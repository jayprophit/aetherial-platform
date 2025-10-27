import express from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { orders, payments as paymentsTable, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-12-18.acacia',
});

// Create payment intent for order
router.post('/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { orderId, amount, currency = 'usd' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Verify order belongs to user
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save payment record
    await db.insert(paymentsTable).values({
      orderId,
      userId,
      amount,
      currency,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Create checkout session for products
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;
    const { items, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Get user email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.images || [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL}/payment/cancel`,
      customer_email: user?.email,
      metadata: {
        userId: userId.toString(),
      },
    });

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Get payment status
router.get('/status/:paymentIntentId', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to get payment status' });
  }
});

// Get user payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const userPayments = await db
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.userId, userId));

    res.json(userPayments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy'
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', paymentIntent.id);

      // Update payment status
      await db
        .update(paymentsTable)
        .set({ 
          status: 'completed',
          metadata: JSON.stringify({ ...JSON.parse(paymentIntent.metadata as any || '{}'), completedAt: new Date().toISOString() })
        })
        .where(eq(paymentsTable.stripePaymentIntentId, paymentIntent.id));

      // Update order status
      const orderId = parseInt(paymentIntent.metadata.orderId || '0');
      if (orderId) {
        await db
          .update(orders)
          .set({ status: 'paid' })
          .where(eq(orders.id, orderId));
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed:', failedPayment.id);

      await db
        .update(paymentsTable)
        .set({ status: 'failed' })
        .where(eq(paymentsTable.stripePaymentIntentId, failedPayment.id));
      break;

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session.id);

      // Handle successful checkout
      const userId = parseInt(session.metadata?.userId || '0');
      if (userId && session.payment_intent) {
        await db.insert(paymentsTable).values({
          userId,
          orderId: null,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          status: 'completed',
          stripePaymentIntentId: session.payment_intent as string,
          metadata: JSON.stringify({ sessionId: session.id }),
        });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Refund payment
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer',
    });

    // Update payment status
    await db
      .update(paymentsTable)
      .set({ status: 'refunded' })
      .where(eq(paymentsTable.stripePaymentIntentId, paymentIntentId));

    res.json({
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount / 100,
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

export default router;

