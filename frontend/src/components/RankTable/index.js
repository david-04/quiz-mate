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
        this.state = { orderByName: false };
        this.onChangeSortOrder = this.onChangeSortOrder.bind(this);
        this.onDownload = this.onDownload.bind(this);
        this.mapRowToCsv = this.mapRowToCsv.bind(this);
        this.renderRow = this.renderRow.bind(this);
    }

    onChangeSortOrder(orderByName) {
        this.setState({ orderByName });
    }

    getSortedRows() {
        const dataOrderedByPoints = this.props.data.slice(0);
        dataOrderedByPoints.sort(comparePoints);
        const rows = dataOrderedByPoints.map((item, index) => ({
            nickname: item.nickname,
            points: item.points,
            duration: item.duration,
            place: index + 1
        }));
        if (this.state.orderByName) {
            rows.sort(compareNicknames);
        }
        return rows;
    }

    mapRowToCsv(item) {
        const speed = 0 === item.points ? "" : (Math.round(item.duration / item.points) / MS_PER_SEC);
        return `${item.place}, ${item.nickname}, ${item.points}, ${speed}`;
    }

    onDownload() {
        const header = `"Place", "Player", "Points", "Speed (seconds per answer)"`;
        const rows = this.getSortedRows().map(this.mapRowToCsv).join("\n");
        fileDownload(`${header}\n${rows}\n`, "quiz.csv");
    }

    renderRow(item, index) {
        return (
            <tr key={index}>
                <td>{item.place}</td>
                <td>{item.nickname}</td>
                <td>{item.points}</td>
                <td>{formatSpeed(item.duration, item.points)}</td>
            </tr>
        );
    }

    renderHeader() {
        if (this.props.showHeader) {
            return (
                <Container fluid style={{ marginBottom: '20px' }}>
                    <Row>
                        <Col xs={6} style={{ textAlign: "left", paddingLeft: "0" }}>
                            <LogicSwitch
                                value={this.state.orderByName}
                                offText="Order by points"
                                onText="Order by name"
                                onChange={this.onChangeSortOrder}
                            />
                        </Col>
                        <Col xs={6} style={{ textAlign: "right", paddingRight: "0" }}>
                            <Button variant="secondary" onClick={this.onDownload}>
                                Export to CSV file
                            </Button>
                        </Col>
                    </Row>
                </Container>
            );
        } else {
            return false;
        }
    }

    renderTable() {
        return (
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
                    {this.getSortedRows().map(this.renderRow)}
                </tbody>
            </Table>
        );
    }

    render() {
        if (this.props.data) {
            return (
                <div className="rank-table">
                    {this.renderHeader()}
                    {this.renderTable()}
                </div >
            );
        } else {
            return false;
        }
    }
}

export default RankTable;;
