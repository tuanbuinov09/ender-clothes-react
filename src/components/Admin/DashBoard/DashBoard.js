import React, { useEffect, useState } from "react";
import axios from "axios";
import "../ej2-grid.css";
import clsx from "clsx";
import { removeSyncfusionLicenseMessage } from "../../../uitilities/utilities";
import style from './DashBoard.module.css';
import DashBoardChart from "../Chart/DashBoardChart";
import OverAllStatistic from "../OverAllStatistic/OverAllStatistic";
import SectionTitle from "../../HomePage/SectionTitle/SectionTitle";
import DashBoardPieChartProductBuyCount from "../Chart/DashBoardChartProductBuyCount";
import DashBoardChartCategoryBuyCount from "../Chart/DashBoardChartCategoryBuyCount";
import DashBoardChartProfitOfCurrentQuarter from "../Chart/DashBoardChartProfitOfCurrentQuarter";

function DashBoard(props) {
  useEffect(() => {

    //khi unmount trả lại header
    return () => {
      props.changeHeader('user')
    }
  }, [])
  props.changeHeader('employee')

  return (
    <>
      <div className={clsx(style.dashBoardContainer)}>

        <SectionTitle title={"THỐNG KÊ TỔNG QUAN"} />
        <OverAllStatistic />
        <DashBoardChart />

      </div>


      <div className={clsx(style.bottomCharts)}>

        <div className={clsx(style.bottomChart, style.marginRight32)}>
          <div className={clsx(style.inner)}>
            <DashBoardChartCategoryBuyCount />

          </div>

        </div>
        <div className={clsx(style.bottomChart)}>
          <div className={clsx(style.inner)}>
            <DashBoardChartProfitOfCurrentQuarter />

          </div>

        </div>



      </div>
      <div className={clsx(style.bottomCharts)}>
        <div className={clsx(style.bottomChart, style.w100)}>
          <DashBoardPieChartProductBuyCount />
        </div>
      </div>
    </>

  );
}

export default DashBoard;
