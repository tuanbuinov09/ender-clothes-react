
import React, { Component } from 'react';
import axios from 'axios';
import style from './FileUploadComponent.module.css';
import clsx from 'clsx';
import moment from 'moment';

class FileUploadComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: '',
            status: '',
            progress: 0
        }
    }
    selectFileHandler = (event) => {
        //1. define the array for the file type e.g. png, jpeg
        const fileTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];

        // 2. get the file type
        let file = event.target.files;
        console.log(`File ${file}`);
        // 3. the message for error if the file type of not matched
        let errMessage = [];
        // 4. to check the file type to match with the fileTypes array iterate 
        // through the types array
        if (fileTypes.every(extension => file[0].type != extension)) {
            errMessage.push(`The file ${file.type} extension is not supported`);
        } else {
            // let a = (moment().format('DDMMyyyyhhmmss')) +'-'+ file[0].name ;
            // console.log(a)
            // file[0].name = a;
            this.setState({
                selectedFile: file[0]
            });

            this.props.onSelectedOptionsChange({field: this.props.field, file:  file[0]});

        }
    };
    
    // method contain logic to upload file
    uploadHandler = (event) => {
        // 1. the FormData object that contains the data to be posted to the 
        // WEB API
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);

        // 2. post the file to the WEB API
        axios.post("http://localhost:22081/api/FileUpload/Upload", formData, {
            onUploadProgress: progressEvent => {
                this.setState({
                    progress: (progressEvent.loaded / progressEvent.total * 100)
                })
            }
        })
            .then((response) => {
                this.setState({ status: `upload success ${response.data}` });
            })
            .catch((error) => {
                this.setState({ status: `upload failed ${error}` });
            })
    }
    render() {
        // console.log('ssssssssss:', this.state)
        return (
            <div>
                <label className={clsx(style.label)}>{this.props.title}</label>
                <div className={clsx(style.fileInputContainer)}>
                    <input className={clsx(style.fileInput)} type="file" accept="image/*" onChange={this.selectFileHandler} />
                    {this.props.showUploadButton?<button className={clsx(style.fileUpLoadButton)} type="button" onClick={this.uploadHandler}>Tải lên</button>:<></>}
                    {/* <div className={clsx(style.fileUpLoadProgress)}>{this.state.progress}%</div>
                    <div className={clsx(style.fileUpLoadStatus)}>{this.state.status}</div> */}
                </div>
            </div>
        );
    }
}

export default FileUploadComponent;