import Link from 'next/link'

const DropNav = ({homeNavActive, setHomeNaveActive}) => {


  if (!homeNavActive) return ''
  
  return (
  <div className="w-full fixed top-[81px] left-0 flex flex-col z-[9999] animate-height h-0 overflow-hidden">
    <Link href="/login"><a onClick={() => setHomeNaveActive(false)} className="text-white font-medium bg-neutral-800 p-3 text-center hover:text-fuchsia-600 transition-all duration-300">Login</a></Link>
    <Link href="/signup"><a onClick={() => setHomeNaveActive(false)} className="text-white font-medium bg-neutral-800 p-3 text-center hover:text-fuchsia-500 transition-all duration-300">Sign Up</a></Link>
    <Link href="/contact"><a onClick={() => setHomeNaveActive(false)} className="text-white font-medium bg-neutral-800 p-3 text-center hover:text-fuchsia-500 transition-all duration-300">Contact</a></Link>
  </div>
  )
}

export default DropNav