import React, {useCallback, useMemo, useState} from "react";
import {getFormattedToday} from "../../../helpers/date";
import {useSelector} from "react-redux";
import {ColumnDef} from "@tanstack/react-table";
import IndeterminateCheckbox from "../IndetermineCheckbox";
import {t} from "i18next";
import CurrencyNameAndFlag from "../CurrencyNameAndFlag";
import BalanceAmount from "../BalanceAmount";
import {currencyColumns} from "../utils";
import CustomTableContainer from "../CustomTableContainer";
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import GeneralReportExtraHeader from "../IcomeCostProfit/GeneralReportExtraHeader";
import ReportsTotalPerformanceCharts from "../TotalPerformance/ReportsPerformanceCharts";
import { abs } from "mathjs";
import { loopThroughDates } from "../TotalPerformance/utils";

interface GrossFeeReportType {
    fee_type: "received-fee" | "paid-fee" | "balance";
    currency_accounts: any;
    exchanged_amount: number;
    exchanged_amount_per_date: any;
}

const GrossFee = () => {
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<string | null>(getFormattedToday());
    const [toDate, setToDate] = useState<string | null>(getFormattedToday());
    const [itemsAreLoading, setItemsAreLoading] = useState<boolean>(false);
    const {referenceCurrencies, referenceCurrency} = useSelector((info: any) => info.InitialData);
    const [chartData, setChartData] = useState<any>([]);
    const [chartDatesArray, setChartDatesArray] = useState<string[]>([]);


    const columns = useMemo<ColumnDef<GrossFeeReportType>[]>(
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
                id: "fee_type",
                cell: (info) => t(info.row.original.fee_type),
                header: () => <span>{t("Fee Type")}</span>,
                minSize: 80,  // Ensure the column doesn't shrink below this size
                maxSize: 80,  // Prevent resizing beyond this size
                width: 80      // Explicitly set the width
            },
            {
                id: 'exchanged_amounts',
                cell: (info) =>  <BalanceAmount
                    amount={info.row.original.exchanged_amount}

                />,
                header: () => <div className="flex flex-col">
                    <p>{t("Exchanged Total Amount")}</p>
                    <CurrencyNameAndFlag currencyId={referenceCurrency?.id} />
                </div>,
                minSize: 120,  // Ensure the column doesn't shrink below this size
                maxSize: 120,  // Prevent resizing beyond this size
                width: 120      // Explicitly set the width
            },
            ...currencyColumns(referenceCurrencies),
        ],
        [referenceCurrencies, referenceCurrency]
    );


    const urlToFetch = useMemo(() => {
        return `/statistics-information/gross-fee/?from_date=${fromDate}&to_date=${toDate}`;
    }, [fromDate, toDate])

    const preProcessData = useCallback((data: GrossFeeReportType[]) => {
        if(fromDate === null || toDate === null) return data;
            let seriesData: any = [
                {
                    name: t("Received Fee"),
                    type: 'line',
                    data: []
                },
                {
                    name: t("Paid Fee"),
                    type: 'line',
                    data: []
                },
                {
                    name: t("Balance"),
                    type: 'line',
                    data: []
                }
            ]
    
            const assignExchangedAmontPerDate = (formattedDate: string) => {
                for(let i = 0; i < data.length; i++) {
                    const type = data[i]?.fee_type;
                    
                    if(type === 'received-fee') {
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                        seriesData[0].data.push(exchanged_amount_per_date)
                    } else if(type === 'paid-fee') {
                        const exchanged_amount_per_date = abs(Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0));
                        seriesData[1].data.push(exchanged_amount_per_date);
                    } else if(type === 'balance') {
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                        seriesData[2].data.push(exchanged_amount_per_date);
                    }
                }
            }
                
            let dates = loopThroughDates(fromDate, toDate, assignExchangedAmontPerDate);
            setChartDatesArray(dates);
            setChartData(seriesData);
        
            return data;
      }, [fromDate, toDate])

    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Gross Fee")} pageTitle={t("Reports")} />
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <GeneralReportExtraHeader
                                    setItemsChanged={setItemsChanged}
                                    itemsChanged={itemsChanged}
                                    fromDate={fromDate} onChangeFromDate={setFromDate}
                                    toDate={toDate} onChangeToDate={setToDate}
                                    itemsAreLoading={itemsAreLoading}
                                />
                                <Row>
                                    <Col xxl={12}>
                                        <Card>
                                            <CardHeader>
                                                <h4 className="card-title mb-0 flex-grow-1">{t("Income Cost Profit Over Time")}</h4>
                                            </CardHeader>
                                            <CardBody>
                                                <div  dir="ltr">
                                                    <ReportsTotalPerformanceCharts 
                                                        datesArray={chartDatesArray}
                                                        series={chartData} 
                                                        dataColors='["--vz-success", "--vz-danger", "--vz-warning"]'
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
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
                                        preProcessData={preProcessData}
                                    />
                                </React.Fragment >
                            </CardBody>
                        </Card>
                    </Col>
                </Container>
            </div>
        </React.Fragment>
    )
};

export default GrossFee;