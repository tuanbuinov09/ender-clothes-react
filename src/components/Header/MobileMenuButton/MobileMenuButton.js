import { useRef, forwardRef, useImperativeHandle } from 'react';
import './MobileMenuButton.css';
function MobileMenuButton(props, ref) {
    const mobileButton = useRef();
    const handleMenuButton = () => {
        // console.log(
        mobileButton.current.classList.toggle("active")
        // );
        props.showNavListResponsive();
        props.toggleOverCoat();
    }

    useImperativeHandle(ref, () => {
        return {
            toggleActive() {
                mobileButton.current.classList.toggle("active");
            }
        }
    })

    console.log("rerender")
    return (
        <div className="mobile-menu-button mobile-button-animate" onClick={handleMenuButton} ref={mobileButton}>
            <div className="bar-top">

            </div>
            <div className="bar-middle">

            </div>
            <div className="bar-bottom">

            </div>
        </div>
    );
}
export default forwardRef(MobileMenuButton);