import { IconButton, InputAdornment, NoSsr, Snackbar, TextField } from "@mui/material"
import { ContentCopy as CopyIcon } from "@mui/icons-material"
import { useState } from "react"

type Props = {
    text: string
}

const CopyToClipboard = ({text}:Props) => {
    const [showMessage, setShowMessage] = useState(false)

    const handleClick = () => {
        navigator.clipboard.writeText(text)
        setShowMessage(true)
    }

    const button = (
    <InputAdornment position="end">
        <IconButton onClick={handleClick}>
            <CopyIcon/>
        </IconButton>
    </InputAdornment>
    )
    return (
    <>
    <TextField sx={{width: "300px"}} InputProps={{endAdornment: button}} value={text} disabled>
        <NoSsr>{text}</NoSsr>
    </TextField>
    <Snackbar open={showMessage} autoHideDuration={2000} onClose={() => setShowMessage(false)} message="Copied to clipboard!"/>
    </>
    )
}

export default CopyToClipboard