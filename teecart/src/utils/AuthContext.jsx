import { Account } from "appwrite";
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../Config/appwriteConfig";
import Loader from "../components/loader";


// Default values shown

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  const account = new Account(client);
  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUserLogin = async (e, userEmail, userPassword) => {
    e.preventDefault();
    console.log(userEmail);
    console.log(userPassword);
    try {
      const response = await account.createEmailPasswordSession(
        userEmail,
        userPassword
      );
      // console.log("response from verfication:", response)
      const accountDetails = await account.get();
      setUser(accountDetails);
      // console.log("accountDetails:", accountDetails)
      navigate("/");
    } catch {
      console.error(error);
    }
  };

  const handleUserLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/");
      // Redirect to the login page or perform any other necessary actions after logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle the error gracefully (e.g., display a message to the user)
    }
  };

  const context = {
    user,
    handleUserLogin,
    handleUserLogout,
  };
  return (
    <AuthContext.Provider value={context}>
      {loading ? (
        <Loader/>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
