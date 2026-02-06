import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }>;
    findAll(): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }[]>;
    getLowStock(): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }[]>;
    findOne(id: number): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }>;
    remove(id: number): Promise<{
        updatedAt: Date;
        id: number;
        name: string;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
    }>;
}
