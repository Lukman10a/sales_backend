import { Test, TestingModule } from '@nestjs/testing';
import { BackupsService } from './backups.service';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BackupStatus, BackupType } from '@prisma/client';

describe('BackupsService', () => {
  let service: BackupsService;

  const now = new Date('2026-02-06T10:00:00.000Z');
  const mockBackup = {
    id: 1,
    type: BackupType.backup,
    status: BackupStatus.completed,
    startedAt: now,
    finishedAt: now,
    fileUrl: '/backups/download/backup-1707213600.sql',
  };

  const mockPrismaService = {
    backupJob: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BackupsService>(BackupsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBackup', () => {
    it('should create a new backup', async () => {
      mockPrismaService.backupJob.create.mockResolvedValue(mockBackup);

      const backup = await service.createBackup();

      expect(backup.id).toBeDefined();
      expect(backup.type).toBe(BackupType.backup);
      expect(backup.startedAt).toBeInstanceOf(Date);
      expect(backup.fileUrl).toContain('backup-');
      expect(mockPrismaService.backupJob.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return all backups sorted by date', async () => {
      const newerBackup = {
        ...mockBackup,
        id: 2,
        startedAt: new Date(now.getTime() + 1000),
      };
      mockPrismaService.backupJob.findMany.mockResolvedValue([
        newerBackup,
        mockBackup,
      ]);

      const backups = await service.findAll();

      expect(backups).toHaveLength(2);
      expect(backups[0].startedAt.getTime()).toBeGreaterThanOrEqual(
        backups[1].startedAt.getTime(),
      );
    });
  });

  describe('findOne', () => {
    it('should find backup by id', async () => {
      mockPrismaService.backupJob.findUnique.mockResolvedValue(mockBackup);
      const found = await service.findOne(String(mockBackup.id));

      expect(found.id).toBe(mockBackup.id);
    });

    it('should throw NotFoundException if backup not found', async () => {
      mockPrismaService.backupJob.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('downloadBackup', () => {
    it('should return CSV content', async () => {
      mockPrismaService.backupJob.findUnique.mockResolvedValue(mockBackup);
      const download = await service.downloadBackup(String(mockBackup.id));

      expect(download.filename).toBe(`backup-${mockBackup.id}.sql`);
      expect(download.content).toContain('-- Database Backup');
    });
  });

  describe('restoreBackup', () => {
    it('should restore backup and return success', async () => {
      mockPrismaService.backupJob.findUnique.mockResolvedValue(mockBackup);
      const result = await service.restoreBackup(String(mockBackup.id));

      expect(result.success).toBe(true);
    });
  });

  describe('removeBackup', () => {
    it('should remove backup', async () => {
      mockPrismaService.backupJob.delete.mockResolvedValue(mockBackup);
      const result = await service.removeBackup(String(mockBackup.id));

      expect(result.success).toBe(true);
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
      mockPrismaService.backupJob.findFirst.mockResolvedValue(mockBackup);
      const settings = await service.getSettings();

      expect(settings.autoBackupEnabled).toBe(true);
      expect(settings.intervalHours).toBe(24);
      expect(settings.lastBackupAt).toEqual(mockBackup.startedAt);
    });
  });
});
