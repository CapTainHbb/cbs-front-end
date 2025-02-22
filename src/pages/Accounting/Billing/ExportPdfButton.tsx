import React from 'react';
import {t} from "i18next";
import {Button, Spinner} from "reactstrap";

interface Props {
    isGenerating: boolean;
    onClick: any;
    disabled: boolean;
}

const ExportPdfButton: React.FC<Props> = ({ isGenerating, onClick, disabled }) => {
    return (
        <Button color='primary' className={'w-100 my-1'}
                onClick={onClick}
                disabled={disabled}
        >
            {isGenerating && <Spinner size={'sm'} />}
            {!isGenerating && <><i className='ri-printer-line' /> <span>{t("Print Billing")}</span></>}

        </Button>
    );
};

export default ExportPdfButton;