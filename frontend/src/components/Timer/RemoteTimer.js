import React, { Component } from 'react';
import { calculateTime } from "../../utilities";
import './Timer.css';
import { TIMER_ANIMATE_INTERVAL_SECONDS } from "../../utilities/constants";

class RemoteTimer extends Component {
    getTime = () => {
        const mustAnimate = 0 < this.props.seconds && this.props.seconds <= TIMER_ANIMATE_INTERVAL_SECONDS;
        return (
            <div className={mustAnimate ? "timer-normal" : "timer-warning"}>
                {calculateTime(Math.max(this.props.seconds, 0), false)}
            </div>
        );
    };

    render() {
        return (
            <div className="timer-container-remote">
                {this.getTime()}
            </div>
        );
    }
}

export default RemoteTimer;
