import {  Dialog, Menu, Popper } from "@mui/material"

type ConfirmDialogProps = {
    anchorEl: Element | null
}

export default function ConfirmDialog({anchorEl}: ConfirmDialogProps) {
    return (
        <Popper anchorEl={anchorEl} open={anchorEl !== null}>
            <Dialog open disableEnforceFocus>

            </Dialog>
        </Popper>
    )
}