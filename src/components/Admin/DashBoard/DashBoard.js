import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ej2-grid.css";
import clsx from "clsx";
import { removeSyncfusionLicenseMessage } from "../../../uitilities/utilities";
import style from './DashBoard.module.css';
import DashBoardChart from "../Chart/DashBoardChart";
import OverAllStatistic from "../OverAllStatistic/OverAllStatistic";
import SectionTitle from "../../HomePage/SectionTitle/SectionTitle";

function DashBoard(props) {
  useEffect(()=>{

    //khi unmount trả lại header
    return ()=>{
      props.changeHeader('user')
    }
  }, [])
  props.changeHeader('employee')
  
  return (
    <div className={clsx(style.dashBoardContainer)}>

      <SectionTitle title={"THỐNG KÊ"}/>
      <OverAllStatistic/>
      <DashBoardChart />
    </div>
  );
}

export default DashBoard;
