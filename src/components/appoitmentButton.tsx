import { useCheckAppointment } from "@/lib/hooks";
import { getHourMinuteString } from "@/lib/util";
import { Button } from "@mui/material";
import { DateTime } from "luxon";

type AppointmentButtonProps = {
    appointmentTime: DateTime,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
    workdays: boolean[],
    minutePeriod: number,
    businessID: string,
    setApponitment: (d: DateTime) => void
}

function greaterOrEqualThanHM(startHour: number, startMinute: number, endHour: number, endMinute: number) {
    return startHour >= endHour && startMinute >= endMinute
}

export default function AppointmentButton({setApponitment, appointmentTime, workdays, startHour, startMinute, endHour, endMinute, minutePeriod, businessID}: AppointmentButtonProps) {

    let isNonWorkTIme = false

    if (DateTime.now().toSeconds() >= appointmentTime.toSeconds()) {
        isNonWorkTIme = true
    }
    else if (!workdays[appointmentTime.get("weekday") % 7]) {
        isNonWorkTIme = true
    }
    else if (
        greaterOrEqualThanHM(startHour, startMinute, endHour, endMinute) && // cycled over, migth have to be disabled
        greaterOrEqualThanHM(appointmentTime.hour, appointmentTime.minute, endHour, endMinute) &&
        !greaterOrEqualThanHM(appointmentTime.hour, appointmentTime.minute, startHour, startMinute)
    ) {
        isNonWorkTIme = true
    }

    const {found, isLoading} = 
    useCheckAppointment({businessUserID: businessID, timeStart: appointmentTime.toMillis(), timeEnd: appointmentTime.plus({minutes: minutePeriod}).toMillis()}, isNonWorkTIme)
    //{found: false, isLoading: false}

    let disabled = isNonWorkTIme
    if (!isNonWorkTIme) {
        if (isLoading) {
            disabled = true
        }
        else if (found) {
            disabled = true
        }
    }

    return (
        <Button variant="outlined" onClick={()=>setApponitment(appointmentTime)} disabled={disabled}>
            {getHourMinuteString(appointmentTime)}
        </Button>
    )
}