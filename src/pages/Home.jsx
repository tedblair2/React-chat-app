import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'
import Default from '../components/Default'
import ErrorPage from '../components/ErrorPage'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='home'>
        <div className="homecontainer">
            <Sidebar/>
            <Outlet/>
            {/* <Chat/> */}
            {/* <Default/> */}
        </div>
    </div>
  )
}

export default Home
