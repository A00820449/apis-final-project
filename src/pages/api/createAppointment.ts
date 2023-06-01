import { createAppointment, getService } from "@/lib/db";
import { DateTime } from "luxon";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    businessUserID: z.string(),
    serviceID: z.string(),
    timeStart: z.number(),
    contactEmail: z.string().optional(),
    notes: z.string().optional()
})

export type CreateAppointmentInput = z.infer<typeof inputSchema>

export type CreateAppointmentResponse = {id: string} | {id: null, message: string}

const handler : NextApiHandler<CreateAppointmentResponse> =async (req, res) => {
    const input = inputSchema.safeParse(req.body)
    if (!input.success) {
        return res.status(400).json({id: null, message: "invalid request"})
    }

    const {businessUserID, serviceID, timeStart, contactEmail, notes} = input.data

    let service
    try {
        service = await getService(serviceID)
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({id: null, message: "server error"})
    }

    if (service === null) {
        return res.status(400).json({id: null, message: "invalid request"})
    }

    const timeEnd = DateTime.fromMillis(timeStart).plus({minutes: service.durationInMins}).toMillis()
    const serviceName = service.eventName
    
    try {
        const { id } = await createAppointment(businessUserID, serviceName, timeStart, timeEnd, contactEmail, notes)
        return res.status(200).json({id: id})
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({id: null, message: "server error"})
    }
}

export default handler