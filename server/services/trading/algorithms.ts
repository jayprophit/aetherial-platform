/**
 * Trading Algorithms Library
 * 8 Quantitative Trading Strategies
 */

interface OHLCV {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingSignal {
  action: 'buy' | 'sell' | 'hold';
  strength: number; // 0-100
  price: number;
  reasoning: string;
  indicators: Record<string, number>;
}

interface StrategyConfig {
  riskLevel: 'low' | 'medium' | 'high';
  capital: number;
  stopLoss?: number;
  takeProfit?: number;
  [key: string]: any;
}

/**
 * 1. Momentum Strategy
 * Buys assets showing upward price momentum
 */
export class MomentumStrategy {
  private config: StrategyConfig;

  constructor(config: StrategyConfig) {
    this.config = config;
  }

  analyze(data: OHLCV[], period: number = 14): TradingSignal {
    if (data.length < period) {
      return { action: 'hold', strength: 0, price: data[data.length - 1].close, reasoning: 'Insufficient data', indicators: {} };
    }

    const prices = data.map(d => d.close);
    const momentum = this.calculateMomentum(prices, period);
    const rsi = this.calculateRSI(prices, period);
    const currentPrice = prices[prices.length - 1];

    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 50;
    let reasoning = '';

    if (momentum > 0 && rsi < 70) {
      action = 'buy';
      strength = Math.min(95, 50 + momentum * 2);
      reasoning = `Positive momentum (${momentum.toFixed(2)}%) with RSI at ${rsi.toFixed(2)}`;
    } else if (momentum < 0 && rsi > 30) {
      action = 'sell';
      strength = Math.min(95, 50 + Math.abs(momentum) * 2);
      reasoning = `Negative momentum (${momentum.toFixed(2)}%) with RSI at ${rsi.toFixed(2)}`;
    } else {
      reasoning = `Neutral momentum, RSI: ${rsi.toFixed(2)}`;
    }

    return {
      action,
      strength,
      price: currentPrice,
      reasoning,
      indicators: { momentum, rsi }
    };
  }

  private calculateMomentum(prices: number[], period: number): number {
    const current = prices[prices.length - 1];
    const past = prices[prices.length - period];
    return ((current - past) / past) * 100;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }
}

/**
 * 2. Mean Reversion Strategy
 * Buys when price is below average, sells when above
 */
export class MeanReversionStrategy {
  private config: StrategyConfig;

  constructor(config: StrategyConfig) {
    this.config = config;
  }

  analyze(data: OHLCV[], period: number = 20): TradingSignal {
    if (data.length < period) {
      return { action: 'hold', strength: 0, price: data[data.length - 1].close, reasoning: 'Insufficient data', indicators: {} };
    }

    const prices = data.map(d => d.close);
    const sma = this.calculateSMA(prices, period);
    const stdDev = this.calculateStdDev(prices, period);
    const currentPrice = prices[prices.length - 1];
    const bollingerBands = this.calculateBollingerBands(sma, stdDev);

    const deviation = ((currentPrice - sma) / sma) * 100;
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 50;
    let reasoning = '';

    if (currentPrice < bollingerBands.lower) {
      action = 'buy';
      strength = Math.min(95, 70 + Math.abs(deviation));
      reasoning = `Price below lower Bollinger Band (${deviation.toFixed(2)}% below SMA)`;
    } else if (currentPrice > bollingerBands.upper) {
      action = 'sell';
      strength = Math.min(95, 70 + Math.abs(deviation));
      reasoning = `Price above upper Bollinger Band (${deviation.toFixed(2)}% above SMA)`;
    } else {
      reasoning = `Price within Bollinger Bands (${deviation.toFixed(2)}% from SMA)`;
    }

    return {
      action,
      strength,
      price: currentPrice,
      reasoning,
      indicators: { sma, stdDev, deviation, ...bollingerBands }
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const slice = prices.slice(-period);
    return slice.reduce((sum, p) => sum + p, 0) / period;
  }

  private calculateStdDev(prices: number[], period: number): number {
    const slice = prices.slice(-period);
    const mean = this.calculateSMA(prices, period);
    const squaredDiffs = slice.map(p => Math.pow(p - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / period;
    return Math.sqrt(variance);
  }

  private calculateBollingerBands(sma: number, stdDev: number) {
    return {
      upper: sma + (stdDev * 2),
      middle: sma,
      lower: sma - (stdDev * 2)
    };
  }
}

/**
 * 3. Arbitrage Strategy
 * Exploits price differences across exchanges
 */
export class ArbitrageStrategy {
  private config: StrategyConfig;

  constructor(config: StrategyConfig) {
    this.config = config;
  }

  analyze(exchangePrices: Map<string, number>, fees: Map<string, number>): TradingSignal[] {
    const signals: TradingSignal[] = [];
    const exchanges = Array.from(exchangePrices.keys());

    for (let i = 0; i < exchanges.length; i++) {
      for (let j = i + 1; j < exchanges.length; j++) {
        const exchange1 = exchanges[i];
        const exchange2 = exchanges[j];
        const price1 = exchangePrices.get(exchange1)!;
        const price2 = exchangePrices.get(exchange2)!;
        const fee1 = fees.get(exchange1) || 0.001;
        const fee2 = fees.get(exchange2) || 0.001;

        const priceDiff = Math.abs(price1 - price2);
        const avgPrice = (price1 + price2) / 2;
        const diffPercentage = (priceDiff / avgPrice) * 100;
        const totalFees = (fee1 + fee2) * 100;

        if (diffPercentage > totalFees + 0.5) { // 0.5% minimum profit
          const buyExchange = price1 < price2 ? exchange1 : exchange2;
          const sellExchange = price1 < price2 ? exchange2 : exchange1;
          const buyPrice = Math.min(price1, price2);
          const sellPrice = Math.max(price1, price2);

          signals.push({
            action: 'buy',
            strength: Math.min(95, 60 + diffPercentage * 5),
            price: buyPrice,
            reasoning: `Arbitrage opportunity: Buy on ${buyExchange} at ${buyPrice}, sell on ${sellExchange} at ${sellPrice} (${diffPercentage.toFixed(2)}% profit)`,
            indicators: { buyExchange, sellExchange, profitPercentage: diffPercentage - totalFees }
          });
        }
      }
    }

    return signals.length > 0 ? signals : [{
      action: 'hold',
      strength: 0,
      price: Array.from(exchangePrices.values())[0],
      reasoning: 'No arbitrage opportunities found',
      indicators: {}
    }];
  }
}

/**
 * 4. Grid Trading Strategy
 * Places buy/sell orders at regular intervals
 */
export class GridTradingStrategy {
  private config: StrategyConfig & { gridLevels: number; gridSpacing: number };

  constructor(config: StrategyConfig & { gridLevels: number; gridSpacing: number }) {
    this.config = config;
  }

  generateGrid(currentPrice: number): { buyOrders: number[]; sellOrders: number[] } {
    const { gridLevels, gridSpacing } = this.config;
    const buyOrders: number[] = [];
    const sellOrders: number[] = [];

    for (let i = 1; i <= gridLevels; i++) {
      buyOrders.push(currentPrice * (1 - (gridSpacing * i / 100)));
      sellOrders.push(currentPrice * (1 + (gridSpacing * i / 100)));
    }

    return { buyOrders, sellOrders };
  }

  analyze(currentPrice: number): TradingSignal {
    const grid = this.generateGrid(currentPrice);
    
    return {
      action: 'hold',
      strength: 75,
      price: currentPrice,
      reasoning: `Grid trading active with ${this.config.gridLevels} levels at ${this.config.gridSpacing}% spacing`,
      indicators: {
        gridLevels: this.config.gridLevels,
        gridSpacing: this.config.gridSpacing,
        buyOrders: grid.buyOrders,
        sellOrders: grid.sellOrders
      }
    };
  }
}

/**
 * 5. DCA (Dollar Cost Averaging) Strategy
 * Invests fixed amount at regular intervals
 */
export class DCAStrategy {
  private config: StrategyConfig & { investmentAmount: number; frequency: string };

  constructor(config: StrategyConfig & { investmentAmount: number; frequency: string }) {
    this.config = config;
  }

  analyze(currentPrice: number, lastInvestmentDate: Date): TradingSignal {
    const now = new Date();
    const daysSinceLastInvestment = (now.getTime() - lastInvestmentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    let shouldInvest = false;
    if (this.config.frequency === 'daily' && daysSinceLastInvestment >= 1) shouldInvest = true;
    if (this.config.frequency === 'weekly' && daysSinceLastInvestment >= 7) shouldInvest = true;
    if (this.config.frequency === 'monthly' && daysSinceLastInvestment >= 30) shouldInvest = true;

    return {
      action: shouldInvest ? 'buy' : 'hold',
      strength: shouldInvest ? 90 : 0,
      price: currentPrice,
      reasoning: shouldInvest 
        ? `DCA ${this.config.frequency} investment of $${this.config.investmentAmount}`
        : `Next DCA investment in ${Math.ceil(daysSinceLastInvestment)} days`,
      indicators: {
        investmentAmount: this.config.investmentAmount,
        frequency: this.config.frequency,
        daysSinceLastInvestment
      }
    };
  }
}

/**
 * 6. Breakout Strategy
 * Trades when price breaks support/resistance levels
 */
export class BreakoutStrategy {
  private config: StrategyConfig;

  constructor(config: StrategyConfig) {
    this.config = config;
  }

  analyze(data: OHLCV[], period: number = 20): TradingSignal {
    if (data.length < period) {
      return { action: 'hold', strength: 0, price: data[data.length - 1].close, reasoning: 'Insufficient data', indicators: {} };
    }

    const prices = data.map(d => d.close);
    const highs = data.slice(-period).map(d => d.high);
    const lows = data.slice(-period).map(d => d.low);
    const resistance = Math.max(...highs);
    const support = Math.min(...lows);
    const currentPrice = prices[prices.length - 1];
    const volume = data[data.length - 1].volume;
    const avgVolume = data.slice(-period).reduce((sum, d) => sum + d.volume, 0) / period;

    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 50;
    let reasoning = '';

    if (currentPrice > resistance && volume > avgVolume * 1.5) {
      action = 'buy';
      strength = 85;
      reasoning = `Breakout above resistance (${resistance.toFixed(2)}) with high volume`;
    } else if (currentPrice < support && volume > avgVolume * 1.5) {
      action = 'sell';
      strength = 85;
      reasoning = `Breakdown below support (${support.toFixed(2)}) with high volume`;
    } else {
      reasoning = `Price between support (${support.toFixed(2)}) and resistance (${resistance.toFixed(2)})`;
    }

    return {
      action,
      strength,
      price: currentPrice,
      reasoning,
      indicators: { resistance, support, volume, avgVolume }
    };
  }
}

/**
 * 7. Scalping Strategy
 * Quick trades for small profits
 */
export class ScalpingStrategy {
  private config: StrategyConfig & { targetProfit: number; maxHoldTime: number };

  constructor(config: StrategyConfig & { targetProfit: number; maxHoldTime: number }) {
    this.config = config;
  }

  analyze(data: OHLCV[], period: number = 5): TradingSignal {
    if (data.length < period) {
      return { action: 'hold', strength: 0, price: data[data.length - 1].close, reasoning: 'Insufficient data', indicators: {} };
    }

    const prices = data.map(d => d.close);
    const ema5 = this.calculateEMA(prices, 5);
    const ema15 = this.calculateEMA(prices, 15);
    const currentPrice = prices[prices.length - 1];
    const spread = Math.abs(ema5 - ema15) / currentPrice * 100;

    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 50;
    let reasoning = '';

    if (ema5 > ema15 && spread > 0.1) {
      action = 'buy';
      strength = 80;
      reasoning = `EMA crossover bullish, target ${this.config.targetProfit}% profit`;
    } else if (ema5 < ema15 && spread > 0.1) {
      action = 'sell';
      strength = 80;
      reasoning = `EMA crossover bearish, target ${this.config.targetProfit}% profit`;
    } else {
      reasoning = `Waiting for clear EMA crossover signal`;
    }

    return {
      action,
      strength,
      price: currentPrice,
      reasoning,
      indicators: { ema5, ema15, spread, targetProfit: this.config.targetProfit }
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }
}

/**
 * 8. Swing Trading Strategy
 * Holds positions for days/weeks to capture swings
 */
export class SwingTradingStrategy {
  private config: StrategyConfig;

  constructor(config: StrategyConfig) {
    this.config = config;
  }

  analyze(data: OHLCV[], period: number = 50): TradingSignal {
    if (data.length < period) {
      return { action: 'hold', strength: 0, price: data[data.length - 1].close, reasoning: 'Insufficient data', indicators: {} };
    }

    const prices = data.map(d => d.close);
    const sma50 = this.calculateSMA(prices, 50);
    const sma200 = this.calculateSMA(prices, 200);
    const macd = this.calculateMACD(prices);
    const currentPrice = prices[prices.length - 1];

    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let strength = 50;
    let reasoning = '';

    if (sma50 > sma200 && macd.histogram > 0 && currentPrice > sma50) {
      action = 'buy';
      strength = 85;
      reasoning = `Golden cross with positive MACD, strong uptrend`;
    } else if (sma50 < sma200 && macd.histogram < 0 && currentPrice < sma50) {
      action = 'sell';
      strength = 85;
      reasoning = `Death cross with negative MACD, strong downtrend`;
    } else {
      reasoning = `Waiting for clear trend confirmation`;
    }

    return {
      action,
      strength,
      price: currentPrice,
      reasoning,
      indicators: { sma50, sma200, ...macd }
    };
  }

  private calculateSMA(prices: number[], period: number): number {
    const slice = prices.slice(-period);
    return slice.reduce((sum, p) => sum + p, 0) / period;
  }

  private calculateMACD(prices: number[]) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return { macdLine, signalLine, histogram };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }
}

// Export all strategies
export const TradingStrategies = {
  Momentum: MomentumStrategy,
  MeanReversion: MeanReversionStrategy,
  Arbitrage: ArbitrageStrategy,
  Grid: GridTradingStrategy,
  DCA: DCAStrategy,
  Breakout: BreakoutStrategy,
  Scalping: ScalpingStrategy,
  Swing: SwingTradingStrategy,
};

