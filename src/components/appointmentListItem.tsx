import { useAppointments, useDeleteAppointment } from "@/lib/hooks"
import { ResponseAppointment } from "@/pages/api/getAppointments"
import { Box, Button } from "@mui/material"
import { DateTime } from "luxon"

type AppointmentListItemProps = {
    appointment: ResponseAppointment
}

export default function AppointmentListItem({appointment}: AppointmentListItemProps) {
    const { trigger, isMutating } = useDeleteAppointment({appointmentID: appointment.id})
    const { mutate } = useAppointments()

    const handleClick =  async () => {
        await trigger()
        mutate()
    }

    const dateStart = DateTime.fromMillis(appointment.timeStart)
    const dateEnd = DateTime.fromMillis(appointment.timeEnd)
    return (
    <Box sx={{width: "100%", backgroundColor: "rgba(0,0,0,0.08)", borderRadius: "5px", padding: "1rem"}}>
        <h3>{appointment.serviceName}</h3>
        <div><b>Starts at:</b>{' '}{dateStart.toFormat("dd-LLL-yyyy, hh:mm")}</div>
        <div><b>Ends at:</b>{' '}{dateEnd.toFormat("dd-LLL-yyyy, hh:mm")}</div>
        <div><b>Contact email:</b>{' '}{appointment.contactEmail || "(no contact email)"}</div>
        <div style={{marginBottom: "1rem"}}><b>Notes:</b>{' '}{appointment.notes || "(no notes)"}</div>
        <Button variant="outlined" color="error" disabled={isMutating} onClick={handleClick}>Cancel</Button>
    </Box>
    )
}