import React from 'react';
import {Link} from "react-router-dom";
import {t} from "i18next";

const CloseWindowButton = () => {
    return (
        <div>
            <Link to="/">
                <img className="hover:bg-blue-50 hover:text-black rounded-full justify-center items-center"
                     data-tooltip-id="global-tooltip"
                     data-tooltip-content={t("CloseWindow")}
                     style={{width: 25, height: 25}}
                     // src={require(`../../assets/icons/Close.png`)}
                     alt={"CloseButton"}/>
            </Link>
        </div>
    );
};

export default CloseWindowButton;