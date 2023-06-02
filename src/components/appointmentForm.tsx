import { useCreateAppointment } from "@/lib/hooks";
import { CreateAppointmentInput, CreateAppointmentResponse } from "@/pages/api/createAppointment";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DateTime } from "luxon";
import { FormEventHandler, useState } from "react";

type AppointmentFormProps = {
    appointmentDate: DateTime | null,
    clearAppointmentDate: () => void,
    catalog: {id: string, name: string}[],
    businessUserID: string
}

export default function AppointmentForm({appointmentDate, clearAppointmentDate, catalog, businessUserID}:AppointmentFormProps) {
    const [disabled, setDisabled] = useState(false)
    const {trigger} = useCreateAppointment()

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (disabled) {return}

        setDisabled(true)

        const formData = new FormData(e.currentTarget)

        const serviceID = formData.get("serviceID")?.toString() || "other"
        const notes = formData.get("notes")?.toString()?.trim() || undefined
        const timeStart = appointmentDate !== null ? appointmentDate.toMillis() : DateTime.now().toMillis()

        e.currentTarget.reset()

        try {
            const res = await trigger({businessUserID, serviceID, notes, timeStart})
        }
        catch(e) {
        }
    }

    return (
        <Dialog open={appointmentDate !== null} onClose={clearAppointmentDate} fullWidth>
            <form onSubmit={handleSubmit}>
            <DialogTitle>Make Appointment</DialogTitle>
            <DialogContent>
                <div style={{marginBottom: "1rem"}}>Appointment date: {appointmentDate && appointmentDate.setLocale("us").toLocaleString(DateTime.DATETIME_FULL)}</div>
                <FormControl fullWidth>
                    <InputLabel id="service-select-label">Select Service</InputLabel>
                    <Select labelId="service-select-label" label="Select Service" name="serviceID" required>
                        {catalog.map((v)=>(
                        <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                        ))}
                        <MenuItem value={"other"}>Other</MenuItem>
                    </Select>
                    <TextField multiline rows={4} placeholder="Additional notes..." name="notes"/>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); clearAppointmentDate()}}>
                    Close
                </Button>
                <Button type="submit" disabled={disabled}>
                    Make Appointment
                </Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}