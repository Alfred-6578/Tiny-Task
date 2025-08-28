import React from 'react'
import { Search, User, Plus, Bell } from 'lucide-react'
import Link from 'next/link'
import { FaRegUserCircle } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { GoBell } from "react-icons/go";
import { LuUser } from "react-icons/lu";
import { BiSearchAlt } from "react-icons/bi";
import { usePathname } from 'next/navigation';

const MainNav = () => {
    const pathName = usePathname()

  return (
    <div>
      <nav className="max-md:hidden fixed flex items-center justify-between w-full bg-white shadow top-0 z-80 px-8 py-7">
        <div className="">
            <h1 className="text-2xl font-bold text-primary">TinyTask</h1>
        </div>
        <div className="flex gap-2 border border-placeholder rounded-xl min-w-[400px] lg:min-w-md items-center p-2">
           <Search className='text-placeholder'/>
           <input placeholder='Search Task' type="text" className='w-full'/>
        </div>
        <div className="flex gap-6 text-placeholder items-center">
            <Link href={'/create-task'} >
                <Plus/>
            </Link>
            <Link href={'/notifications'} >
                <Bell/>
            </Link>
            <Link href={'/profile'} className='flex w-9 h-9 p-1 text-placeholder bg-bg-light items-center justify-center border rounded-full'>
                <User/>
            </Link>
        </div>
      </nav>

      <nav className="md:hidden text-placeholder text-2xl fixed flex items-center justify-between w-full bg-white shadow -bottom-0.5 z-80 p-5.5 tny:p-6.5 tny:px-8.5">
        <NavLink icon={<GoHome/>} text="Home" path='/' currentPath={pathName}/>
        <NavLink icon={<BiSearchAlt/>} text="Search" path='/search' currentPath={pathName}/>
        <NavLink icon={<Plus/>} text="Post" path='/create-task' currentPath={pathName}/>
        <NavLink icon={<GoBell/>} text="Notification" path='/notification' currentPath={pathName}/>
        <NavLink icon={<LuUser/>} text="Profile" path='/profile' currentPath={pathName}/>
      
      </nav>
    </div>
  )
}

export default MainNav

const NavLink= ({icon, path, text, currentPath}:any) =>{
    return(
        <>
            <Link href={path} className={`${path == currentPath ? 'text-text-light' : 'text-placeholder'} flex flex-col items-center justify-end text-center transition-all duration-300`}>
                {icon}
                <p className={`${path == currentPath ? '' : 'hidden'} text-[10px] capitalize transition-all duration-300`}>{text}</p>
            </Link> 
        </>
    )
}