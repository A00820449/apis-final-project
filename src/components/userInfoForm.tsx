import { useUser, useUserFull } from "@/lib/hooks"
import { Checkbox, FormControlLabel, FormGroup, Switch, TextField, Typography } from "@mui/material"
import { useRef, useState } from "react"

export default function UserInfoForm() {
    const [disabled, setDisabled] = useState(true)
    const formRef = useRef<HTMLFormElement>(null)
    const {user} = useUserFull()
    if (!user || user.id === null) {
        return <></>
    }
    return (
        <form ref={formRef} style={{maxWidth: '800px', display: "flex", flexDirection: "column", gap: "1rem"}}>
            <FormControlLabel control={<Switch/>} label="Edit" onChange={(_, v) => {setDisabled(!v); !v && formRef.current?.reset()}}/>
            <TextField defaultValue={user.businessName} disabled={disabled} label="Business Name" fullWidth/>
            <TextField defaultValue={user.phoneNum} disabled={disabled} label="Phone Number" fullWidth/>
            <TextField defaultValue={user.address} disabled={disabled} label="Address" fullWidth multiline rows={4}/>
            <Typography>Open hour</Typography>
            <div>
                <TextField defaultValue={user.openHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/><TextField defaultValue={user.openMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <Typography>Open hour</Typography>
            <div>
                <TextField defaultValue={user.closeHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/><TextField defaultValue={user.closeMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <FormGroup row>
                <FormControlLabel control={<Checkbox defaultChecked={user.openSunday}/>} label={"Sunday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openMonday}/>} label={"Monday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openTuesday}/>} label={"Tuesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openWednesday}/>} label={"Wednesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openThursday}/>} label={"Thursday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openFriday}/>} label={"Friday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel control={<Checkbox defaultChecked={user.openSaturday}/>} label={"Saturday"} disabled={disabled} labelPlacement="top"/>
            </FormGroup>
        </form>
    )
}