import { BackupsService } from './backups.service';
export declare class BackupsController {
    private readonly backupsService;
    constructor(backupsService: BackupsService);
    createBackup(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.BackupStatus;
        type: import("@prisma/client").$Enums.BackupType;
        startedAt: Date;
        finishedAt: Date | null;
        fileUrl: string | null;
    }>;
    findAll(): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.BackupStatus;
        type: import("@prisma/client").$Enums.BackupType;
        startedAt: Date;
        finishedAt: Date | null;
        fileUrl: string | null;
    }[]>;
    getSettings(): Promise<{
        autoBackupEnabled: boolean;
        intervalHours: number;
        lastBackupAt: Date | null;
        nextBackupAt: Date | null;
    }>;
    downloadBackup(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    findOne(id: string): Promise<{
        id: number;
        status: import("@prisma/client").$Enums.BackupStatus;
        type: import("@prisma/client").$Enums.BackupType;
        startedAt: Date;
        finishedAt: Date | null;
        fileUrl: string | null;
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
}
