import { Button, Container, Typography, useMediaQuery } from '@mui/material'
import Link from 'next/link'

export default function Home() {
  const match = useMediaQuery("(max-width:600px)")
  return (
    <Container className='main' sx={{textAlign: "center"}}>
      <Typography variant='h1' sx={match ? {fontSize: "50px"} : {}}>Welcome!</Typography>
      <Button LinkComponent={Link} href={'/dashboard'} variant="contained">
        Enter App
      </Button>
    </Container>
  )
}