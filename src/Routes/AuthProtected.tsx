import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import { createMongoAbility} from '@casl/ability';

import { Can } from '@casl/react';



const AuthProtected = (props : any) =>{
  const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated);
  const abilityRules = useSelector((state: any) => state.InitialData.abilityRules);

  if(!isAuthenticated) {
    return <Navigate to="/login" />
  }

  // if(props.route?.needsAuthorization === true && !isAuthorized) {
  //   return <Cover404 />;
  // }
  console.log(abilityRules, props.route?.action, props.route?.codename)
  return <Can I={props.route?.action} a={props.route?.codename} ability={createMongoAbility(abilityRules)}>
      <>{props.children}</>
    </Can>
};


export default AuthProtected;