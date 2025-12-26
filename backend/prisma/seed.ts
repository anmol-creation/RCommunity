import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Verified Rider
  const rider = await prisma.user.upsert({
    where: { phoneNumber: '+919876543210' },
    update: {},
    create: {
      phoneNumber: '+919876543210',
      displayName: 'Raju Rider',
      role: 'USER',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log({ rider });

  // Create Visitor
  const visitor = await prisma.user.upsert({
    where: { phoneNumber: '+911234567890' },
    update: {},
    create: {
      phoneNumber: '+911234567890',
      displayName: 'Guest User',
      role: 'USER',
      verificationStatus: 'UNVERIFIED',
    },
  });

  console.log({ visitor });

  // Create some initial posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Hello fellow riders! Traffic is crazy in Indiranagar today.',
      authorId: rider.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Just delivered my 10th order. Target 20 today!',
      authorId: rider.id,
    },
  });

  console.log({ post1, post2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
