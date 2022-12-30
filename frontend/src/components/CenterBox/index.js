import { Component } from "react";
import IconButton from "../../components/IconButton";
import { closeRoom } from "../../connection/config";

import Close from "../../assets/icons/close.svg";

import "./CenterBox.css";

class CenterBox extends Component {
    render() {
        return (
            <div className="outer">
                <div className="middle">
                    <div className="inner">{this.props.children}</div>
                </div>
                {this.props.cancel && (
                    <IconButton
                        icon={this.props.cancelIcon || Close}
                        label={this.props.cancel}
                        containerClassName="cancel-btn"
                        buttonClassNames="qm-fixed-top qm-fixed-left"
                        onClick={navigate => {
                            if (this.props.closeRoomSignal) {
                                this.props.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                            } else {
                                navigate("/");
                            }
                        }}
                    />
                )}
                {this.props.roomHeader && (
                    <div className="room-header">
                        {this.props.game.hostingRoom.roomCode}
                    </div>
                )}
            </div>
        );
    }
}

export default CenterBox;
