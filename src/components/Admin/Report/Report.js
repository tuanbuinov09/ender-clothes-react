import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../ej2-grid.css";
import clsx from "clsx";
import { loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from "../../../uitilities/utilities";
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
import '../ej2-grid.css'
import SaleReportToPrint from "./SaleReportToPrint";
import { useNavigate } from 'react-router-dom';

loadCldr(numberingSystems, gregorian, numbers, timeZoneNames, weekData);

function Report(props) {
    let navigate = useNavigate();
    setupInterceptors(navigate, 'employee');
    useEffect(() => {
        removeSyncfusionLicenseMessage();
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user')
        }
    }, [])
    const fromDate = useRef();
    const toDate = useRef();
    const fromDateProfit = useRef();

    const [selectedDates, setSelectedDates] = useState({});
    const [selectedDateProfit, setSelectedDateProfit] = useState({ 'type': 'day' });

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
    const linkProfitExport = () => {
        try {
            setSelectedDateProfit({
                ...selectedDateProfit, 'from': fromDateProfit.current.value.toLocaleString('en-US', {
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

        console.log(selectedDateProfit);
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
        },
            {
                headers: {
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                }
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
                    dataFromApi.TONG_DOANH_THU = dataFromApi.reduce((total, dat) => {
                        return total + dat.TONG_TRI_GIA;
                    }, 0)
                    dataFromApi.fromDate = fromDate.current.value.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // second: '2-digit',
                    })
                    dataFromApi.toDate = toDate.current.value.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // second: '2-digit',
                    })
                    // console.log(cartsFromApi);
                    setData(dataFromApi);
                });
        } catch (error) {
            console.error(error);
        }
    }

    const print3 = () => {
        try {

            let from = fromDateProfit.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
            })
            console.log(`http://localhost:22081/api/NhanVien/report-profit?from=${from}&type=${selectedDateProfit.type}`);
            axios
                .get(`http://localhost:22081/api/NhanVien/report-profit?from=${from}&type=${selectedDateProfit.type}`)
                .then((res) => {
                    // const dataFromApi = res.data;
                    // console.log(dataFromApi);
                    // dataFromApi.TONG_DOANH_THU = dataFromApi.reduce((total, dat) => {
                    //     return total + dat.TONG_TRI_GIA;
                    // }, 0)
                    // dataFromApi.fromDate = fromDate.current.value.toLocaleString('vi-VN', {
                    //     year: 'numeric',
                    //     month: '2-digit',
                    //     day: '2-digit',
                    //     // hour: '2-digit',
                    //     // minute: '2-digit',
                    //     // second: '2-digit',
                    // })
                    // dataFromApi.toDate = toDate.current.value.toLocaleString('vi-VN', {
                    //     year: 'numeric',
                    //     month: '2-digit',
                    //     day: '2-digit',
                    //     // hour: '2-digit',
                    //     // minute: '2-digit',
                    //     // second: '2-digit',
                    // })
                    // // console.log(cartsFromApi);
                    // setData(dataFromApi);
                });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div >
            {data && <SaleReportToPrint data={data} setData={setData} />}
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
                    }}>In báo cáo</button>
                    {/* {selectedDates?<a href={"http://localhost:22081/api/NhanVien/report-sale" +`?from=${selectedDates.from}&to=${selectedDates.to}`} download>Xuất File</a>:<></>} */}

                </div>

            </div>
            <div className={clsx(style.reportContainer)}>
                <div>
                    <h1>Lợi nhuận theo khoảng thời gian</h1>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Chọn ngày:</label>
                        <DatePickerComponent onChange={() => {
                            linkProfitExport();
                        }} ref={fromDateProfit} format={'dd/MM/yyyy'} locale='vi' />
                    </div>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Chọn khoảng thời gian:</label>
                        <div className={clsx(style.radioButtonsContainer)}>
                            <input type={'radio'} checked={selectedDateProfit.type === 'day'} name='typeExport' value={'day'} onChange={e => {
                                setSelectedDateProfit({ ...selectedDateProfit, 'type': 'day' });
                            }} id='r1' />
                            <label for="r1"> Theo ngày</label>

                            <input type={'radio'} checked={selectedDateProfit.type === 'month'} name='typeExport' value={'month'} onChange={e => {
                                setSelectedDateProfit({ ...selectedDateProfit, 'type': 'month' });
                            }} id='r2' />
                            <label for="r2"> Theo tháng</label>

                            <input type={'radio'} checked={selectedDateProfit.type === 'quarter'} name='typeExport' value={'quarter'} onChange={e => {
                                setSelectedDateProfit({ ...selectedDateProfit, 'type': 'quarter' });
                            }} id='r3' />
                            <label for="r3"> Theo quý</label>

                            <input type={'radio'} checked={selectedDateProfit.type === 'year'} name='typeExport' value={'year'} onChange={e => {
                                setSelectedDateProfit({ ...selectedDateProfit, 'type': 'year' });
                            }} id='r4' />
                            <label for="r4"> Theo năm</label>

                        </div>

                    </div>
                    <button className={clsx(style.btnExport)} onClick={() => {
                        print3();
                    }}>In báo cáo</button>
                    {/* {selectedDates?<a href={"http://localhost:22081/api/NhanVien/report-sale" +`?from=${selectedDates.from}&to=${selectedDates.to}`} download>Xuất File</a>:<></>} */}

                </div>

            </div>
        </div>
    );
}

export default Report;
