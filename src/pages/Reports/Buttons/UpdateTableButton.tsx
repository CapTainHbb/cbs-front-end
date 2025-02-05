import React, {useContext} from 'react';
import {t} from "i18next";
// import IconWithLabel from "../IconWithLabel";
import {TableContext} from "../CustomTableContainer";

const UpdateTableButton = () => {
    const {onUpdateTable} = useContext(TableContext);

    return (
        <button className={'btn btn-primary'}
                data-tooltip-id="global-tooltip"
                data-tooltip-content={t("UpdateTable")}
                onClick={(e: any) => onUpdateTable?.(e)}
                // disabled={!onUpdateTable}
        >
            apply update
        </button>
    );
};

export default UpdateTableButton;