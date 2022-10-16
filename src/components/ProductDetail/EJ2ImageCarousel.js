import { CarouselComponent } from "@syncfusion/ej2-react-navigations";
import { removeSyncfusionLicenseMessage } from "../../uitilities/utilities";
import * as React from "react";
class EJ2ImageCarousel extends React.Component {
    constructor() {
        super();
        this.showButtons = "VisibleOnHover";
        removeSyncfusionLicenseMessage();
    }
    getSelectedIndex() {
        return this.props.productImages.findIndex((item) => {
            return item.MA_MAU === this.props.selectedProductDetail.MA_MAU
        })
    }
    setIsShowButton() {
        return this.showButtons = this.props.productImages.length>1?"VisibleOnHover":"Hidden";
    }
    itemTemplate(img) {
        return <figure className="img-container"><img src={img.HINH_ANH} alt={img.TEN_MAU} style={{ height: "100%", width: "100%" }} /></figure>;
    }
componentDidMount(){
    removeSyncfusionLicenseMessage();
}
    componentDidUpdate(){
        console.log('updated')
    }

    componentWillUnmount(){
        console.log('unmount')
    }

    onSlideChanging(args) {
        console.log(args.currentSlide); // You can customize the slide before changing.
    }
    onSlideChanged(args) {
        console.log(args.currentSlide); // You can customize the slide after changed.
    }

    render() {
        console.log(this.props.productImages)
        console.log(this.getSelectedIndex())
        return (
            <div className='control-container'>
                <CarouselComponent autoPlay={this.props.productImages.length>1?true:false} 
                buttonsVisibility={this.setIsShowButton()} 
                selectedIndex={this.getSelectedIndex()} 
                dataSource={this.props.productImages} 
                itemTemplate={this.itemTemplate.bind(this)}
                pauseOnHover={true}
                interval={7000} 
                loop={true}
                slideChanging={this.onSlideChanging.bind(this)} slideChanged={this.onSlideChanged.bind(this)}
                enableTouchSwipe={this.props.productImages.length>1?true:false}>

                </CarouselComponent>
            </div>);
    }
}
export default EJ2ImageCarousel;