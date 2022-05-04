import clsx from 'clsx';
import { Button } from '../Button/Button';
import style from './Modal.module.css';
export const Modal = (props) => {
    return (
        <div className={clsx(style.modalWrapper)}>
            <div className={clsx(style.modal)}>
                <h1 className={clsx(style.title)}>Do you want to clear your bag?</h1>
                <div className={clsx(style.buttonWrapper)}>
                    <Button text="CONFIRM" className={clsx(style.buttonConfirm)} />
                    <Button text="CANCEL" className={clsx(style.buttonCancek)} />
                </div>
            </div>
        </div>
    )
}