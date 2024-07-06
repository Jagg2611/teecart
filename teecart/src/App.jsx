import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoutes';
import { AuthProvider } from './utils/AuthContext';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/Signup';
import Verify from './components/verify';
import Profile from './components/profile';
import Applayout from './components/applayout';
import Loader from './components/loader';
import Search from './components/search';
import Product from './components/product';
import Cart from './components/cart';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Applayout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/search' element={<Search/>} />
            <Route path='/product' element={<Product/>} />
            <Route element={<PrivateRoutes />}>
              <Route path='/profile' element={<Profile />} />
              <Route path='/cart' element={<Cart/>} />
            </Route>
          </Routes>
        </Applayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
