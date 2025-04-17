import {loginSuccess, loginFailed} from "./reducer";
import axiosInstance from '../../../helpers/axios_instance';
import {fetchInitialData} from "../../initialData/thunk";
import {setInitialDataIsLoading} from "../../initialData/reducer";

export const checkIsUserAuthenticated = () => async (dispatch : any) => {
    axiosInstance.post('/users/token/verify/', {})
        .then(response => {
            dispatch(loginSuccess({}));
            dispatch(fetchInitialData());
        })
        .catch(error => {
            dispatch(loginFailed({}));
            dispatch(setInitialDataIsLoading(false))
        })
};

export const loginUser = (values: any) => async (dispatch: any) => {
  await axiosInstance.post('/users/login/', {
    "username": values.username,
    "password": values.password,
  }).then(response => {
    dispatch(loginSuccess({}))
    dispatch(fetchInitialData())
  }).catch(error => {

  });
}

export const logout = async () => {
  await axiosInstance.post('/users/logout/', {})
      .then(response => {
        window.location.assign('/login');
      }).catch((error: any) => {
        console.error(error);
      }).finally(() => {
        window.location.assign('/login');
      });
}
