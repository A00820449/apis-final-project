import { getAppointments } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { Appointment } from "@prisma/client";
import { NextApiHandler } from "next";

export type GetAppointmentsResponse = {appointments: Appointment[]} | {appointments: null, message: string}

const handler : NextApiHandler<GetAppointmentsResponse> = async (req, res) => {
    const id = req.session.user_id

    if (!id) {
        return res.status(400).json({appointments: null, message: "invalid request"})
    }

    try {
        const apps = await getAppointments(id, 50, 0)
        return res.status(200).json({appointments: apps})
    }
    catch(e) {
        console.error(e)
        return res.status(500).json({appointments: null, message: "server error"})
    }
}

export default withSessionApiRoute(handler)