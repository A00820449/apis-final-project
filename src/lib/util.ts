import { DateTime } from "luxon"

export function getHourMinuteString(d: DateTime) {
    const hour = d.hour
    const minutes = d.minute
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}