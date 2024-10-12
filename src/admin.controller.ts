import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AccessKeyService } from './access-key.service';
import { CreateKeyDto, UpdateKeyDto } from './dto'; // Assuming DTOs are defined

@Controller('admin')
export class AdminController {
  constructor(private readonly accessKeyService: AccessKeyService) {}

  @Post('create-key')
  async createKey(@Body() createKeyDto: CreateKeyDto) {
    const { rateLimit, expirationTime } = createKeyDto;
    const newKey = await this.accessKeyService.generateKey(
      rateLimit,
      expirationTime,
    );
    return { message: 'Key generated successfully', key: newKey };
  }

  @Get('list-keys')
  async listKeys() {
    const keys = await this.accessKeyService.listKeys();
    return { keys };
  }

  @Delete('delete-key/:key')
  async deleteKey(@Param('key') key: string) {
    const result = await this.accessKeyService.deleteKey(key);
    if (result) {
      return { message: 'Key deleted successfully' };
    } else {
      return { error: 'Key not found or failed to delete' };
    }
  }

  @Post('update-key/:key')
  async updateKey(
    @Param('key') key: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ) {
    const { rateLimit, expirationTime } = updateKeyDto;
    const result = await this.accessKeyService.updateKey(
      key,
      rateLimit,
      expirationTime,
    );
    if (result) {
      return { message: 'Key updated successfully' };
    } else {
      return { error: 'Key not found or failed to update' };
    }
  }

  @Get('logs')
  async viewLogs() {
    const logs = await this.accessKeyService.viewLogs();
    return logs;
  }
}
