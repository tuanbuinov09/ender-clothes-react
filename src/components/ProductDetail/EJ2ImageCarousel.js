import { CarouselComponent } from "@syncfusion/ej2-react-navigations";
import * as React from "react";
class EJ2ImageCarousel extends React.Component {
    constructor() {
        super();
        this.showButtons = "VisibleOnHover";
        
    }
    getSelectedIndex() {
        return this.props.productImages.findIndex((item) => {
            return item.MA_MAU === this.props.selectedProductDetail.MA_MAU
        })
    }
    
    itemTemplate(img) {
        return <figure className="img-container"><img src={img.HINH_ANH} alt={img.TEN_MAU} style={{ height: "100%", width: "100%" }} /></figure>;
    }

    componentDidUpdate(){
        console.log('updated')
    }

    componentWillUnmount(){
        console.log('unmount')
    }

    render() {
        console.log(this.props.productImages)
        console.log(this.getSelectedIndex())
        return (
            <div className='control-container'>
                <CarouselComponent buttonsVisibility={this.showButtons} selectedIndex={this.getSelectedIndex()} dataSource={this.props.productImages} itemTemplate={this.itemTemplate.bind(this)}></CarouselComponent>
            </div>);
    }
}
export default EJ2ImageCarousel;