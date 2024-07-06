import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faBars, faTimes, faSearch,faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../stylings/navbar.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { COLLECTION_CATEGORIES, DATABASEID, database } from '../Config/appwriteConfig';

const Navbar = () => {
    const {user,handleUserLogout} = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName,setUserName] = useState('sign in');
    const data = null;
    useEffect(()=>{
      if(user){
        // console.log('user is :',user.name)
        setUserName(user.name)
      }
      else{
        setUserName('sign in')
      }
    });
    
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  return (
    <>
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo">Tee-Cart</div>
      </div>
      <div className="navbar-menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
      </div>
      <div className="navbar-links">
      <div className={`navbar-items ${isMenuOpen ? 'open' : ''}`}>
        <a  className="navbar-link" onClick={(e)=>{e.preventDefault();navigate('/')}}>Home</a>
        <a href="#about" className="navbar-link">About</a>
        <a className="navbar-link">hi,{userName}</a> 
      </div>
      
      <div className={`navbar-items ${isMenuOpen ? 'open' : ''}`}>
        <div className="navbar-icons">
          <FontAwesomeIcon icon={faSearch} className='navbar-icon' onClick={(e)=>{e.preventDefault();navigate('/search',{state:data})}}/>
          <FontAwesomeIcon icon={faShoppingCart} className="navbar-icon" onClick={(e)=>{e.preventDefault();navigate('/cart')}}/>
          <FontAwesomeIcon icon={faUser} className="navbar-icon" onClick={(e)=>{e.preventDefault();navigate('/profile')}} />
          {user&&<FontAwesomeIcon icon={faSignOutAlt} className='navbar-icon' onClick={(e)=>{e.preventDefault();handleUserLogout()}}/>}
          {!user && <FontAwesomeIcon icon={faSignInAlt} className='navbar-icon' onClick={(e)=>{e.preventDefault();navigate('/login')}}/>}
        </div>
      </div>
      </div>
      
    </nav>
    <hr />
    </>
    
  )
}

export default Navbar