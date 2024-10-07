import React from 'react';

const Spinner = () => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center"
      style={{ zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    </div>
  );
};

export default Spinner;