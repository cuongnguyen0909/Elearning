import { LinearProgress, CircularProgress, Backdrop } from '@mui/material';
import React from 'react';

type Props = {
    // isLoading: boolean;
};

const Loading: React.FC<Props> = (props) => {
    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: 9999998
            })}
            open={true}
            // onClick={(event: any) => {
            //     if (props.preventClick) {
            //         event.preventDefault();
            //     }
            // }}
        >
            <CircularProgress color="inherit" className="z-9999999" />
            {/* <LinearProgress className="z-9999999999" color="inherit" /> */}
        </Backdrop>
    );
};

export default Loading;
