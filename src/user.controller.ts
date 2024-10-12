import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';

@Controller('user')
export class UserController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  // get access key details
  @Get('access-plan/:key')
  async getAccessPlan(@Param('key') key: string) {
    const accessPlan = await this.accessKeyService.getAccessPlanDetails(key);
    if (!accessPlan) {
      return { error: 'Invalid or expired key' };
    }
    return { accessPlan };
  }

  // enable or disable a key
  @Post('toggle-key/:key')
  async toggleKey(
    @Param('key') key: string,
    @Body() body: { isEnabled: boolean },
  ) {
    const { isEnabled } = body;
    const result = await this.accessKeyService.toggleKey(key, isEnabled);
    if (!result) {
      return { error: 'Key not found or failed to update' };
    }
    return { message: `Key has been ${isEnabled ? 'enabled' : 'disabled'}` };
  }
}
