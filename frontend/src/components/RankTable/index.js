import fileDownload from "js-file-download";
import React, { Component } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

import { compareNicknames, comparePoints, formatSpeed } from "../../utilities";
import { MS_PER_SEC } from "../../utilities/constants";
import LogicSwitch from "../LogicSwitch";

import './RankTable.css';

class RankTable extends Component {

    constructor(props) {
        super(props);
        this.state = { byPoints: true };
        this.onSortByPoints = this.onSortByPoints.bind(this);
        this.onDownload = this.onDownload.bind(this);
    }

    onSortByPoints(value) {
        this.setState({ byPoints: value });
    }


    getSortedRows() {
        const data = this.props.data.slice();
        data.sort(this.state.byPoints ? comparePoints : compareNicknames);
        return data;
    }

    onDownload() {
        const header = `"Place", "Player", "Points", "Speed (seconds per answer)"`;
        const rows = this.getSortedRows().map((item, index) => {
            const speed = 0 === item.points ? "" : (Math.round(item.duration / item.points) / MS_PER_SEC);
            return `${index + 1}, ${item.nickname}, ${item.points}, ${speed}`;
        }).join("\n");
        fileDownload(`${header}\n${rows}\n`, "quiz.csv");
    }

    renderRows() {
        let key = 0;
        return this.getSortedRows().map((item, index) => {
            key++;
            return (
                <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{item.nickname}</td>
                    <td>{item.points}</td>
                    <td>{formatSpeed(item.duration, item.points)}</td>
                </tr>
            );
        });
    }

    render() {
        if (this.props.data) {
            return (
                <div className="rank-table">
                    {
                        this.props.showHeader &&
                        <Container fluid style={{ marginBottom: '20px' }}>
                            <Row>
                                <Col xs={6}>
                                    <LogicSwitch
                                        value={this.state.byPoints}
                                        offText="Sort by name"
                                        onText="Sort by points"
                                        onChange={this.onSortByPoints}
                                    />
                                </Col>
                                <Col xs={6}>
                                    <Button variant="secondary" onClick={this.onDownload}>
                                        Export to CSV file
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    }
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Place</th>
                                <th>Player</th>
                                <th>Points</th>
                                <th>Answer speed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </Table>
                </div >
            );
        } else {
            return (
                <span />
            );
        }
    }
}

export default RankTable;;
