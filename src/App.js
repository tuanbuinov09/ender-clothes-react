import './css/base.css';
import './css/main.css';
import './css/responsive.css';

import React from "react";
import { Modal } from './components/Modal/Modal';
import Main from './components/Main';
import { useDispatch, useSelector } from 'react-redux';
function App() {
  const { isOpen } = useSelector((store) => store.modal);
  const dispatch = useDispatch();
  return (
    <>
      {isOpen && <Modal />}
      <Main />
    </>

  );
}

export default App;
