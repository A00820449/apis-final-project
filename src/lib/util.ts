export function getHourMinuteString(d: Date) {
    const hour = d.getHours()
    const minutes = d.getMinutes()
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}