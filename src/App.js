import './css/base.css';
import './css/main.css';
import './css/responsive.css';

import React from "react";
import { Modal } from './components/Modal/Modal';
import Main from './components/Main';
function App() {
  return (
    <>
      <Modal />
      <Main />
    </>

  );
}

export default App;
