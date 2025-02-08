import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

const CreateDirectCurrencyTransfer = () => {

    const [modal_backdrop, setmodal_backdrop] = useState<boolean>(true);
    
    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop);
    }
    
    return (<Modal
        isOpen={modal_backdrop}
        toggle={() => {
            tog_backdrop();
        }}
        backdrop={'static'}
        id="staticBackdrop"
        centered
    >
        <ModalHeader>
            <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
            <Button type="button" className="btn-close"
                onClick={() => {
                    setmodal_backdrop(false);
                }} aria-label="Close"></Button>
        </ModalHeader>
        <ModalBody className="text-center p-5">
            <i className="bx bx-party display-4 text-success"></i>
    
            <div className="mt-4">
                <h4 className="mb-3">You've made it!</h4>
            </div>
        </ModalBody>
    </Modal>)
}

export default CreateDirectCurrencyTransfer
