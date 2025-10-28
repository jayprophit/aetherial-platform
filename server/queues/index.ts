import { Queue, Worker } from 'bullmq';
import connection from '../redis';

// Create a new connection in every instance
export const emailQueue = new Queue('email', { connection });

const emailWorker = new Worker('email', async job => {
  // Simulate sending an email
  console.log(`Sending email to ${job.data.to} with subject: ${job.data.subject}`);
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate 2-second delay
  console.log('Email sent!');
}, { connection });

emailWorker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

