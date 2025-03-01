import { t } from 'i18next';
import React, {useState} from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, Label, UncontrolledDropdown} from "reactstrap";

export interface Color {
    name: string;
    colorCode: string | null;
    colorClassName: string | undefined;
}

interface Props {
    onColorSelected: any;
}

const ColorPicker : React.FC<Props> = ({ onColorSelected }) => {
    const [selectedColor, setSelectedColor] = useState<Color>();

    const colors: Color[] = [
        { name: t('Red'), colorCode: '#ec9c9c' , colorClassName: 'badge bg-danger-subtle text-danger'},
        { name: t('Yellow'), colorCode: '#FEF08A', colorClassName: 'badge bg-warning-subtle text-warning'},
        { name: t('Green'), colorCode: '#acefc6', colorClassName: 'badge bg-success-subtle text-success' },
        { name: t('Blue'), colorCode: '#97cde4', colorClassName: 'badge bg-info-subtle text-info' },
        { name: t('Clear'), colorCode: '#ffffff', colorClassName: 'badge bg-light-subtle text-body'}
    ];


    const selectColor = (color: Color) => {
        setSelectedColor(color);
        onColorSelected?.(color);
    };

    return (
        <UncontrolledDropdown>
            <DropdownToggle color={'primary'}>
                <Label className={'cursor-pointer select-none'} >{t("Select Color For Row")}</Label>
                <i className={'mdi mdi-chevron-down'}></i>
            </DropdownToggle>
            <DropdownMenu>
                {colors.map((color, index) => (
                    <DropdownItem key={index} onClick={() => selectColor(color)}>
                        <span
                            className={color.colorClassName + " w-100"}
                            // style={{backgroundColor: color?.colorCode ? color.colorCode : "transparent"}}
                        >
                            {t(color.name)}
                      </span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </UncontrolledDropdown>
    );
};

export default ColorPicker;