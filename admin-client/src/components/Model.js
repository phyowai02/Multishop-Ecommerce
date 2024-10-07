import React from 'react';

const Model = ({ isOpen, closeModal, title, children}) => {
    if(!isOpen)
        return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg p-8 w-1/3'>
                <h2 className='text-2xl font-bold mb-4'>{title}</h2>
                <div>{children}</div>
                <button
                    onClick={closeModal}
                    className='mt-4  px-4 py-2 font-semibold text-white bg-red-500 rounded-lg'
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Model;