import React from 'react';
import { RxCross2 } from "react-icons/rx";

const Model = ({ isOpen, closeModal, title, children}) => {
    if(!isOpen)
        return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg p-8 w-1/3  '>
                <div className='flex justify-between mb-4'>
                    <h2 className='text-2xl font-bold'>{title}</h2>
                    <button
                        onClick={closeModal}
                        className='text-3xl'
                    >
                        <RxCross2 />
                    </button>
                </div>
                <div>{children}</div>   
            </div>
        </div>
    );
};

export default Model;