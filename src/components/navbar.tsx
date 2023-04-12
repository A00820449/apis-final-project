import {AppBar, Toolbar, Box, Typography} from "@mui/material"
import Link from "next/link"

const NavBar = () => {
    return (
    <Box flexGrow={1}>
        <AppBar position='sticky'>
            <Toolbar>
                <Typography variant="h6" sx={{textAlign: "center"}} flexGrow={1}>
                    <Link href={'/'} style={{color: "inherit", textDecoration: "inherit"}}>App</Link>
                </Typography>
            </Toolbar>
        </AppBar>
    </Box>
    )
}

export default NavBar