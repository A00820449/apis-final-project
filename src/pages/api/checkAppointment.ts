import { checkAppointment } from "@/lib/db";
import { getJSONfromQuery } from "@/lib/util";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    businessUserID: z.string().nonempty(),
    timeStart: z.number(),
    timeEnd: z.number()
})

export type CheckAppointmentInput = z.infer<typeof inputSchema>

export type CheckAppointmentResponse = boolean

const handler : NextApiHandler<CheckAppointmentResponse> = async (req, res) => {

    const parsed = getJSONfromQuery(req.query)
    const input = inputSchema.safeParse(parsed)
    if (!input.success) {
        return res.status(400).json(false)
    }
    const {businessUserID, timeStart, timeEnd} = input.data
    try {
        const app = await checkAppointment(businessUserID, timeStart, timeEnd)
        return res.status(200).json(app !== null)
    }
    catch (e) {
        return res.status(200).json(false)
    }
}

export default handler