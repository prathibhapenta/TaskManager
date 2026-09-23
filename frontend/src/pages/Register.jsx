import React, { useState } from 'react'
import { apiRequest } from '../services/api'
import {useNavigate} from "react-router-dom"

const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    try{

      setLoading(true)
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,email,password
        })
      })
      console.log(response)
      setName("")
      setEmail("")
      setPassword("")
      navigate("/login")

    }catch(err){
      console.log(err.message)
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
       
        <div>
          <label htmlFor='name'>Enter your Name: </label>
          <input type = "text"
          id = "name"
          placeholder="Enter your Name"
          value = {name}
          onChange = {(e) => setName(e.target.value)}/>
        </div>
        <br/>

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
        
        <button type = "submit">{loading ? "Registering..." : "Register"}</button>

      </form>
    </div>
  )
}

export default Register
