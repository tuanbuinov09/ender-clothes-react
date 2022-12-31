
import { Chart, ChartSeries, ChartTooltip, ChartSeriesItemTooltip, ChartSeriesItem, ChartArea, ChartValueAxis, ChartValueAxisItem, ChartTitle, ChartLegend, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import { useState, useEffect } from 'react';
import '@progress/kendo-theme-material/dist/all.css';
import clsx from 'clsx';
import axios from 'axios';
import style from './DashBoardChart.module.css'
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';
function DashBoardChartCategoryBuyCount() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    try {
      console.log(`${REACT_APP_API_URL}/api/NhanVien/category-buy-count?n=3&top=5`);
      axios
        .get(`${REACT_APP_API_URL}/api/NhanVien/category-buy-count?n=3&top=5`)
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
    return data.TEN_TL
  }));
  const series = chartData.map((data => {
    return { category: data.TEN_TL, value: data.SO_LUONG }
  }));
  // const series = chartData.map((data => {
  //   return data.SO_LUONG
  // }));
  const labelContent = (props) => {
    // let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
    //   style: "percent",
    //   minimumFractionDigits: 2,
    // });
    // return `${props.dataItem.category} years old: ${formatedNumber}`;
    console.log(props)
    return `${props.dataItem.category}: ${props.dataItem.value}`;
  };

  return (
    <div className={clsx(style.chartContainer)}>
      <div className={clsx(style.chart)}>
        <Chart>
          <ChartTooltip background='white' color='#333' />
          <ChartArea background="#fff" margin={8} />
          <ChartTitle font="14pt sans-serif" text="TOP 5 THỂ LOẠI BÁN CHẠY 3 THÁNG GẦN NHẤT" margin={28} color="#088699" />
          <ChartLegend position="bottom" visible={true} />
          <ChartSeries>
            <ChartSeriesItem
              type="pie"
              data={series}
              field="value"
              categoryField="category"
              labels={{
                // position: 'top',
                visible: true,
                content: labelContent,
              }}
            />
          </ChartSeries>
        </Chart>
        {/* <Chart >
          <ChartTooltip background='white' color='#333' />
          <ChartArea background="#fff" margin={28} />

          <ChartTitle font="14pt sans-serif" text="TOP 5 SẢN PHẨM BÁN CHẠY 3 THÁNG GẦN NHẤT" margin={0} color="#088699" />
          <ChartLegend position="top" orientation="horizontal" />
          <ChartSeries>
            <ChartSeriesItem color={"#088699"} data={series} />

          </ChartSeries>
          <ChartCategoryAxis>
            <ChartCategoryAxisItem categories={categories} />
          </ChartCategoryAxis>
          <ChartValueAxis>
            <ChartValueAxisItem />
          </ChartValueAxis>
        </Chart> */}

      </div>
    </div>
  );
}

export default DashBoardChartCategoryBuyCount;


