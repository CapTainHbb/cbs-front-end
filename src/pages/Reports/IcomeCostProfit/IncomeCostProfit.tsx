import BreadCrumb from 'Components/Common/BreadCrumb'
import React, {useCallback, useMemo, useState} from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import GeneralReportExtraHeader from '../GeneralReportExtraHeader';
import CustomTableContainer from '../CustomTableContainer';
import { ColumnDef } from '@tanstack/react-table';
import IndeterminateCheckbox from '../IndetermineCheckbox';
import { t } from 'i18next';
import BalanceAmount from '../BalanceAmount';
import CurrencyNameAndFlag from '../CurrencyNameAndFlag';
import { currencyColumns, loopThroughDates } from '../utils';
import { useSelector } from 'react-redux';
import {getFormattedToday} from "../../../helpers/date";
import { CurrencyAccount } from 'pages/Accounting/types';
import GeneralReportCharts from '../GeneralReportsCharts';
import { abs } from 'mathjs';

interface IncomeCostProfitReportItemType {
    exchanged_amount: number;
    currency_accounts: CurrencyAccount[];
    type: "income" | "gross-cost" | 'benefit-loss';
    exchanged_amount_per_date: any;
}

const IncomeCostProfit = () => {
  const [fromDate, setFromDate] = useState<string | null>(getFormattedToday());
  const [toDate, setToDate] = useState<string | null>(getFormattedToday());

  const referenceCurrency = useSelector((state: any) => state.InitialData.referenceCurrency);
  const referenceCurrencies = useSelector((state: any) => state.InitialData.referenceCurrencies);
  const [itemsAreLoading, setItemsAreLoading] = useState<boolean>(false)
  const [itemsChanged, setItemsChanged] = useState<boolean>(false)
  const [chartData, setChartData] = useState<any>([]);
  const [chartDatesArray, setChartDatesArray] = useState<string[]>([]);

    const columns = useMemo<ColumnDef<IncomeCostProfitReportItemType>[]>(
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
            minSize: 35,  // Ensure the column doesn't shrink below this size
            maxSize: 35,  // Prevent resizing beyond this size
            width: 35      // Explicitly set the width
        },
        {
            id: "type",
            cell: (info) => t(info.row.original.type),
            header: () => <span>{t("Report Type")}</span>,
            minSize: 80,  // Ensure the column doesn't shrink below this size
            maxSize: 80,  // Prevent resizing beyond this size
            width: 80      // Explicitly set the width
        },
        {
            id: 'exchanged_amounts',
            cell: (info) =>  <BalanceAmount
                amount={info.row.original.exchanged_amount}

            />,
            header: () => <Col lg={12}>
                <p>{t("Exchanged Total Amount")}</p>
                <CurrencyNameAndFlag currencyId={referenceCurrency?.id} />
            </Col>,
            minSize: 120,  // Ensure the column doesn't shrink below this size
            maxSize: 120,  // Prevent resizing beyond this size
            width: 120      // Explicitly set the width
        },
        ...currencyColumns(referenceCurrencies),
    ],
    [referenceCurrencies, referenceCurrency]
  );

  const urlToFetch = useMemo(() => {
        return `statistics-information/income-cost-profit/?from_date=${fromDate}&to_date=${toDate}`;
  }, [fromDate, toDate])


  const preProcessData = useCallback((data: IncomeCostProfitReportItemType[]) => {
    if(fromDate === null || toDate === null) return data;
            
        let seriesData: any = [
            {
                name: t("Income"),
                type: 'line',
                data: []
            },
            {
                name: t("Gross Cost"),
                type: 'line',
                data: []
            },
            {
                name: t("Benefit Loss"),
                type: 'line',
                data: []
            }
        ]

        const assignExchangedAmontPerDate = (formattedDate: string) => {
            for(let i = 0; i < data.length; i++) {
                const type = data[i]?.type;
                
                if(type === 'income') {
                    const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                    seriesData[0].data.push(exchanged_amount_per_date)
                } else if(type === 'gross-cost') {
                    const exchanged_amount_per_date = abs(Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0));
                    seriesData[1].data.push(exchanged_amount_per_date)
                } else if(type === 'benefit-loss') {
                    const exchanged_amount_per_date = Number(data?.[i]?.["exchanged_amount_per_date"]?.[formattedDate]?.balance || 0);
                    seriesData[2].data.push(exchanged_amount_per_date)
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
          <BreadCrumb title={t("Income Cost And Profit")} pageTitle={t("Reports")} />
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
                                    <h4 className="card-title mb-0 flex-grow-1">{t("Income Cost Profit Over Time")}</h4>
                                </CardHeader>
                                <CardBody>
                                    <div  dir="ltr">
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
                    <React.Fragment >
                        <CustomTableContainer
                            itemsChanged={itemsChanged}
                            loadMethod={'GET'}
                            setItemsChanged={setItemsChanged}
                            loadItemsApi={urlToFetch}
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
}

export default IncomeCostProfit;
