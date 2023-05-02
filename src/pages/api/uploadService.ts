import { createService } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";
import { z } from "zod";

const uploadServiceInputSchema = z.object({
    eventName: z.string().nonempty(),
    description: z.string().optional(),
    durationInMins: z.number().optional()
})

export type UploadServiceInput = z.infer<typeof uploadServiceInputSchema>

export type UploadServiceResponse = {
    id: string
} | {
    id: null,
    message: string
}

const handler : NextApiHandler<UploadServiceResponse> = async (req, res) => {
    if (!req.session.user_id) {
        return res.status(400).json({id: null, message: "invalid request"})
    }
    const input = uploadServiceInputSchema.safeParse(req.body)
    if (!input.success) {
        return res.status(400).json({id: null, message: "invalid input"})
    }

    const {eventName, description} = input.data

    const service = await createService(req.session.user_id, eventName, description)

    if (service === null) {
        return res.status(500).json({id: null, message: "server error"})
    }

    res.json({id: service.id})
}

export default withSessionApiRoute(handler)