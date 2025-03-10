import React, {useMemo, useState} from 'react';
import {Card, CardBody, CardHeader, Col, Container} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomTableContainer from "../Reports/CustomTableContainer";
import {t} from "i18next";
import {ColumnDef} from "@tanstack/react-table";
import IndeterminateCheckbox from "../Reports/IndetermineCheckbox";
import {getUTCFormattedDateTime} from "../../helpers/date";
import Select from "react-select";
import UsersActivityHistoryExtraHeader from "./UsersActivityHistoryExtraHeader";
import {useSelector} from "react-redux";
import {User, UserProfile} from "./types";

export const methodTypes =  [
    {label: t('LOGOUT'), value: 'LOGOUT'},
    {label: t('LOGIN'), value: 'LOGIN'},
    {label: t('GET'), value: 'GET'},
    {label: t('POST'), value: 'POST'},
    {label: t('PUT'), value: 'PUT'},
    {label: t('DELETE'), value: 'DELETE'}
]

interface Filters {
    user: number | undefined;
    from_date?: string,
    to_date?: string,
    from_time?: string,
    to_time?: string,
    method_type?: string,
}

interface UserActivity {
    actor: User;
    verb: string;
    details: string;
    method_type: "POST" | "PUT" | "DELETE" | "GET" | "LOGOUT" | "LOGIN";
    timestamp: string;
    ip_address: string;
    user_agent: string;
}

const UsersActivityHistory = () => {
    const users = useSelector((state: any) => state.InitialData.users)
    const [itemsChanged, setItemsChanged] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);

    const [fromDate, setFromDate] = useState<any>();
    const [toDate, setToDate] = useState<any>();
    const [fromTime, setFromTime] = useState<any>();
    const [toTime, setToTime] = useState<any>();
    const [methodType, setMethodType] = useState<any>();

    const filters: Filters = useMemo(() => {
        return {
            user: user?.id,
            from_date: fromDate === ""? undefined : fromDate,
            to_date: toDate === ""? undefined : toDate,
            from_time: fromTime === ""? undefined : fromTime,
            to_time: toTime === ""? undefined : toTime,
            method_type: methodType,
        }
    }, [fromDate, fromTime, methodType, toDate, toTime, user?.id])

    const defaultColumns = useMemo<ColumnDef<UserActivity>[]>(() => {
        return [
            {
                id: 'select',
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <div className="px-1">
                        <IndeterminateCheckbox
                            {...{
                                checked: row.getIsSelected(),
                                disabled: !row.getCanSelect(),
                                indeterminate: row.getIsSomeSelected(),
                                onChange: row.getToggleSelectedHandler(),
                            }}
                        />
                    </div>
                ),
                size: 10
            },
            {
                accessorKey: 'actor',
                // @ts-ignore
                cell: info => info.getValue()?.username,
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Username")}</span>
                        <Select isClearable
                                value={users?.find((option: any) => option.value === user)?.username}
                                onChange={(item: any) => setUser(item?.value)}
                                className="mb-0"
                                options={users?.map((user: UserProfile) => {
                                    return {
                                        label: user.user.username,
                                        value: user,
                                    }
                                })}
                                id="statusinput-choices"
                        />
                    </div>,
                size: 45
            },
            {
                accessorKey: 'details',
                // @ts-ignore
                cell: info => info.getValue(),
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Details")}</span>
                    </div>
            },
            {
                accessorKey: 'method_type',
                // @ts-ignore
                cell: info => t(info.getValue()),
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Method Type")}</span>
                        <Select isClearable
                                value={methodTypes.find(option => option.value === methodType)}
                                onChange={(item: any) => setMethodType(item?.value)}
                                className="mb-0"
                                options={methodTypes}
                                id="statusinput-choices"
                        />
                    </div>,
                size: 45
            },
            {
                accessorKey: 'verb',
                // @ts-ignore
                cell: info => t(info.getValue()),
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Verb")}</span>
                    </div>
            },
            {
                id: 'date',
                cell: info => getUTCFormattedDateTime(new Date(info.row.original.timestamp)).date,
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Date")}</span>
                        {/*<RangeFilter type="date"*/}
                        {/*             fromName={'date_from'}*/}
                        {/*             toName={'date_to'}*/}
                        {/*             fromValue={fromDate}*/}
                        {/*             onFromChange={(e: any) => setFromDate(e.target.value)}*/}
                        {/*             toValue={toDate}*/}
                        {/*             onToChange={(e: any) => setToDate(e.target.value)}*/}
                        {/*/>*/}
                    </div>,
                size: 50
            },
            {
                id: 'time',
                cell: info => getUTCFormattedDateTime(new Date(info.row.original.timestamp)).time,
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Time")}</span>
                        {/*<RangeFilter type="time"*/}
                        {/*             fromName={'time_from'}*/}
                        {/*             toName={'time_to'}*/}
                        {/*             fromValue={fromTime}*/}
                        {/*             onFromChange={(e: any) => setFromTime(e.target.value)}*/}
                        {/*             toValue={toTime}*/}
                        {/*             onToChange={(e: any) => setToTime(e.target.value)}*/}
                        {/*/>*/}
                    </div>,
                size: 45
            },
            {
                accessorKey: 'ip_address',
                cell: info => info.getValue(),
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("Ip Address")}</span>
                    </div>,
                size: 45
            },
            {
                accessorKey: 'user_agent',
                cell: info => info.getValue(),
                header: () =>
                    <div className='header-item-container'>
                        <span className={'header-item-title'}>{t("User Agent")}</span>
                    </div>,
                size: 45
            },
        ]
    }, [methodType])

    return (
        <React.Fragment>
            <div className='page-content'>
                <Container fluid>
                    <BreadCrumb title={t("Users Activity History")}
                                pageTitle={t("Users Activity History")} />
                    <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <UsersActivityHistoryExtraHeader
                                    fromDate={fromDate} onChangeFromDate={setFromDate}
                                    toDate={toDate} onChangeToDate={setToDate}
                                />
                            </CardHeader>
                            <CardBody>
                                <React.Fragment >
                                    <CustomTableContainer
                                        loadItemsApi={'/activities/'}
                                        loadMethod='POST'
                                        columns={(defaultColumns || [])}
                                        itemsChanged={itemsChanged}
                                        setItemsChanged={setItemsChanged}
                                        filters={filters}
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

export default UsersActivityHistory;