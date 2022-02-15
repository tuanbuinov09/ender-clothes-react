import { useRef } from 'react';
import './MobileMenuButton.css';
function MobileMenuButton({ props }) {
    const mobileMenuButton = useRef();
    const handleMenuButton = (e) => {
        console.log(mobileMenuButton.current.classList.toggle("active"));

    }
    return (
        <div className="mobile-menu-button mobile-button-animate" onClick={handleMenuButton} ref={mobileMenuButton}>
            <div className="bar-top">

            </div>
            <div className="bar-middle">

            </div>
            <div className="bar-bottom">

            </div>
        </div>
    );
}
export default MobileMenuButton;