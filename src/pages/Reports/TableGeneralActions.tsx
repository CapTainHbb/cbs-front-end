import React, {useContext} from 'react';
import {t} from "i18next";
import {TableContext} from "./CustomTableContainer";
import CloseWindowButton from "./CloseWindowButton";
import ChangePage from "./ChangePage";

interface Props {
    hasFullScreen: boolean;
}

const TableGeneralActions: React.FC<Props> = ({ hasFullScreen }) => {
    const {isTableFullScreen, setIsTableFullScreen} = useContext(TableContext);

    return (
        <div className="table-general-actions">
            <div className="flex flex-row items-center">
                <CloseWindowButton />
                {hasFullScreen && isTableFullScreen && (
                    <button className="cursor-pointer" data-tooltip-id="global-tooltip"
                            data-tooltip-content={t("ExitFullScreen")}
                            onClick={() => setIsTableFullScreen(false)}>
                        <img
                            style={{width: 25, height: 25}}
                            className={'ri-close-circle-fill'}
                             alt="Billing Icon"/>
                    </button>)}
                {hasFullScreen && !isTableFullScreen && (
                    <button className="cursor-pointer" data-tooltip-id="global-tooltip"
                            data-tooltip-content={t("FullScreen")}
                            onClick={() => setIsTableFullScreen(true)}>
                        <img
                             style={{width: 25, height: 25}}
                            // src={require(`../../../assets/icons/FullScreen.png`)}
                             alt="Billing Icon"/>
                    </button>)}
            </div>
            <ChangePage />
        </div>
    );
};

export default TableGeneralActions;