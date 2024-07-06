
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylings/login.css';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import show_password_icon from '../assets/show.png';
import hide_password_icon from '../assets/hide.png';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, []);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordHasContent, setPasswordHasContent] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  useEffect(() => {
    // Check if all fields are filled
    if (userEmail && userPassword) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [userEmail, userPassword]);


  return (
    <div className='auth-container'>
      <div className="auth-header">
        <div className="text">Tee-Cart</div>
      </div>
      <div className="auth-inputs">
        <div className="auth-input">
          <img src={email_icon} alt="Email" />
          <input type="email" placeholder='Email-id' onChange={(e) => { setUserEmail(e.target.value) }} />
        </div>
        <div className="auth-input">
          <img src={password_icon} alt="Password" />
          <input type={passwordVisible ? 'text' : 'password'} placeholder='Password' onChange={(e) => { setUserPassword(e.target.value); setPasswordHasContent(e.target.value.length>0) }} />
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
        dont have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
      </div>
      <div className="auth-submit-container">
        <div className={`auth-submit ${isButtonEnabled ? '' : 'disabled'}`}  onClick={(e) => { handleUserLogin(e, userEmail, userPassword) }}>
          login
        </div>
      </div>
    </div>
  );
}

export default Login;
