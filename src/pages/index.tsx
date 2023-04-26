import { Container } from '@mui/material'
import Link from 'next/link'

export default function Home() {
  return (
    <Container className='main'>
      <Link href={'/dashboard'}>Enter</Link>
    </Container>
  )
}