import React, { useState } from 'react';

const BatteryComponent = ({ level }) => {

    return (
        <div className="h-7 w-4 flex flex-col items-center relative">
            <div className=' h-1 w-2 bg-gray-300 overflow-hidden'></div>
            <div className="bg-gray-300 h-full w-full relative rounded-sm">
                <div
                    className="bg-primary rounded-sm w-full absolute bottom-0"
                    style={{ height: `${level}%` }}
                ></div>
            </div>
        </div>
    );
};

export default BatteryComponent;
