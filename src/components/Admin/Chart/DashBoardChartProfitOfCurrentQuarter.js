
import { Chart, ChartSeries, ChartTooltip, ChartSeriesItemTooltip, ChartSeriesItem, ChartArea, ChartValueAxis, ChartValueAxisItem, ChartTitle, ChartLegend, ChartCategoryAxis, ChartCategoryAxisItem } from '@progress/kendo-react-charts';
import { useState, useEffect } from 'react';
import '@progress/kendo-theme-material/dist/all.css';
import clsx from 'clsx';
import axios from 'axios';
import style from './DashBoardChart.module.css'
import { REACT_APP_API_URL } from '../../../uitilities/CONSTANT';
function DashBoardChartProfitOfCurrentQuarter() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    try {
      console.log(`${REACT_APP_API_URL}/api/NhanVien/profit-current-quarter`);
      axios
        .get(`${REACT_APP_API_URL}/api/NhanVien/profit-current-quarter`)
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
    return data.THANG
  }));
  const seriesThu = chartData.map((data => {
    return data.TONG_DOANH_THU;
  }));
  const seriesNhap = chartData.map((data => {
    return data.TONG_GIA_NHAP;
  }));
  const seriesTra = chartData.map((data => {
    return data.TONG_GIA_TRA;
  }));
  const seriesLoiNhuan = chartData.map((data => {
    return data.TONG_LOI_NHUAN;
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
          <ChartTitle font="14pt sans-serif" text="LỢI NHUẬN TRONG QUÝ HIỆN TẠI" margin={28} color="#088699" />
          <ChartLegend position="bottom" visible={true} />
          <ChartCategoryAxis>
            <ChartCategoryAxisItem
              categories={categories}
            />
          </ChartCategoryAxis>
          <ChartSeries>
            <ChartSeriesItem type="line" data={seriesThu} name="Doanh Thu" />
            <ChartSeriesItem type="line" data={seriesNhap} name="Tiền nhập hàng" />
            <ChartSeriesItem type="line" data={seriesTra} name="Tiền trả hàng" />
            <ChartSeriesItem type="line" data={seriesLoiNhuan} name="Lợi nhuận" />
          </ChartSeries>

        </Chart>
        {/* <Chart>
          <ChartTooltip background='white' color='#333' />
          <ChartArea background="#fff" margin={8} />
          <ChartTitle font="14pt sans-serif" text="LỢI NHUẬN TRONG QUÝ HIỆN TẠI" margin={28} color="#088699" />
          <ChartLegend position="bottom" visible={true} />
          <ChartSeries>
            <ChartSeriesItem
              type="pie"
              data={series}
              field="value"
              categoryField="category"
              labels={{
                visible: true,
                content: labelContent,
              }}
            />
          </ChartSeries>
        </Chart> */}
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

export default DashBoardChartProfitOfCurrentQuarter;


