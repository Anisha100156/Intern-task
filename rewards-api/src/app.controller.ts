import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const greeting = this.appService.getHello();
    this.logger.debug(`getHello() called, responding with: ${greeting}`);
    return greeting;
  }

  // Example endpoint for health checking or uptime validation
  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    this.logger.log('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
