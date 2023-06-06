import { deleteService, serviceBelongsToBusiness } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    serviceID: z.string()    
})

export type DeleteServiceInput = z.infer<typeof inputSchema>

export type DeleteServiceResponse = {ok: true} | {ok: false, message: string}

const handler : NextApiHandler<DeleteServiceResponse> = async (req, res) => {
    const id = req.session.user_id

    if (!id) {
        return res.status(400).json({ok: false, message: "invalid request"})
    }

    const parsed = inputSchema.safeParse(req.query)

    if (!parsed.success) {
        return res.status(400).json({ok: false, message: "invalid request"})
    }

    const { serviceID } = parsed.data

    const belongs = await serviceBelongsToBusiness(id, serviceID)

    if (!belongs) {
        return res.status(400).json({ok: false, message: "unauthorized"})
    }

    try {
        await deleteService(serviceID)
        return res.status(200).json({ok: true})
    }
    catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, message: "unauthorized"})
    }
}

export default withSessionApiRoute(handler)