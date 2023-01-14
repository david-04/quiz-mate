import { Component } from "react";
import { Button } from "react-bootstrap";

import Check from "../../assets/icons/check.svg";
import ContentCopy from "../../assets/icons/content_copy.svg";

import "./CopyButton.css";

class CopyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { variant: undefined, image: undefined };
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    copyToClipboard() {
        const success = "default" === this.props.variant ? "default" : "success";
        const danger = "default" === this.props.variant ? "default" : "danger";
        navigator.clipboard
            .writeText(this.props.text)
            .then(() => this.flickerCopyButton(success, Check))
            .catch(() => this.flickerCopyButton(danger, ContentCopy));
    }

    flickerCopyButton(variant, image) {
        this.setState(
            { variant, image },
            () => setTimeout(() => this.setState({ variant: undefined, image: undefined }), 700)
        );
    }

    render() {
        const variant = this.state.variant || this.props.variant || "warning";
        const copyButtonStyle = { filter: "warning" === variant ? "none" : "invert(100%)" };
        const copyButtonIcon = this.state.image || ContentCopy;
        return (
            <Button variant={variant} onClick={this.copyToClipboard}>
                <img src={copyButtonIcon} alt="Copy URL" style={copyButtonStyle} />
            </Button>
        );
    }
}

export default CopyButton;
