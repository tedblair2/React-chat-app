import React, { useContext, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth,storage,db } from '../firebase';
import { ref,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AuthContext } from '../AuthContext'
import { UserContext } from './Chat'

const Input = () => {
  const sendRef=useRef(null)
  const fileRef=useRef(null)
  const {currentUser}=useContext(AuthContext)
  const receiverId=useContext(UserContext)

  const enterClick=(e)=>{
    e.key==='Enter' && sendMessage()
  }
  const sendMessage=async()=>{
    const combinedId= currentUser.uid>receiverId ? currentUser.uid+receiverId : receiverId+currentUser.uid
    const msg=sendRef.current.value
    const imageFile=fileRef.current.files[0]

    if(msg !== ''){
      const msgRef=doc(db,"Messages",combinedId)
      const docSnap = await getDoc(msgRef);
      const existingData = docSnap.data();
      const existingMessages = existingData.messages || [];
      if(imageFile){
        try {
          const storageRef = ref(storage, `Images/${Date.now()}`);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
              console.log(error)
            }, 
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                await updateDoc(msgRef,{
                  lastMsg:msg,
                  lastTime:serverTimestamp(),
                  lastSender:currentUser.uid,
                  messages: [...existingMessages,{
                    message:msg,
                    image:downloadURL,
                    sender:currentUser.uid
                  }],
                })
                sendRef.current.value=''
                fileRef.current.value=null
                console.log('File available at', downloadURL);
              });
            }
          );
        } catch (error) {
          console.log(error);
        }
        
      }else{
        await updateDoc(msgRef,{
          lastMsg:msg,
          lastTime:serverTimestamp(),
          lastSender:currentUser.uid,
          messages: [...existingMessages,{
            message:msg,
            image:"null",
            sender:currentUser.uid
          }],
        })
        sendRef.current.value=''
      }
    }
  }
  return (
    <div className='input'>
      <input type="text" name="" id="" placeholder='Type Here...' ref={sendRef} onKeyDown={enterClick}/>
      <div className="send">
        <FontAwesomeIcon icon='fa fa-image' className='icon'/>
        <input type="file" name="" id="file" hidden ref={fileRef} accept='image/jpg,image/jpeg,image/png'/>
        <label htmlFor="file">
          <FontAwesomeIcon icon="fa-solid fa-paperclip" className='icon' />
        </label>
        <button><FontAwesomeIcon icon="fa fa-paper-plane" className='icon' onClick={sendMessage} /></button>
      </div>
    </div>
  )
}

export default Input
