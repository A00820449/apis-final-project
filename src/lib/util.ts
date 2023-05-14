import { DateTime } from "luxon"

export function getHourMinuteString(d: DateTime) {
    const hour = d.hour
    const minutes = d.minute
    return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

export function getJSONfromQuery(query: Partial<{[key: string]: string | string[]}>) {
    let json : string
    if (typeof query.json === "string") (
        json = query.json
    )
    else if (query.json instanceof Array) {
        json = query.json.join("")
    }
    else {
        json = ""
    }

    try {
        const parsed : unknown = JSON.parse(json)
        return parsed
    }
    catch (e) {
        return undefined
    }
}