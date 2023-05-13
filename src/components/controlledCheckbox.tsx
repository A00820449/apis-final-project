import { Checkbox, CheckboxProps } from "@mui/material";
import { useState } from "react";

export default function ControlledCheckBox({disabled = false, defaultChecked = false, ...props}: CheckboxProps) {
    const [value, setValue] = useState(defaultChecked)
    const changeHandler = (_: unknown, checked: boolean) => {
        setValue(checked)
    }
    return <Checkbox disabled={disabled} checked={disabled? defaultChecked : value} onChange={changeHandler} {...props} />
}