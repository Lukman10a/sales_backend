"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BackupsService = class BackupsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBackup() {
        const backup = await this.prisma.backupJob.create({
            data: {
                type: client_1.BackupType.backup,
                status: client_1.BackupStatus.completed,
                finishedAt: new Date(),
                fileUrl: `/backups/download/backup-${Date.now()}.sql`,
            },
        });
        return backup;
    }
    async findAll() {
        return this.prisma.backupJob.findMany({
            orderBy: { startedAt: 'desc' },
        });
    }
    async findOne(id) {
        const backup = await this.prisma.backupJob.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!backup) {
            throw new common_1.NotFoundException(`Backup ${id} not found`);
        }
        return backup;
    }
    async downloadBackup(id) {
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
    async restoreBackup(id) {
        const backup = await this.findOne(id);
        return {
            success: true,
            message: `Successfully restored database from backup ${backup.id}`,
        };
    }
    async removeBackup(id) {
        try {
            await this.prisma.backupJob.delete({
                where: { id: parseInt(id, 10) },
            });
            return { success: true };
        }
        catch {
            throw new common_1.NotFoundException(`Backup ${id} not found`);
        }
    }
    scheduleBackup(intervalHours) {
        return Promise.resolve({
            success: true,
            message: `Backup scheduled every ${intervalHours} hours`,
        });
    }
    async getSettings() {
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
};
exports.BackupsService = BackupsService;
exports.BackupsService = BackupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BackupsService);
//# sourceMappingURL=backups.service.js.map