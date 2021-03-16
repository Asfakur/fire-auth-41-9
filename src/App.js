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

  const handleChange = (event)  =>{
    console.log(event.target.name, event.target.value);
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
     <form onSubmit={handleSubmit}>
      <input type="text" name="email" onBlur={handleChange} placeholder="Enter Your place holder" required/>
      <br/>
      <input type="password" name="password" onChange={handleChange} id="" required/>
      <br/>
      <input type="submit" value="Submit"/>
     </form>
    </div>
  );
}

export default App;
