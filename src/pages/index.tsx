import { Container } from '@mui/material'
import Link from 'next/link'

const Home = () => {
  return (
    <Container className='main'>
      <Link href={'/dashboard'}>Enter</Link>
    </Container>
  )
}

export default Home