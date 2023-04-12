import { getUserData } from "@/lib/db";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    const id = req.session.user_id

    try {
        const user = await getUserData(id)
        res.json({...user})
    } catch (e) {
        console.error(e)
        res.status(500).json({message: "Server error"})
    }
}


export type User = {
    id: string,
    businessID: string,
    businessName: string,
    isAdmin: boolean
}

export default withIronSessionApiRoute(handler, sessionOptions)