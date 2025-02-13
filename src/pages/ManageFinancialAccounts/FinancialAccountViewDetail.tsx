import React, {useEffect, useState} from 'react';
import {CurrencyAccount, FinancialAccount} from "../Accounting/types";
import {Card, CardBody, Modal, ModalBody, ModalHeader} from "reactstrap";
import {t} from "i18next";
import axiosInstance from "../../helpers/axios_instance";
import toast from "react-hot-toast";
import FinancialAccountBalance from "../Accounting/FinancialAccountBalance";

interface Props {
    financialAccountId?: number | null;
    forceUpdate?: boolean;
}

const FinancialAccountViewDetail: React.FC<Props> = ({ financialAccountId, forceUpdate }) => {

    const [currencyAccounts, setCurrencyAccounts] = useState<CurrencyAccount[]>([]);
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        if(!financialAccountId) {
            setCurrencyAccounts([]);
            return;
        }
        axiosInstance.get(`/accounts/financial-accounts/${financialAccountId}/currency-accounts/`)
            .then(response => {
                setCurrencyAccounts(response.data);
            }).catch(error => {
            toast.error(t("LoadCurrencyAccountFailed"))
        })
    }, [financialAccountId, forceUpdate]);

    return (
        <Card id="financial-account-view-detail" >
            <Modal fade={true} isOpen={modal} toggle={() => setModal(false)} centered={true} >
                <ModalHeader className="bg-primary-subtle p-3"  toggle={() => setModal(false)}>
                    {t("Financial Account Balance")}
                </ModalHeader>
                <ModalBody>
                    <FinancialAccountBalance financialAccountId={financialAccountId}
                                             currencyAccounts={currencyAccounts} />
                </ModalBody>
            </Modal>
            <CardBody>
                <div className="table-responsive table-card">
                    <FinancialAccountBalance financialAccountId={financialAccountId}
                                             currencyAccounts={currencyAccounts}
                                             setModal={setModal} />
                </div>
            </CardBody>
        </Card>
    );
};

export default FinancialAccountViewDetail;