import React, { Component } from "react";
import { Container, Row } from "react-bootstrap";

import "./QuestionExplorer.css";

class QuestionExplorer extends Component {

    constructor(props) {
        super(props);
        this.renderListItem = this.renderListItem.bind(this);
    }

    renderListItem(item, index) {
        return (
            <div
                className={
                    "question-explorer-list-item"
                    + (this.props.selectedIndex === index ? ' item-selected' : '')
                }
                key={index}
                onClick={() => this.props.selected(index)}>
                {`${index + 1}. ${item.question}`}
            </div>
        );
    }

    renderListItems() {
        if (this.props.questions.length === 0) {
            return (
                <div className="question-explorer-list" style={{ fontSize: '1rem', marginTop: '30px' }}>
                    No questions yet
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
