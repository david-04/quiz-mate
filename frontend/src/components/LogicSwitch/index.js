import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

class LogicSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = { value: props.value };
        this.changeValueToTrue = this.changeValueToTrue.bind(this);
        this.changeValueToFalse = this.changeValueToFalse.bind(this);
    }

    changeValueToTrue() {
        this.changeValue(true);
    }

    changeValueToFalse() {
        this.changeValue(false);
    }

    changeValue(newValue) {
        this.setState({ value: newValue });
        this.props.onChange(newValue);
    }

    switchButtonStyle = {
        paddingLeft: "20px",
        paddingRight: "20px",
        height: "40px"
    };

    render() {
        return (
            <div>
                <ButtonGroup>
                    <Button
                        variant={!this.state.value ? "secondary" : "light"}
                        onClick={this.changeValueToFalse}
                        style={this.switchButtonStyle}
                    >
                        {this.props.offText ? this.props.offText : "OFF"}
                    </Button>
                    <Button
                        variant={this.state.value ? "secondary" : "light"}
                        onClick={this.changeValueToTrue}
                        style={this.switchButtonStyle}
                    >
                        {this.props.onText ? this.props.onText : "ON"}
                    </Button>
                </ButtonGroup>
            </div>
        );
    }
}

export default LogicSwitch;
