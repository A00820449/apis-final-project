import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import Link from 'next/link'

export default function Home() {
  const match = useMediaQuery("(max-width:600px)")
  
  return (
    <div className='main' style={{textAlign: "center"}}>
      <Box display="block" sx={{color: "white", backgroundImage: "url(/landing_page_image.jpg)", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat", backgroundSize: "cover"}}>
      <Box display="block" sx={{backdropFilter: "brightness(40%)", paddingY: "5rem", paddingX: "1rem" ,minHeight: "100vh", boxSizing: "border-box"}}>
        <Typography variant={match ? "h2" : "h1"}>Welcome!</Typography>
        <div style={{padding: "2rem 0"}}>
        <Typography fontSize={"18px"} component={"p"}>With CalendarDate, your business can easily accept and manage appointments.</Typography>
        <Typography fontSize={"18px"} component={"p"}>Forget having your clients call you and start taking appointments now. To get started, click the button below!</Typography>
        </div>
        <Button LinkComponent={Link} href={'/dashboard'} variant="contained">
          Enter App
        </Button>
        <div style={{color: "rgba(255,255,255,0.5)", marginTop: "2rem"}}>(Background image by <a style={{color: "inherit"}} href="https://www.freepik.com/free-photo/flat-lay-calendar-laptop-arrangement_20940893.htm#query=calendar&position=1&from_view=search&track=sph">Freepik</a>)</div>
      </Box>
      </Box>
    </div>
  )
}