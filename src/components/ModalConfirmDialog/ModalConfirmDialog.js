import clsx from 'clsx';
import { Button } from '../Button/Button';
import style from './Modal.module.css';
export const ModalConfirmDialog = (props) => {
    return (
        <div className={clsx(style.modalWrapper)}>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.title)}>{props.title}</h1>
                <div className={clsx(style.buttonWrapper)}>
                    <div onClick={() => {
                        props.onConfirm();
                    }} >
                        <Button text="ĐỒNG Ý" className={clsx(style.buttonConfirm)} />
                    </div>
                    <div onClick={() => {
                        props.onDeny();
                    }} >
                        <Button text="HỦY" className={clsx(style.buttonCancek)} />
                    </div>

                </div>
            </div>
        </div>
    )
}

//usage:
// function Test() {
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//      const [confirmDialogTiltle, setConfirmDialogTiltle] = useState('');
//     const onConfirm = ()=>{
//         setMessage('confirmed');
//         setShowConfirmDialog(false);
//     }
//     const onDeny = ()=>{
//         setMessage('denied');
//         setShowConfirmDialog(false);
//     }
//     const [message, setMessage] = useState('initial');
//     return (
//         <>
//         {showConfirmDialog && <ModalConfirmDialog onConfirm={onConfirm} onDeny={onDeny} title={confirmDialogTitle}/>}
//         <button onClick={(e)=>{
//             setTestConfirmDialog(true);
//         }}>{message}</button>
//        </>
        
//     );
// }