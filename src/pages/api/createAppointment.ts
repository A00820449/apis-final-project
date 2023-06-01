import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    businessUserID: z.string(),
    serviceID: z.string(),
    timeStart: z.number(),
    contactEmail: z.string().optional(),
    notes: z.string().optional()
})

type CreateAppointmentInput = z.infer<typeof inputSchema>

type CreateAppointmentResponse = {id: string} | {id: null, message: string}

const handler : NextApiHandler<CreateAppointmentResponse> =async (req, res) => {
    res.json({id: ""})
}

export default withSessionApiRoute(handler)