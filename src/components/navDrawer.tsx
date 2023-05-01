import { Drawer, List, ListItem } from "@mui/material";
import NavListItem from "./navListItem";
import { Home as HomeIcon } from "@mui/icons-material"

type NavDrawerProps = {
    open: boolean,
    setClosed: () => void
}

export default function NavDrawer({open, setClosed}: NavDrawerProps) {
    return (
        <Drawer anchor="left" open={open} onClose={setClosed} keepMounted>
            <div style={{width: "min(80vw,400px)"}} onClick={setClosed}>
                <List>
                    <ListItem >
                        <NavListItem location="/dashboard" icon={<HomeIcon/>} text="Home"></NavListItem>
                    </ListItem>
                </List>
            </div>
        </Drawer>
    )
}