import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Container, Row, Col, Button} from 'react-bootstrap';
import LogicSwitch from "../LogicSwitch";
import Downloader from 'react-file-download';
import {t} from 'react-switch-lang';
import './RankTable.css';

class RankTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            byPoints: true
        }
    }

    sortByPoints = (a, b) => {
        if(a.points < b.points) return 1;
        if(a.points > b.points) return -1;
        return 0;
    };

    sortAlphabetically = (a, b) => {
        const nameA = a.nickname.toUpperCase();
        const nameB = b.nickname.toUpperCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    };

    render() {
        if(this.props.data) {
            let csv = [[t('components.no'), t('components.nickname'), t('components.points')]];
            let data = this.props.data.slice();
            let no = 1;
            data.sort(this.state.byPoints ? this.sortByPoints : this.sortAlphabetically);
            data.forEach(item => {
                csv.push([no++, item.nickname, item.points]);
            });
            const csvFile = csv.map(e => e.join(",")).join("\n");
            no = 1;

            return (
                <div className={"rank-table"}>
                    {
                        this.props.showHeader &&
                        <Container fluid style={{marginBottom: '20px'}}>
                            <Row noGutters>
                                <Col xs={6}>
                                    <LogicSwitch value={this.state.byPoints}
                                                 offText={t('components.orderAlphabetically')}
                                                 onText={t('components.orderPointsDESC')}
                                                 onChange={(val) => {this.setState({byPoints: val})}}/>
                                </Col>
                                <Col xs={6}>
                                    <Button variant={"secondary"} onClick={() => {
                                        Downloader(csvFile, 'quiz.csv');
                                    }}>
                                        {t('components.exportCSVFile')}
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    }
                    <Table striped bordered>
                        <thead>
                        <tr>
                            <th>{t('components.no')}</th>
                            <th>{t('components.nickname')}</th>
                            <th>{t('components.points')}</th>
                        </tr>
                        </thead>
                        <tbody>
                            {data.map(item => {
                                return(
                                    <tr key={no}>
                                        <td>{no++}</td>
                                        <td>{item.nickname}</td>
                                        <td>{item.points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            );
        }else{
            return (
                <span/>
            );
        }
    }
}

export default RankTable;