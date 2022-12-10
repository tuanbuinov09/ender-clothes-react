import './css/base.css';
import './css/main.css';
import './css/responsive.css';

import React from "react";
import { Modal } from './components/Modal/Modal';
import Main from './components/Main';
import { useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadLocaleSyncfusion } from './uitilities/utilities';
function App() {
  const { isOpen } = useSelector((store) => store.modal);
  loadLocaleSyncfusion();
  return (
    <>
      {isOpen && <Modal />}
      <Main />
      <ToastContainer className="custom-toastify" />
    </>

  );
}

export default App;
