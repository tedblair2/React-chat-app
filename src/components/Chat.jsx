import React from 'react'
import Camera from '../image/videoimg.jpeg'
import Add from '../image/add_person.png'
import More from '../image/more.png'
import Messages from './Messages'
import Input from './Input'
import { getMessages } from '../chatmsgs'
import { useLoaderData } from 'react-router-dom'

export const UserContext=React.createContext()
export async function loader({params}){
  const user=await getMessages(params.userId)
  if(!user){
    throw new Response("",{
      status:404,
      statusText:"User not found"
    })
  }
  return {user}
}
const Chat = () => {
  const {user}=useLoaderData()
  return (
    <div className='chat'>
      <div className="chatinfo">
        <span>{user.name}</span>
        <div className="chaticons">
          <img src={Camera} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <UserContext.Provider value={user.userid}>
        <Messages/>
        <Input/>
      </UserContext.Provider>
    </div>
  )
}

export default Chat
