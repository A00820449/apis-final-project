import { Button, Container, Typography } from '@mui/material'
import Link from 'next/link'

export default function Home() {
  return (
    <Container className='main' sx={{textAlign: "center"}}>
      <Typography variant='h1'>Welcome!</Typography>
      <Button LinkComponent={Link} href={'/dashboard'} variant="contained">
        Enter App
      </Button>
    </Container>
  )
}