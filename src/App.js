import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.cofig';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSigned: false,
    name: '',
    email: '',
    password: '',
    photo: ''
    // newUser: false
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        // console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          photo: '',
          email: '',
          error: '',
          success: false
        }
        setUser(signedOutUser);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleBlur = (event) => {
    let isFieldValid = true;

    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user }
      newUserInfo[event.target.name] = event.target.value;

      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          // Signed in 
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
          // var user = userCredential.user;
          // console.log(user);
          // ...
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // var errorCode = error.code;
          // var errorMessage = error.message;
          // ..
        });
    }

    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log('sign in user info', userCredential.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });

    }

    event.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;
    
    user.updateProfile({
      displayName : name
    }).then(function() {
      console.log('user name update successfully');
    }).catch(function(error) {
      console.log(error);
    });
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
          <img src={user.photo} alt="" />
        </div>
      }
      <h1>Our own Authentication</h1>

      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your name" />}
        <br />
        <input type="text" name="email" onBlur={handleBlur} placeholder="Enter Your place holder" required />
        <br />
        <input type="password" name="password" onBlur={handleBlur} id="" required />
        <br />
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      { user.success && <p style={{ color: 'green' }}>User { newUser ? 'created' : 'Logged In'} successfully</p>}
    </div>
  );
}

export default App;
