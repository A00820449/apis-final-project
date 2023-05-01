import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import Link from "next/link"
import { ReactNode } from "react"

type NavListItemProps = {
    location: string,
    text: string,
    icon: ReactNode
}

export default function NavListItem({icon, location, text}: NavListItemProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton LinkComponent={Link} href={location}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text}/>
            </ListItemButton>
        </ListItem>
    )
}