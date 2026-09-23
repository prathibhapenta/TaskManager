import React, { useState } from 'react'
import { apiRequest } from '../services/api'
import {useNavigate} from "react-router-dom"
import { useAuth } from '../context/AuthContext'

const Login = () => {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {login} = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{

      setLoading(true)
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,password
        })
      })
      console.log(response)

     if (response.success) { 
      login(response.token);
       setEmail("");
        setPassword(""); 
        navigate("/dashboard"); 
      }
     

    }catch(err){
      console.log(err.message)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
       
       
        <div>
          <label htmlFor='email'>Enter your email: </label>
          <input type = "email"
          id = "email"
          placeholder="Enter your email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}/>
        </div>
        <br/>

         <div>
          <label htmlFor='password'>Enter your Password: </label>
          <input type = "password"
          id = "password"
          placeholder="Enter your password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}/>
        </div>
        <br/>
        
        <button type = "submit">{loading ? "Logging..." : "Login"}</button>

      </form>
    </div>
  )
}

export default Login
