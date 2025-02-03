import React, { useEffect } from 'react';

//redux
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';

const selectLayoutMode = createSelector(
    (state: any) => state.Layout,
    (layout) => layout.layoutModeType
);

const NonAuthLayout = ({ children } : any) => {

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
    return (
        <div>
            {children}
        </div>
    );
};

export default NonAuthLayout;