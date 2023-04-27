import { NextApiHandler } from "next";
import { withSessionApiRoute } from "@/lib/session";
import { loginQuery } from "@/lib/db";

export type LoginInput = {
    username: string,
    password: string
}

export type LoginResponse = {
    message?: string
    id?: string
}

const handler: NextApiHandler<LoginResponse> = async (req, res) => {
    const {username, password} = req.body as LoginInput

    if (!username || !password) {
        return res.status(400).json({message: "Invalid request"})
    }

    try {
        const user_id = await loginQuery(username, password)

        if (user_id) {
            req.session.user_id = user_id
            await req.session.save()
            return res.json({id: user_id})
        }

        return res.status(400).json({message: "Wrong username or password"})
    }
    catch (e) {
        console.error(e)
        res.status(500).send({message: "Server error"})
    }
}

export default withSessionApiRoute(handler)