import { NextApiHandler } from "next";
import { hash } from "bcrypt";
import { prisma } from "@/lib/db";
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientRustPanicError, PrismaClientUnknownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

interface SignUpInput {
    businessID?: string,
    name?: string,
    password?: string
}

const handler: NextApiHandler = async (req, res) => {
    try {
        const {businessID = '', name = '', password = ''} = req.body as SignUpInput

        if (!businessID || !name || !password) {
            return res.status(400).json({message: "Invalid request"})
        }

        if (!businessID.match(/^[A-Za-z0-9_.-]{3,16}$/g)) {
            return res.status(400).json({message: "Invalid business ID"})
        }

        const passwrodHash = await hash(password, 10)

        const user = await prisma.businessUser.create({
            data: {
                businessID: businessID,
                businessName: name,
                passwordHash: passwrodHash
            }
        })

        res.json({id: user.id})

    }
    catch(e) {
        console.error(e)
        if (typeof e === "object" && e !== null && "code" in e && e.code === 'P2002') {
            res.status(400).json({message: "Business ID already exists"})
        }
        /** Send error message if there is one (might not be secure) */
        /*else if (e instanceof Error) {
            res.status(500).json({message: e.message || "An error occurred"})
        }*/
        else {
            res.status(500).json({message: "An error occurred"})
        }
    }
}

export default handler