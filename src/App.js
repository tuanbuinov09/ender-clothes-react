import './css/base.css';
import './css/main.css';
import './css/responsive.css';

import React from "react";
import { Modal } from './components/Modal/Modal';
import Main from './components/Main';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
function App() {
  const { isOpen } = useSelector((store) => store.modal);
  return (
    <>
      {isOpen && <Modal />}
      <Main />
      {/* <ToastContainer /> */}
    </>

  );
}

export default App;
