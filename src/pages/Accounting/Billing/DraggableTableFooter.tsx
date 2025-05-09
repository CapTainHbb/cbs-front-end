import React, {useEffect, useRef, useState, useCallback} from "react";
import ColorPicker from "../../../Components/Common/ColorPicker";
import {Button, Col, Row} from "reactstrap";
import {t} from "i18next";
import ReactDOM from "react-dom";
import SumOfSelectedRows from "../SumOfSelectedRows";
import {Party} from "../types";
import axiosInstance from "../../../helpers/axios_instance";
import { toast } from "react-toastify";


interface Props {
    updateRowColorApi?: string;
    footerComponent?: any;
    onCloseClicked?: any;
    selectedRows?: Party[];
}

const DraggableTableFooter: React.FC<Props> = ({ updateRowColorApi,
                                                   footerComponent,
                                                   onCloseClicked, selectedRows }) => {
    const footerRef = useRef(null);
    const [position, setPosition] = useState({ x: window.innerWidth / 2 - 400, y: window.innerHeight - 60 }); // Initial position centered horizontally & bottom
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: any) => {
        setDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: any) => {
            if (!dragging) return;
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y
            });
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        if (dragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset]);

    const handleColorSelected = useCallback((e: any) => {
        if(!updateRowColorApi || !selectedRows) return;
        
        let data = selectedRows?.map((row: Party) => ({
            color: e?.colorCode,
            party_id: row.id,
        }))
        axiosInstance.put(updateRowColorApi, data)
            .then(response => {
                toast.success(t("Successfully updated colors"));
                for(let i = 0; i < selectedRows?.length; i++) {
                    // @ts-ignore
                    selectedRows[i].highlight_color = e.colorCode;
                }
            })
            .catch(error => toast.error(t("Failed to update colors")));
    }, [selectedRows, updateRowColorApi]);

    // Render in a portal to make it fully independent of the parent
    return ReactDOM.createPortal(
        <div
            className="d-none d-md-block"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                position: "fixed",
                zIndex: 99,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                width: "%50"
            }}
        >
            <Row className="bg-primary rounded">
                <Col md={1} sm={1} >
                    <Button type={'button'} color={'primary'}
                            ref={footerRef}
                            data-tooltip-id="tooltip"
                            data-tooltip-content={t("Move")}
                            onMouseDown={handleMouseDown}
                            className="cursor-grab">
                        <i className="ri-drag-move-2-fill"></i>
                    </Button>
                </Col>
                <Col md={1} sm={1} onClick={onCloseClicked} className="cursor-pointer"
                     data-tooltip-id="tooltip"
                     data-tooltip-content={t("Close")}>
                    <Button type={'button'} color={'primary'}>
                        <i className="ri-close-circle-fill"></i>
                    </Button>
                </Col>
                <Col md={updateRowColorApi? 3: 4} sm={12}>
                    <Button type={'button'} color={'primary'} className={'w-xl'} >
                        {selectedRows?.length} {t("Rows Selected")}
                    </Button>
                </Col>
                <Col md={updateRowColorApi? 3: 4} sm={12}>
                    <SumOfSelectedRows selectedRows={selectedRows} />
                </Col>
                {updateRowColorApi && <Col md={4} sm={12}>
                    <ColorPicker onColorSelected={handleColorSelected} />
                </Col>}
            </Row>
        </div>,
        document.body
    );
};

export default DraggableTableFooter;
