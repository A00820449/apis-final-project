import { useMutateUserData, useUser, useUserFull } from "@/lib/hooks"
import { Alert, Button, FormControlLabel, FormGroup, InputLabel, Snackbar, Switch, TextField } from "@mui/material"
import { FormEventHandler, SyntheticEvent, useRef, useState } from "react"
import ControlledCheckBox from "./controlledCheckbox"
import ControlledTextField from "./controlledTextField"

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
    const [snackInfo, setSnackInfo] = useState({isError: false, message: "", open: false})
    const formRef = useRef<HTMLFormElement>(null)
    const {mutate: mutateUser} = useUser(false)
    const {user, mutate: mutateUserFull} = useUserFull()
    const {isMutating, trigger} = useMutateUserData()

    const switchHandle = (_: SyntheticEvent<Element, Event>, v: boolean) => {
        setDisabled(!v)
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
            return setSnackInfo({open: true, message: "An error occurred", isError: true})
        }

        if (res.ok) {
            mutateUser()
            mutateUserFull()
            setSnackInfo({open: true, message: "Successful update!", isError: false})
        }
        else {
            const msg = res.message? `Error: ${res.message}` : "An error occurred"
            setSnackInfo({open: true, message: msg, isError: false})
        }
    }

    if (!user || user.id === null) {
        return <></>
    }
    return (
        <>
        <FormControlLabel control={<Switch/>} label="Edit" onChange={switchHandle}/>
        <form ref={formRef} style={{maxWidth: '800px', display: "flex", flexDirection: "column", gap: "1rem"}} onSubmit={handleSubmit}>
            <ControlledTextField required name="businessName" defaultValue={user.businessName} disabled={disabled} label="Business Name" fullWidth/>
            <ControlledTextField name="phoneNum" inputProps={{pattern:"[0-9]{10}"}} defaultValue={user.phoneNum} disabled={disabled} label="Phone Number (10 digits)" fullWidth/>
            <ControlledTextField name="address" defaultValue={user.address} disabled={disabled} label="Address" fullWidth multiline rows={4}/>
            <InputLabel disabled={disabled}>Open hour</InputLabel>
            <div>
                <ControlledTextField name="openHour" defaultValue={user.openHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/>
                <ControlledTextField name="openMinute" defaultValue={user.openMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
            </div>
            <InputLabel disabled={disabled}>Close hour</InputLabel>
            <div>
                <ControlledTextField name="closeHour" defaultValue={user.closeHour} type="number" inputProps={{min: "0", max: "23"}} sx={{width: "4rem"}} size="small" disabled={disabled}/>
                <ControlledTextField name="closeMinute" defaultValue={user.closeMinute} inputProps={{min: "0", max: "59"}} type="number" sx={{width: "4rem"}} size="small" disabled={disabled}/>
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
        <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={snackInfo.open} autoHideDuration={3000} onClose={() => setSnackInfo((s) => ({isError: s.isError, message: s.message, open: false}))}>
            <Alert sx={{width: "100%"}} severity={snackInfo.isError? "error" : "success"} onClose={() => setSnackInfo((s) => ({isError: s.isError, message: s.message, open: false}))}>
                {snackInfo.message}
            </Alert>
        </Snackbar>
        </>
    )
}