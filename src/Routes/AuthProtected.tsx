import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";


const AuthProtected = (props : any) =>{
  const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated)
  return isAuthenticated? <>{props.children}</>: <Navigate to="/login" />;
};


export default AuthProtected;