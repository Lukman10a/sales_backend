import { BackupsService } from './backups.service';
export declare class BackupsController {
    private readonly backupsService;
    constructor(backupsService: BackupsService);
    createBackup(): Promise<import("./backups.service").Backup>;
    findAll(): Promise<import("./backups.service").Backup[]>;
    findOne(id: string): Promise<import("./backups.service").Backup>;
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
