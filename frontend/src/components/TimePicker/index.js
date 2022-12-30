import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { calculateTime } from "../../utilities";

import "./TimePicker.css";

const MAX_TIME = 100;
const STEP_SIZE = 5;

class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    changeValue = diff => {
        const min = this.props.min ? this.props.min : 0;
        const max = this.props.max ? this.props.max : MAX_TIME;
        let newValue = this.state.value + diff;
        if (newValue < min) {
            newValue = min;
        }
        if (newValue > max) {
            newValue = max;
        }
        this.setState({ value: newValue });
        this.props.onChange(newValue);
    };

    render() {
        return (
            <div className="time-picker-container">
                <ButtonGroup>
                    <Button variant="light" onClick={() => this.changeValue(-STEP_SIZE)}>
                        -{STEP_SIZE}
                    </Button>
                    <div className='time-display'>
                        <span className="time-display-value">
                            {
                                this.state.value === 0 && this.props.zeroText
                                    ? this.props.zeroText
                                    : calculateTime(this.state.value, false)
                            }
                        </span>
                    </div>
                    <Button variant="light" onClick={() => this.changeValue(STEP_SIZE)}>
                        +{STEP_SIZE}
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default TimePicker;
