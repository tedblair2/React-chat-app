import React, { useContext, useEffect, useState } from 'react'
import Img from '../image/c.jpg'
import {  Link } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../AuthContext';

const Chats = () => {
    const [chats,setChats]=useState([])
    const {currentUser}=useContext(AuthContext)

    useEffect(()=>{
        const unsub=onSnapshot(collection(db,"Messages"),(snapshot)=>{
                const updatedChats=snapshot.docs.map(doc=>doc.data()).filter(chat=>chat.users.includes(currentUser.uid) && chat.lastSender !== "").sort((a,b)=>b.lastTime-a.lastTime)
                setChats(updatedChats)
            })
        return ()=>{
            unsub()
        }
    },[])
    useEffect(()=>{
        const fetchUserData=async()=>{
            if(chats.length===0){
                return;
            }
            const updadedChats=await Promise.all(
                chats.map(async(chat)=>{
                    const receiverId=chat.users.find(id=> id !== currentUser.uid)
                    const userDoc=await getDoc(doc(db,"Users",receiverId))
                    const userData=userDoc.data()
                    return {...chat,userData}
                })
            )
            setChats(updadedChats)
        }
        fetchUserData()
    },[chats,currentUser.uid])
  return (
    <div className='chats'>
        {chats.map((chat)=>(
            <Link to={`chats/${chat.userData && chat.userData.userid}`}>
                <div className="userchat">
                    <img src={chat.userData && chat.userData.photo} alt="" />
                    <div className="userchatinfo">
                        <span>{chat.userData && chat.userData.name}</span>
                        <p>{chat.lastSender===currentUser.uid ? `You: ${chat.lastMsg}`:chat.lastMsg}</p>
                    </div>
                </div>
            </Link>
        ))}
    </div>
  )
}

export default Chats
