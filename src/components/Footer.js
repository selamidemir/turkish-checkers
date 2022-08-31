import React from 'react';
import CurrentGamer from './CurrentGamer';
import ResetGame from './ResetGame';

function Footer() {
  return (
    <div className='footer'>
      <CurrentGamer />
      <ResetGame />
    </div>
  );
}

export default Footer;