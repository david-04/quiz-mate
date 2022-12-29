import React, {Component} from 'react';
import {calculateTime} from "../../utilities";
import './Timer.css';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            startTime: 0,
            limit: 0,
            current: 0
        }
    }

    componentDidMount() {
        this.clock = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clock);
    }


    tick = () => {
        if(this.state.running) {
            const sec = Math.round((new Date().getTime() - this.state.startTime) / 1000);
            this.setState({current: sec});
            if(this.props.tick) this.props.tick(this.state.limit - sec);
            if(sec >= this.state.limit) {
                this.stopTimer();
                if(this.props.trigger) this.props.trigger();
            }
        }
    };

    startTimer = (seconds) => {
        this.setState({
            running: true,
            startTime: new Date().getTime(),
            limit: seconds,
            current: 0
        });
    };

    stopTimer = () => {
        this.setState({
            running: false,
            startTime: 0,
            limit: 0,
            current: 0
        });
    };

    getTime = () => {
        return(<div className={this.state.limit - this.state.current > 10 || !this.state.running ? "timer-normal" : "timer-warning"}>
            {calculateTime(Math.max(this.state.limit - this.state.current, 0), false)}
        </div>);
    };

    render() {
        return (
            <div className={"timer-container"}>
                {this.getTime()}
            </div>
        );
    }
}

export default Timer;