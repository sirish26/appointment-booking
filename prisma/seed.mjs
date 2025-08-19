import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'Passw0rd!'
const PATIENT_EMAIL = 'patient@example.com'
const PATIENT_PASSWORD = 'Passw0rd!'

async function main() {

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: { name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'ADMIN' }
  })

  await prisma.user.upsert({
    where: { email: PATIENT_EMAIL },
    update: {},
    create: { name: 'Patient', email: PATIENT_EMAIL, password: PATIENT_PASSWORD, role: 'PATIENT' }
  })

  console.log('Seeded admin & patient')

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) { 
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + i);

    for (let hour = 9; hour <= 17; hour++) {
      const startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour, 0, 0));
      const endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour + 1, 0, 0));

      await prisma.slot.upsert({
        where: { startTime: startTime },
        update: {},
        create: { startTime, endTime },
      });
    }
  }
  console.log('Seeded slots');
}

main().finally(() => prisma.$disconnect())
