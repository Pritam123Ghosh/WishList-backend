import "dotenv/config";
import pkg from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
const { PrismaClient } = pkg;

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
