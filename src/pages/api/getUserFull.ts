import { getBusinessData, getUserData, getUserFull } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { BusinessUser } from "@prisma/client";
import { NextApiHandler } from "next";

export type GetUserFullResponse = Omit<BusinessUser, "passwordHash"> | {id: null, message?: string}

const handler : NextApiHandler<GetUserFullResponse> = async (req, res) => {
    const id = req.session.user_id
    if (!id) {
        return res.status(400).json({id: null, message: "invalid request"})
    }
    try {
        const data = await getUserFull(id)
        if (!data) {
            return res.status(400).json({id: null, message: "invalid request"})
        }
        const {passwordHash, ...response} = data
        res.json(response)
    }
    catch(e) {
        res.status(500).json({id: null, message: "server error"})
        console.error(e)
    }
}

export default withSessionApiRoute(handler)