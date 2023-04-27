import { NextApiHandler } from "next";
import { signupQuery } from "@/lib/db";

export type SignUpInput = {
    businessID: string,
    name: string,
    password: string
}

export type SignUpResponse = {
    message?: string,
    id?: string
}

const handler: NextApiHandler<SignUpResponse> = async (req, res) => {
    try {
        const {businessID = '', name = '', password = ''} = req.body as SignUpInput

        if (!businessID || !name || !password) {
            return res.status(400).json({message: "Invalid request"})
        }

        if (!businessID.match(/^[A-Za-z0-9_.-]{3,16}$/g)) {
            return res.status(400).json({message: "Invalid business ID"})
        }

        const user_id = await signupQuery(businessID, password, name)

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