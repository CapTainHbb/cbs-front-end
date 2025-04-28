import React, {useCallback, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner,
    Table
} from 'reactstrap';
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { t } from 'i18next';
import axiosInstance from "../../helpers/axios_instance";
import {toast, ToastContainer} from "react-toastify";
import {normalizeDjangoError} from "../../helpers/error";
import RectLoader from "../Reports/RectLoader";

const ManageBackup = () => {

    const [accessToken, setAccessToken] = useState<string>("")
    const [accessTokenIsSetting, setAccessTokenIsSetting] = useState(false);
    const [backupList, setBackupList] = useState<any>();
    const [backupListIsLoading, setBackupListIsLoading] = useState(false);
    const [isMakingBackup, setIsMakingBackup] = useState(false);

    const fetchBackups = useCallback(async () => {
        setBackupListIsLoading(true);
        axiosInstance.get("/backups/")
            .then(response => {
                setBackupList(response.data);
            })
            .catch(error => toast.error(normalizeDjangoError(error)))
            .finally(() => {
                setBackupListIsLoading(false);
            })
    },[setBackupList])

    useEffect(() => {
        fetchBackups();
    }, [fetchBackups])

    const sendSetAccessToken = useCallback(() => {
        setAccessTokenIsSetting(true);
        axiosInstance.put('/backups/set-access-token/', {
            access_token: accessToken,
        }).then(response => {
            toast.success(t("Access token set successfully."));
        }).catch(error => toast.error(error))
            .finally(() => {
                setAccessTokenIsSetting(false);
            })
    }, [accessToken])

    const triggerBackup = useCallback(async () => {
        setIsMakingBackup(true);
        axiosInstance.post(`/backups/trigger/`, {})
            .then(response => {toast.success(t("Backup created successfully."))})
            .catch(error => toast.error(normalizeDjangoError(error)))
            .finally(() => {
                setIsMakingBackup(false);
            })
    }, [])

    return (
        <React.Fragment>
            <div className='page-content'>
                <ToastContainer closeButton={false} />
                <Container fluid>
                    <BreadCrumb title={t("Manage Backup")} pageTitle={t("Manage Backup")} />
                    <Card>
                        <CardHeader>{t("Access Token")}</CardHeader>
                        <CardBody>
                            <Row className="p-3">
                                <Col>
                                    <Input
                                        type={'text'}
                                        value={accessToken}
                                        onChange={(e) => setAccessToken(e.target.value)}
                                    />
                                </Col>
                                <Col>
                                    {accessTokenIsSetting &&
                                        <Spinner color={'primary'} size={'lg'} />
                                    }
                                    {!accessTokenIsSetting &&
                                        <Button disabled={accessTokenIsSetting} type="button" color="primary" onClick={sendSetAccessToken}>
                                        {t("Set access token")}
                                    </Button>}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>{t("Backup List")}</CardHeader>
                        <CardBody>
                            <Row>
                                <Table>
                                    <tbody>
                                    {backupListIsLoading && (
                                        <tr>
                                            <RectLoader />
                                        </tr>
                                    )}
                                    {!backupListIsLoading && backupList?.map((item: any, i: number) => (<tr key={i}>{item}</tr>))}
                                    </tbody>
                                </Table>
                                <Col>
                                    {backupListIsLoading &&
                                        <Spinner color="primary" size="lg" />
                                    }
                                    {!backupListIsLoading && <Button color={'primary'}
                                            disabled={backupListIsLoading}
                                            onClick={fetchBackups}>
                                        {t("Refresh")}

                                    </Button>}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>{t("Make backup")}</CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    {isMakingBackup && <Spinner size={'lg'} color={'primary'} />}
                                    {!isMakingBackup && <Button color={'primary'} disabled={isMakingBackup}
                                                                onClick={triggerBackup}>{t("Make backup")}</Button>}
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ManageBackup;