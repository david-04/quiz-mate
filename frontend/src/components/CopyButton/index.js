import { Component } from "react";
import { Button } from "react-bootstrap";

import Check from "../../assets/icons/check.svg";
import ContentCopy from "../../assets/icons/content_copy.svg";

const FLICKER_TIMEOUT = 700;

class CopyButton extends Component {

    constructor(props) {
        super(props);
        this.state = { variant: undefined, image: undefined };
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.resetButton = this.resetButton.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.scheduleResetButton = this.scheduleResetButton.bind(this);
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.props.text).then(this.onSuccess).catch(this.onError);
    }

    onSuccess() {
        this.onSuccessOrError("default" === this.props.variant ? "default" : "success", Check);
    }

    onError() {
        this.onSuccessOrError("default" === this.props.variant ? "default" : "danger", ContentCopy);
    }

    onSuccessOrError(variant, image) {
        this.setState({ variant, image }, this.scheduleResetButton);
    }

    scheduleResetButton() {
        setTimeout(this.resetButton, FLICKER_TIMEOUT);
    }

    resetButton() {
        this.setState({ variant: undefined, image: undefined });
    }

    render() {
        const variant = this.state.variant || this.props.variant || "warning";
        const copyButtonStyle = { filter: "warning" === variant ? "none" : "invert(100%)" };
        const copyButtonIcon = this.state.image || ContentCopy;
        return (
            <Button variant={variant} onClick={this.copyToClipboard} className={this.props.className || ""}>
                <img src={copyButtonIcon} alt="Copy URL" style={copyButtonStyle} />
            </Button>
        );
    }
}

export default CopyButton;
