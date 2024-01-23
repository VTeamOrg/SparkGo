import React, { useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';

const Scanner = () => {

    return (
        <div className="flex items-center content-center h-full">
            <QrScanner
                containerStyle={{ width: '100%', height: '100%', position: 'unset', padding: '0px' }}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'cover', position: 'unset' }}
                onDecode={(result) => console.log(result)}
                onError={(error) => console.log(error?.message)}
            />
        </div>
    );
};

export default Scanner;
