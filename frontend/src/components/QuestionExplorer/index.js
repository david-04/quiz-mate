import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";

import "./QuestionExplorer.css";

class QuestionExplorer extends Component {

    constructor(props) {
        super(props);
        this.renderListItem = this.renderListItem.bind(this);
    }

    renderListItem(item, index) {
        const className = [
            "question-explorer-list-item",
            this.props.selectedIndex === index ? ' item-selected' : ''
        ].join(" ");
        return (
            <div className={className}
                key={index}
                onClick={() => this.props.selected(index)}>
                {`${index + 1}. ${item.question}`}
            </div>
        );
    }

    renderListItems() {
        if (this.props.questions.length === 0) {
            return (
                <div className="question-explorer-list" style={{ fontSize: '1rem', padding: '30px', textAlign: "left" }}>
                    {/* This quiz contains new questions yet.<br /><br />Use the "insert question" or "append question" button on the right to add one. */}
                </div>
            );
        } else {
            return (
                <div className="question-explorer-list">
                    {this.props.questions.map(this.renderListItem)}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="question-explorer">
                <Container fluid>
                    <Row>
                        {this.renderListItems()}
                    </Row>
                </Container>
            </div>
        );
    }
}

export default QuestionExplorer;
