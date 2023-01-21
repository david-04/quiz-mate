import React, { Component } from "react";

import CenterBox from "../../components/CenterBox";

class WaitingForCode extends Component {
    render() {
        return (
            <CenterBox logo cancel="Cancel" {...this.props}>
                <div className="message-box">
                    Connecting...
                </div>
            </CenterBox>
        );
    }
}

export default WaitingForCode;
