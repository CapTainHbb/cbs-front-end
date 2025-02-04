import React, {useContext} from 'react';
import ColumnFilterButton from "./ColumnFilterButton";
import UpdateTableButton from "./UpdateTableButton";
import ApplyFilterButton from "./ApplyFilterButton";
import {TableContext} from "./CustomTableContainer";


interface Props {
    children?: React.ReactNode;
}

const TableExtraHeaderContainer : React.FC<Props> = ({ children}) => {
    const tableContext = useContext(TableContext)


    return (
        <div>
            <div className="d-flex w-48 justify-content-between">
                {tableContext?.filters && <ApplyFilterButton/>}
                <UpdateTableButton/>
                <ColumnFilterButton/>
            </div>
            {children &&
                <div className='w-100 h-100'>
                    {children}
                </div>
            }
        </div>
    );
};

export default TableExtraHeaderContainer;