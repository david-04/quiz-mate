import React, { Component } from "react";

import CenterBox from "../../components/CenterBox";
import RankTable from "../../components/RankTable";

class Final extends Component {
    render() {
        return (
            <CenterBox logo cancel="Return to menu" {...this.props}>
                <div className="message-box">
                    <RankTable data={this.props.generalRanking} showHeader />
                </div>
            </CenterBox>
        );
    }
}

export default Final;
