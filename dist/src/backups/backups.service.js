"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupsService = void 0;
const common_1 = require("@nestjs/common");
let BackupsService = class BackupsService {
    backups = [];
    backupIdCounter = 1;
    createBackup() {
        const backup = {
            id: `backup-${this.backupIdCounter++}`,
            filename: `backup-${Date.now()}.sql`,
            size: Math.floor(Math.random() * 1000000) + 100000,
            createdAt: new Date(),
            downloadUrl: `/backups/download/backup-${this.backupIdCounter - 1}`,
            restorePoint: false,
        };
        this.backups.push(backup);
        return Promise.resolve(backup);
    }
    findAll() {
        return Promise.resolve(this.backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }
    findOne(id) {
        return Promise.resolve().then(() => {
            const backup = this.backups.find((b) => b.id === id);
            if (!backup) {
                throw new common_1.NotFoundException(`Backup ${id} not found`);
            }
            return backup;
        });
    }
    async downloadBackup(id) {
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
    async restoreBackup(id) {
        const backup = await this.findOne(id);
        backup.restorePoint = true;
        return {
            success: true,
            message: `Successfully restored database from backup ${backup.filename}`,
        };
    }
    removeBackup(id) {
        const index = this.backups.findIndex((b) => b.id === id);
        if (index > -1) {
            this.backups.splice(index, 1);
            return Promise.resolve({ success: true });
        }
        return Promise.reject(new common_1.NotFoundException(`Backup ${id} not found`));
    }
    scheduleBackup(intervalHours) {
        return Promise.resolve({
            success: true,
            message: `Backup scheduled every ${intervalHours} hours`,
        });
    }
    getSettings() {
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
};
exports.BackupsService = BackupsService;
exports.BackupsService = BackupsService = __decorate([
    (0, common_1.Injectable)()
], BackupsService);
//# sourceMappingURL=backups.service.js.map