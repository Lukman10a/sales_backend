import { Injectable, NotFoundException } from '@nestjs/common';

export interface Backup {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  downloadUrl: string;
  restorePoint: boolean;
}

@Injectable()
export class BackupsService {
  // In-memory storage for demo (use database in production)
  private backups: Backup[] = [];
  private backupIdCounter = 1;

  /**
   * Create a new backup
   */
  createBackup(): Promise<Backup> {
    const backup: Backup = {
      id: `backup-${this.backupIdCounter++}`,
      filename: `backup-${Date.now()}.sql`,
      size: Math.floor(Math.random() * 1000000) + 100000, // Random size between 100KB-1MB
      createdAt: new Date(),
      downloadUrl: `/backups/download/backup-${this.backupIdCounter - 1}`,
      restorePoint: false,
    };

    this.backups.push(backup);
    return Promise.resolve(backup);
  }

  /**
   * List all backups
   */
  findAll(): Promise<Backup[]> {
    return Promise.resolve(
      this.backups.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    );
  }

  /**
   * Get backup by ID
   */
  findOne(id: string): Promise<Backup> {
    return Promise.resolve().then(() => {
      const backup = this.backups.find((b) => b.id === id);
      if (!backup) {
        throw new NotFoundException(`Backup ${id} not found`);
      }
      return backup;
    });
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
-- Created: ${backup.createdAt.toISOString()}
-- Size: ${backup.size} bytes

BEGIN TRANSACTION;

INSERT INTO users VALUES (1, 'test@example.com', 'hashedpassword', 'Test', 'User', 'owner', NULL, NULL, NULL, '2026-01-01', '2026-01-25', NULL);

COMMIT;`;

    return {
      filename: backup.filename,
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

    // Mark as restore point
    backup.restorePoint = true;

    return {
      success: true,
      message: `Successfully restored database from backup ${backup.filename}`,
    };
  }

  /**
   * Delete backup
   */
  removeBackup(id: string): Promise<{ success: boolean }> {
    const index = this.backups.findIndex((b) => b.id === id);
    if (index > -1) {
      this.backups.splice(index, 1);
      return Promise.resolve({ success: true });
    }
    return Promise.reject(new NotFoundException(`Backup ${id} not found`));
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
  getSettings(): Promise<{
    autoBackupEnabled: boolean;
    intervalHours: number;
    lastBackupAt: Date | null;
    nextBackupAt: Date | null;
  }> {
    const lastBackup = this.backups[this.backups.length - 1];
    const nextBackupAt = lastBackup
      ? new Date(lastBackup.createdAt.getTime() + 24 * 60 * 60 * 1000)
      : null;

    return Promise.resolve({
      autoBackupEnabled: true,
      intervalHours: 24,
      lastBackupAt: lastBackup?.createdAt || null,
      nextBackupAt,
    });
  }
}
