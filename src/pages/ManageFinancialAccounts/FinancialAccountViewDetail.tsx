import React, {useEffect, useState} from 'react';
import {CurrencyAccount, FinancialAccount} from "../Accounting/types";
import {Card, CardBody, Modal, ModalBody, ModalHeader} from "reactstrap";
import {t} from "i18next";
import axiosInstance from "../../helpers/axios_instance";
import toast from "react-hot-toast";
import FinancialAccountBalance from "../Accounting/FinancialAccountBalance";

interface Props {
    financialAccount?: FinancialAccount | null;
    forceUpdate?: boolean;
}

const FinancialAccountViewDetail: React.FC<Props> = ({ financialAccount, forceUpdate }) => {

    const [currencyAccounts, setCurrencyAccounts] = useState<CurrencyAccount[]>([]);
    const [modal, setModal] = useState<boolean>(false);


    useEffect(() => {
        if(!financialAccount?.id) {
            setCurrencyAccounts([]);
            return;
        }
        axiosInstance.get(`/accounts/financial-accounts/${financialAccount.id}/currency-accounts/`)
            .then(response => {
                setCurrencyAccounts(response.data);
            }).catch(error => {
            toast.error(t("LoadCurrencyAccountFailed"))
        })
    }, [financialAccount, forceUpdate]);

    return (
        <Card id="financial-account-view-detail" >
            <Modal fade={true} isOpen={modal} toggle={() => setModal(false)} centered={true} >
                <ModalHeader className="bg-primary-subtle p-3"  toggle={() => setModal(false)}>
                    {t("Financial Account Balance")}
                </ModalHeader>
                <ModalBody>
                    <FinancialAccountBalance financialAccount={financialAccount}
                                             currencyAccounts={currencyAccounts} />
                </ModalBody>
            </Modal>
            <CardBody>
                <div className="table-responsive table-card">
                    <FinancialAccountBalance financialAccount={financialAccount}
                                             currencyAccounts={currencyAccounts}
                                             setModal={setModal} />
                </div>
            </CardBody>
        </Card>
    );
};

export default FinancialAccountViewDetail;