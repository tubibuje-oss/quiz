import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
const adapter = connectionString
  ? new PrismaPg({
      connectionString,
    })
  : undefined;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// export default prisma;
