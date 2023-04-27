import { getUserData } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";

const handler: NextApiHandler<User|UserError> = async (req, res) => {
    const id = req.session.user_id

    try {
        const user = await getUserData(id)
        if (!user) {
            return res.status(400).json({id: null, message: "Server error"})
        }
        res.json(user)
    } catch (e) {
        console.error(e)
        res.status(500).json({id: null, message: "Server error"})
    }
}


export type User = {
    id: string,
    businessID: string,
    businessName: string,
    isAdmin: boolean
}

type UserError = {
    id: null,
    message: string
}

export type UserResponse = User | UserError

export default withSessionApiRoute(handler)