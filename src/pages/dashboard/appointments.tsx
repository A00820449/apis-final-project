import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session"
import { NextPageWithLayout } from "../_app"
import { getDashboardLayout } from "@/components/dashboardLayout"
import { Box, Container, Typography } from "@mui/material"
import { useAppointments } from "@/lib/hooks"
import AppointmentListItem from "@/components/appointmentListItem"

export const getServerSideProps = getServerSidePropsUserSession

const Appointments : NextPageWithLayout<UserSessionProps> = () => {
    const { appointments } = useAppointments()

    const appos = appointments? appointments.appointments || [] : []

    return (
    <Container>
        <Typography variant="h4" marginY={"1rem"}>Appointments</Typography>
        <Box sx={{display: "flex", flexFlow: "column", gap: "1rem"}}>
            {
            appos.length?
            appos.map((v) => (
                <AppointmentListItem appointment={v} key={v.id}/>
            )) :
            "No upcoming appointments."
            }
        </Box>
    </Container>
)
}

Appointments.getLayout = getDashboardLayout

export default Appointments