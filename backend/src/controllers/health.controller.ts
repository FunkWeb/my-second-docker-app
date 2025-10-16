import {JsonController, Get} from 'routing-controllers';

@JsonController('/health')
export class HealthController {
  @Get('/')
  get() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
