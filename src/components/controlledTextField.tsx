import { TextField, TextFieldProps } from "@mui/material";
import { useState } from "react";

export default function ControlledTextField({defaultValue, disabled, ...props}: TextFieldProps) {
    const [value, setValue] = useState(defaultValue)

    return <TextField value={disabled? defaultValue : value} disabled={disabled} onChange={(e) => setValue(e.currentTarget.value)} {...props}/>
}