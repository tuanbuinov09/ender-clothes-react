import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import style from './ProductImportEdit.module.css';
import clsx from 'clsx';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { intToVNDCurrencyFormat, loadLocaleSyncfusion, removeSyncfusionLicenseMessage, setupInterceptors } from '../../../uitilities/utilities';
import { XIcon, CheckIcon, SaveIcon, PrintIcon } from '../../../icons';
import { toast } from 'react-toastify';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { ColumnChooser, ColumnDirective, ColumnsDirective, GridComponent, Inject, Page, Sort, Filter, Group, Edit, Toolbar, dataReady } from '@syncfusion/ej2-react-grids';
import LoadingAnimation from '../../LoadingAnimation/LoadingAnimation';
function ProductImportEdit(props) {
    console.log('dredner')
    let navigate = useNavigate();

    setupInterceptors(navigate, 'employee');

    //const params = useParams(); prams.cartId
    console.log(props.importId, props.viewMode);
    // const notify = (message) => toast.error(message, { autoClose: true, closeDuration: 3000 });//error/info/add

    const [flag, setFlag] = useState(false);

    const [products, setProducts] = useState([]);
    const [productDetailsForImport, setProductDetailsForImport] = useState([]);

    const [errorMessage, setErrorMessage] = useState({ errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorHINH_ANH_CHITIET: "", errorHINH_ANH_CHUNG: "" });
    const [isLoading, setIsLoading] = useState(false);

    const [importProductEntity, setImportProductEntity] = useState({ MA_NV: "", GHI_CHU: "", NGAY_TAO: "", chiTietPhieuNhap: [] });

    removeSyncfusionLicenseMessage();

    const productDropdownList = useRef();

    const datePicker = useRef();
    const grid = useRef()
    let editOptions, toolbarOptions;
    editOptions = { /*allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Dialog' */ };

    //vì không thể set sẵn các sản phẩm đã chọn trên trang khác của grid, nên khi chỉnh sửa, xem chi tiết k phân trang
    let pageSettings = { pageSize: props.viewMode === 'add' ? 8 : 10000 };
    let filterOptions = {
        // type: 'Menu' // default là input
        type: 'Excel'
    };
    let selectionSettings = {
        type: 'Multiple',
        // checkboxMode: 'ResetOnRowClick'
        persistSelection: true //sang trang khác k bị mất selection
    }
    let tooltip;
    const beforeRender = (args) => {
        // event triggered before render the tooltip on target element.
        tooltip.current.content = args.target.closest("td").innerText;
    }
    beforeRender.bind(this);
    // toolbarOptions = ['Add', 'Edit', 'Delete', 'Update', 'Cancel'];
    // toolbarOptions = ['Edit', 'Update', 'Cancel'];
    toolbarOptions = ['ColumnChooser'];


    const onChangeProduct = (e) => {
        setIsLoading(true);
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        setErrorMessage(tmpErrorMsg);
        axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${productDropdownList.current.value}`).then(res => {
            // console.log('dt for import: ', res.data)
            res.data.forEach(item => {
                item.GIA = 0;
                item.SO_LUONG = 0;
                item.errorGIA_NHAP = "";
                item.errorSO_LUONG = "";
            })

            let a = res.data.map(item => {
                return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA }
            });
            console.log(a);
            setProductDetailsForImport(res.data);
            setImportProductEntity({ ...importProductEntity, chiTietPhieuNhap: a })
            setIsLoading(false);
        })
    }

    const rowSelected = () => {
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            // setSelectedCart(JSON.parse(JSON.stringify(selectedrecords[0])));
        }
    }

    const [productDetailsForImport__2, setProductDetailsForImport__2] = useState([]);
    const selectProducts = async () => {
        setErrorMessage({ ...errorMessage, errorSAN_PHAM_ALL: '' })
        if (grid) {
            /** Get the selected row indexes */
            const selectedrowindex = grid.current.getSelectedRowIndexes();
            /** Get the selected records. */
            const selectedrecords = grid.current.getSelectedRecords();

            console.log('selected records: ', selectedrecords)
            setIsLoading(true);
            const temp = [];

            for (var i = 0; i < selectedrecords.length; i++) {
                const maSP = selectedrecords[i].MA_SP;
                const productInDetailForImport2 = productDetailsForImport__2.find(pd2 => {
                    return pd2.MA_SP === maSP;
                })

                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${selectedrecords[i].MA_SP}`);
                if (productInDetailForImport2) {
                    res.data.forEach(ctpn => {
                        const ctpnOfProdOfImport2 = productInDetailForImport2.chiTietPhieuNhap.find(ctpn2 => ctpn2.MA_CT_SP === ctpn.MA_CT_SP);
                        if (ctpnOfProdOfImport2) {
                            ctpn.GIA = ctpnOfProdOfImport2.GIA;
                            ctpn.SO_LUONG = ctpnOfProdOfImport2.SO_LUONG;
                            ctpn.errorGIA_NHAP = "";
                            ctpn.errorSO_LUONG = "";
                        } else {
                            ctpn.GIA = 0;
                            ctpn.SO_LUONG = 0;
                            ctpn.errorGIA_NHAP = "";
                            ctpn.errorSO_LUONG = "";
                        }

                    })

                } else {
                    res.data.forEach(ctpn => {

                        ctpn.GIA = 0;
                        ctpn.SO_LUONG = 0;
                        ctpn.errorGIA_NHAP = "";
                        ctpn.errorSO_LUONG = "";
                    })
                }

                let b = res.data.map(ctpn => {
                    return { MA_CT_SP: ctpn.MA_CT_SP, SO_LUONG: ctpn.SO_LUONG, GIA: ctpn.GIA, TEN_SIZE: ctpn.TEN_SIZE, TEN_MAU: ctpn.TEN_MAU }
                });

                temp.push({ ...selectedrecords[i], chiTietPhieuNhap: b });
                // setImportProductEntity({ ...importProductEntity, chiTietPhieuNhap: a })
            }
            setProductDetailsForImport__2(temp);
            setIsLoading(false);

        }
    }
    console.log('rerrrrrrrrrr: ', productDetailsForImport__2)
    useEffect(() => {
        if (!JSON.parse(localStorage.getItem('employee')) || !JSON.parse(localStorage.getItem('employee')).MA_NV || JSON.parse(localStorage.getItem('employee')).MA_QUYEN === 'Q04') {
            toast.error("Hãy đăng nhập với tài khoản đủ thẩm quyền để thao tác");
            navigate("/employee/login", true);
        }
        setIsLoading(true);

        try {

            let url = `${process.env.REACT_APP_API_URL}/api/SanPham/all?top=`;

            console.log(url)
            axios.get(url).then(res => {
                const productsFromAPI = res.data;
                // console.log(productsFromAPI);
                productsFromAPI.forEach((item) => {
                    if (item.NGAY_TAO) {
                        let date = new Date(item.NGAY_TAO);
                        item.NGAY_TAO = date.toLocaleDateString('vi-VN');
                    }
                    if (item.SIZE_STR) {
                        item.SIZE_STR = item.SIZE_STR.substr(1)
                    }
                    let a = item.MA_SP + ' - ' + item.TEN_SP
                    item.TEN_SP_STR = a;

                })
                console.log(productsFromAPI);

                setProducts(productsFromAPI);
                setIsLoading(false);
                // console.log(productsFromAPI);
                // grid.current.dataSource = productsFromAPI;

                setFlag(true);
                grid.current.dataSource = productsFromAPI;
                if (props.viewMode === 'add') {
                    console.log(datePicker)
                    datePicker.current.value = new Date();
                } else {

                    getImport();
                }
            });
        } catch (e) {
            console.log(e);
        }
    }, [])

    const getImport = async () => {
        setIsLoading(true);
        let url = `${process.env.REACT_APP_API_URL}/api/NhapHang/?importId=${props.importId}`;
        const res = await axios.get(url);


        console.log(res.data)
        const importEntityFromApi = res.data;
        setImportProductEntity(importEntityFromApi);
        datePicker.current.value = importEntityFromApi.NGAY_TAO;

        // productDropdownList.current.value = importEntityFromApi.MA_SP;

        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "" };
        setErrorMessage(tmpErrorMsg);

        const old_MA_SPs = importEntityFromApi.MA_SP.split(', ');
        const old_TEN_SPs = importEntityFromApi.TEN_SP.split(', ');


        let temp = [];
        for (var i = 0; i < old_MA_SPs.length; i++) {
            let product = { MA_SP: old_MA_SPs[i], TEN_SP: old_TEN_SPs[i], chiTietPhieuNhap: [] };

            const detailForImportByProductIdFromAPI = await axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${product.MA_SP}`);
            detailForImportByProductIdFromAPI.data.forEach(ctpn => {
                const ctpnOfProdOfImport2 = importEntityFromApi.chiTietPhieuNhap.find(ctpn2 => ctpn2.MA_CT_SP === ctpn.MA_CT_SP);
                if (ctpnOfProdOfImport2) {
                    ctpn.GIA = ctpnOfProdOfImport2.GIA;
                    ctpn.SO_LUONG = ctpnOfProdOfImport2.SO_LUONG;
                    ctpn.errorGIA_NHAP = "";
                    ctpn.errorSO_LUONG = "";
                } else {
                    ctpn.GIA = 0;
                    ctpn.SO_LUONG = 0;
                    ctpn.errorGIA_NHAP = "";
                    ctpn.errorSO_LUONG = "";
                }
            })

            let b = detailForImportByProductIdFromAPI.data.map(ctpn => {
                return { MA_CT_SP: ctpn.MA_CT_SP, SO_LUONG: ctpn.SO_LUONG, GIA: ctpn.GIA, TEN_SIZE: ctpn.TEN_SIZE, TEN_MAU: ctpn.TEN_MAU }
            });

            temp.push({ ...product, chiTietPhieuNhap: b });
        }
        let gridData = grid.current.dataSource;
        let selectedIndexes = gridData.map((gridDataItem, index) => {
            const product = old_MA_SPs.find(masp => {
                return masp === gridDataItem.MA_SP
            })
            if (product) {
                return index;
            }
        })
        selectedIndexes = selectedIndexes.filter(item => {
            return item !== undefined;
        })
        console.log(selectedIndexes, 'selected rowindexés');

        grid.current.selectRows(selectedIndexes);
        setProductDetailsForImport__2(temp);
        setIsLoading(false);

        // axios.get(`${process.env.REACT_APP_API_URL}/api/SanPham/detail-for-import?productId=${importEntityFromApi.MA_SP}`).then(res => {
        //     // console.log('dt for import: ', res.data)
        //     res.data.forEach(item => {
        //         const a = importEntityFromApi.chiTietPhieuNhap.find(ctpn => ctpn.MA_CT_SP === item.MA_CT_SP)
        //         a ? item.GIA = a.GIA : item.GIA = 0;
        //         a ? item.SO_LUONG = a.SO_LUONG : item.SO_LUONG = 0;
        //         item.errorGIA_NHAP = "";
        //         item.errorSO_LUONG = "";
        //     })

        //     let a = res.data.map(item => {
        //         return { MA_CT_SP: item.MA_CT_SP, SO_LUONG: item.SO_LUONG, GIA: item.GIA }
        //     });

        //     // console.log(a);
        //     setProductDetailsForImport(res.data);
        //     setImportProductEntity({ ...importProductEntity, chiTietPhieuNhap: a })
        // })
    }

    useEffect(() => {
        if (props.viewMode === 'view' || props.viewMode === 'edit') {
            try {

                // axios.get(`http://localhost:22081/api/SanPham/${props.productId}`).then(res => {
                //     const response = res.data;
                //     response.chiTietGioHang2.forEach((resp, index) => {
                //         try {
                //             resp.STT = index + 1;
                //             resp.GIA_STR = intToVNDCurrencyFormat(resp.GIA) + " ₫";
                //             resp.TRI_GIA_STR = intToVNDCurrencyFormat(resp.GIA * resp.SO_LUONG, true);//thêm true + đ
                //         } catch (e) {
                //             console.log(e)
                //         }
                //     })
                //     setCart(response);
                //     //set nhân viên đã được assign   
                //     setFlag(true);


                //     productDropdownList.current.value = response.MA_NV_GIAO;
                //     console.log("nvgiao old:", response.MA_NV_GIAO)

                // });
            } catch (error) {
                console.error(error);
            }
        } else {

        }

    }, []);

    loadLocaleSyncfusion();

    const validate = () => {
        let hasError = false;
        let tmpErrorMsg = { errorSO_LUONG_ALL: "", errorTEN_SP: "", errorTHE_LOAI: "", errorMO_TA: "", errorBANG_MAU: "", errorBANG_SIZE: "", errorSAN_PHAM_ALL: "" };
        // if (!product.TEN_SP) {
        //     tmpErrorMsg = { ...tmpErrorMsg, errorTEN_SP: "*Vui lòng nhập tên sản phẩm" }
        //     hasError = true;
        // }
        console.log(grid.current.getSelectedRecords().length);
        if (grid.current.getSelectedRecords().length === 0) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSAN_PHAM_ALL: "*Vui lòng chọn sản phẩm cần nhập" }
            hasError = true;
        }

        let item = productDetailsForImport__2.some(item => {
            let item2 = item.chiTietPhieuNhap.some(ctpn => {
                return ctpn.SO_LUONG > 0;
            });
            if (item2) {
                return true;
            }
            return false;
        });

        if (!item) {
            tmpErrorMsg = { ...tmpErrorMsg, errorSO_LUONG_ALL: "*Tổng số lượng nhập của phiếu phải lớn hơn 0" }
            hasError = true;
        }
        productDetailsForImport__2.forEach(item => {
            item.chiTietPhieuNhap.forEach(ctpn => {
                ctpn.errorSO_LUONG = '';
                if (ctpn.SO_LUONG < 0) {
                    ctpn.errorSO_LUONG = '*Số lượng nhập phải lớn hơn hoặc bằng 0'
                    hasError = true;
                }
                if (!ctpn.SO_LUONG) {
                    ctpn.SO_LUONG = 0;
                }

                ctpn.errorGIA_NHAP = '';
                if (ctpn.GIA < 0) {
                    ctpn.errorGIA_NHAP = '*Giá nhập phải lớn hơn hoặc bằng 0'
                    hasError = true;
                }
                if (!ctpn.GIA) {
                    ctpn.GIA = 0;
                }
            })

        })

        setErrorMessage(tmpErrorMsg)

        return hasError
    }


    const save = () => {
        if (validate()) {
            return;
        }

        // let data = productDetailsForImport.filter(item => {
        //     return item.SO_LUONG > 0;
        // })
        // console.log("data to send: ", data)


        //productDetailsForImport__2.forEach(item => {
        //     item.chiTietPhieuNhap.filter(ctgh=>{
        //         return ctgh.SO_LUONG>0;
        //     });
        // })
        let dataToImport = [];
        productDetailsForImport__2.forEach(item => {
            item.chiTietPhieuNhap.forEach(ctgh => {
                if (ctgh.SO_LUONG > 0) {
                    dataToImport.push(ctgh);
                }
            });
        })

        console.log('dataToImport: ', dataToImport);

        let _importProductEntity = {

            MA_NV: JSON.parse(localStorage.getItem('employee')).MA_NV,
            GHI_CHU: importProductEntity.GHI_CHU,
            chiTietPhieuNhap: dataToImport
        }

        setImportProductEntity(_importProductEntity)

        console.log('pass', _importProductEntity, `${process.env.REACT_APP_API_URL}/api/NhapHang/add-product-import`)
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/NhapHang/add-product-import`, _importProductEntity,
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                }
            ).then(res => {
                const response = res.data;
                console.log('res: ' + response);
                if (response.errorDesc) {
                    toast.error(response.errorDesc);
                    return
                }

                toast.success("Thêm phiếu nhập thành công");
                props.rerender();
            },
                {
                    headers: {
                        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('employee')).accessToken,
                    }
                });
        } catch (error) {
            console.error(error);
        }

    }

    let productDropdownFields = { text: 'TEN_SP_STR', value: 'MA_SP' };
    // filtering event handler to filter a Country

    const onProductFiltering = (e) => {
        let query = new Query();
        //frame the query based on search string with filter type.
        query = (e.text !== '') ? query.where('TEN_SP_STR', 'contains', e.text, true) : query;
        //pass the filter data source, filter query to updateData method.
        e.updateData(products, query);
    };


    const getTitle = () => {
        return props.viewMode === 'view' ? `Chi tiết phiếu nhập ${props.importId}` : props.viewMode === 'edit' ? `Chỉnh sửa phiếu nhập ${props.importId}` : `Thêm mới phiếu nhập`
    }

    const getTotalPrice = () => {
        return productDetailsForImport.reduce((total, item) => {
            return total = total + (item.SO_LUONG * item.GIA)
        }, 0)
    }
    const getTotalQuantity = () => {
        return productDetailsForImport.reduce((total, item) => {
            return total = total + (item.SO_LUONG * 1)
        }, 0)
    }
    const onChangeQuantity = (MA_CT_SP, quantity) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForImport.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, SO_LUONG: quantity };
            } else {
                return item;
            }
        });
        setProductDetailsForImport(newArray);

    }
    const onChangePrice = (MA_CT_SP, price) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForImport.map((item, i) => {
            if (item.MA_CT_SP === MA_CT_SP) {
                return { ...item, GIA: price };
            } else {
                return item;
            }
        });
        setProductDetailsForImport(newArray);

    }

    const getTotalPrice__2 = (MA_SP) => {
        const productToGetTotal = productDetailsForImport__2.find(item => {
            return item.MA_SP === MA_SP;
        })
        return productToGetTotal.chiTietPhieuNhap.reduce((total, item) => {
            return total = total + (item.SO_LUONG * item.GIA)
        }, 0)
    }
    const getTotalQuantity__2 = (MA_SP) => {
        const productToGetTotal = productDetailsForImport__2.find(item => {
            return item.MA_SP === MA_SP;
        })
        return productToGetTotal.chiTietPhieuNhap.reduce((total, item) => {
            return total = total + (item.SO_LUONG * 1)
        }, 0)
    }

    const getTotalPrice__ALL2 = (MA_SP) => {
        return productDetailsForImport__2.reduce((total, item) => {
            return total = total + getTotalPrice__2(item.MA_SP);
        }, 0)
    }
    const getTotalQuantity__ALL2 = (MA_SP) => {
        return productDetailsForImport__2.reduce((total, item) => {
            return total = total + getTotalQuantity__2(item.MA_SP);
        }, 0)
    }

    const onChangeQuantity__2 = (MA_CT_SP, quantity, MA_SP) => {
        // console.log(MA_CT_SP, quantity)
        const newArray = productDetailsForImport__2.map((item, i) => {
            console.log(item);
            if (item.MA_SP === MA_SP) {
                const newCTPN = item.chiTietPhieuNhap.map(ctpn => {
                    if (ctpn.MA_CT_SP === MA_CT_SP && item.MA_SP === MA_SP) {
                        return { ...ctpn, SO_LUONG: quantity };
                    } else {
                        return ctpn;
                    }
                })
                return { ...item, chiTietPhieuNhap: newCTPN }
            }
            else return { ...item }

        });
        setProductDetailsForImport__2(newArray);

    }
    const onChangePrice__2 = (MA_CT_SP, price, MA_SP) => {
        const newArray = productDetailsForImport__2.map((item, i) => {
            console.log(item);
            if (item.MA_SP === MA_SP) {
                const newCTPN = item.chiTietPhieuNhap.map(ctpn => {
                    if (ctpn.MA_CT_SP === MA_CT_SP && item.MA_SP === MA_SP) {
                        return { ...ctpn, GIA: price };
                    } else {
                        return ctpn;
                    }
                })
                return { ...item, chiTietPhieuNhap: newCTPN }
            }
            else return { ...item }

        });
        setProductDetailsForImport__2(newArray);

    }

    // console.log('rerender, product: ', product)
    console.log('rerender input": ', productDetailsForImport)
    return (
        // preparePrint ? <CartDetailToPrint type={'userViewing'} closePreparePrintDialog={closePreparePrintDialog} cartId={props.cartId} /> 
        // :
        <>
            {isLoading ? <div className={clsx(style.loadingOverCoat)}>
                <LoadingAnimation />
            </div> : <></>}

            {flag ? <div className={clsx(style.modalWrapper)}>

                <div className={clsx(style.top)}>
                    {/* <ToastContainer /> */}
                </div>
                <div className={clsx(style.modal)}>
                    <h1 className={clsx(style.header)}><span className={clsx(style.closeButton)} onClick={() => {
                        props.closeDialog();
                    }}><XIcon /></span></h1>

                    <h1 className={clsx(style.title)}>{getTitle()}</h1>
                    <div className={clsx(style.btnCheckContainer)}>
                        {props.type !== 'userViewing' && JSON.parse(localStorage.getItem('employee')).MA_QUYEN !== 'Q04' ?
                            <>
                                <button onClick={() => {
                                    save();
                                }} className={clsx(style.checkButton, style.saveButton, { [style.inActive]: props.viewMode === 'view' })}>
                                    <span className={clsx(style.iconSvg)}><SaveIcon /></span>Lưu
                                </button>

                            </>
                            : <></>

                        }

                    </div>

                    <div className={clsx(style.cartInfo, style.form)}>

                        <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                            <label className={clsx(style.inputLabel)}>Ngày tạo:</label>
                            <div className={clsx(style.datePickerContainer, style.readOnly)}>
                                <DatePickerComponent onChange={() => {
                                }} ref={datePicker} format={'dd/MM/yyyy'} locale='vi' />
                            </div>
                            {/* {errorMessage.errorName?<p className={clsx(style.errorMessage)}>{errorMessage.errorName}</p>:""} */}
                        </div>

                        <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                            <label className={clsx(style.inputLabel)}>Ghi chú:</label>
                            <textarea maxLength={1000} onChange={(e) => {
                                console.log(e.target.value)
                                setImportProductEntity({ ...importProductEntity, GHI_CHU: e.target.value })
                            }} type="text" placeholder=""
                                value={importProductEntity.GHI_CHU} name='GHI_CHU' className={clsx(style.input)} />
                            {<p className={clsx(style.errorMessage)}>{errorMessage.errorGHI_CHU}</p>}
                        </div>

                        <div className={clsx(style.inputGroup, style.quantityInputGroup, style.marginBottom16)}>
                            <label className={clsx(style.inputLabel)}>Nhân viên tạo:</label>
                            <input type="text" placeholder="" disabled
                                value={
                                    props.viewMode === 'add' ? JSON.parse(localStorage.getItem('employee')).HO_TEN : importProductEntity.HO_TEN_NV
                                } name='HO_TEN_NV' className={clsx(style.input)} />
                        </div>
                        <div className={clsx(style.inputGroup, style.quantityInputGroup, style.marginBottom16)}>

                        </div>
                        {products.length > 0 ?
                            <>
                                <div className={clsx(style.toolBar)}>
                                    <button onClick={() => {
                                        selectProducts();
                                    }} className={clsx(style.checkButton, style.saveButton, style.selectButton, { [style.inActive]: props.viewMode === 'view' })}><span className={clsx(style.iconSvg)}><CheckIcon /></span>Chọn</button>
                                </div>
                                <div className={clsx(style.customerCarts)}>
                                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorSAN_PHAM_ALL}</p>}
                                    {<GridComponent ref={grid}
                                        toolbar={toolbarOptions}
                                        showColumnChooser={true}
                                        //  actionComplete={actionComplete} 
                                        //  actionBegin={actionBegin}
                                        locale='vi-VN'
                                        editSettings={editOptions}
                                        pageSettings={pageSettings}
                                        dataSource={products} allowPaging={true} /*allowGrouping={true}*/
                                        allowSorting={true} allowFiltering={true}
                                        filterSettings={filterOptions} height={315}
                                        rowSelected={rowSelected}
                                        gridLines='Both'
                                        selectionSettings={selectionSettings}
                                    >
                                        <ColumnsDirective>
                                            <ColumnDirective type='checkbox' width='50' />
                                            <ColumnDirective field='MA_SP' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mã SP' width='200' textAlign="Left" isPrimaryKey={true} />
                                            <ColumnDirective field='TEN_SP' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Tên SP' width='200' textAlign="Left" />
                                            <ColumnDirective field='TEN_TL' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Thể loại' width='150' editType='dropdownedit' textAlign="Left" />
                                            <ColumnDirective field='SIZE_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Size/ Màu' width='200' textAlign="Left" />
                                            <ColumnDirective field='GIA_STR' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Giá' width='200' textAlign="Left" />
                                            <ColumnDirective field='NGAY_TAO' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Ngày tạo' width='150' textAlign="Left" />
                                            <ColumnDirective field='LUOT_XEM' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Lượt xem' width='150' textAlign="Left" />
                                            {/* <ColumnDirective field='MA_TL'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='MA_TL' width='100' textAlign="Right"/> */}
                                            {/* <ColumnDirective field='Freight' width='100' format="C2" textAlign="Right"/> */}
                                            <ColumnDirective field='HINH_ANH' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Hình ảnh' width='200' textAlign="Left" />
                                            <ColumnDirective field='MO_TA' clipMode='EllipsisWithTooltip' headerTextAlign='Center' headerText='Mô tả' width='150' textAlign="Left" /*type='date' format={'dd/MM/yyyy'} editType='datepickeredit' */ />

                                            {/* <ColumnDirective field='TEN_NV_DUYET'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV duyệt' width='160' textAlign="Left" />
                        <ColumnDirective field='TEN_NV_GIAO'  clipMode='EllipsisWithTooltip' headerTextAlign='Center'  headerText='NV giao' width='160' textAlign="Left" /> */}


                                        </ColumnsDirective>
                                        <Inject services={[Page, Sort, Filter, Group, Edit, Toolbar, ColumnChooser]} />
                                    </GridComponent>
                                    }</div></>
                            : <></>

                        }

                        {/* detail */}

                        {productDetailsForImport__2.length > 0 ?
                            // <div className={clsx(style.detailFileUploadsContainer)}>

                            <>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Màu /size</label>

                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Số lượng</label>
                                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorSO_LUONG_ALL}</p>}
                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Giá nhập</label>

                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.inputLabel)}>Thành tiền</label>

                                </div>
                            </>
                            // </div>
                            : <></>}

                        {/* <div className={clsx(style.detailFileUploadsContainer)}> */}
                        {
                            productDetailsForImport__2.map((item, index) => {
                                return (
                                    <>
                                        <div className={clsx(style.productName)}>{item.MA_SP + ' - ' + item.TEN_SP}</div>
                                        {item.chiTietPhieuNhap.map((ctpn, index2) => {
                                            return <><div key={index2} className={clsx(style.quantityInputContainer)}>
                                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                    {/* <label className={clsx(style.inputLabel)}>Màu /size:</label> */}
                                                    <input disabled onChange={(e) => {

                                                    }} type="text" name='MAU_SIZE'
                                                        value={`${ctpn.TEN_MAU}/ ${ctpn.TEN_SIZE}`}
                                                        placeholder="" className={clsx(style.input)}
                                                    />

                                                </div>
                                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                    {/* <label className={clsx(style.inputLabel)}>Số lượng:</label> */}
                                                    <input disabled={props.viewMode === 'view'} onChange={(e) => {
                                                        console.log(e.target.value)
                                                        onChangeQuantity__2(ctpn.MA_CT_SP, e.target.value, item.MA_SP);
                                                    }} type="number"
                                                        value={item.chiTietPhieuNhap[index2].SO_LUONG}
                                                        placeholder="" className={clsx(style.input)}
                                                        min={0}
                                                        onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                                    />
                                                    {<p className={clsx(style.errorMessage)}>{ctpn.errorSO_LUONG}</p>}
                                                </div>
                                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                    {/* <label className={clsx(style.inputLabel)}>Giá nhập:</label> */}
                                                    <input disabled={props.viewMode === 'view'} onChange={(e) => {
                                                        console.log(e.target.value)
                                                        onChangePrice__2(ctpn.MA_CT_SP, e.target.value, item.MA_SP);
                                                    }} type="number"
                                                        value={item.chiTietPhieuNhap[index2].GIA}
                                                        placeholder="" className={clsx(style.input)}
                                                        min={0}
                                                        //disable scroll increase
                                                        onFocus={(e) => e.target.addEventListener("wheel", function (e) { e.preventDefault() }, { passive: false })}
                                                    />
                                                    {<p className={clsx(style.errorMessage)}>{ctpn.errorGIA_NHAP}</p>}
                                                </div>

                                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                    {/* <label className={clsx(style.inputLabel)}>Thành tiền</label> */}
                                                    <input disabled onChange={(e) => {

                                                    }} type="text" name='THANH_TIEN'
                                                        value={`${intToVNDCurrencyFormat(ctpn.GIA * ctpn.SO_LUONG, true)}`}
                                                        placeholder="" className={clsx(style.input)}
                                                    />

                                                </div>
                                            </div></>
                                        })}
                                        <>

                                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                                            </div>
                                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                <label className={clsx(style.totalLabel)}>Tổng số lượng: {getTotalQuantity__2(item.MA_SP)}</label>
                                            </div>
                                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                                            </div>
                                            <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                                <label className={clsx(style.totalLabel)}>Tổng giá nhập: {intToVNDCurrencyFormat(getTotalPrice__2(item.MA_SP), true)}</label>

                                            </div></>

                                        <hr></hr>
                                    </>
                                )
                            })
                        }
                        {/* </div> */}

                        {productDetailsForImport__2.length > 0 ?
                            // <div className={clsx(style.detailFileUploadsContainer)}>
                            <>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.totalLabel)}>Tổng số lượng của phiếu: {getTotalQuantity__ALL2()}</label>
                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    {/* <label className={clsx(style.inputLabel)}>Màu /size</label> */}

                                </div>
                                <div className={clsx(style.inputGroup, style.quantityInputGroup)}>
                                    <label className={clsx(style.totalLabel)}>Tổng giá nhập của phiếu: {intToVNDCurrencyFormat(getTotalPrice__ALL2(), true)}</label>

                                </div></>
                            // </div>
                            : <></>}
                    </div>

                    {/* <div className={clsx(style.inputGroup)}>
                    <FileUploadComponent
                        ref={generalFileInputRef}
                        field={'HINH_ANH_CHUNG'}
                        title={'Chọn hình ảnh chung'}
                        onSelectedOptionsChange={generalFileChange}
                        showUploadButton={false}
                    />
                    {<p className={clsx(style.errorMessage)}>{errorMessage.errorHINH_ANH_CHUNG}</p>}
                </div> */}
                    {/* <div className={clsx(style.inputLabel, style.longLabel)}>Nhập số lượng và giá nhập: </div> */}



                </div>
            </div> : <></>} </>);
}
//chỉ update lúc cần
export default React.memo(ProductImportEdit);