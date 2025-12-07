import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const ConditionalNavbar = () => {
  const location = useLocation()
  const hideNavbarPaths = ['/login', '/signup']

  if (hideNavbarPaths.includes(location.pathname)) {
    return null
  }

  return <Navbar />
}

export default ConditionalNavbar











