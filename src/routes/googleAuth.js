'use strict'

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

router.post('/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const payload = await verify(token);
    // Check if the user exists in your database
    // If not, create a new user
    const userId = payload.sub; // Google user ID

    // Create a JWT token
    const jwtToken = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token: jwtToken, user: payload });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}


module.exports = router;

///////////////////////////////////////////////////
// sample react app code to test glogin
///////////////////////////////////////////////////

// import React from 'react';
// import { GoogleLogin } from 'react-google-login';

// const GoogleSignIn = () => {
//   const responseGoogle = async (response) => {
//     const token = response.tokenId;
//     try {
//       const res = await fetch('http://localhost:5000/api/auth/google', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         console.log('User data:', data.user);
//         // Handle successful authentication (e.g., save user data in state)
//       } else {
//         console.error('Error:', data.error);
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//     }
//   };

//   const onFailure = (error) => {
//     console.error('Login failed:', error);
//   };

//   return (
//     <div>
//       <h1>Google Sign-In</h1>
//       <GoogleLogin
//         clientId="YOUR_CLIENT_ID" // Use your actual Client ID
//         buttonText="Login with Google"
//         onSuccess={responseGoogle}
//         onFailure={onFailure}
//         cookiePolicy={'single_host_origin'}
//       />
//     </div>
//   );
// };

// export default GoogleSignIn;
