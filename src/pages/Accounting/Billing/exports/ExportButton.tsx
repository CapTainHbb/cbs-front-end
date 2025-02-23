import React from 'react';
import {Button, Spinner} from "reactstrap";

interface Props {
    isGenerating: boolean;
    onClick: any;
    disabled: boolean;
    text: string;
}

const ExportButton: React.FC<Props> = ({ isGenerating, onClick, disabled, text }) => {
    return (
        <Button color='primary' className={'w-100 my-1'}
                onClick={onClick}
                disabled={disabled}
        >
            {isGenerating && <Spinner size={'sm'} />}
            {!isGenerating && <><i className='ri-printer-line' /> <span>{text}</span></>}

        </Button>
    );
};

export default ExportButton;