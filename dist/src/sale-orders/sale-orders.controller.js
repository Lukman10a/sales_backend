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
exports.SaleOrdersController = void 0;
const common_1 = require("@nestjs/common");
const sale_orders_service_1 = require("./sale-orders.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_sale_order_dto_1 = require("./dto/create-sale-order.dto");
let SaleOrdersController = class SaleOrdersController {
    saleOrdersService;
    constructor(saleOrdersService) {
        this.saleOrdersService = saleOrdersService;
    }
    async create(createSaleOrderDto) {
        return this.saleOrdersService.create(createSaleOrderDto);
    }
    async findAll() {
        return this.saleOrdersService.findAll();
    }
    async getByDateRange(startDate, endDate) {
        return this.saleOrdersService.getSalesByDateRange(new Date(startDate), new Date(endDate));
    }
    async findOne(id) {
        return this.saleOrdersService.findOne(id);
    }
    async updateStatus(id, status) {
        return this.saleOrdersService.updateStatus(id, status);
    }
    async updateItems(id, items) {
        return this.saleOrdersService.updateItems(id, items);
    }
    async cancel(id) {
        return this.saleOrdersService.cancel(id);
    }
};
exports.SaleOrdersController = SaleOrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_order_dto_1.CreateSaleOrderDto]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('report/by-date'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "getByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)('owner'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/items'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('items')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "updateItems", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SaleOrdersController.prototype, "cancel", null);
exports.SaleOrdersController = SaleOrdersController = __decorate([
    (0, common_1.Controller)('sale-orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sale_orders_service_1.SaleOrdersService])
], SaleOrdersController);
//# sourceMappingURL=sale-orders.controller.js.map