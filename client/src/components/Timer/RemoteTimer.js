import React, {Component} from 'react';
import {calculateTime} from "../../utilities";
import './Timer.css';

class RemoteTimer extends Component {
    getTime = () => {
        return(<div className={this.props.seconds > 10 || this.props.seconds === 0 ? "timer-normal" : "timer-warning"}>
            {calculateTime(Math.max(this.props.seconds, 0), false)}
        </div>);
    };

    render() {
        return (
            <div className={"timer-container-remote"}>
                {this.getTime()}
            </div>
        );
    }
}

export default RemoteTimer;