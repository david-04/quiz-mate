import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./IconButton.css";

class IconButton extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.navigate);
        }
    }

    getClassNames(name, defaultClassNames) {
        return [
            defaultClassNames || "",
            this.props[`${name}ClassName`] || ""
        ].join(" ");
    }

    getStyle(name) {
        return this.props[`${name}Style`] || {};
    }

    renderLabel() {
        if (this.props.label) {
            return (
                <span className={this.getClassNames("label")} style={this.getStyle("label")}>{this.props.label}</span>
            );
        } else {
            return false;
        }
    }

    renderButton() {
        const variant = this.props.variant || "secondary";
        const disabled = undefined !== this.props.disabled && null !== this.props.disabled
            ? this.props.disabled
            : false;
        const invert = "warning" !== this.props.variant;

        return (
            <div className={"icon-button " + (this.props.containerClassName || "")} style={this.getStyle("container")}>
                <Button variant={variant} disabled={disabled} style={this.getStyle("button")} onClick={this.onClick}>
                    <div>
                        <img
                            src={this.props.icon}
                            alt={this.props.label || ""}
                            className={this.getClassNames("icon", invert ? "invert" : "")}
                            style={this.getStyle("icon")}
                        />
                        {this.renderLabel()}
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

function IconButtonWithNavigate(props) {
    return (<IconButton {...props} navigate={useNavigate()} />);
}

export default IconButtonWithNavigate;
