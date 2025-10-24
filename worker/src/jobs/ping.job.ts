import type {Job} from 'bullmq';

export default async function pingJob(_: Job) {
  return 'pong';
}


//heehee haha b