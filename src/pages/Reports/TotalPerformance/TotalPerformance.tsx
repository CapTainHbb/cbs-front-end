import React, {useCallback, useMemo, useState} from "react";
import {getFormattedToday} from "../../../helpers/date";
import {ColumnDef} from "@tanstack/react-table";
import IndeterminateCheckbox from "../IndetermineCheckbox";
import {useSelector} from "react-redux";
import {CurrencyAccount} from "../../Accounting/types";
import {t} from "i18next";
import {currencyColumns} from "../utils";
import {Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomTableContainer from "../CustomTableContainer";
import GeneralReportExtraHeader from "../IcomeCostProfit/GeneralReportExtraHeader";
import { ReportItemType } from "../types";


interface TotalPerformanceRowType {
    exchanged_amounts: number;
    currency_accounts: CurrencyAccount[];
    flow_type: "incoming" | "outgoing" | "balance";
    date: string;
}

const TotalPerformance = () => {
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<string | null>(getFormattedToday());
    const [toDate, setToDate] = useState<string | null>(getFormattedToday())
    const {referenceCurrencies, referenceCurrency} = useSelector((state: any) => state.InitialData);
    const [itemsAreLoading, setItemsAreLoading] = useState<boolean>(false);

    const preprocessData = useCallback((data: ReportItemType) => {
        let processedData = []
        processedData.push({
            balance_exchanged_amount: data?.balance_exchanged_amount,
            currency_accounts: data?.balance_currency_accounts,
            type: "balance"
        })
        return data
    }, []);

    const columns = useMemo<ColumnDef<TotalPerformanceRowType>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        checked={table.getIsAllRowsSelected()}
                        indeterminate={table.getIsSomeRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                        />
                    </div>
                ),
                size: 10,
            },
            {
                id: "flow_type",
                cell: (info) => t(info.row.original.flow_type),
                header: () => <span>{t("Type")}</span>,
                minSize: 70,  // Ensure the column doesn't shrink below this size
                maxSize: 70,  // Prevent resizing beyond this size
                width: 70      // Explicitly set the width
            },
            ...currencyColumns(referenceCurrencies),
        ],
        [referenceCurrencies, referenceCurrency]
    );

    const urlToFetch = useMemo(() => {
        return `/statistics-information/total-performance/?from_date=${fromDate}&to_date=${toDate}`;
    }, [fromDate]);

    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Total Performance")} pageTitle={t("Reports")} />
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <GeneralReportExtraHeader
                                    fromDate={fromDate} onChangeFromDate={setFromDate}
                                    toDate={toDate} onChangeToDate={setToDate}
                                    itemsChanged={itemsChanged} setItemsChanged={setItemsChanged}
                                    itemsAreLoading={itemsAreLoading}
                                />
                            </CardHeader>
                            <CardBody>
                                <React.Fragment >
                                    <CustomTableContainer
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                        loadItemsApi={urlToFetch}
                                        loadMethod={'GET'}
                                        columns={(columns || [])}
                                        hasPagination={false}
                                        setItemsAreLoading={setItemsAreLoading}
                                    />
                                </React.Fragment >
                            </CardBody>
                        </Card>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TotalPerformance;
