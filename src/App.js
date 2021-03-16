import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.cofig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser] = useState({
    isSigned: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      // console.log(displayName, email, photoURL);
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        photo: '',
        email: ''
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch(err =>{
      console.log(err);
    })
  }

  const handleBlur = (event)  =>{
    let isFromValid = true;

    if(event.target.name === 'email'){
      isFromValid = /\S+@\S+\.\S+/.test(event.target.value);  
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFromValid = isPasswordValid && passwordHasNumber;
    }
    if(isFromValid){
      const newUserInfo = {...user}
      newUserInfo[event.target.name] = event.target.value;
      
      setUser(newUserInfo);
    }
  }

  const handleSubmit = () => {
    console.log("submit Clicked");
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
      <button onClick={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
        <div> 
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
     <h1>Our own Authentication</h1>
     <p>Name: {user.name}</p>
     <p>Email: {user.email}</p>
     <p>Password: {user.password}</p>
     <form onSubmit={handleSubmit}>
       <input type="text" name="name" onBlur={handleBlur} placeholder="Your name"/>
       <br/>
      <input type="text" name="email" onBlur={handleBlur} placeholder="Enter Your place holder" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} id="" required/>
      <br/>
      <input type="submit" value="Submit"/>
     </form>
    </div>
  );
}

export default App;
