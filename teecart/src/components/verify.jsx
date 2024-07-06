import { Account } from 'appwrite';
import React, { useEffect } from 'react'
import client from '../Config/appwriteConfig';
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const render = () => {

    try {
      const account = new Account(client)

      const urlParams = new URLSearchParams(window.location.search);
      const secret = urlParams.get('secret');
      const userId = urlParams.get('userId');

      const promise = account.updateVerification(userId, secret).then(
        async function (response) {
          console.log('verfication done')
          await account.deleteSession('current');
          navigate('/login')
        }
      )
    } catch (error) {
      alert('verification failed')
      navigate('/signup')
    }
  }
  useEffect(() => {
    render();
  })

  return (
    <>verify</>
  )
}

export default Verify;
