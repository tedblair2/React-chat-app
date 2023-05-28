import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from './Message'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../AuthContext'
import { UserContext } from './Chat'

const Messages = () => {
  const [messages,setMessages]=useState([])
  const {currentUser}=useContext(AuthContext)
  const receiverId=useContext(UserContext)
  const messagesRef=useRef(null)

  useEffect(()=>{
    const combinedId= currentUser.uid>receiverId ? currentUser.uid+receiverId : receiverId+currentUser.uid
    const unsub = onSnapshot(doc(db, "Messages", combinedId), (doc) => {
        setMessages(doc.data().messages)
        scrollToBottom()
    });

    return ()=>{
      unsub()
    }
  },[currentUser.uid,receiverId])

  const scrollToBottom=()=>{
    messagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
  return (
    <div className='messages'>
      {messages.map(msg=>(
        <Message message={msg.message} sender={msg.sender===currentUser.uid ? 'owner':''} image={msg.image}/>
      ))}
      <div ref={messagesRef} />
    </div>
  )
}

export default Messages
