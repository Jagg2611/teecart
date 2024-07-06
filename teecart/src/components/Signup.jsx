import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylings/Signup.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import show_password_icon from '../assets/show.png';
import hide_password_icon from '../assets/hide.png';
import { COLLECTION_PROFILES, DATABASEID, account, database } from '../Config/appwriteConfig'; 

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordHasContent, setPasswordHasContent] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  useEffect(() => {
    // Check if all fields are filled
    if (username && password && email) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [username,password,email]);

  const handlesubmit = async () => {
    try {
      const user = await account.create('unique()', email, password, username);
      console.log('User created successfully:', user);
      const promise0 = await database.createDocument(DATABASEID,COLLECTION_PROFILES,user.$id,{'username':username,'email':email});
      console.log('profile created',promise0);
      const promise1 = await account.createEmailPasswordSession(email, password).then(
        function(response){
          console.log('success1:',response)
        }
      )
      const promise2 = await account.createVerification('http://localhost:5173/verify').then(
        function(response){
          console.log('success2:',response)
        }
      )
      alert("Verification email has been sent! please verify");
      
      
    } catch (error) {
      console.error('Error creating user:', error.message);
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className='auth-container'>
      <div className="auth-header">
        <div className="text">Tee-Cart</div>
        <div className="underline"></div>
      </div>
      <div className="auth-inputs">
        <div className="auth-input">
          <img src={user_icon} alt="User" />
          <input type="text" placeholder='Name' onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="auth-input">
          <img src={email_icon} alt="Email" />
          <input type="email" placeholder='Email-id' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="auth-input">
          <img src={password_icon} alt="Password" />
          <input type={passwordVisible ? 'text' : 'password'} placeholder='Password' onChange={(e) => {setPassword(e.target.value); setPasswordHasContent(e.target.value.length>0)} } />
          <div className="password-toggle">
          {passwordHasContent && (
            <img
              src={passwordVisible ? hide_password_icon : show_password_icon}
              alt={passwordVisible ? 'Hide password' : 'Show password'}
              onClick={togglePasswordVisibility}
            />
          )}
          </div>
        </div>
      </div>
      <div className="not-User">
        already have an account? <span onClick={() => navigate('/login')}>Login</span>
      </div>
      <div className="auth-submit-container">
        <div className={`auth-submit ${isButtonEnabled ? '' : 'disabled'}`} onClick={handlesubmit}>Sign Up</div>
      </div>
    </div>
  );
}

export default Signup;
