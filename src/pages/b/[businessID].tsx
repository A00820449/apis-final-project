import { getBusinessData } from "@/lib/db";
import { getHourMinuteString } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, NoSsr, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useState } from "react";

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
    workDays: number[]
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
            startHour: 8,
            startMin: 0,
            endHour: 18,
            endMin: 30,
            workDays: [1, 2, 3, 4, 5]
        }
    }
}

const weekdays : readonly string[] = ["SUN", "MON", "TUE", "WED" , "THU", "FRI", "SAT"]

export default function BusinessHomePage({businessName, address, phone, startHour, startMin, endHour, endMin, logoURL, workDays}: Props) {

    const [appointmentDate, setAppointmentDate] = useState<Date|null>(null)

    if (!logoURL) {
        logoURL = "/default_pfp.jpg"
    }

    const sunday = new Date()
    sunday.setHours(0,0,0,0)
    sunday.setDate(sunday.getDate() - sunday.getDay()) // sets to sunday

    const weekSchedule : Date[][] = Array.from({length: weekdays.length}, (_,i)=>{
        const d = new Date(sunday)
        d.setDate(sunday.getDate() + i)
        d.setHours(startHour, startMin, 0, 0)
        return [d]
    })

    const minStep = 10
    weekSchedule.forEach((week, i)=> {
        for (let i = minStep; i < 24 * 60; i += minStep) {
            const d = new Date(week[0])
            d.setMinutes(d.getMinutes() + i)

            if (d.getHours() >= endHour && d.getMinutes() >= endMin) {
                break
            }

            week.push(d)
        }
    })

    console.log(weekSchedule)

    return (
        <>
        <img src={logoURL} style={{display: "block", width: "100px", margin: "0 auto"}}/>
        <Typography variant="h3" align="center">{businessName}</Typography>
        <Box alignContent={"center"} textAlign={"center"}>
            {address ? `Address: ${address}` : "(No address available)"}
            {phone && `Address: ${phone}`}
        </Box>
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {weekSchedule.map((d, i) => (
                        <TableCell key={i} align="center">
                            <div>{weekdays[i]}</div>
                            <div style={{fontWeight: "bold"}}><NoSsr>{d[0].getDate()}</NoSsr></div>
                        </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weekSchedule[0].map((_, timeslot) => (
                        <TableRow key={timeslot}>
                            {weekSchedule.map((_, weekday)=>(
                            <TableCell key={weekday} align="center">
                                <Button variant="outlined" onClick={()=>setAppointmentDate(weekSchedule[weekday][timeslot])} disabled={!workDays.includes(weekday) || weekSchedule[weekday][timeslot].getTime() <= Date.now()}>
                                    <NoSsr>{getHourMinuteString(weekSchedule[weekday][timeslot])}</NoSsr>
                                </Button>
                            </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Dialog open={appointmentDate !== null} onClose={()=>setAppointmentDate(null)} fullWidth>
            <form onSubmit={(e) => {e.preventDefault(); setAppointmentDate(null)}}>
            <DialogTitle>Make Appointment</DialogTitle>
            <DialogContent>
                Appointment date: <NoSsr>{appointmentDate && `${appointmentDate.toDateString()}, ${appointmentDate.toTimeString()}`}</NoSsr>
                <FormControl fullWidth>
                    <InputLabel id="service-select-label">Select Service</InputLabel>
                    <Select labelId="service-select-label" label="Select Service" required>
                        <MenuItem value={1}>Option 1</MenuItem>
                        <MenuItem value={2}>Option 2</MenuItem>
                        <MenuItem value={0}>Other</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); setAppointmentDate(null)}}>
                    Close
                </Button>
                <Button type="submit">
                    Make Appointment
                </Button>
            </DialogActions>
            </form>
        </Dialog>
        </>
    )
}