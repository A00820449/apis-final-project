import { NextApiHandler } from "next";
import { withSessionApiRoute } from "@/lib/session";
import { loginQuery } from "@/lib/db";
import { z } from "zod";

const loginInputSchema = z.object({
    username: z.string().nonempty(),
    password: z.string().nonempty(),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export type LoginResponse = {
    message?: string
    id?: string
}

const handler: NextApiHandler<LoginResponse> = async (req, res) => {
    const input = loginInputSchema.safeParse(req.body)

    if (!input.success) {
        return res.status(400).json({message: "Invalid request"})
    }

    const {username, password} = input.data

    try {
        const user_id = await loginQuery(username, password)

        if (!user_id) {
            return res.status(400).json({message: "Wrong username or password"})
        }

        req.session.user_id = user_id
        await req.session.save()
        return res.json({id: user_id})
    }
    catch (e) {
        console.error(e)
        res.status(500).send({message: "Server error"})
    }
}

export default withSessionApiRoute(handler)