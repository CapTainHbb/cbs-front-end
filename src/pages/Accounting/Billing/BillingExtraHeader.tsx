import React, {useMemo} from 'react';
import {FinancialAccount} from "../types";
import {useSelector} from "react-redux";
import Select from "react-select";
import {Col, Row} from "reactstrap";
import FinancialAccountBalance from "../FinancialAccountBalance";

interface Props {
    financialAccount?: FinancialAccount;
    onChangeFinancialAccount?: any;
}

const BillingExtraHeader: React.FC<Props> = ({ financialAccount, onChangeFinancialAccount }) => {
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts);
    const options = useMemo(() => {
        return financialAccounts.map((item: FinancialAccount) => ({
            label: item?.full_name,
            value: item,
        }));
    }, [financialAccounts])

    return (
        <Row>
            <Col>
                <Select
                    options={options}
                    onChange={(item: any) => onChangeFinancialAccount(item?.value)}
                    value={options?.find((option: any) => option?.value?.id === financialAccount?.id)}
                    isClearable
                />
            </Col>
            <Col>
                <FinancialAccountBalance financialAccountId={financialAccount?.id} forceUpdate={true} />
            </Col>
        </Row>
    );
};

export default BillingExtraHeader;