import React, {useEffect} from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import AuthProtected  from './AuthProtected';
import {useDispatch, useSelector} from "react-redux";
import {createSelector} from "reselect";
import Spinners from "../Components/Common/Spinner";
import {checkIsUserAuthenticated} from "../slices/auth/login/thunk";
import {fetchInitialData} from "../slices/initialData/thunk";

const Index = () => {
    const isAuthenticated = useSelector((state: any) => state.Authentication.isAuthenticated)
    const initialDataIsLoading = useSelector((state: any) => state.InitialData.initialDataIsLoading)
    const dispatch: any = useDispatch()
    const selectLayoutMode = createSelector(
        (state: any) => state.Layout,
        (layout) => layout.layoutModeType
    );
    const layoutModeType = useSelector(selectLayoutMode);

    useEffect(() => {
        if (layoutModeType === "dark") {
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.setAttribute("data-bs-theme", "light");
        }
        return () => {
            document.body.removeAttribute("data-bs-theme");
        };
    }, [layoutModeType]);

    useEffect(() => {
        dispatch(checkIsUserAuthenticated());
        dispatch(fetchInitialData());
    }, [dispatch]);

    if (isAuthenticated === null || initialDataIsLoading) {
        return <Spinners />;
    }

    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                                </AuthProtected>}
                            key={idx}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;