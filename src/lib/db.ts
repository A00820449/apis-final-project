import { User } from "@/pages/api/user";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
        process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") { globalForPrisma.prisma = prisma; }

export async function getUserData(id: string) : Promise<User | null> {
  return await prisma.businessUser.findUnique({
      where: {
          id: id
      },
      select: {
          id: true,
          businessID: true,
          businessName: true,
          isAdmin: true
      }
  })
}

export async function LoginInputQuery(username: string, password: string) {
  const user = await prisma.businessUser.findUnique({
      where: {
          businessID: username
      }
  })

  if (!user) {
      return null
  }

  if (await compare(password, user.passwordHash)) {
      return user.id
  }

  return null
}
