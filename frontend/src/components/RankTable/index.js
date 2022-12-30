import React, { Component } from "react";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import LogicSwitch from "../LogicSwitch";
import fileDownload from "js-file-download";
import { formatSpeed, sortByPoints } from "../../utilities";
import { MS_PER_SEC } from "../../utilities/constants";

import './RankTable.css';

class RankTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            byPoints: true
        };
    }

    sortAlphabetically = (a, b) => {
        const nameA = a.nickname.toUpperCase();
        const nameB = b.nickname.toUpperCase();
        if (nameA < nameB) {
            return -1;
        } else {
            return (nameA > nameB) ? 1 : 0;
        }
    };

    render() {
        if (this.props.data) {
            const csv = [["Place", "Player", "Points", "Speed (seconds per answer)"]];
            const data = this.props.data.slice();
            let no = 1;
            data.sort(this.state.byPoints ? sortByPoints : this.sortAlphabetically);
            data.forEach(item => {
                const speed = 0 === item.points ? "" : (Math.round(item.duration / item.points) / MS_PER_SEC);
                csv.push([no, item.nickname, item.points, speed]);
                no++;
            });
            const csvFile = csv.map(e => e.join(",")).join("\n");
            no = 1;

            return (
                <div className="rank-table">
                    {
                        this.props.showHeader &&
                        <Container fluid style={{ marginBottom: '20px' }}>
                            <Row>
                                <Col xs={6}>
                                    <LogicSwitch value={this.state.byPoints}
                                        offText="Alphabetically"
                                        onText="Points descending"
                                        onChange={val => { this.setState({ byPoints: val }); }} />
                                </Col>
                                <Col xs={6}>
                                    <Button variant="secondary" onClick={() => {
                                        fileDownload(csvFile, 'quiz.csv');
                                    }}>
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
                            {data.map(item => {
                                no++;
                                return (
                                    <tr key={no}>
                                        <td>{no - 1}</td>
                                        <td>{item.nickname}</td>
                                        <td>{item.points}</td>
                                        <td>{formatSpeed(item.duration, item.points)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            );
        } else {
            return (
                <span />
            );
        }
    }
}

export default RankTable;
