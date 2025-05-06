import { PrismaClient } from "../app/generated/prisma";
import prismaRandom from 'prisma-extension-random';

// import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// const prisma =
//   globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());
const prisma = globalForPrisma.prisma || new PrismaClient().$extends(prismaRandom());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
