import { Component } from "react";
import CenterBox from "../../components/CenterBox";

import Warning from "../../assets/icons/warning.svg";

import "../../assets/icons/material-ui-icon.css";

class NicknameIsTaken extends Component {
    render() {
        return (
            <CenterBox logo cancel="Return to menu" {...this.props}>
                <img src={Warning} className="material-ui-icon" style={{ fontSize: "4.5em" }} alt="Add" />
                <div className="message-box">
                    Name "{this.props.game.playerName}" is already taken - choose another!
                </div>
            </CenterBox>
        );
    }
}

export default NicknameIsTaken;
