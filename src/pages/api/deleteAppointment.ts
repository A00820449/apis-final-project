import { appointmentBelongsToBusiness, deleteAppointment } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { NextApiHandler } from "next";
import { z } from "zod";

const inputSchema = z.object({
    appointmentID: z.string()    
})

export type DeleteAppointmentInput = z.infer<typeof inputSchema>

export type DeleteAppointmentResponse = {ok: true} | {ok: false, message: string}

const handler : NextApiHandler<DeleteAppointmentResponse> = async (req, res) => {
    const id = req.session.user_id

    if (!id) {
        return res.status(400).json({ok: false, message: "invalid request"})
    }

    const parsed = inputSchema.safeParse(req.query)

    if (!parsed.success) {
        return res.status(400).json({ok: false, message: "invalid request"})
    }

    const { appointmentID } = parsed.data

    const belongs = await appointmentBelongsToBusiness(id, appointmentID)

    if (!belongs) {
        return res.status(400).json({ok: false, message: "unauthorized"})
    }

    try {
        await deleteAppointment(appointmentID)
        return res.status(200).json({ok: true})
    }
    catch (e) {
        console.error(e)
        return res.status(400).json({ok: false, message: "unauthorized"})
    }
}

export default withSessionApiRoute(handler)