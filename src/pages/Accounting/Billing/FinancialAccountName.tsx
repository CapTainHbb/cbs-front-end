import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import {FinancialAccount} from "../types";

interface Props {
    financialAccountId?: number;
}
const FinancialAccountName: React.FC<Props> = ({ financialAccountId }) => {
    const financialAccounts = useSelector((state: any) => state.InitialData.financialAccounts);

    const financialAccountName = useMemo(() => {
        return financialAccounts?.find((acc: FinancialAccount) => acc.id === financialAccountId)?.name;
    }, [financialAccounts, financialAccountId]);

    return (
        <span>{financialAccountName}</span>
    );
};

export default FinancialAccountName;