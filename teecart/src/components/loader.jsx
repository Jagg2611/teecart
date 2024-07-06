import React from 'react'
import { quantum } from "ldrs";
import '../stylings/loader.css'
const Loader = () => {
  quantum.register();
  return (
    <div className='loader-container'><l-quantum size="70" speed="1.75" color="black"></l-quantum></div>
  )
}

export default Loader