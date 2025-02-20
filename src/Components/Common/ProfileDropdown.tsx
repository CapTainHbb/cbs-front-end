import React, {useState, useCallback} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import axiosInstance from '../../helpers/axios_instance';

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import {t} from "i18next";

const ProfileDropdown = () => {

    const userProfileDataSelector = createSelector(
        (state: any) => state.InitialData,
        (initialData) => initialData.userProfileData
    );
    // Inside your component
    const userProfileData = useSelector(userProfileDataSelector);

    const onClickLogout = useCallback(async (e: any) => {
        axiosInstance.post('/users/logout/', {})
        .then((response) => {
            window.location.assign('/logout');
            })
        .catch(error => {
            console.log(error);
        }).finally(() => {
            window.location.assign('/logout');
        })
    }, [])

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                                {userProfileData.user.username}
                            </span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                                {t(userProfileData.role)}
                            </span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <h6 className="dropdown-header">{t("Welcome")} {userProfileData.user.username}!</h6>
                    <DropdownItem className='p-0'>
                        <Link to="/apps-chat" className="dropdown-item">
                            <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">{t("Messages")}</span>
                        </Link>
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem className='p-0'>
                        <div  onClick={onClickLogout} className="dropdown-item">
                            <i
                                className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                    className="align-middle" data-key="t-logout">{t("Logout")}</span>
                        </div>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;