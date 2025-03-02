import React, {useMemo} from 'react';
import {Link} from "react-router-dom";
import {t} from "i18next";

interface Props {
    table: any;
}

const ChangePageContainer: React.FC<Props> = ({ table }) => {

    const totalPages = Math.ceil(table?.getRowCount() / table?.getState().pagination.pageSize);
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i)
    return (
        <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                <li className={!table?.getCanPreviousPage() ? "page-item disabled" : "page-item"}>
                    <Link to="#" className="page-link" onClick={table?.previousPage}>
                        {t("Previous")}
                    </Link>
                </li>

                {pageOptions.map((item, key) => {
                    const currentPage = table?.getState().pagination.pageIndex;

                    // Logic to show only nearby pages with ellipsis
                    const shouldShow =
                        item === 0 || // First page
                        item === pageOptions.length - 1 || // Last page
                        (item >= currentPage - 1 && item <= currentPage + 1); // Around current page

                    const isEllipsisBefore = item === 1 && currentPage > 2;
                    const isEllipsisAfter = item === pageOptions.length - 2 && currentPage < pageOptions.length - 3;

                    return (
                        <React.Fragment key={key}>
                            {isEllipsisBefore &&
                                <li className="page-item disabled"><span className="page-link">...</span></li>}
                            {shouldShow && (
                                <li className="page-item">
                                    <Link
                                        to="#"
                                        className={currentPage === item ? "page-link active" : "page-link"}
                                        onClick={() => table?.setPageIndex(item)}
                                    >
                                        {item + 1}
                                    </Link>
                                </li>
                            )}
                            {isEllipsisAfter &&
                                <li className="page-item disabled"><span className="page-link">...</span></li>}
                        </React.Fragment>
                    );
                })}

                <li className={!table?.getCanNextPage() ? "page-item disabled" : "page-item"}>
                    <Link to="#" className="page-link" onClick={table?.nextPage}>
                        {t("Next")}
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default ChangePageContainer;