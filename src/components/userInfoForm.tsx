import { useMutateUserData, useUserFull } from "@/lib/hooks"
import { Button, FormControlLabel, FormGroup, InputLabel, Switch, TextField } from "@mui/material"
import { FormEventHandler, SyntheticEvent, useRef, useState } from "react"
import ControlledCheckBox from "./controlledCheckbox"
import { UpdateUserInput, UpdateUserResponse } from "@/pages/api/updateUser"

async function fetchUserUpdate(input: UpdateUserInput) : Promise<UpdateUserResponse> {
    return await fetch("/api/updateUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input)
    }).then(r => r.json())
}

function parseEmptyString(s: string|undefined) {
    if (s === undefined) {
        return undefined
    }
    if (s === "") {
        return null
    }
    return s
}

function parseBoolean(s: string|undefined) {
    if (s === undefined) {
        return false
    }
    if (s === "") {
        return false
    }
    return true
}

function parseHour(s: string|undefined) {
    if (s === undefined) {
        return undefined
    }
    const num = parseInt(s)
    if (isNaN(num)) {
        return undefined
    }

    return Math.min(23, Math.max(num, 0))
}

function parseMinute(s: string|undefined) {
    if (s === undefined) {
        return undefined
    }
    const num = parseInt(s)
    if (isNaN(num)) {
        return undefined
    }

    return Math.min(59, Math.max(num, 0))
}


export default function UserInfoForm() {
    const [disabled, setDisabled] = useState(true)
    const formRef = useRef<HTMLFormElement>(null)
    const {user, mutate} = useUserFull()
    const {isMutating, trigger} = useMutateUserData()

    const switchHandle = (_: SyntheticEvent<Element, Event>, v: boolean) => {
        setDisabled(!v)
        if (!v) {
            formRef.current?.reset()
        }
    }

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (disabled) {return}
        if (isMutating) {return}

        const formData = new FormData(formRef.current||undefined)

        const businessName = (formData.get("businessName")?.toString().trim()) || undefined
        const phoneNum = parseEmptyString(formData.get("phoneNum")?.toString().trim())
        const address = parseEmptyString(formData.get("address")?.toString().trim())
        
        const openHour = parseHour(formData.get("openHour")?.toString().trim())
        const openMinute = parseMinute(formData.get("openMinute")?.toString().trim())
        const closeHour = parseHour(formData.get("closeHour")?.toString().trim())
        const closeMinute = parseMinute(formData.get("closeMinute")?.toString().trim())

        const openSunday = parseBoolean(formData.get("openSunday")?.toString().trim())
        const openMonday = parseBoolean(formData.get("openMonday")?.toString().trim())
        const openTuesday = parseBoolean(formData.get("openTuesday")?.toString().trim())
        const openWednesday = parseBoolean(formData.get("openWednesday")?.toString().trim())
        const openThursday = parseBoolean(formData.get("openThursday")?.toString().trim())
        const openFriday = parseBoolean(formData.get("openFriday")?.toString().trim())
        const openSaturday = parseBoolean(formData.get("openSaturday")?.toString().trim())

        const data = ({businessName, phoneNum, address, openHour, openMinute, closeHour, closeMinute, openSunday, openMonday, openTuesday, openWednesday, openThursday, openFriday, openSaturday})
        console.log(data)

        const res = await trigger(data)
        if (!res) {
            return alert("an error occurred")
        }

        if (res.ok) {
            mutate()
            alert("Change done!")
        }
        else {
            alert(res.message)
        }
    }

    if (!user || user.id === null) {
        return <></>
    }
    return (
        <form ref={formRef} style={{maxWidth: '800px', display: "flex", flexDirection: "column", gap: "1rem"}} onSubmit={handleSubmit}>
            <FormControlLabel control={<Switch/>} label="Edit" onChange={switchHandle}/>
            <TextField name="businessName" defaultValue={user.businessName} disabled={disabled} label="Business Name" fullWidth/>
            <TextField name="phoneNum" inputProps={{pattern:"[0-9]{10}"}} defaultValue={user.phoneNum} disabled={disabled} label="Phone Number (10 digits)" fullWidth/>
            <TextField name="address" defaultValue={user.address} disabled={disabled} label="Address" fullWidth multiline rows={4}/>
            <InputLabel disabled={disabled}>Open hour</InputLabel>
            <div>
                <TextField name="openHour" defaultValue={user.openHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/>
                <TextField name="openMinute" defaultValue={user.openMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <InputLabel disabled={disabled}>Close hour</InputLabel>
            <div>
                <TextField name="closeHour" defaultValue={user.closeHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/>
                <TextField name="closeMinute" defaultValue={user.closeMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <FormGroup sx={{display: "flex", alignItems: "center", justifyContent: "center" ,flexDirection: "row"}}>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openSunday" disabled={disabled} defaultChecked={user.openSunday}/>} label={"Sunday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openMonday" disabled={disabled} defaultChecked={user.openMonday}/>} label={"Monday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openTuesday" disabled={disabled} defaultChecked={user.openTuesday}/>} label={"Tuesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openWednesday" disabled={disabled} defaultChecked={user.openWednesday}/>} label={"Wednesday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openThursday" disabled={disabled} defaultChecked={user.openThursday}/>} label={"Thursday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openFriday" disabled={disabled} defaultChecked={user.openFriday}/>} label={"Friday"} disabled={disabled} labelPlacement="top"/>
                <FormControlLabel sx={{width: "80px"}} control={<ControlledCheckBox name="openSaturday" disabled={disabled || isMutating} defaultChecked={user.openSaturday}/>} label={"Saturday"} disabled={disabled} labelPlacement="top"/>
            </FormGroup>
            <Button disabled={disabled} variant="contained" type="submit">Update</Button>
        </form>
    )
}