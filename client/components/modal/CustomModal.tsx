import React from 'react';
import { Modal, Box } from '@mui/material';
type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem?: any;
    component: any;
    setRoute?: (route: string) => void;
};

const CustomModal: React.FC<Props> = (props) => {
    const { open, setOpen, activeItem, component: Component, setRoute } = props;
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="absolute left-[50%] top-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-4 shadow outline-none dark:bg-slate-900">
                <Component setOpen={setOpen} setRoute={setRoute} />
            </Box>
        </Modal>
    );
};

export default CustomModal;
