import { Button } from "@mui/material";
import { DateTime } from "luxon";

type AppointmentButtonProps = {
    appTime: DateTime,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
}

export default function AppointmentButton({}: AppointmentButtonProps) {
    return (
        <Button></Button>
    )
}