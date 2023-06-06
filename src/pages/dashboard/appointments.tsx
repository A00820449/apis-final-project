import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session"
import { NextPageWithLayout } from "../_app"
import { getDashboardLayout } from "@/components/dashboardLayout"

export const getServerSideProps = getServerSidePropsUserSession

const Appointments : NextPageWithLayout<UserSessionProps> = () => {
    return (
        <></>
    )
}

Appointments.getLayout = getDashboardLayout

export default Appointments