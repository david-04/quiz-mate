import React, {Component} from 'react';
import {Button} from "react-bootstrap";
import {closeRoom} from "../../connection/config";
import './CenterBox.css'

import logo from '../../assets/logo.svg'
import CloseIcon from '@material-ui/icons/Close'

class CenterBox extends Component {
    render() {
        return (
            <div className={"outer"}>
                <div className="middle">
                    <div className={"inner"}>
                        {this.props.children}
                    </div>
                </div>
                {
                    this.props.cancel &&
                    <div className={"cancel-btn"}>
                        <Button variant={"secondary"} onClick={() => {
                            if(this.props.closeRoomSignal) {
                                this.props.socket.emit(closeRoom, this.props.game.hostingRoom.roomCode);
                            }else{
                                this.props.history.push('/');
                            }
                        }}>
                            <CloseIcon/> {this.props.cancel}
                        </Button>
                    </div>
                }
                {
                    this.props.roomHeader &&
                    <div className={"room-header"}>
                        {this.props.game.hostingRoom.roomCode}
                    </div>
                }
                {
                    this.props.logo &&
                    <div className={"watermark-logo"}>
                        <img src={logo} alt={"quizario watermark logo"}/>
                    </div>
                }
            </div>
        );
    }
}

export default CenterBox;