import { getUserData } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";

const handler: NextApiHandler<User|UserError> = async (req, res) => {
    const id = req.session.user_id

    if (!id) {
        return res.status(400).json({id: null, message: "not logged in"})
    }

    try {
        const user = await getUserData(id)
        if (!user) {
            req.session.destroy()
            return res.status(400).json({id: null, message: "user not found"})
        }
        res.json(user)
    } catch (e) {
        console.error(e)
        req.session.destroy()
        res.status(500).json({id: null, message: "server error"})
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