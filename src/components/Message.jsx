import React, { useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../AuthContext'
import { UserContext } from './Chat'

const Message = ({message,sender,image}) => {
  const {currentUser}=useContext(AuthContext)
  const receiverId=useContext(UserContext)
  const [receiver,setReceiver]=useState({})

  useEffect(()=>{
    const getUserData=async()=>{
      const userDoc=await getDoc(doc(db,"Users",receiverId))
      const userData=userDoc.data()
      setReceiver(userData)
    }
    getUserData()
  },[receiver])
  return (
    <div className={`message ${sender}`}>
      <div className="msginfo">
        <img src={sender==='owner'? currentUser.photoURL : receiver.photo} alt="" />
        <span>Just now</span>
      </div>
      <div className="msgcontent">
        <p>{message}</p>
        {image !== 'null' && <img src={image} alt="" />}
      </div>
    </div>
  )
}

export default Message
