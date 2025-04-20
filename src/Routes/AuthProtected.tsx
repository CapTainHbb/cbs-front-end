import { useSelector } from "react-redux";
import {Navigate} from "react-router-dom";
import { createMongoAbility} from '@casl/ability';
import {useEffect, useMemo, useState} from "react";

const AuthProtected = (props : any) =>{
  const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated);
  const abilityRules = useSelector((state: any) => state.InitialData.abilityRules);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const ability = useMemo(() => {
    return createMongoAbility(abilityRules);
  }, [abilityRules]);

  useEffect(() => {
    setIsAuthorized(ability.can(props.route?.action, props.route?.subject));
  }, [ability, props.route]);

  if(!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (!isAuthorized) {
    return <></>;
  }

  return <>{props.children}</>;
};


export default AuthProtected;