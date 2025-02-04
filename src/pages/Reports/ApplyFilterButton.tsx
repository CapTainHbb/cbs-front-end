import React, {useContext} from 'react';
import {t} from "i18next";
// import IconWithLabel from "../IconWithLabel";
import {TableContext} from "./CustomTableContainer";

const ApplyFilterButton = () => {
    const {onUpdateTable} = useContext(TableContext);

    return (
        <button className={`table-button`}
                data-tooltip-id="global-tooltip"
                data-tooltip-content={t("ApplyFilters")}
                onClick={(e: any) => onUpdateTable?.(e)}
                disabled={!onUpdateTable}
        >
            apply filter
            {/*<IconWithLabel iconName={"Filter02"}/>*/}
        </button>
    );
};

export default ApplyFilterButton;