
import { Chart, ChartSeries,ChartTooltip, ChartSeriesItemTooltip, ChartSeriesItem, ChartArea, ChartValueAxis, ChartValueAxisItem, ChartTitle, ChartLegend, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import { useState, useEffect } from 'react';
import '@progress/kendo-theme-material/dist/all.css';
import clsx from 'clsx';
import axios from 'axios';
import style from './DashBoardChart.module.css'
function DashBoardChart() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    try {
      console.log(`http://localhost:22081/api/NhanVien/dashboardchart?n=${7}`);
      axios
        .get(`http://localhost:22081/api/NhanVien/dashboardchart?n=${7}`)
        .then((res) => {
          const dataFromApi = res.data;
          console.log(dataFromApi);
          // console.log(cartsFromApi);
          setChartData(dataFromApi);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);
  const categories = chartData.map((data => {
    return data.NGAY_STR
  }));
  const series = chartData.map((data => {
    return data.TONG_TRI_GIA
  }));

  return (
    <div className={clsx(style.chartContainer)}>
    <div className={clsx(style.chart)}>
    <Chart >
      <ChartTooltip background='white' color='#333' />
      <ChartArea background="#fff" margin={28}  />
      <ChartTitle font="20pt sans-serif" text={"DOANH THU CỬA HÀNG TRONG 7 NGÀY GẦN NHẤT"} 
      />
      <ChartSeries>
        <ChartSeriesItem color={"#088699"} data={series} /*name="Doanh Thu (VND)" */ />
        
      </ChartSeries>
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories} />
      </ChartCategoryAxis>
      <ChartValueAxis>
        <ChartValueAxisItem />
      </ChartValueAxis>
    </Chart></div>
    </div>
  );
}

export default DashBoardChart;


