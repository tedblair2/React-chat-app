import React, { useState } from 'react'
import Add from '../image/add.png'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {
  const navigate=useNavigate()
  const [error,setError]=useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      console.log(err);
      setError("Something went wrong!")
    }
  };
  return (
    <div className='container'>
        <div className='formwrapper'>
            <span className="logo">Chat App</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
                <input type="email" name="" id="" placeholder='email' />
                <input type="password" name="" id="" placeholder='password' />
                <button type="submit">Sign In</button>
                {error && <span>{error}</span>}
            </form>
            <p>Don,t have an account? <Link to="/register">Register</Link></p>
        </div>
      
    </div>
  )
}

export default Login
