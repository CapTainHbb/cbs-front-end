import React from 'react';
import {Label} from "reactstrap";
import {t} from "i18next";

interface Props {
    checked: boolean;
    setChecked: any;
}

const GeneralLedgerExtraHeader: React.FC<Props> = ({ checked, setChecked }) => {
    return (
        <React.Fragment>
            <div className="d-flex gap-3">
                <input type={"checkbox"} className={'form-check-input'}
                       checked={checked}
                       onChange={(e) => setChecked(e.target.checked)} />
                <Label>{t("Hide Small Amounts")}</Label>
            </div>
        </React.Fragment>
    );
};

export default GeneralLedgerExtraHeader;