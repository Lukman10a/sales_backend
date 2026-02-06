import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BackupsService } from './backups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('backups')
@UseGuards(JwtAuthGuard)
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  /**
   * POST /backups
   * Create a new backup
   */
  @Post()
  @Roles('owner')
  @UseGuards(RolesGuard)
  async createBackup() {
    return this.backupsService.createBackup();
  }

  /**
   * GET /backups
   * List all backups
   */
  @Get()
  @Roles('owner')
  @UseGuards(RolesGuard)
  async findAll() {
    return this.backupsService.findAll();
  }

  /**
   * GET /backups/settings
   * Get backup settings
   */
  @Get('settings')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async getSettings() {
    return this.backupsService.getSettings();
  }

  /**
   * GET /backups/download/:id
   * Download backup
   */
  @Get('download/:id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async downloadBackup(@Param('id') id: string) {
    return this.backupsService.downloadBackup(id);
  }

  /**
   * GET /backups/:id
   * Get backup by ID
   */
  @Get(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.backupsService.findOne(id);
  }

  /**
   * POST /backups/:id/restore
   * Restore backup
   */
  @Post(':id/restore')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async restoreBackup(@Param('id') id: string) {
    return this.backupsService.restoreBackup(id);
  }

  /**
   * DELETE /backups/:id
   * Delete backup
   */
  @Delete(':id')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async removeBackup(@Param('id') id: string) {
    return this.backupsService.removeBackup(id);
  }

  /**
   * POST /backups/schedule
   * Schedule automatic backups
   */
  @Post('schedule')
  @Roles('owner')
  @UseGuards(RolesGuard)
  async scheduleBackup(@Body('intervalHours') intervalHours: number) {
    return this.backupsService.scheduleBackup(intervalHours);
  }
}
