import { useSelector } from "react-redux";


const AuthProtected = (props : any) =>{
  const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated)
  return isAuthenticated? <>{props.children}</>: <></>;
};


export default AuthProtected;