import { Drawer, List, ListItem } from "@mui/material";
import NavListItem from "./navListItem";
import { Home as HomeIcon, Book as BookIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material"

type NavDrawerProps = {
    open: boolean,
    setClosed: () => void
}

export default function NavDrawer({open, setClosed}: NavDrawerProps) {
    return (
        <Drawer anchor="left" open={open} onClose={setClosed} keepMounted>
            <div style={{width: "min(80vw,400px)"}} onClick={setClosed}>
                <List>
                    <NavListItem location="/dashboard/" icon={<HomeIcon/>} text="Home"></NavListItem>
                    <NavListItem location="/dashboard/catalog" icon={<BookIcon/>} text="Catalog"></NavListItem>
                    <NavListItem location="/dashboard/appointments" icon={<CalendarIcon/>} text="Appointments"></NavListItem>
                </List>
            </div>
        </Drawer>
    )
}