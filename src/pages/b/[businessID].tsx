import { getBusinessData } from "@/lib/db";
import { Box, Button, NoSsr, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import Image from "next/image";
import { useState } from "react";
import { DateTime } from "luxon";
import AppointmentButton from "@/components/appoitmentButton";
import AppointmentForm from "@/components/appointmentForm";

type Query = {
    businessID: string
}

type Props = {
    id: string
    businessID: string,
    businessName: string,
    address: string | null,
    phone: string | null,
    logoURL: string | null,
    startHour: number,
    startMin: number,
    endHour: number,
    endMin: number,
    workDays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
    catalog: {id: string, name: string}[],
    minPeriod: number
}

export async function getServerSideProps({query}: GetServerSidePropsContext) : Promise<GetServerSidePropsResult<Props>> {
    const {businessID} = query as Query

    const businessData = await getBusinessData(businessID)
    
    if (businessData === null) {
        return {
            notFound: true
        }
    }


    return {
        props: {
            id: businessData.id,
            businessID: businessData.businessID,
            businessName: businessData.businessName,
            address: businessData.address,
            phone: businessData.phoneNum,
            logoURL: businessData.logoURL,
            startHour: businessData.openHour,
            startMin: businessData.openMinute,
            endHour: businessData.closeHour,
            endMin: businessData.closeMinute,
            workDays: [businessData.openSunday, businessData.openMonday, businessData.openTuesday, businessData.openWednesday, businessData.openThursday, businessData.openFriday, businessData.openSaturday],
            catalog: businessData.catalog.map((v) => ({id: v.id, name: v.eventName})),
            minPeriod: businessData.minutePeriod
        }
    }
}

const weekdays : readonly string[] = ["SUN", "MON", "TUE", "WED" , "THU", "FRI", "SAT"]
const months : readonly string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export default function BusinessHomePage({id, businessName, address, phone, startHour, startMin, endHour, endMin, logoURL, workDays, catalog, minPeriod}: Props) {

    const [appointmentDate, setAppointmentDate] = useState<DateTime|null>(null)
    const [weekOffset, setWeekOffset] = useState(0)
    const weekOffsetLimit = 8

    const setAppointment = (d: DateTime) => {setAppointmentDate(d)}

    if (!logoURL) {
        logoURL = "/default_pfp.jpg"
    }

    const localSunday = DateTime.now().toLocal().startOf("week").plus({days: -1}).plus({weeks: weekOffset});

    const week_ : DateTime[] = Array.from({length: 7}, (_, i) => localSunday.plus({days: i}))

    const minutePeriod = minPeriod || 10

    // we're assuming the times from the server are in Mexico City time zone
    const startLocalDT = DateTime.now().setZone("America/Mexico_City", {keepLocalTime: true}).set({hour: startHour, minute: startMin}).toLocal()
    const endLocalDT = DateTime.now().setZone("America/Mexico_City", {keepLocalTime: true}).set({hour: endHour, minute: endMin}).toLocal()

    startHour = startLocalDT.hour
    startMin = startLocalDT.minute

    endHour = endLocalDT.hour
    endMin = endLocalDT.minute

    let scheduleStartMin = 0
    let scheduleEndMin = 23 * 60 + 59

    if (endHour * 60 + endMin >= startHour * 60 + startMin) {
        scheduleStartMin = startHour * 60 + startMin
        scheduleEndMin  = endHour * 60 + endMin
    }

    const schedule : DateTime[][] = week_.map((dt)=>{
        const output : DateTime[] = []

        for (let min = scheduleStartMin; min < scheduleEndMin; min += minutePeriod) {
            output.push(dt.plus({minutes: min}))
        }

        return output
    })

    return (
        <>
        <Image alt="Company logo" src={logoURL} width={100} height={100} style={{display: "block", margin: "0 auto"}}/>
        <Typography variant="h3" align="center">{businessName}</Typography>
        <Box alignContent={"center"} textAlign={"center"}>
            <div>{address ? `Address: ${address}` : "(No address available)"}</div>
            <div>{phone && `Phone number: ${phone}`}</div>
        </Box>
        <div style={{display: "flex", justifyContent: "center", gap: "2rem"}}>
            <Button disabled={weekOffset <= 0}  onClick={() => setWeekOffset((v) => v - 1)}>{"<<"}</Button>
            <Button onClick={() => setWeekOffset(0)}>{"This week"}</Button>
            <Button disabled={weekOffset > weekOffsetLimit}  onClick={() => setWeekOffset((v) => v + 1)}>{">>"}</Button>
        </div>
        <TableContainer component={Paper}>
            <Table stickyHeader sx={{tableLayout: "fixed", minWidth: "600px"}}>
            <NoSsr>
                <TableHead>
                    <TableRow>
                        {schedule.map((d, weekday) => (
                        <TableCell key={weekday} align="center">
                            <div>{weekdays[d[0].get("weekday") % 7]}</div>
                            <div style={{fontWeight: "bold"}}>{months[d[0].get("month") - 1]}{" "}{d[0].get("day")}</div>
                        </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {schedule[0].map((_, timeslot) => (
                    <TableRow key={timeslot}>
                        {schedule.map((_, weekday)=>(
                        <TableCell key={weekday} align="center">
                            <AppointmentButton minutePeriod={minPeriod} businessID={id} appointmentTime={schedule[weekday][timeslot]} startHour={startHour} startMinute={startMin} endHour={endHour} endMinute={endMin} setApponitment={setAppointment} workdays={workDays}/>
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
            </NoSsr>
            </Table>
        </TableContainer>
        <AppointmentForm catalog={catalog} appointmentDate={appointmentDate}  clearAppointmentDate={()=>{setAppointmentDate(null)}} businessUserID={id}/>
        </>
    )
}