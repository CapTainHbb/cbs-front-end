import React from "react";
import { Modal, ModalBody } from "reactstrap";
import {t} from "i18next";

interface Props {
  show ?: boolean;
  onConfirmClick ?: () => void;
  onCloseClick ?: () => void;
  isConfirm?: boolean;
  recordId?: string;
}

const ConfirmModal: React.FC<Props> = ({ show, onConfirmClick, 
  isConfirm = true,
  onCloseClick }) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className={`${isConfirm? "" : "ri-delete-bin-line"} display-5 text-danger`}></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{t("Are you sure?")}</h4>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            {t("Close")}
          </button>
          <button
            type="button"
            className="btn w-sm btn-danger "
            id="delete-record"
            onClick={onConfirmClick}
          >
            {isConfirm? t("Yes, Do It"): t("Yes, Delete It")}
          </button>
        </div>
      </ModalBody>
    </Modal>
  ) as unknown as JSX.Element;
};

export default ConfirmModal;