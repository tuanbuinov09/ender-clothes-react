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
import { PrintIcon } from "../../../icons";
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
    const toDateProfit = useRef();

    const [selectedDates, setSelectedDates] = useState({});
    const [selectedDateProfit, setSelectedDateProfit] = useState({ 'type': 'day' });
    const [typeView, setTypeView] = useState('income');
    const linkExport = () => {
        setTypeView('income');
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
        setTypeView('profit');
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

        try {
            setSelectedDateProfit({
                ...selectedDateProfit, 'to': toDateProfit.current.value.toLocaleString('en-US', {
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
    setCulture('vi');
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
                .get(`http://localhost:22081/api/NhanVien/report-sale?from=${from}&to=${to}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                        }
                    })
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
            let to = toDateProfit.current.value.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
            })
            console.log(`http://localhost:22081/api/NhanVien/report-profit?from=${from}&to=${to}&type=${selectedDateProfit.type}`);
            axios
                .get(`http://localhost:22081/api/NhanVien/report-profit?from=${from}&to=${to}&type=${selectedDateProfit.type}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                        }
                    })
                .then((res) => {
                    const dataFromApi = res.data;
                    console.log(dataFromApi);
                    // do saleReportToPrint đang dùng tong_tri_gia làm cột doanh thu
                    dataFromApi.forEach(item => {
                        item.TONG_TRI_GIA = item.TONG_DOANH_THU;
                    })
                    dataFromApi.TONG_DOANH_THU = dataFromApi.reduce((total, dat) => {
                        return total + dat.TONG_DOANH_THU;
                    }, 0)
                    // dataFromApi.TONG_TRI_GIA = dataFromApi.TONG_DOANH_THU;
                    dataFromApi.TONG_GIA_NHAP = dataFromApi.reduce((total, dat) => {
                        return total + dat.TONG_GIA_NHAP;
                    }, 0)
                    dataFromApi.TONG_GIA_TRA = dataFromApi.reduce((total, dat) => {
                        return total + dat.TONG_GIA_TRA;
                    }, 0)
                    dataFromApi.TONG_LOI_NHUAN = dataFromApi.reduce((total, dat) => {
                        return total + dat.TONG_LOI_NHUAN;
                    }, 0)
                    dataFromApi.fromDate = fromDateProfit.current.value.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        // hour: '2-digit',
                        // minute: '2-digit',
                        // second: '2-digit',
                    })
                    dataFromApi.toDate = toDateProfit.current.value.toLocaleString('vi-VN', {
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

    return (
        <div >
            {data && <SaleReportToPrint data={data} setData={setData} type={selectedDateProfit.type} typeView={typeView} />}
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
                    <button className={clsx(style.btnExport, style.checkButton, style.printButton)} onClick={() => {
                        print2();
                    }}><span className={clsx(style.iconSvg)}><PrintIcon /></span>In báo cáo</button>
                    {/* {selectedDates?<a href={"http://localhost:22081/api/NhanVien/report-sale" +`?from=${selectedDates.from}&to=${selectedDates.to}`} download>Xuất File</a>:<></>} */}

                </div>

            </div>
            <div className={clsx(style.reportContainer)}>
                <div>
                    <h1>Lợi nhuận theo khoảng thời gian</h1>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Chọn loại báo cáo:</label>
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
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Từ ngày:</label>
                        <DatePickerComponent onChange={() => {
                            linkProfitExport();
                        }} ref={fromDateProfit} format={'dd/MM/yyyy'} locale='vi' />
                    </div>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Tới ngày:</label>
                        <DatePickerComponent onChange={() => {
                            linkProfitExport();
                        }} ref={toDateProfit} format={'dd/MM/yyyy'} locale='vi' />
                    </div>

                    <button className={clsx(style.btnExport, style.checkButton, style.printButton)} onClick={() => {
                        print3();
                    }}><span className={clsx(style.iconSvg)}><PrintIcon /></span>In báo cáo</button>
                    {/* {selectedDates?<a href={"http://localhost:22081/api/NhanVien/report-sale" +`?from=${selectedDates.from}&to=${selectedDates.to}`} download>Xuất File</a>:<></>} */}

                </div>

            </div>
        </div>
    );
}

export default Report;
