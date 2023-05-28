import React, { useContext, useState } from 'react'
import Add from '../image/add.png'
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { auth,storage,db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { ref,uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const Register = () => {
  const {currentUser}=useContext(AuthContext)
  const [error,setError]=useState("")
  console.log(currentUser)
  const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const storageRef = ref(storage, `Profiles/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file); // pass file object here

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log(error)
          setError("Something went wrong!")
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateProfile(user, {
              displayName: name,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "Users", user.uid), {
              userid: user.uid,
              name: name,
              email: email,
              photo: downloadURL,
            });
            navigate("/")
            console.log('File available at', downloadURL);
          });
        }
      );
    } catch (err) {
      console.log(err);
      setError("Something went wrong!")
    }
  };
  

  return (
    <div className='container'>
        <div className='formwrapper'>
            <span className="logo">Chat App</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <input type="text" name="" id="" placeholder='name' />
                <input type="email" name="" id="" placeholder='email' />
                <input type="password" name="" id="" placeholder='password' />
                <input type="file" name="file" id="file" accept='image/jpg,image/jpeg,image/png' hidden/>
                <label htmlFor="file">
                    <img src={Add} alt="" />
                    <span>Select Profile Pic</span>
                </label>
                <button type="submit">Sign Up</button>
                {error && <span>Something went wrong!</span>}
            </form>
            <p>Have an account? <Link to="/login">Login</Link></p>
        </div>
      
    </div>
  )
}

export default Register
