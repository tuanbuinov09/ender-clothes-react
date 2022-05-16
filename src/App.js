import './css/base.css';
import './css/main.css';
import './css/responsive.css';

import React from "react";
import { Modal } from './components/Modal/Modal';
import Main from './components/Main';
import { useSelector } from 'react-redux';
function App() {
  const { isOpen } = useSelector((store) => store.modal);
  return (
    <>
      {isOpen && <Modal />}
      <Main />
    </>

  );
}

export default App;
