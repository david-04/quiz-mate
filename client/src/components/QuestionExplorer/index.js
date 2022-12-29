import React, {Component} from 'react';
import {Container, Row} from 'react-bootstrap';
import {t} from 'react-switch-lang';
import './QuestionExplorer.css';

class QuestionExplorer extends Component {

    ListItems = () => {
        if(this.props.questions.length === 0) {
            return(
                <div className={"question-explorer-list"} style={{fontSize: '1rem', marginTop: '30px'}}>
                    {t('components.emptyQuestionList')}
                </div>
            )
        }else{
            let no = 0;
            return(
                <div className={"question-explorer-list"}>
                    {
                        this.props.questions.map(item => {
                            const itemNo = no++;
                            return(
                                <div className={"question-explorer-list-item" + (this.props.selectedIndex === itemNo ? ' item-selected' : '')} key={itemNo} onClick={ () => {
                                    this.props.selected(itemNo)
                                }}>
                                    {(itemNo + 1) + '. ' + item.question}
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
    };

    render() {
        return (
            <div className={"question-explorer"}>
                <Container fluid>
                    <Row>
                        <this.ListItems/>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default QuestionExplorer;