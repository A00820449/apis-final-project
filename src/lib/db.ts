import { UpdateUserInput } from "@/pages/api/updateUser";
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

  const b = await prisma.businessUser.findFirst({
    where: {
      businessID: businessID
    }
  })
  
  if (!b) {
    return null
  }

  const cat = await prisma.service.findMany({
    where: {
      businessUserID: b.id
    }
  })
  return {...b, catalog: cat}
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

export async function signupQuery(businessID: string, password: string, name: string, address?: string, phoneNUm?: string) {
  const passwrodHash = await hash(password, 10)

  if (phoneNUm && !phoneNUm.match(/^[0-9]{10}$/)) {
    phoneNUm = undefined
  }

  if (address) {
    address = address.replace(/[ \n\r\t]]+/g, " ").trim()
  }

  try {
    const user = await prisma.businessUser.create({
      data: {
          businessID: businessID,
          businessName: name,
          passwordHash: passwrodHash,
          address: address,
          phoneNum: phoneNUm
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

export async function getUserCatalog(id: string) {
  return prisma.service.findMany({
    where: {
      businessUserID: id
    }
  })
}

export async function createService(businessUserID: string,  eventName: string, description?: string, durationInMins?: number) {
  try {
    const service = await prisma.service.create({
      data: {
        businessUserID,
        eventName,
        description,
        durationInMins
      }
    })
    return service
  }
  catch(e) {
    console.error(e)
    return null
  }
}

export async function getUserFull(id: string) {
  return prisma.businessUser.findUnique({
    where: {
      id: id
    }
  })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  return await prisma.businessUser.update({
    where: {
      id: id
    },
    data: data
  })
}

export async function checkAppointment(businessUserID: string, time: number) {}