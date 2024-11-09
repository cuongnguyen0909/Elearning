import React from 'react';
import { Modal, Box, Button } from '@mui/material';

type Props = {
    title: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    message: string;
    onConfirm: () => void;
};

const ConfirmationModal: React.FC<Props> = ({ open, title, setOpen, message, onConfirm }) => {
    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="confirmation-modal-title"
            aria-describedby="confirmation-modal-description"
        >
            <Box className="absolute left-[50%] top-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                <h2 id="confirmation-modal-title" className="text-lg font-bold">
                    {title}
                </h2>
                <p id="confirmation-modal-description" className="mt-2">
                    {message}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outlined" onClick={handleClose}>
                        No
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            onConfirm();
                            handleClose();
                        }}
                    >
                        Agree
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;
