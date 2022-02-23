import { useRef, forwardRef } from 'react';
import './MobileMenuButton.css';
function MobileMenuButton(props, ref) {
    // const mobileButton = useRef();
    const handleMenuButton = () => {
        // console.log(
        ref.current.classList.toggle("active")
        // );
        props.showNavListResponsive();
        props.toggleOverCoat();
    }
    console.log("rerender")
    return (
        <div className="mobile-menu-button mobile-button-animate" onClick={handleMenuButton} ref={ref}>
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