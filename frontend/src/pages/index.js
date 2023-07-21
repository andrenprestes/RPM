
import React, { useState } from "react"
import { useRouter } from 'next/router';
import axios from "axios";
const url = "http://35.199.85.72:8080/api";

const api = axios.create({
  baseURL: url
})


export default function () {
  let [authMode, setAuthMode] = useState("signin");
  const router = useRouter();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPassword] = useState("");
  const [nam, setName] = useState("");

  const database = [
    {
      username: "andre@tmail.com",
      name: "Dr. André Neves",
      password: "pass1"
    },
    {
      username: "user2",
      name: "Dr. André Neves",
      password: "pass2"
    }
  ];
  
  const errors = {
    username: "invalid username",
    password: "invalid password"
  };
  
  const handleSubmitSignIn = (event) => {
    //Prevent page reload
    event.preventDefault();
  
    var { username, password } = document.forms[0];
    setUser(username.value);
    setPassword(password.value);


    api.post("/users/checkuser", {username: username.value, password: password.value})
        .then(response=>{
          if (response.data.loggedIn){
            event.preventDefault();
            router.push(router.push({pathname: '/patients', query: {...response.data.message}}));
          }else
            setErrorMessages({ name: response.data.name, message: response.data.message });
        })
  };

  const handleSubmitSignUp = (event) => {
    //Prevent page reload
    event.preventDefault();
  
    var { username, name, password } = document.forms[0];
    setUser(username.value);
    setPassword(password.value);
    setName(name)
    api.post("/users/adduser", {username: username.value, name: name, password: password.value})
        .then(response=>{
          if (response.data.loggedIn){
            event.preventDefault();
            router.push(router.push({pathname: '/patients', query: {...response.data.message}}));
          }else
            setErrorMessages({ name: response.data.name, message: response.data.message });
        })
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container" style={{
        backgroundColor: '#F5F4FF'
      }}>
        <form className="Auth-form" onSubmit={handleSubmitSignIn}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Login</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                name="username"
                className="form-control mt-1"
                placeholder="Enter email"
              />
              {isSubmitted?null:renderErrorMessage("username")}
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control mt-1"
                placeholder="Enter password"
              />
              {isSubmitted?null:renderErrorMessage("password")}
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="Auth-form-container"style={{
      backgroundColor: '#F5F4FF'
    }}>
      <form className="Auth-form"  onSubmit={handleSubmitSignUp}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              name="username"
              className="form-control mt-1"
              placeholder="Email Address"
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Password"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}