import { User } from "@/pages/api/user";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";

// Boilerplate so the db connection is saved between reloads
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
// End of boilerplate



//START OF QUERY FUNCTIONS//

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

export async function getBusinessData(businessID: string) {
  return await prisma.businessUser.findFirst({
    where: {
      businessID: businessID
    }
  })
}

export async function loginQuery(username: string, password: string) {
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

export async function signupQuery(businessID: string, password: string, name: string) {
  const passwrodHash = await hash(password, 10)
  try {
    const user = await prisma.businessUser.create({
      data: {
          businessID: businessID,
          businessName: name,
          passwordHash: passwrodHash
        }
      })

    return user.id
  }
  catch(e) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === 'P2002') {
      return null
    }
    else {
      throw e
    }
  }
}