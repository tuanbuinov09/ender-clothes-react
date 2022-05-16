import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../features/modal/modalSlice';
import { caculateTotalAmountAndPrice, clearBag } from '../../features/shoppingBag/shoppingBagSlice';
import { Button } from '../Button/Button';
import style from './Modal.module.css';
export const Modal = (props) => {
    const dispatch = useDispatch();
    return (
        <div className={clsx(style.modalWrapper)}>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.title)}>Do you want to clear your bag?</h1>
                <div className={clsx(style.buttonWrapper)}>
                    <div onClick={() => {
                        dispatch(clearBag());
                        dispatch(caculateTotalAmountAndPrice());
                        dispatch(closeModal());
                    }} >
                        <Button text="CONFIRM" className={clsx(style.buttonConfirm)} />
                    </div>
                    <div onClick={() => {
                        dispatch(closeModal());
                    }} >
                        <Button text="CANCEL" className={clsx(style.buttonCancek)} />
                    </div>

                </div>
            </div>
        </div>
    )
}