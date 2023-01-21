import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

import "./NumberPicker.css";

const STEP_SIZE = 10;
const MAX_VALUE = 100;

class NumberPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.incrementOne = this.incrementOne.bind(this);
        this.incrementMany = this.incrementMany.bind(this);
        this.decrementOne = this.decrementOne.bind(this);
        this.decrementMany = this.decrementMany.bind(this);
    }

    incrementOne() {
        this.changeValue(1);
    }

    incrementMany() {
        this.changeValue(STEP_SIZE);
    }

    decrementOne() {
        this.changeValue(-1);
    }

    decrementMany() {
        this.changeValue(-STEP_SIZE);
    }

    changeValue(diff) {
        const min = this.props.min ? this.props.min : 0;
        const max = this.props.max ? this.props.max : MAX_VALUE;
        let newValue = this.state.value + diff;
        if (newValue < min) {
            newValue = min;
        }
        if (newValue > max) {
            newValue = max;
        }
        this.setState({ value: newValue });
        this.props.onChange(newValue);
    }

    render() {
        return (
            <div className="number-picker-container">
                <ButtonGroup>
                    <Button variant="light" onClick={this.decrementOne}>
                        -1
                    </Button>
                    <Button variant="light" onClick={this.decrementMany}>
                        -{STEP_SIZE}
                    </Button>
                    <div className='number-display'>
                        <span className="number-display-value">
                            {this.state.value === 0 && this.props.zeroText ? this.props.zeroText : this.state.value}
                        </span>
                    </div>
                    <Button variant="light" onClick={this.incrementMany}>
                        +{STEP_SIZE}
                    </Button>
                    <Button variant="light" onClick={this.incrementOne}>
                        +1
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default NumberPicker;
