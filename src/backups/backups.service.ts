import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { BackupJob } from '@prisma/client';
import { BackupType, BackupStatus } from '@prisma/client';

@Injectable()
export class BackupsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new backup
   */
  async createBackup(): Promise<BackupJob> {
    const backup = await this.prisma.backupJob.create({
      data: {
        type: BackupType.backup,
        status: BackupStatus.completed,
        finishedAt: new Date(),
        fileUrl: `/backups/download/backup-${Date.now()}.sql`,
      },
    });

    return backup;
  }

  /**
   * List all backups
   */
  async findAll(): Promise<BackupJob[]> {
    return this.prisma.backupJob.findMany({
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Get backup by ID
   */
  async findOne(id: string): Promise<BackupJob> {
    const backup = await this.prisma.backupJob.findUnique({
      where: { id: parseInt(id, 10) },
    });
    
    if (!backup) {
      throw new NotFoundException(`Backup ${id} not found`);
    }
    
    return backup;
  }

  /**
   * Download backup (mock endpoint)
   */
  async downloadBackup(id: string): Promise<{
    filename: string;
    content: string;
  }> {
    const backup = await this.findOne(id);

    const mockSqlContent = `-- Database Backup
-- Created: ${backup.startedAt.toISOString()}
-- Status: ${backup.status}

BEGIN TRANSACTION;

INSERT INTO users VALUES (1, 'test@example.com', 'hashedpassword', 'Test', 'User', 'owner', NULL, NULL, NULL, '2026-01-01', '2026-01-25', NULL);

COMMIT;`;

    return {
      filename: `backup-${backup.id}.sql`,
      content: mockSqlContent,
    };
  }

  /**
   * Restore backup (mock endpoint)
   */
  async restoreBackup(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const backup = await this.findOne(id);

    return {
      success: true,
      message: `Successfully restored database from backup ${backup.id}`,
    };
  }

  /**
   * Delete backup
   */
  async removeBackup(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.backupJob.delete({
        where: { id: parseInt(id, 10) },
      });
      return { success: true };
    } catch {
      throw new NotFoundException(`Backup ${id} not found`);
    }
  }

  /**
   * Schedule automatic backups (mock endpoint)
   */
  scheduleBackup(intervalHours: number): Promise<{
    success: boolean;
    message: string;
  }> {
    return Promise.resolve({
      success: true,
      message: `Backup scheduled every ${intervalHours} hours`,
    });
  }

  /**
   * Get backup settings
   */
  async getSettings(): Promise<{
    autoBackupEnabled: boolean;
    intervalHours: number;
    lastBackupAt: Date | null;
    nextBackupAt: Date | null;
  }> {
    const lastBackup = await this.prisma.backupJob.findFirst({
      orderBy: { startedAt: 'desc' },
    });
    
    const nextBackupAt = lastBackup
      ? new Date(lastBackup.startedAt.getTime() + 24 * 60 * 60 * 1000)
      : null;

    return {
      autoBackupEnabled: true,
      intervalHours: 24,
      lastBackupAt: lastBackup?.startedAt || null,
      nextBackupAt,
    };
  }
}
