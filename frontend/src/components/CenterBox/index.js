import { Component } from "react";
import GithubCorner from "react-github-corner";

import IconButton from "../../components/IconButton";
import { closeRoom } from "../../connection/config";
import { client } from "../../connection/config";

import Close from "../../assets/icons/close.svg";

import "./CenterBox.css";

class CenterBox extends Component {

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
                    Join:
                    <span className="qm-join-summary-url">{client}/#/{this.props.game.hostingRoom.roomCode}</span>
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
                        onClick={navigate => {
                            if (this.props.closeRoomSignal) {
                                this.props.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                            } else {
                                navigate("/");
                            }
                        }}
                    />
                )}
            </div>
        );
    }
}

export default CenterBox;
