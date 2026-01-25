import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@planity.com' },
    update: {},
    create: {
      email: 'admin@planity.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active',
    },
  });

  // Create provider user
  const providerPassword = await argon2.hash('provider123');
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@planity.com' },
    update: {},
    create: {
      email: 'provider@planity.com',
      passwordHash: providerPassword,
      name: 'Salon Owner',
      role: 'providerOwner',
      status: 'active',
    },
  });

  // Create client user
  const clientPassword = await argon2.hash('client123');
  const client = await prisma.user.upsert({
    where: { email: 'client@planity.com' },
    update: {},
    create: {
      email: 'client@planity.com',
      passwordHash: clientPassword,
      name: 'Test Client',
      role: 'client',
      status: 'active',
    },
  });

  // Create business
  const business = await prisma.business.upsert({
    where: { slug: 'salon-lumiere' },
    update: {},
    create: {
      name: 'Salon Lumière',
      slug: 'salon-lumiere',
      description: 'A beautiful salon in the heart of Paris',
      category: 'Hair Salon',
      timezone: 'Europe/Paris',
      phone: '+33123456789',
      email: 'contact@salonlumiere.fr',
      status: 'active',
      freeCancellationBeforeHours: 24,
      allowRescheduleBeforeHours: 2,
      locations: {
        create: {
          label: 'Main',
          address1: '123 Rue de la Paix',
          postalCode: '75001',
          city: 'Paris',
          country: 'FR',
          lat: 48.8566,
          lng: 2.3522,
        },
      },
    },
  });

  // Create provider profile
  await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      displayName: 'Salon Owner',
      businessId: business.id,
      isOwner: true,
    },
  });

  // Create staff
  const staff = await prisma.staff.create({
    data: {
      businessId: business.id,
      name: 'Camille',
      roleTitle: 'Senior Stylist',
      isActive: true,
    },
  });

  // Create services
  const haircutService = await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Haircut',
      description: 'Professional haircut service',
      category: 'Hair',
      baseDurationMin: 45,
      isActive: true,
      serviceVariants: {
        create: [
          {
            name: 'Standard Cut',
            priceCents: 3500, // €35.00
            durationMin: 45,
            bufferBeforeMin: 5,
            bufferAfterMin: 10,
            capacity: 1,
          },
          {
            name: 'Premium Cut',
            priceCents: 5000, // €50.00
            durationMin: 60,
            bufferBeforeMin: 5,
            bufferAfterMin: 10,
            capacity: 1,
          },
        ],
      },
    },
  });

  const coloringService = await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Hair Coloring',
      description: 'Professional hair coloring service',
      category: 'Hair',
      baseDurationMin: 120,
      isActive: true,
      serviceVariants: {
        create: [
          {
            name: 'Full Color',
            priceCents: 8000, // €80.00
            durationMin: 120,
            bufferBeforeMin: 10,
            bufferAfterMin: 15,
            capacity: 1,
          },
        ],
      },
    },
  });

  const stylingService = await prisma.service.create({
    data: {
      businessId: business.id,
      name: 'Hair Styling',
      description: 'Professional hair styling service',
      category: 'Hair',
      baseDurationMin: 30,
      isActive: true,
      serviceVariants: {
        create: [
          {
            name: 'Blow Dry',
            priceCents: 2500, // €25.00
            durationMin: 30,
            bufferBeforeMin: 5,
            bufferAfterMin: 5,
            capacity: 1,
          },
        ],
      },
    },
  });

  // Create availability rules (Monday-Friday, 9am-6pm)
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
  for (const dayOfWeek of daysOfWeek) {
    await prisma.availabilityRule.create({
      data: {
        businessId: business.id,
        staffId: staff.id,
        dayOfWeek,
        startTimeLocal: '09:00',
        endTimeLocal: '18:00',
      },
    });
  }

  console.log('✅ Seeding completed!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@planity.com / admin123');
  console.log('Provider: provider@planity.com / provider123');
  console.log('Client: client@planity.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

