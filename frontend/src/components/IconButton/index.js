import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./IconButton.css";

class IconButton extends Component {

    renderButton() {
        const getStyle = name => this.props[`${name}Style`] || {};
        const getClassNames = (name, defaultClassNames) => [
            defaultClassNames || "",
            this.props[`${name}ClassName`] || ""
        ].join(" ");

        const onClick = () => this.props.onClick ? this.props.onClick(this.props.navigate) : undefined;
        const variant = this.props.variant || "secondary";
        const disabled = undefined !== this.props.disabled && null !== this.props.disabled
            ? this.props.disabled
            : false;
        const invert = ["warning"] !== this.props.variant;
        const renderLabel = () => this.props.label
            ? <span className={getClassNames("label")} style={getStyle("label")}>{this.props.label}</span>
            : false;

        return (
            <div className={"icon-button " + (this.props.containerClassName || "")} style={getStyle("container")}>
                <Button variant={variant} disabled={disabled} style={getStyle("button")} onClick={onClick}>
                    <div>
                        <img
                            src={this.props.icon}
                            alt={this.props.label || ""}
                            className={getClassNames("icon", invert)}
                            style={getStyle("icon")}
                        />
                        {renderLabel()}
                        {this.props.children}
                    </div>
                </Button>
            </div>
        );
    }

    renderLink() {
        return (
            <Link to={this.props.link}>
                {this.renderButton()}
            </Link>
        );
    }

    render() {
        return this.props.link ? this.renderLink() : this.renderButton();
    }
}

const IconButtonWithNavigate = props => (<IconButton {...props} navigate={useNavigate()} />);

export default IconButtonWithNavigate;
