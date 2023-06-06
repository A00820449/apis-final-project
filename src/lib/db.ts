import { UpdateUserInput } from "@/pages/api/updateUser";
import { User } from "@/pages/api/user";
import { Appointment, PrismaClient } from "@prisma/client";
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

export async function checkAppointment(businessUserID: string, timeStart: number, timeEnd: number) {

  return await prisma.appointment.findFirst({
    where: {
      businessUserID: businessUserID,
      timeStart: {
        lt: new Date(timeEnd)
      },
      timeEnd: {
        gt: new Date(timeStart)
      }
    },
    select: {
      id: true
    }
  })
}

export async function createAppointment(businessUserID: string, serviceName: string, timeStart: number, timeEnd: number, contactEmail?: string, notes?: string) {
  if (timeStart >= timeEnd) {
    throw new Error("invalid time range")
  }

  const conflict = await checkAppointment(businessUserID, timeStart, timeEnd)

  if (conflict !== null) {
    throw new Error("overlapping appointment")
  }

  return await prisma.appointment.create({
    data: {
      businessUserID: businessUserID,
      serviceName: serviceName,
      timeStart: new Date(timeStart),
      timeEnd: new Date(timeEnd),
      contactEmail: contactEmail,
      notes: notes
    }
  })
}

export async function deleteAppointment(id: string) {
  return prisma.appointment.delete({
    where: {
      id: id
    }
  })
}

export async function getAppointments(id: string, take: number, skip: number) {
  return await prisma.appointment.findMany({
    where: {
      businessUserID: id
    },
    orderBy: {
      timeStart: "desc"
    },
    skip: skip,
    take: take
  })
}

export async function appointmentBelongsToBusiness(businessUserID: string, appointmentID: string) {
  const found = await prisma.appointment.findFirst({
    where: {
      id: appointmentID,
      businessUserID: businessUserID,
    },
    select: {
      id: true
    }
  })

  return found !== null
}

export async function getService(id: string) {
  return await prisma.service.findUnique({
    where: {
      id: id
    }
  })
}

export async function deleteService(id: string) {
  return await prisma.service.delete({
    where: {
      id: id
    }
  })
}

export async function serviceBelongsToBusiness(businessUserID: string, serviceID: string) {
  const found = await prisma.service.findFirst({
    where: {
      id: serviceID,
      businessUserID: businessUserID
    },
    select: {
      id: true
    }
  })

  return found !== null
}