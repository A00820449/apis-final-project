import {AppBar, Toolbar, Box, Typography, IconButton, Menu, MenuItem} from "@mui/material"
import Link from "next/link"
import NavDrawer from "./navDrawer"
import { useState } from "react"
import { Menu as MenuIcon, AccountCircle as AccountCircleIcon } from "@mui/icons-material"

export default function NavBar() {
    const [open, setOpen] = useState(false)
    const [anchor, setAnchor] = useState<HTMLButtonElement|null>(null)
    const setClosed = () => setOpen(false)
    return (
    <>
    <AppBar position='sticky'>
        <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={()=>setOpen(true)}>
                <MenuIcon/>
            </IconButton>
            <Typography variant="h6" sx={{textAlign: "center"}} flexGrow={1}>
                <Link href={'/'} style={{color: "inherit", textDecoration: "inherit"}}>App</Link>
            </Typography>
            <IconButton size="large" onClick={(e)=> setAnchor(e.currentTarget)} color="inherit">
                <AccountCircleIcon />
            </IconButton>
            <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
                <Link href="/api/redirectLogout" style={{color: "inherit", textDecoration: "inherit"}}>
                <MenuItem>
                    Log out
                </MenuItem>
                </Link>
            </Menu>
        </Toolbar>
    </AppBar>
    <NavDrawer open={open} setClosed={setClosed}></NavDrawer>
    </>
    )
}