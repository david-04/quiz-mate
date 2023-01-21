import { Component } from "react";
import GithubCorner from "react-github-corner";

import IconButton from "../../components/IconButton";
import { closeRoom } from "../../connection/config";
import { getServerUrl } from "../../utilities";
import CopyButton from "../CopyButton";

import Close from "../../assets/icons/close.svg";

import "./CenterBox.css";

class CenterBox extends Component {

    constructor(props) {
        super(props);
        this.onCancel = this.onCancel.bind(this);
    }

    onCancel(navigate) {
        if (this.props.closeRoomSignal) {
            this.props.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
        } else {
            navigate("/");
        }
    }

    renderGitHubCorner() {
        if (true === this.props.showGitHubLink) {
            return <GithubCorner href="https://github.com/david-04/quiz-mate" />;
        } else {
            return false;
        }
    }

    renderJoinInfo() {
        if (true === this.props.renderJoinInfo) {
            return (
                <div className="qm-join-summary">
                    <div>
                        Join:
                    </div>
                    <div className="qm-join-summary-url">
                        {getServerUrl(this.props.game.hostingRoom.roomCode)}
                    </div>
                    <div className="qm-join-summary-copy-button">
                        <CopyButton text={getServerUrl(this.props.game.hostingRoom.roomCode)} variant="default" />
                    </div>
                </div>
            );
        } else {
            return false;
        }
    }

    render() {
        return (
            <div className="outer">
                {this.renderJoinInfo()}
                {this.renderGitHubCorner()}
                <div className="middle">
                    <div className="inner">{this.props.children}</div>
                </div>
                {this.props.cancel && (
                    <IconButton
                        icon={this.props.cancelIcon || Close}
                        label={this.props.cancel}
                        containerClassName="cancel-btn"
                        buttonClassName="qm-fixed-top qm-fixed-left"
                        onClick={this.onCancel}
                    />
                )}
            </div>
        );
    }
}

export default CenterBox;
