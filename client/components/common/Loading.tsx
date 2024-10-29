import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

type Props = {
    isLoading: boolean;
    preventClick?: boolean;
};

const Loading: React.FC<Props> = (props) => {
    const { isLoading } = props;
    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1
            })}
            open={isLoading}
            // onClick={(event: any) => {
            //     if (props.preventClick) {
            //         event.preventDefault();
            //     }
            // }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Loading;
