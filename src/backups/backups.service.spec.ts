import { Test, TestingModule } from '@nestjs/testing';
import { BackupsService } from './backups.service';
import { NotFoundException } from '@nestjs/common';

describe('BackupsService', () => {
  let service: BackupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BackupsService],
    }).compile();

    service = module.get<BackupsService>(BackupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBackup', () => {
    it('should create a new backup', async () => {
      const backup = await service.createBackup();

      expect(backup.id).toBeDefined();
      expect(backup.filename).toContain('backup-');
      expect(backup.createdAt).toBeInstanceOf(Date);
      expect(backup.downloadUrl).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all backups sorted by date', async () => {
      await service.createBackup();
      await service.createBackup();

      const backups = await service.findAll();

      expect(backups).toHaveLength(2);
      expect(backups[0].createdAt.getTime()).toBeGreaterThanOrEqual(
        backups[1].createdAt.getTime(),
      );
    });
  });

  describe('findOne', () => {
    it('should find backup by id', async () => {
      const created = await service.createBackup();
      const found = await service.findOne(created.id);

      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException if backup not found', async () => {
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('downloadBackup', () => {
    it('should return CSV content', async () => {
      const backup = await service.createBackup();
      const download = await service.downloadBackup(backup.id);

      expect(download.filename).toBe(backup.filename);
      expect(download.content).toContain('-- Database Backup');
    });
  });

  describe('restoreBackup', () => {
    it('should restore backup and return success', async () => {
      const backup = await service.createBackup();
      const result = await service.restoreBackup(backup.id);

      expect(result.success).toBe(true);
      const restored = await service.findOne(backup.id);
      expect(restored.restorePoint).toBe(true);
    });
  });

  describe('removeBackup', () => {
    it('should remove backup', async () => {
      const backup = await service.createBackup();
      const result = await service.removeBackup(backup.id);

      expect(result.success).toBe(true);
      await expect(service.findOne(backup.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('scheduleBackup', () => {
    it('should schedule automatic backups', async () => {
      const result = await service.scheduleBackup(24);

      expect(result.success).toBe(true);
      expect(result.message).toContain('24');
    });
  });

  describe('getSettings', () => {
    it('should return backup settings', async () => {
      const settings = await service.getSettings();

      expect(settings.autoBackupEnabled).toBe(true);
      expect(settings.intervalHours).toBe(24);
    });
  });
});
