import React, {useMemo, useState} from "react";
import {getFormattedToday} from "../../../helpers/date";
import {ColumnDef} from "@tanstack/react-table";
import IndeterminateCheckbox from "../IndetermineCheckbox";
import {useSelector} from "react-redux";
import {CurrencyAccount} from "../../Accounting/types";
import {t} from "i18next";
import BalanceAmount from "../BalanceAmount";
import CurrencyNameAndFlag from "../CurrencyNameAndFlag";
import {currencyColumns} from "../utils";
import {Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CustomTableContainer from "../CustomTableContainer";


interface TotalPerformance {
    exchanged_amounts: number;
    currency_accounts: CurrencyAccount[];
    flow_type: "incoming" | "outgoing" | "balance";
    date: string;
}

const TotalPerformance = () => {
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);

    const [date, setDate] = useState<string>(getFormattedToday());

    const filters = useMemo(() => ({ date }), [date]);

    const {referenceCurrencies, referenceCurrency} = useSelector((state: any) => state.InitialData);

    const columns = useMemo<ColumnDef<TotalPerformance>[]>(
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
                size: 40,
            },
            {
                id: 'exchanged_amounts',
                cell: (info) =>  <BalanceAmount
                    amount={info.row.original.exchanged_amounts}

                />,
                header: () => <div className="flex flex-col">
                    <p>{t("Exchanged Total Amount")}</p>
                    <CurrencyNameAndFlag currencyId={referenceCurrency?.id} />
                </div>,
                size: 50,
            },
            ...currencyColumns(referenceCurrencies),
        ],
        [referenceCurrencies, referenceCurrency]
    );

    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Total Performance")} pageTitle={t("Reports")} />
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                {/*<GeneralReportExtraHeader*/}
                                {/*    setItemsChanged={setItemsChanged}*/}
                                {/*    itemsChanged={itemsChanged}*/}
                                {/*    fromDate={fromDate} onChangeFromDate={setFromDate}*/}
                                {/*    toDate={toDate} onChangeToDate={setToDate}*/}
                                {/*/>*/}
                            </CardHeader>
                            <CardBody>
                                <React.Fragment >
                                    <CustomTableContainer
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                        loadItemsApi="/statistics-information/total-performance/"
                                        columns={(columns || [])}
                                        filters={filters}
                                        hasPagination={false}
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
