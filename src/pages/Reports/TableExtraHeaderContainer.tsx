import React from 'react';
import ColumnFilterButton from "./Buttons/ColumnFilterButton";
import UpdateTableButton from "./Buttons/UpdateTableButton";
import ApplyFilterButton from "./Buttons/ApplyFilterButton";


interface Props {
    children?: React.ReactNode;
}

const TableExtraHeaderContainer : React.FC<Props> = ({ children}) => {
    return (
        <div>
            {children &&
                <div className='w-100 h-100'>
                    {<ApplyFilterButton/>}
                <UpdateTableButton/>
                <ColumnFilterButton/>
                    {children}
                </div>
            }
        </div>
    );
};

export default TableExtraHeaderContainer;