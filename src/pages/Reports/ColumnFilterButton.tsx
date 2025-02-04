import React, {useContext, useEffect, useRef, useState} from 'react';
import {t} from "i18next";
import {TableContext} from "./CustomTableContainer";


const ColumnFilterButton = () => {
    const {table } = useContext(TableContext)

    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event : any) => {
            // @ts-ignore
            if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
                setIsDropDownOpen(false); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='position-relative d-flex align-items-center' ref={dropdownRef}>
            <button className='btn btn-secondary'
                    onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                    data-tooltip-content={t("ColumnFilter")}
                    data-tooltip-id="global-tooltip"
            >
                Apply Filter
            </button>

            {isDropDownOpen &&
                <ul className='list-unstyled position-absolute bg-white border rounded mt-1 p-1'>
                    {table.getAllLeafColumns().map((column: any) => {
                        return (
                            <div key={column.id} className="px-1">
                                <label
                                    className='d-flex align-items-center bg-light border border-primary rounded p-1 w-100'>
                                    <input
                                        className='mx-1'
                                        {...{
                                            type: 'checkbox',
                                            checked: column.getIsVisible(),
                                            onChange: column.getToggleVisibilityHandler(),
                                        }}
                                    />
                                    <p className='mb-0'>{t(column.id)}</p>
                                </label>
                            </div>
                        )
                    })}
                </ul>
            }
        </div>)
};

export default ColumnFilterButton;