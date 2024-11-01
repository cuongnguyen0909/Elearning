import { LinearProgress } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

type Props = {
    // isLoading: boolean;
};

const Loading: React.FC<Props> = (props) => {
    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 1
            })}
            open={true}
            // onClick={(event: any) => {
            //     if (props.preventClick) {
            //         event.preventDefault();
            //     }
            // }}
        >
            <CircularProgress color="inherit" className="z-9999999999" />
            {/* <LinearProgress className="z-9999999999" color="inherit" /> */}
        </Backdrop>
    );
};

export default Loading;
