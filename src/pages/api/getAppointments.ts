import { getAppointments } from "@/lib/db";
import { withSessionApiRoute } from "@/lib/session";
import { Appointment } from "@prisma/client";
import { NextApiHandler } from "next";

export type ResponseAppointment = {
    id: string,
    businessUserID: string, 
    serviceName: string,
    timeStart: number,
    timeEnd: number, 
    contactEmail: string | null,
    confirmed: boolean,
    creationTime: number,
    notes: string | null
}

export type GetAppointmentsResponse = {appointments: ResponseAppointment[]} | {appointments: null, message: string}

const handler : NextApiHandler<GetAppointmentsResponse> = async (req, res) => {
    const id = req.session.user_id

    if (!id) {
        return res.status(400).json({appointments: null, message: "invalid request"})
    }

    try {
        const apps = (await getAppointments(id, 50, 0)).map((v) => ({...v, timeStart: v.timeStart.getTime(), timeEnd: v.timeEnd.getTime(), creationTime: v.creationTime.getTime()}))
        return res.status(200).json({appointments: apps})
    }
    catch(e) {
        console.error(e)
        return res.status(500).json({appointments: null, message: "server error"})
    }
}

export default withSessionApiRoute(handler)