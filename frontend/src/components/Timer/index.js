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
    }

    componentWillUnmount() {
        clearInterval(this.clock);
    }

    tick() {
        if (this.state.running) {
            const sec = Math.round((new Date().renderTime() - this.state.startTime) / MS_PER_SEC);
            this.setState({ current: sec });
            if (this.props.tick) {
                this.props.tick(this.state.limit - sec);
            }
            if (sec >= this.state.limit) {
                this.stopTimer();
                if (this.props.trigger) {
                    this.props.trigger();
                }
            }
        }
    };

    startTimer(seconds) { // NOSONAR
        this.setState({
            running: true,
            startTime: new Date().renderTime(),
            limit: seconds,
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
