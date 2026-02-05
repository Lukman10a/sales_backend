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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupsController = void 0;
const common_1 = require("@nestjs/common");
const backups_service_1 = require("./backups.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let BackupsController = class BackupsController {
    backupsService;
    constructor(backupsService) {
        this.backupsService = backupsService;
    }
    async createBackup() {
        return this.backupsService.createBackup();
    }
    async findAll() {
        return this.backupsService.findAll();
    }
    async findOne(id) {
        return this.backupsService.findOne(id);
    }
    async downloadBackup(id) {
        return this.backupsService.downloadBackup(id);
    }
    async restoreBackup(id) {
        return this.backupsService.restoreBackup(id);
    }
    async removeBackup(id) {
        return this.backupsService.removeBackup(id);
    }
    async scheduleBackup(intervalHours) {
        return this.backupsService.scheduleBackup(intervalHours);
    }
    async getSettings() {
        return this.backupsService.getSettings();
    }
};
exports.BackupsController = BackupsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "createBackup", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('download/:id'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "downloadBackup", null);
__decorate([
    (0, common_1.Post)(':id/restore'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "restoreBackup", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "removeBackup", null);
__decorate([
    (0, common_1.Post)('schedule'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)('intervalHours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "scheduleBackup", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupsController.prototype, "getSettings", null);
exports.BackupsController = BackupsController = __decorate([
    (0, common_1.Controller)('backups'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [backups_service_1.BackupsService])
], BackupsController);
//# sourceMappingURL=backups.controller.js.map