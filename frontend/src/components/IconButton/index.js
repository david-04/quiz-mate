import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import "./IconButton.css";

class IconButton extends Component {

    renderButton() {
        const style = name => this.props[`${name}Style`] || {};
        const classNames = (name, defaultClassNames) => [
            defaultClassNames || "",
            this.props[`${name}ClassNames`] || ""
        ].join(" ");

        const onClick = () => this.props.onClick ? this.props.onClick(this.props.navigate) : undefined;
        const variant = this.props.variant || "secondary";
        const disabled = undefined !== this.props.disabled && null !== this.props.disabled
            ? this.props.disabled
            : false;
        const invert = this.props.invert === false ? "" : "invert";

        return (
            <div className={"icon-button " + (this.props.containerClassName || "")} style={style("container")}>
                <Button variant={variant}
                    disabled={disabled}
                    className={classNames("button")} style={style("button")} onClick={onClick}>
                    <img
                        src={this.props.icon}
                        alt={this.props.label}
                        className={classNames("icon", invert)}
                        style={style("icon")}
                    />
                    <span className={classNames("label")} style={style("label")}>{this.props.label}</span>
                    {this.props.children}
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
