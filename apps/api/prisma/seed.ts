import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const serviceCategories = [
    { slug: 'coiffure', label: 'Coiffure', sortOrder: 0 },
    { slug: 'barbier', label: 'Barbier', sortOrder: 1 },
    { slug: 'manucure', label: 'Manucure', sortOrder: 2 },
    { slug: 'institut-beaute', label: 'Institut de beauté', sortOrder: 3 },
    { slug: 'spa', label: 'Spa', sortOrder: 4 },
    { slug: 'epilation', label: 'Épilation', sortOrder: 5 },
    { slug: 'massage', label: 'Massage', sortOrder: 6 },
  ];
  for (const c of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { slug: c.slug },
      update: { label: c.label, sortOrder: c.sortOrder },
      create: c,
    });
  }

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

  // Create business (Toulouse)
  const business = await prisma.business.upsert({
    where: { slug: 'salon-lumiere' },
    update: {
      description: 'A beautiful salon in the heart of Toulouse',
      phone: '+33512345678',
      category: 'coiffure',
    },
    create: {
      name: 'Salon Lumière',
      slug: 'salon-lumiere',
      description: 'A beautiful salon in the heart of Toulouse',
      category: 'coiffure',
      timezone: 'Europe/Paris',
      phone: '+33512345678',
      email: 'contact@salonlumiere.fr',
      status: 'active',
      freeCancellationBeforeHours: 24,
      allowRescheduleBeforeHours: 2,
      locations: {
        create: {
          label: 'Main',
          address1: '10 Rue du Taur',
          postalCode: '31000',
          city: 'Toulouse',
          country: 'FR',
          lat: 43.6047,
          lng: 1.4442,
        },
      },
    },
  });

  // Ensure Salon Lumière location is Toulouse (in case it was seeded before with Paris)
  await prisma.location.updateMany({
    where: { businessId: business.id },
    data: {
      address1: '10 Rue du Taur',
      postalCode: '31000',
      city: 'Toulouse',
      lat: 43.6047,
      lng: 1.4442,
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
  // Staff-level rules (for when staffId is passed)
  const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday (0=Sunday in API)
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
  // Business-level rules (no staffId) so app gets slots when it doesn't send staffId
  for (const dayOfWeek of daysOfWeek) {
    await prisma.availabilityRule.create({
      data: {
        businessId: business.id,
        staffId: null,
        dayOfWeek,
        startTimeLocal: '09:00',
        endTimeLocal: '18:00',
      },
    });
  }

  // ——— 3 coiffeur shops for testing (all Toulouse) ———
  const coiffeurShops = [
    {
      name: 'Coiffure Élégance',
      slug: 'coiffure-elegance',
      description: 'Salon de coiffure moderne au cœur de Toulouse. Coupe, coloration et soins.',
      category: 'coiffure',
      city: 'Toulouse',
      address1: '45 Rue de la Pomme',
      postalCode: '31000',
      lat: 43.605,
      lng: 1.442,
      staffName: 'Sophie',
      staffTitle: 'Styliste',
      ratingAvg: 4.8,
      ratingCount: 124,
    },
    {
      name: 'Le Salon du Marais',
      slug: 'salon-marais',
      description: 'Coiffure tendance à Toulouse. Expertise coupe femme et homme.',
      category: 'barbier',
      city: 'Toulouse',
      address1: '12 Rue du Capitole',
      postalCode: '31000',
      lat: 43.6035,
      lng: 1.446,
      staffName: 'Thomas',
      staffTitle: 'Coiffeur',
      ratingAvg: 4.6,
      ratingCount: 89,
    },
    {
      name: 'Boucles & Co',
      slug: 'boucles-co',
      description: 'Spécialiste des coupes et colorations. Ambiance conviviale.',
      category: 'spa',
      city: 'Toulouse',
      address1: '8 Rue des Filatiers',
      postalCode: '31000',
      lat: 43.5989,
      lng: 1.4342,
      staffName: 'Marie',
      staffTitle: 'Coloriste',
      ratingAvg: 4.9,
      ratingCount: 156,
    },
  ];

  for (const shop of coiffeurShops) {
    const existing = await prisma.business.findUnique({ where: { slug: shop.slug }, include: { staff: true } });
    if (existing) continue; // already seeded

    const biz = await prisma.business.create({
      data: {
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        category: shop.category,
        timezone: 'Europe/Paris',
        phone: '+33012345678',
        email: `contact@${shop.slug.replace(/-/g, '')}.fr`,
        status: 'active',
        ratingAvg: shop.ratingAvg,
        ratingCount: shop.ratingCount,
        freeCancellationBeforeHours: 24,
        allowRescheduleBeforeHours: 2,
        locations: {
          create: {
            label: 'Principal',
            address1: shop.address1,
            postalCode: shop.postalCode,
            city: shop.city,
            country: 'FR',
            lat: shop.lat,
            lng: shop.lng,
          },
        },
      },
    });

    const staffMember = await prisma.staff.create({
      data: {
        businessId: biz.id,
        name: shop.staffName,
        roleTitle: shop.staffTitle,
        isActive: true,
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Coupe',
        description: 'Coupe et coiffage',
        category: 'Coiffure',
        baseDurationMin: 45,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Coupe femme', priceCents: 4500, durationMin: 45, bufferBeforeMin: 5, bufferAfterMin: 10, capacity: 1 },
            { name: 'Coupe homme', priceCents: 2800, durationMin: 30, bufferBeforeMin: 5, bufferAfterMin: 5, capacity: 1 },
          ],
        },
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Coloration',
        description: 'Coloration complète ou mèches',
        category: 'Coiffure',
        baseDurationMin: 90,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Coloration complète', priceCents: 7500, durationMin: 90, bufferBeforeMin: 10, bufferAfterMin: 10, capacity: 1 },
            { name: 'Mèches', priceCents: 9500, durationMin: 120, bufferBeforeMin: 10, bufferAfterMin: 15, capacity: 1 },
          ],
        },
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Brushing',
        description: 'Brushing et mise en pli',
        category: 'Coiffure',
        baseDurationMin: 30,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Brushing', priceCents: 2200, durationMin: 30, bufferBeforeMin: 5, bufferAfterMin: 5, capacity: 1 },
          ],
        },
      },
    });

    for (const dayOfWeek of daysOfWeek) {
      await prisma.availabilityRule.create({
        data: {
          businessId: biz.id,
          staffId: staffMember.id,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
      await prisma.availabilityRule.create({
        data: {
          businessId: biz.id,
          staffId: null,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
    }
  }

  // ——— 3 salons in Toulouse ———
  const toulouseSalons = [
    {
      name: 'Coiffure Capitole',
      slug: 'coiffure-capitole-toulouse',
      description: 'Salon de coiffure au pied du Capitole. Coupe, coloration et soins capillaires.',
      category: 'coiffure',
      city: 'Toulouse',
      address1: '15 Place du Capitole',
      postalCode: '31000',
      lat: 43.6047,
      lng: 1.4442,
      staffName: 'Léa',
      staffTitle: 'Styliste',
      ratingAvg: 4.7,
      ratingCount: 98,
    },
    {
      name: 'Salon Garonne',
      slug: 'salon-garonne-toulouse',
      description: 'Coiffure et barbier près des quais. Ambiance décontractée, expertise homme et femme.',
      category: 'barbier',
      city: 'Toulouse',
      address1: '42 Quai de la Daurade',
      postalCode: '31000',
      lat: 43.5989,
      lng: 1.4342,
      staffName: 'Antoine',
      staffTitle: 'Coiffeur-Barbier',
      ratingAvg: 4.5,
      ratingCount: 67,
    },
    {
      name: 'Boucles Roses',
      slug: 'boucles-roses-toulouse',
      description: 'Spécialiste coloration et mèches dans la ville rose. Conseils personnalisés.',
      category: 'coiffure',
      city: 'Toulouse',
      address1: '8 Rue du Taur',
      postalCode: '31000',
      lat: 43.6072,
      lng: 1.4419,
      staffName: 'Claire',
      staffTitle: 'Coloriste',
      ratingAvg: 4.9,
      ratingCount: 112,
    },
  ];

  for (const shop of toulouseSalons) {
    const existing = await prisma.business.findUnique({ where: { slug: shop.slug }, include: { staff: true } });
    if (existing) continue;

    const biz = await prisma.business.create({
      data: {
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        category: shop.category,
        timezone: 'Europe/Paris',
        phone: '+33512345678',
        email: `contact@${shop.slug.replace(/-/g, '').replace('toulouse', '')}.fr`,
        status: 'active',
        ratingAvg: shop.ratingAvg,
        ratingCount: shop.ratingCount,
        freeCancellationBeforeHours: 24,
        allowRescheduleBeforeHours: 2,
        locations: {
          create: {
            label: 'Principal',
            address1: shop.address1,
            postalCode: shop.postalCode,
            city: shop.city,
            country: 'FR',
            lat: shop.lat,
            lng: shop.lng,
          },
        },
      },
    });

    const staffMember = await prisma.staff.create({
      data: {
        businessId: biz.id,
        name: shop.staffName,
        roleTitle: shop.staffTitle,
        isActive: true,
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Coupe',
        description: 'Coupe et coiffage',
        category: 'Coiffure',
        baseDurationMin: 45,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Coupe femme', priceCents: 4200, durationMin: 45, bufferBeforeMin: 5, bufferAfterMin: 10, capacity: 1 },
            { name: 'Coupe homme', priceCents: 2600, durationMin: 30, bufferBeforeMin: 5, bufferAfterMin: 5, capacity: 1 },
          ],
        },
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Coloration',
        description: 'Coloration complète ou mèches',
        category: 'Coiffure',
        baseDurationMin: 90,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Coloration complète', priceCents: 7200, durationMin: 90, bufferBeforeMin: 10, bufferAfterMin: 10, capacity: 1 },
            { name: 'Mèches', priceCents: 8800, durationMin: 120, bufferBeforeMin: 10, bufferAfterMin: 15, capacity: 1 },
          ],
        },
      },
    });

    await prisma.service.create({
      data: {
        businessId: biz.id,
        name: 'Brushing',
        description: 'Brushing et mise en pli',
        category: 'Coiffure',
        baseDurationMin: 30,
        isActive: true,
        serviceVariants: {
          create: [
            { name: 'Brushing', priceCents: 2000, durationMin: 30, bufferBeforeMin: 5, bufferAfterMin: 5, capacity: 1 },
          ],
        },
      },
    });

    for (const dayOfWeek of daysOfWeek) {
      await prisma.availabilityRule.create({
        data: {
          businessId: biz.id,
          staffId: staffMember.id,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
      await prisma.availabilityRule.create({
        data: {
          businessId: biz.id,
          staffId: null,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
    }
  }

  // ——— Test salon Toulouse: full booking simulation (dates + heures) ———
  const testSalonSlug = 'salon-test-reservation-toulouse';
  const existingTestSalon = await prisma.business.findUnique({
    where: { slug: testSalonSlug },
    include: { staff: true, locations: true },
  });
  if (!existingTestSalon) {
    const testSalon = await prisma.business.create({
      data: {
        name: 'Salon Test Réservation Toulouse',
        slug: testSalonSlug,
        description:
          'Salon de test pour simuler une réservation complète. Ouvert du lundi au samedi, 9h-19h.',
        category: 'coiffure',
        timezone: 'Europe/Paris',
        phone: '+33561234567',
        email: 'contact@salontest-toulouse.fr',
        status: 'active',
        ratingAvg: 4.8,
        ratingCount: 42,
        freeCancellationBeforeHours: 24,
        allowRescheduleBeforeHours: 2,
        locations: {
          create: {
            label: 'Principal',
            address1: '7 Place du Capitole',
            postalCode: '31000',
            city: 'Toulouse',
            country: 'FR',
            lat: 43.604652,
            lng: 1.444209,
          },
        },
      },
    });

    const staff1 = await prisma.staff.create({
      data: {
        businessId: testSalon.id,
        name: 'Julie',
        roleTitle: 'Styliste',
        isActive: true,
      },
    });
    const staff2 = await prisma.staff.create({
      data: {
        businessId: testSalon.id,
        name: 'Marc',
        roleTitle: 'Coiffeur',
        isActive: true,
      },
    });

    const serviceCoupe = await prisma.service.create({
      data: {
        businessId: testSalon.id,
        name: 'Coupe',
        description: 'Coupe et coiffage',
        category: 'Coiffure',
        baseDurationMin: 45,
        isActive: true,
        serviceVariants: {
          create: [
            {
              name: 'Coupe femme',
              priceCents: 4500,
              durationMin: 45,
              bufferBeforeMin: 5,
              bufferAfterMin: 10,
              capacity: 1,
            },
            {
              name: 'Coupe homme',
              priceCents: 2800,
              durationMin: 30,
              bufferBeforeMin: 5,
              bufferAfterMin: 5,
              capacity: 1,
            },
          ],
        },
      },
    });

    const serviceColoration = await prisma.service.create({
      data: {
        businessId: testSalon.id,
        name: 'Coloration',
        description: 'Coloration complète ou mèches',
        category: 'Coiffure',
        baseDurationMin: 90,
        isActive: true,
        serviceVariants: {
          create: [
            {
              name: 'Coloration complète',
              priceCents: 7200,
              durationMin: 90,
              bufferBeforeMin: 10,
              bufferAfterMin: 10,
              capacity: 1,
            },
          ],
        },
      },
    });

    const serviceBrushing = await prisma.service.create({
      data: {
        businessId: testSalon.id,
        name: 'Brushing',
        description: 'Brushing et mise en pli',
        category: 'Coiffure',
        baseDurationMin: 30,
        isActive: true,
        serviceVariants: {
          create: [
            {
              name: 'Brushing',
              priceCents: 2000,
              durationMin: 30,
              bufferBeforeMin: 5,
              bufferAfterMin: 5,
              capacity: 1,
            },
          ],
        },
      },
    });

    // Horaires: lundi à samedi 9h–19h (dayOfWeek: 1=Mon … 6=Sat, 0=Sun)
    const daysOpen = [1, 2, 3, 4, 5, 6];
    for (const dayOfWeek of daysOpen) {
      await prisma.availabilityRule.create({
        data: {
          businessId: testSalon.id,
          staffId: staff1.id,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
      await prisma.availabilityRule.create({
        data: {
          businessId: testSalon.id,
          staffId: staff2.id,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
      await prisma.availabilityRule.create({
        data: {
          businessId: testSalon.id,
          staffId: null,
          dayOfWeek,
          startTimeLocal: '09:00',
          endTimeLocal: '19:00',
        },
      });
    }

    console.log('   + 1 salon test réservation: Salon Test Réservation Toulouse (Toulouse, 7 Place du Capitole)');
  }

  // Ensure all salons are located in Toulouse (update any existing locations from previous seeds)
  const toulouseSpots: { lat: number; lng: number; address1: string }[] = [
    { lat: 43.6047, lng: 1.4442, address1: '10 Rue du Taur' },
    { lat: 43.605, lng: 1.442, address1: '45 Rue de la Pomme' },
    { lat: 43.6035, lng: 1.446, address1: '12 Rue du Capitole' },
    { lat: 43.5989, lng: 1.4342, address1: '8 Rue des Filatiers' },
    { lat: 43.6047, lng: 1.4442, address1: '15 Place du Capitole' },
    { lat: 43.5989, lng: 1.4342, address1: '42 Quai de la Daurade' },
    { lat: 43.6072, lng: 1.4419, address1: '8 Rue du Taur' },
    { lat: 43.604652, lng: 1.444209, address1: '7 Place du Capitole' },
  ];
  const allLocations = await prisma.location.findMany({ select: { id: true } });
  for (let i = 0; i < allLocations.length; i++) {
    const spot = toulouseSpots[i % toulouseSpots.length];
    await prisma.location.update({
      where: { id: allLocations[i].id },
      data: {
        city: 'Toulouse',
        postalCode: '31000',
        address1: spot.address1,
        lat: spot.lat,
        lng: spot.lng,
      },
    });
  }
  if (allLocations.length > 0) {
    console.log(`   + Updated ${allLocations.length} location(s) to Toulouse`);
  }

  // Backfill: ensure every business with availability has business-level rules (staffId null)
  // so the app gets slots when it doesn't send staffId
  const businessesWithRules = await prisma.business.findMany({
    where: { availabilityRules: { some: {} } },
    select: { id: true },
  });
  const daysMonSat = [1, 2, 3, 4, 5, 6];
  for (const b of businessesWithRules) {
    const hasNullStaffRule = await prisma.availabilityRule.findFirst({
      where: { businessId: b.id, staffId: null },
    });
    if (!hasNullStaffRule) {
      for (const dayOfWeek of daysMonSat) {
        await prisma.availabilityRule.create({
          data: {
            businessId: b.id,
            staffId: null,
            dayOfWeek,
            startTimeLocal: '09:00',
            endTimeLocal: '19:00',
          },
        });
      }
      console.log('   + Backfilled business-level availability for business', b.id);
    }
  }

  console.log('✅ Seeding completed!');
  console.log('   + 3 coiffeur shops: Coiffure Élégance, Le Salon du Marais, Boucles & Co');
  console.log('   + 3 salons Toulouse: Coiffure Capitole, Salon Garonne, Boucles Roses');
  console.log('   + 1 salon test: Salon Test Réservation Toulouse (slug: salon-test-reservation-toulouse)');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@planity.com / admin123');
  console.log('Provider: provider@planity.com / provider123');
  console.log('Client: client@planity.com / client123');
  console.log('\n📅 Simuler une réservation (client):');
  console.log('  1. Se connecter avec client@planity.com / client123');
  console.log('  2. Rechercher "Toulouse" ou ouvrir le salon "Salon Test Réservation Toulouse"');
  console.log('  3. Choisir une prestation (ex: Coupe femme), une date (lun–sam), un créneau puis confirmer.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

