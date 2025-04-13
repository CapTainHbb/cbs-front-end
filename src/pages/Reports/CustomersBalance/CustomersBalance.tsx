import BreadCrumb from 'Components/Common/BreadCrumb'
import { t } from 'i18next'
import React, { useCallback, useMemo, useState } from 'react'
import {Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalHeader, Row} from 'reactstrap'
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
import CloseAllPositions from "./CloseAllPositions";

interface SystemStateRowType {
    exchanged_amount: number;
    currency_accounts: CurrencyAccount[];
    exchanged_amount_per_date: any;
    type: 'creditor' | 'debtor' | 'balance';
}

const CustomersBalance = () => {

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
    const [capModalIsOpen, setCapModalIsOpen] = useState<boolean>(false);
    const [balanceCurrencyAccounts, setBalanceCurrencyAccounts] = useState<CurrencyAccount[]>([])

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
    
            const assignExchangedAmountPerDate = (formattedDate: string) => {
                for(let i = 0; i < data.length; i++) {
                    const type = data?.[i]?.type;
                    if(type === 'creditor') {
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.creditor || 0);
                        seriesData[0].data.push(exchanged_amount_per_date)
                    } else if(type === 'debtor') {
                        const exchanged_amount_per_date = abs(Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.debtor || 0));
                        seriesData[1].data.push(exchanged_amount_per_date)
                    } else if(type === 'balance') {
                        setBalanceCurrencyAccounts(data?.[i]?.currency_accounts)
                        const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                        seriesData[2].data.push(exchanged_amount_per_date)
                    }
                    
                }
            }
            
            
            let dates = loopThroughDates(fromDate, toDate, assignExchangedAmountPerDate)
            setChartDatesArray(dates);
            setChartData(seriesData);
    
            return data;
        }, [fromDate, toDate])
        
  return (
    <React.Fragment>
        <div className='page-content'>
            <Container fluid>
                <Modal isOpen={capModalIsOpen}
                       toggle={() => setCapModalIsOpen(false)} backdrop={"static"}
                       className={'modal-lg'}
                       centered={true}>
                    <ModalHeader className="bg-primary-subtle p-3"
                                 toggle={() => setCapModalIsOpen(false)}>
                        {t("CAP (Close All Positions)")}
                    </ModalHeader>
                    <ModalBody>
                        <CloseAllPositions currencyAccounts={balanceCurrencyAccounts} />
                    </ModalBody>
                </Modal>
                <BreadCrumb  title={t('Customers Balance')} pageTitle={t("Reports")}/>
                <Col lg={12}>
                    <Card>
                        <CardHeader>
                            <Row className={'gap-1'}>
                                <Col md={9}>
                                    <GeneralReportExtraHeader
                                                fromDate={fromDate} onChangeFromDate={setFromDate}
                                                toDate={toDate} onChangeToDate={setToDate}
                                                itemsChanged={itemsChanged} setItemsChanged={setItemsChanged}
                                                itemsAreLoading={itemsAreLoading}
                                            />
                                </Col>
                                <Col md={2}>
                                    <Button color={'primary'} onClick={() => setCapModalIsOpen(true)}>
                                        {t("CAP (Close All Positions)")}
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col xxl={12}>
                                    <Card>
                                        <CardHeader>
                                            <h4 className="card-title mb-0 flex-grow-1">{t("Customers Balance Over Time")}</h4>
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

export default CustomersBalance
