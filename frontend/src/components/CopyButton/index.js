import { Component } from "react";
import { Button } from "react-bootstrap";

import Check from "../../assets/icons/check.svg";
import ContentCopy from "../../assets/icons/content_copy.svg";

import "./CopyButton.css";

class CopyButton extends Component {
    constructor(props) {
        super(props);
        this.state = { copyButtonVariant: undefined };
        this.copyToClipboard = this.copyToClipboard.bind(this);
    }

    copyToClipboard() {
        navigator.clipboard
            .writeText(this.props.text)
            .then(() => this.flickerCopyButton("success"))
            .catch(() => this.flickerCopyButton("danger"));
    }

    flickerCopyButton(copyButtonVariant) {
        this.setState(
            { copyButtonVariant },
            () => setTimeout(() => this.setState({ copyButtonVariant: undefined }), 1000)
        );
    }

    render() {
        const copyButtonVariant = this.state.copyButtonVariant || "warning";
        const copyButtonStyle = { filter: "warning" === copyButtonVariant ? "none" : "invert(100%)" };
        const copyButtonIcon = "success" === copyButtonVariant ? Check : ContentCopy;
        return (
            <Button variant={copyButtonVariant} onClick={this.copyToClipboard}>
                <img src={copyButtonIcon} alt="Copy URL" style={copyButtonStyle} />
            </Button>
        );
    }
}

export default CopyButton;
