import { useUser, useUserFull } from "@/lib/hooks"
import { Checkbox, FormControlLabel, FormGroup, InputLabel, Switch, TextField, Typography } from "@mui/material"
import { SyntheticEvent, useRef, useState } from "react"
import ControlledCheckBox from "./controlledCheckbox"

export default function UserInfoForm() {
    const [disabled, setDisabled] = useState(true)
    const formRef = useRef<HTMLFormElement>(null)
    const {user} = useUserFull()

    const switchHandle = (_: SyntheticEvent<Element, Event>, v: boolean) => {
        setDisabled(!v)
        if (!v) {
            formRef.current?.reset()
        }
    }

    if (!user || user.id === null) {
        return <></>
    }
    return (
        <form ref={formRef} style={{maxWidth: '800px', display: "flex", flexDirection: "column", gap: "1rem"}}>
            <FormControlLabel control={<Switch/>} label="Edit" onChange={switchHandle}/>
            <TextField defaultValue={user.businessName} disabled={disabled} label="Business Name" fullWidth/>
            <TextField defaultValue={user.phoneNum} disabled={disabled} label="Phone Number" fullWidth/>
            <TextField defaultValue={user.address} disabled={disabled} label="Address" fullWidth multiline rows={4}/>
            <InputLabel disabled={disabled}>Open hour</InputLabel>
            <div>
                <TextField id="open-hour" defaultValue={user.openHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/><TextField defaultValue={user.openMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <InputLabel disabled={disabled}>Close hour</InputLabel>
            <div>
                <TextField defaultValue={user.closeHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/><TextField defaultValue={user.closeMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <FormGroup sx={{display: "flex", alignItems: "center", justifyContent: "center" ,flexDirection: "row"}}>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openSunday}/>} label={"Sunday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openMonday}/>} label={"Monday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openTuesday}/>} label={"Tuesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openWednesday}/>} label={"Wednesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openThursday}/>} label={"Thursday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openFriday}/>} label={"Friday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox disabled={disabled} defaultChecked={user.openSaturday}/>} label={"Saturday"} disabled={disabled} labelPlacement="top"/>
            </FormGroup>
        </form>
    )
}