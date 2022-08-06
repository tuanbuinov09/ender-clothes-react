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
    props.changeHeader('employee')
    const excel = () => {
        console.log(fromDate.current) //,toDate.current.value 
        return
        axios.post('http://localhost:22081/api/NhanVien/report-sale', {
            method: 'GET',
            responseType: 'blob', // important
            'from':fromDate.current.value,
            'to':toDate.current.value 
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
        });
    }
    L10n.load({
        'vi': {
            'datepicker': { placeholder: 'Chọn ngày',
             today: 'Hôm nay' }
        }
        });
    return (
        <div >

            <SectionTitle title={"BÁO CÁO"} />

            <div className={clsx(style.reportContainer)}>
                <div>
                    <h1>Doanh thu theo tháng</h1>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Từ ngày:</label>
                        <DatePickerComponent ref={fromDate} format={'dd/MM/yyyy'} locale='vi'/>
                    </div>
                    <div className={clsx(style.datePickerContainer)}>
                        <label>Tới ngày:</label>
                        <DatePickerComponent ref={toDate} format={'dd/MM/yyyy'} locale='vi'/>
                    </div>
                    <button onClick={() => {
                        excel();
                    }}>Xuất file</button>
                </div>


            </div>
        </div>
    );
}

export default Report;
