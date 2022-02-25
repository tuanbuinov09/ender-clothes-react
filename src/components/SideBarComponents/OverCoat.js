import clsx from 'clsx';
import style from './OverCoat.module.css'
function OverCoat(props) {
    return (
        // neu la overcoat cua header thi zindex nho hon header voi class ofnavlist
        <div className={clsx(style.overCoat, { [style.active]: props.active, [style.ofNavList]: props.ofNavList })}>

        </div>
    );
}

export default OverCoat;