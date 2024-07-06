import React, {useEffect,useState} from 'react'
import { useAuth } from '../utils/AuthContext'
import { COLLECTION_CATEGORIES, DATABASEID, database } from '../Config/appwriteConfig';

const Home = () => {
  const {user,handleUserLogout} = useAuth();
  const [data,setData] = useState(null);
  const [searchReq,setSearchReq] = useState(null);
 
  useEffect(()=>{
    const getCategories = async()=>{
      const promise = await database.listDocuments(DATABASEID,COLLECTION_CATEGORIES);
      setData(data);
    }
    
    if(!data){
      getCategories();
    }
  },[])
  return (
    <>
    home <br />
    <button onClick={handleUserLogout}>logout</button>
    </>
    
  )
}

export default Home