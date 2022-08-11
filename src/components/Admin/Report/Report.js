import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../ej2-grid.css";
import clsx from "clsx";
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage } from "../../../uitilities/utilities";
import style from './Report.module.css';
import SectionTitle from "../../HomePage/SectionTitle/SectionTitle";
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';

import * as gregorian from 'cldr-data/main/vi/ca-gregorian.json';
import * as numbers from 'cldr-data/main/vi/numbers.json';
import * as timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import * as numberingSystems from 'cldr-data/supplemental/numberingSystems.json';
import * as weekData from 'cldr-data/supplemental/weekData.json';// To load the culture based first day of week
import { useReactToPrint } from 'react-to-print';
import SaleReportToPrint from "./SaleReportToPrint";
loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);
function Report(props) {
    useEffect(() => {
        removeSyncfusionLicenseMessage();
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user')
        }
    }, [])
    const fromDate = useRef();
    const toDate = useRef();

    const [selectedDates, setSelectedDates] = useState({});

    const linkExport = () => {
        try {
            setSelectedDates({
                ...selectedDates, 'from': fromDate.current.value.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            })
        } catch (e) {

        }
        try {
            setSelectedDates({
                ...selectedDates, 'to': toDate.current.value.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            })
        } catch (e) {

        }
console.log(selectedDates);
    }
    props.changeHeader('employee')
    const excel = () => {
        console.log(fromDate.current) //,toDate.current.value 
        axios.post('http://localhost:22081/api/NhanVien/report-sale', {
            method: 'GET',
            //             responseType: 'blob', // important
            'from': fromDate.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }),
            'to': toDate.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
        }).then((response) => {
            console.log(response);
            // var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // FileSaver.saveAs(blob, 'fixi.xlsx');
        });
    }
    L10n.load({
        'vi': {
            'datepicker': {
                placeholder: 'Chọn ngày',
                today: 'Hôm nay'
            }
        }
    });
    setCulture('vi')
const [data, setData] = useState(null);
    const print2 = () => {
        try {
            let to = toDate.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
            })
            let from = fromDate.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
            })
            console.log(`http://localhost:22081/api/NhanVien/report-sale?from=${from}&to=${to}`);
            axios
              .get(`http://localhost:22081/api/NhanVien/report-sale?from=${from}&to=${to}`)
              .then((res) => {
                const dataFromApi = res.data;
                console.log(dataFromApi);
                dataFromApi.TONG_DOANH_THU = dataFromApi.reduce((total, dat)=>{
                     return total + dat.TONG_TRI_GIA;
                 }, 0)
                 dataFromApi.fromDate = from;
                 dataFromApi.toDate = to;
                // console.log(cartsFromApi);
                setData(dataFromApi);
              });
          } catch (error) {
            console.error(error);
          }
    }
   

    return (
        <div >
            {data && <SaleReportToPrint data={data} setData={setData}/>}
           <SectionTitle title={"BÁO CÁO"} />

            <div className={clsx(style.reportContainer)}>
                <div>
                    <h1>Doanh thu theo tháng</h1>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Từ ngày:</label>
                        <DatePickerComponent onChange={() => {
                            linkExport();
                        }} ref={fromDate} format={'dd/MM/yyyy'} locale='vi' />
                    </div>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Tới ngày:</label>
                        <DatePickerComponent onChange={() => {
                            linkExport();
                        }} ref={toDate} format={'dd/MM/yyyy'} locale='vi' />
                    </div>
                    <button className={clsx(style.btnExport)} onClick={() => {
                        print2();
                    }}>Xuất file</button>
                    {/* {selectedDates?<a href={"http://localhost:22081/api/NhanVien/report-sale" +`?from=${selectedDates.from}&to=${selectedDates.to}`} download>Xuất File</a>:<></>} */}

                </div>

            </div>
        </div>
    );
}

export default Report;
