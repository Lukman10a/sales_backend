"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOrdersModule = void 0;
const common_1 = require("@nestjs/common");
const sale_orders_service_1 = require("./sale-orders.service");
const sale_orders_controller_1 = require("./sale-orders.controller");
const products_module_1 = require("../products/products.module");
let SaleOrdersModule = class SaleOrdersModule {
};
exports.SaleOrdersModule = SaleOrdersModule;
exports.SaleOrdersModule = SaleOrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [products_module_1.ProductsModule],
        controllers: [sale_orders_controller_1.SaleOrdersController],
        providers: [sale_orders_service_1.SaleOrdersService],
        exports: [sale_orders_service_1.SaleOrdersService],
    })
], SaleOrdersModule);
//# sourceMappingURL=sale-orders.module.js.map