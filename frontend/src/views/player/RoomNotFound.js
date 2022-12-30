import { Component } from "react";
import CenterBox from "../../components/CenterBox";

import Warning from "../../assets/icons/warning.svg";

import "../../assets/icons/material-ui-icon.css";

class RoomNotFound extends Component {
    render() {
        return (
            <CenterBox logo cancel="Return to menu" {...this.props}>
                <img src={Warning} className="material-ui-icon" style={{ fontSize: "4.5em" }} alt="Add" />
                <div className="message-box">
                    Room with code {this.props.game.roomCode} was not found!
                </div>
            </CenterBox>
        );
    }
}

export default RoomNotFound;
