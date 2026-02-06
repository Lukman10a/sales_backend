import { PrismaService } from '../prisma/prisma.service';
import type { BackupJob } from '@prisma/client';
export declare class BackupsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBackup(): Promise<BackupJob>;
    findAll(): Promise<BackupJob[]>;
    findOne(id: string): Promise<BackupJob>;
    downloadBackup(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    restoreBackup(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeBackup(id: string): Promise<{
        success: boolean;
    }>;
    scheduleBackup(intervalHours: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSettings(): Promise<{
        autoBackupEnabled: boolean;
        intervalHours: number;
        lastBackupAt: Date | null;
        nextBackupAt: Date | null;
    }>;
}
