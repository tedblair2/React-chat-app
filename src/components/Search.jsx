import React, { useContext, useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthContext } from '../AuthContext'
import { Link } from 'react-router-dom'

const Search = () => {
  const [users,setUsers]=useState([])
  const [filteredUserslist,setFilteredUsers]=useState([])
  const [noUser,setnoUser]=useState(false)
  const {currentUser}=useContext(AuthContext)
  const searchInputRef=useRef(null)
  const search=(e)=>{
    const searchValue = e.target.value;
    if(searchValue !== ''){
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) && user.userid != currentUser.uid
      );
      setFilteredUsers(filteredUsers)
      if(filteredUsers.length ===0){
        setnoUser(true)
      }else{
        setnoUser(false)
      }
    }else{
      setFilteredUsers([])
    }
  }
  const handleSelect=async(receiverId)=>{
    const combinedId= currentUser.uid>receiverId ? currentUser.uid+receiverId : receiverId+currentUser.uid

    const docRef = doc(db, "Messages", combinedId);
    const docSnap = await getDoc(docRef);
    const users=[]
    users.push(currentUser.uid,receiverId)

    if (docSnap.exists()) {
        console.log("Exists");
    } else {
        // Document does not exist, create new document
        const newDocData = {
            lastMsg:"No message available",
            lastTime:serverTimestamp(),
            lastSender:"",
            messages: [],
            users
        };
        await setDoc(docRef, newDocData);
        console.log("New document created.");
    }
    if(searchInputRef.current){
      searchInputRef.current.value=''
      setFilteredUsers([])
    }
  }
  useEffect(()=>{
    const fetchUsers=async()=>{
      const querySnapshot=await getDocs(collection(db,"Users"))
      const userData=querySnapshot.docs.map((doc)=>{
        return {id:doc.id,...doc.data()}
      })
      setUsers(userData)
    }
    fetchUsers()
  },[])
  useEffect(()=>{
    console.log(users)
  },[users])
  return (
    <div className='search'>
        <div className="searchform">
            <input type="text" name="" id=""  placeholder='Search User...' onChange={search} ref={searchInputRef}/>
            {noUser && <span className='none'>No such User found</span> }
        </div>
        {filteredUserslist.map(user=>(
          <Link to={`chats/${user.id}`}>
            <div className="userchat" key={user.id} onClick={()=>handleSelect(user.id)}>
              <img src={user.photo} alt="" />
              <div className="userchatinfo">
                  <span>{user.name}</span>
              </div>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default Search