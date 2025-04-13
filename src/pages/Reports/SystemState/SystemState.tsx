import BreadCrumb from 'Components/Common/BreadCrumb'
import { t } from 'i18next'
import React, { useCallback, useMemo, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import CustomTableContainer from '../CustomTableContainer'
import { CurrencyAccount } from 'pages/Accounting/types'
import { ColumnDef } from '@tanstack/react-table'
import IndeterminateCheckbox from '../IndetermineCheckbox'
import BalanceAmount from '../BalanceAmount'
import CurrencyNameAndFlag from '../CurrencyNameAndFlag'
import { useSelector } from 'react-redux'
import { currencyColumns, loopThroughDates } from '../utils'
import GeneralReportExtraHeader from '../GeneralReportExtraHeader'
import { getFormattedToday } from 'helpers/date'
import GeneralReportCharts from '../GeneralReportsCharts'
import { abs } from 'mathjs'

interface SystemStateRowType {
    exchanged_amount: number;
    currency_accounts: CurrencyAccount[];
    exchanged_amount_per_date: any;
    type: 'creditor' | 'debtor' | 'balance';
}

const SystemState = () => {

    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<string | null>(getFormattedToday());
    const [toDate, setToDate] = useState<string | null>(getFormattedToday());
    const {referenceCurrencies, referenceCurrency} = useSelector((state: any) => state.InitialData);
    const urlToFetch = useMemo(() => {
            return `/statistics-information/system-state/?from_date=${fromDate}&to_date=${toDate}`;
        }, [fromDate, toDate]);
    const [itemsAreLoading, setItemsAreLoading] = useState<boolean>(false);
    const [chartData, setChartData] = useState<any>([]);
    const [chartDatesArray, setChartDatesArray] = useState<string[]>([]);

    const columns = useMemo<ColumnDef<SystemStateRowType>[]>(
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
                id: "type",
                cell: (info) => t(info.row.original.type),
                header: () => <span>{t("Type")}</span>,
                minSize: 70,  // Ensure the column doesn't shrink below this size
                maxSize: 70,  // Prevent resizing beyond this size
                width: 70      // Explicitly set the width
            },
            {
                id: "exchanged_amount",
                cell: (info) =>  <BalanceAmount amount={info.row.original.exchanged_amount} />,
                header: () => <Row>{t("Exchanged Amount")} <CurrencyNameAndFlag currencyId={referenceCurrency?.id} /></Row>,
                minSize: 130,  // Ensure the column doesn't shrink below this size
                maxSize: 130,  // Prevent resizing beyond this size
                width: 130      // Explicitly set the width
            },
            ...currencyColumns(referenceCurrencies),
        ],
        [referenceCurrencies, referenceCurrency]
    );

    const preProcessData = useCallback((data: SystemStateRowType[]) => {
            if(fromDate === null || toDate === null) return data;
            
            let seriesData: any = [
                {
                    name: t("creditor"),
                    type: 'line',
                    data: []
                },
                {
                    name: t("debtor"),
                    type: 'line',
                    data: []
                },
                {
                    name: t("balance"),
                    type: 'line',
                    data: []
                }
            ]
    
            const assignExchangedAmontPerDate = (formattedDate: string) => {
                for(let i = 0; i < data.length; i++) {
                    const type = data?.[i]?.type;
                    if(type === 'creditor') {
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.creditor || 0);
                        seriesData[0].data.push(exchanged_amount_per_date)
                    } else if(type === 'debtor') {
                        const exchanged_amount_per_date = abs(Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.debtor || 0));
                        seriesData[1].data.push(exchanged_amount_per_date)
                    } else if(type === 'balance') {
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                        seriesData[2].data.push(exchanged_amount_per_date)
                    }
                    
                }
            }
            
            
            let dates = loopThroughDates(fromDate, toDate, assignExchangedAmontPerDate)
            setChartDatesArray(dates);
            setChartData(seriesData);
    
            return data;
        }, [fromDate, toDate])
        
  return (
    <React.Fragment>
        <div className='page-content'>
            <Container fluid>
                <BreadCrumb  title={t('System State')} pageTitle={t("Reports")}/>
                <Col lg={12}>
                    <Card>
                        <CardHeader>
                            <GeneralReportExtraHeader
                                        fromDate={fromDate} onChangeFromDate={setFromDate}
                                        toDate={toDate} onChangeToDate={setToDate}
                                        itemsChanged={itemsChanged} setItemsChanged={setItemsChanged}
                                        itemsAreLoading={itemsAreLoading}
                                    />
                            <Row>
                                <Col xxl={12}>
                                    <Card>
                                        <CardHeader>
                                            <h4 className="card-title mb-0 flex-grow-1">{t("Total Performance Over Time")}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <div dir='ltr'>
                                            <GeneralReportCharts 
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
                            <React.Fragment>
                                <CustomTableContainer 
                                    itemsChanged={itemsChanged}
                                    setItemsChanged={setItemsChanged}
                                    loadItemsApi={urlToFetch}
                                    loadMethod={'GET'}
                                    columns={columns}
                                    hasPagination={false}
                                    setItemsAreLoading={setItemsAreLoading}
                                    preProcessData={preProcessData}
                                />
                            </React.Fragment>
                        </CardBody>
                    </Card>
                </Col>
            </Container>
        </div>
    </React.Fragment>
  )
}

export default SystemState
