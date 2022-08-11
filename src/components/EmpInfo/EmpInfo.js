import React, { useEffect, useState } from 'react';
import style from './EmpInfo.module.css';
import clsx from 'clsx';
import { Button } from '../Button/Button';
import { PrintIcon, LogOutIcon } from '../../icons';
import { useNavigate } from 'react-router-dom';
import userImage from './128-1280406_view-user-icon-png-user-circle-icon-png.png';
function EmpInfo(props) {
    useEffect(() => {
        //khi unmount trả lại header
        return () => {
            props.changeHeader('user')
        }
    }, [])

    props.changeHeader('employee')
    const [errorMessage, setErrorMessage] = useState();
    const [userInfo, setUserInfo] = useState();
    const [shipInfo, setShipInfo] = useState({
        MA_NV:JSON.parse(localStorage.getItem('employee')).MA_NV,
        name1:JSON.parse(localStorage.getItem('employee')).HO_TEN,
        phone:JSON.parse(localStorage.getItem('employee')).SDT,
        email:JSON.parse(localStorage.getItem('employee')).EMAIL,
        address:JSON.parse(localStorage.getItem('employee')).DIA_CHI
    });
    let navigate = useNavigate();
    useEffect(()=>{
        // setUserInfo(JSON.parse(localStorage.getItem('user')));
        try{
            // setShipInfo()
        }catch(e){
            console.log(e);
        }
       
    },[]);
    const handleChange =(name, value)=> {
        if(name==='name1'){
            setShipInfo({...shipInfo, name1: value});
        }
        if(name==='phone'){
            setShipInfo({...shipInfo, phone: value});
        }
        if(name==='email'){
            setShipInfo({...shipInfo, email: value});
        }
        if(name==='address'){
            setShipInfo({...shipInfo, address: value});
        }
      }
    return (
        <div>
            {<div className={clsx(style.loginWrapper)}>
            <div className={clsx(style.left)}>
                <div className={clsx(style.userImageContainer)}><img className={clsx(style.userImage)} src={userImage} alt='employee'></img></div>
                
                <button className={clsx(style.checkButton, style.printButton, style.logOutBtn)} onClick={()=>{
                    localStorage.removeItem('employee');
                    navigate("/employee/login", { replace: true })
                }}><span className={clsx(style.iconSvg)}><LogOutIcon /></span>Đăng xuất</button>
            </div>
            <div className={clsx(style.right)}>
                    <><h1 className={clsx(style.title)}>THÔNG TIN NHÂN VIÊN</h1>
                        <form className={clsx(style.form)} onSubmit={(e) => {
                            e.preventDefault();
                            const shipInfo1 = {
                            'MA_NV':shipInfo.MA_NV,
                            'HO_TEN':shipInfo.name1,
                            'SDT':shipInfo.phone,
                            'EMAIL':shipInfo.email,
                            'DIA_CHI':shipInfo.address}
                            localStorage.removeItem('empInfo');
                            localStorage.setItem('empInfo', JSON.stringify(shipInfo1));
                            console.log(localStorage.getItem('empInfo', JSON.stringify(shipInfo1)));
                            navigate("/purchase", { replace: true });
                        }}>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Họ tên:</label>
                                <input onChange={(e) => {
                                    // setPassword(e.target.value.trim());
                                    handleChange("name1", e.target.value);
                                }} type="text" name='name1' /*value={password}*/ value={shipInfo?shipInfo.name1:""} placeholder="" className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Số điện thoại:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("phone", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo?shipInfo.phone:""} name='phone' className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Email:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("email", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/value={shipInfo?shipInfo.email:""} name='email' className={clsx(style.input)} />
                            </div>
                            <div className={clsx(style.inputGroup)}>
                                <label className={clsx(style.inputLabel)}>Địa chỉ:</label>
                                <input onChange={(e) => {
                                    // setEmail(e.target.value.trim());
                                    handleChange("address", e.target.value);
                                }} type="text" placeholder="" /*value={email}*/ value={shipInfo?shipInfo.address:""} name='address' className={clsx(style.input)} />
                            </div>
                            <p className={clsx(style.errorMessage)}>{errorMessage}</p>
                            <div className={clsx(style.inputGroup)}
                            onClick={(e)=>{
                                
                            }}>
                                {/* <Button text={"ĐẶT MUA"} /> */}
                            </div>
                        </form>
                    </>
                    </div>
        </div>}
        </div>
    );
}

export default EmpInfo;