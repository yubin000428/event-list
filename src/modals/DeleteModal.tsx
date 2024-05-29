import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface DeleteModalProps {
  onDelete: () => void;
  buttonColor?: string;
}

function DeleteModal({ onDelete, buttonColor = 'red' }: DeleteModalProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = () => {
        onDelete(); // 삭제 함수 호출
        setShow(false); // 모달 닫기
    };

    return (
        <div>
            <Button className={`btn ${buttonColor}`} onClick={handleShow}>삭제</Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                  <Modal.Title>삭제</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말 삭제하시겠습니까 ?</Modal.Body>
                <Modal.Footer>
                  <Button 
                  className="btn_close" 
                  variant="secondary" 
                  onClick={handleClose}
                  >아니요</Button>
                  <Button 
                  variant="primary"
                  onClick={handleDelete}
                  >네, 삭제하겠습니다</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteModal;
