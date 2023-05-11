import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DateTime } from "luxon";

type AppointmentFormProps = {
    appointmentDate: DateTime | null,
    clearAppointmentDate: () => void,
    catalog: {id: string, name: string}[]
}

export default function AppointmentForm({appointmentDate, clearAppointmentDate, catalog}:AppointmentFormProps) {
    return (
        <Dialog open={appointmentDate !== null} onClose={clearAppointmentDate} fullWidth>
            <form onSubmit={(e) => {e.preventDefault(); clearAppointmentDate()}}>
            <DialogTitle>Make Appointment</DialogTitle>
            <DialogContent>
                <div style={{marginBottom: "1rem"}}>Appointment date: {appointmentDate && appointmentDate.setLocale("us").toLocaleString(DateTime.DATETIME_FULL)}</div>
                <FormControl fullWidth>
                    <InputLabel id="service-select-label">Select Service</InputLabel>
                    <Select labelId="service-select-label" label="Select Service" required>
                        {catalog.map((v)=>(
                        <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                        ))}
                        <MenuItem value={"0"}>Other</MenuItem>
                    </Select>
                    <TextField multiline rows={4} placeholder="Additional notes..."/>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); clearAppointmentDate()}}>
                    Close
                </Button>
                <Button type="submit">
                    Make Appointment
                </Button>
            </DialogActions>
            </form>
        </Dialog>
    )
}