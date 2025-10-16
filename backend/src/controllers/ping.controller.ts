import {JsonController, Get} from 'routing-controllers';
import {pingQueue} from "../queues/ping.queue.js";

@JsonController('/ping')
export class PingController {
  @Get('/')
  async get() {
    await pingQueue.add('ping', {});
    const counts = await pingQueue.getJobCounts()

    return {
      status: 'ok',
      counts,
    }
  }
}
