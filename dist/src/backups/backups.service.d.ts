export interface Backup {
    id: string;
    filename: string;
    size: number;
    createdAt: Date;
    downloadUrl: string;
    restorePoint: boolean;
}
export declare class BackupsService {
    private backups;
    private backupIdCounter;
    createBackup(): Promise<Backup>;
    findAll(): Promise<Backup[]>;
    findOne(id: string): Promise<Backup>;
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
