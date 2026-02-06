import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.saleItem.deleteMany();
  await prisma.saleOrder.deleteMany();
  await prisma.product.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.user.deleteMany();

  // Create owner user
  const ownerPassword = await argon2.hash('Password123');
  const owner = await prisma.user.create({
    data: {
      email: 'owner@primestock.com',
      passwordHash: ownerPassword,
      firstName: 'John',
      lastName: 'Owner',
      role: UserRole.owner,
      businessName: 'Primestock Enterprise',
      lastActive: new Date(),
    },
  });
  console.log('✅ Created owner user:', owner.email);

  // Create apprentice user
  const apprenticePassword = await argon2.hash('Password123');
  const apprentice = await prisma.user.create({
    data: {
      email: 'apprentice@primestock.com',
      passwordHash: apprenticePassword,
      firstName: 'Jane',
      lastName: 'Apprentice',
      role: UserRole.apprentice,
      lastActive: new Date(),
    },
  });
  console.log('✅ Created apprentice user:', apprentice.email);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop Dell XPS 15',
        sku: 'LAP-DELL-XPS15-001',
        description: 'High-performance laptop for professionals',
        category: 'Electronics',
        price: 1499.99,
        stock: 25,
        minStockThreshold: 5,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        sku: 'MSE-WIRE-001',
        description: 'Ergonomic wireless mouse',
        category: 'Accessories',
        price: 29.99,
        stock: 3,
        minStockThreshold: 10,
      },
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Hub',
        sku: 'HUB-USBC-001',
        description: '7-in-1 USB-C hub with HDMI',
        category: 'Accessories',
        price: 49.99,
        stock: 50,
        minStockThreshold: 15,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Office Chair',
        sku: 'CHAIR-OFF-001',
        description: 'Ergonomic office chair with lumbar support',
        category: 'Furniture',
        price: 299.99,
        stock: 12,
        minStockThreshold: 5,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard',
        sku: 'KEY-MECH-001',
        description: 'RGB mechanical keyboard with blue switches',
        category: 'Accessories',
        price: 89.99,
        stock: 8,
        minStockThreshold: 10,
      },
    }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  // Create sale orders
  const order1 = await prisma.saleOrder.create({
    data: {
      customerName: 'Alice Johnson',
      status: 'paid',
      paymentState: 'paid',
      total: 1579.97,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 1499.99,
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: 49.99,
          },
          {
            productId: products[1].id,
            quantity: 1,
            price: 29.99,
          },
        ],
      },
    },
  });

  const order2 = await prisma.saleOrder.create({
    data: {
      customerName: 'Bob Smith',
      status: 'paid',
      paymentState: 'paid',
      total: 389.98,
      items: {
        create: [
          {
            productId: products[3].id,
            quantity: 1,
            price: 299.99,
          },
          {
            productId: products[4].id,
            quantity: 1,
            price: 89.99,
          },
        ],
      },
    },
  });

  const order3 = await prisma.saleOrder.create({
    data: {
      customerName: 'Charlie Brown',
      status: 'pending',
      paymentState: 'pending',
      total: 119.98,
      items: {
        create: [
          {
            productId: products[2].id,
            quantity: 2,
            price: 49.99,
          },
          {
            productId: products[1].id,
            quantity: 1,
            price: 29.99,
          },
        ],
      },
    },
  });

  console.log('✅ Created 3 sale orders');

  // Update product stock to reflect sales
  await prisma.product.update({
    where: { id: products[0].id },
    data: { stock: 24 }, // Sold 1
  });
  await prisma.product.update({
    where: { id: products[1].id },
    data: { stock: 1 }, // Sold 2 (already low stock)
  });
  await prisma.product.update({
    where: { id: products[2].id },
    data: { stock: 47 }, // Sold 3
  });
  await prisma.product.update({
    where: { id: products[3].id },
    data: { stock: 11 }, // Sold 1
  });
  await prisma.product.update({
    where: { id: products[4].id },
    data: { stock: 7 }, // Sold 1 (below threshold)
  });
  console.log('✅ Updated product stock levels');

  // Create activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: owner.id,
        action: 'login',
        entity: 'auth',
        details: { ip: '192.168.1.100' },
        ipAddress: '192.168.1.100',
      },
      {
        userId: owner.id,
        action: 'create',
        entity: 'product',
        details: { productId: products[0].id },
        ipAddress: '192.168.1.100',
      },
      {
        userId: apprentice.id,
        action: 'login',
        entity: 'auth',
        details: { ip: '192.168.1.101' },
        ipAddress: '192.168.1.101',
      },
    ],
  });
  console.log('✅ Created activity logs');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Test Accounts:');
  console.log('   Owner: owner@primestock.com / Password123');
  console.log('   Apprentice: apprentice@primestock.com / Password123');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
