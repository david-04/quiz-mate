import { Component } from "react";
import CenterBox from "../../components/CenterBox";

class LoadingRoom extends Component {
    render() {
        return (
            <CenterBox cancel="Cancel" {...this.props}>
                <div className="message-box">
                    Connecting with the room...
                </div>
            </CenterBox>
        );
    }
}

export default LoadingRoom;
