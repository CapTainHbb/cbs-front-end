import React, {useState} from 'react';
import {Currency, PartyType} from "./utils";
import {partyTypeOptions} from "./CreditorsAndDebtors";
import {Label} from "reactstrap";
import Select from "react-select";


interface Props {
    currency?: Currency;
    setCurrency: any;
    partyType?: PartyType;
    setPartyType: any;
}

const SingleOptions = [
    { value: 'creditor', label: 'Creditor' },
    { value: 'debtor', label: 'Debtor' },
];

const CreditorsAndDebtorsExtraHeader: React.FC<Props> = ({
                                                             currency, setCurrency, partyType, setPartyType
                                                         }) => {
    const [selectedReportType, setSelectedReportType] = useState<any>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<any>(null);

    return (
        <div className="d-flex w-100 h-100 justify-content-evenly align-items-center">
            <div className="mb-3">
                <Label htmlFor="choices-single-default" className="form-label text-muted">Report Type</Label>
                <Select
                    value={selectedReportType}
                    onChange={(selectedSingle: any) => {
                        setSelectedReportType(selectedSingle);
                    }}
                    options={SingleOptions}
                />
            </div>
            <div className="mb-3">
                <Label htmlFor="choices-single-default" className="form-label text-muted">Currency Type</Label>
                <Select
                    value={selectedCurrency}
                    onChange={(selectedSingle: any) => {
                        setSelectedCurrency(selectedSingle);
                    }}
                    options={SingleOptions}
                />
            </div>
        </div>
    );
};

export default CreditorsAndDebtorsExtraHeader;