import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import {useMemo} from "react";


const AuthProtected = (props : any) =>{
  const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated)
  const role = useSelector((state: any) => state.InitialData.userProfileData.role)

  const isAuthorized = useMemo(() => {
    return role === 'admin' || role === 'manager';
  }, [role])
  if(!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if(props.route?.needsAuthorization === true && !isAuthorized){
    return <Cover404 />;
  }

  return <>{props.children}</>;
};


export default AuthProtected;