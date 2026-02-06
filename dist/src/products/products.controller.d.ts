import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }[]>;
    getLowStock(): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        name: string;
        id: number;
        sku: string;
        description: string | null;
        category: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        stock: number;
        minStockThreshold: number;
        updatedAt: Date;
    }>;
}
