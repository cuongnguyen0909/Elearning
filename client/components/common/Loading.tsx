import { LinearProgress, CircularProgress, Backdrop } from '@mui/material';
import React from 'react';

type Props = {};

const Loading: React.FC<Props> = (props) => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: '#fff',
        zIndex: 9999998
      })}
      open={true}
    >
      <CircularProgress color="inherit" className="z-9999999" />
    </Backdrop>
  );
};

export default Loading;
