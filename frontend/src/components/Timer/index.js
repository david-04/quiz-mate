import React, { Component } from "react";

import { calculateTime } from "../../utilities";
import { MS_PER_SEC, TIMER_ANIMATE_INTERVAL_SECONDS } from "../../utilities/constants";

import "./Timer.css";

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            startTime: 0,
            limit: 0,
            current: 0
        };
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        this.clock = setInterval(this.tick, MS_PER_SEC);
        if (0 < this.props.timeLimit) {
            this.startTimer(this.props.timeLimit);
        }
    }

    componentWillUnmount() {
        clearInterval(this.clock);
    }

    tick() {
        if (this.state.running) {
            const sec = Math.round((new Date().getTime() - this.state.startTime) / MS_PER_SEC);
            this.setState({ current: sec });
            if (this.props.tick) {
                this.props.tick(this.state.limit - sec);
            }
            if (this.state.limit <= sec) {
                this.stopTimer();
                if (this.props.onTimerStop) {
                    this.props.onTimerStop();
                }
            }
        }
    };

    startTimer() {
        this.setState({
            running: true,
            startTime: new Date().getTime(),
            limit: this.props.timeLimit,
            current: 0
        });
    };

    stopTimer() {
        this.setState({
            running: false,
            startTime: 0,
            limit: 0,
            current: 0
        });
    };

    renderTime() {
        const className = TIMER_ANIMATE_INTERVAL_SECONDS < this.state.limit - this.state.current || !this.state.running
            ? "timer-normal"
            : "timer-warning";
        return (
            <div className={className}>
                {calculateTime(Math.max(this.state.limit - this.state.current, 0), false)}
            </div>
        );
    };

    render() {
        return (
            <div className="timer-container">
                {this.renderTime()}
            </div>
        );
    }
}

export default Timer;
