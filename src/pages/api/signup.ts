import { NextApiHandler } from "next";
import { signupQuery } from "@/lib/db";
import { z } from "zod";

const signUpInputSchema = z.object({
    businessID: z.string().nonempty(),
    name: z.string().nonempty(),
    password: z.string().nonempty(),
    address: z.string().optional(),
    phoneNum: z.string().optional()
})

export type SignUpInput = z.infer<typeof signUpInputSchema>

export type SignUpResponse = {
    message?: string,
    id?: string
}

const handler: NextApiHandler<SignUpResponse> = async (req, res) => {
    try {
        const input = signUpInputSchema.safeParse(req.body)

        if (!input.success) {
            return res.status(400).json({message: "Invalid request"})
        }

        const {businessID, name, password, address, phoneNum} = input.data
        
        if (!businessID.match(/^[A-Za-z0-9_.-]{3,16}$/g)) {
            return res.status(400).json({message: "Invalid business ID"})
        }

        const user_id = await signupQuery(businessID, password, name, address, phoneNum)

        if (!user_id) {
            return res.status(400).json({message: "Business ID already exists"})
        }
        
        res.json({id: user_id})

    }
    catch(e) {
        console.error(e)
        /** Send error message if there is one (might not be secure) */
        /*if (e instanceof Error) {
            return res.status(500).json({message: e.message || "An error occurred"})
        }*/
        
        res.status(500).json({message: "An error occurred"})
    }
}

export default handler