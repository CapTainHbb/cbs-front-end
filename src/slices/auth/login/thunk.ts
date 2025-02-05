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

  // const loadingToastId = toast.loading(t('LoggingIn'));
  await axiosInstance.post('/users/login/', {
    "username": values.username,
    "password": values.password,
  }).then(response => {
    // toast.success(t('LoginSuccess'), {
    //   id: loadingToastId,
    // });
    dispatch(loginSuccess({}))
    dispatch(fetchInitialData())
  }).catch(error => {
    // toast.error(t("LoginFailed"), {
    //   id: loadingToastId,
    // });

  });
}

export const logout = async () => {
  // const loadingToastId = toast.loading(t('LoggingOut'));
  await axiosInstance.post('/users/logout/', {})
      .then(response => {
        window.location.assign('/login');
      }).catch((error: any) => {
        console.error(error);
      }).finally(() => {
        // toast.remove(loadingToastId);
        window.location.assign('/login');
      });
}
