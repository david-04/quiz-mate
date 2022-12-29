import React from 'react'
import CenterBox from "../../components/CenterBox";
import {Container, Row, Col, Button, Modal} from 'react-bootstrap'
import './Editor.css';
import QuestionExplorer from "../../components/QuestionExplorer";
import QuestionEditor from "../../components/QuestionEditor";
import Downloader from 'react-file-download'
import {validateJson} from "../../utilities";
import {t} from 'react-switch-lang';

import CloseIcon from '@material-ui/icons/Close';
import PublishIcon from '@material-ui/icons/Publish';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            originalName: '',
            workspace: [],
            selectedIndex: -1,
            changed: false,
            exitModal: false,
            deleteModal: false,
            uploadModal: false
        };
        this.inputFile = React.createRef();
    }

    changeSelecion = (index) => {
        this.setState({
            selectedIndex: index
        })
    };

    exitButton = () => {
        if(this.state.changed) {
            this.setState({exitModal: true})
        }else{
            this.props.history.push('/');
        }
    };

    uploadFile = () => {
        if(this.state.changed) {
            this.setState({uploadModal: true});
        }else{
            this.loadProject();
        }
    };

    cancelUpload = () => {
        this.setState({uploadModal: false});
        this.inputFile.current.value = "";
    };

    loadProject = () => {
        this.setState({uploadModal: false});
        let fr = new FileReader();
        fr.onload = (e) => {
            let config = null;
            try {
                config = JSON.parse(e.target.result);
                if(validateJson(config)) {
                    this.setState({
                        workspace: config
                    });
                }else{
                    this.setState({
                        workspace: [],
                        originalName: ''
                    });
                    alert(t('general.badFile'));
                }
            }catch(error) {
                this.setState({
                    workspace: [],
                    originalName: ''
                });
                alert(t('general.badJSON'));
            }
            this.inputFile.current.value = "";
        };
        if(this.inputFile.current.files.item(0)) {
            this.setState({
                originalName: this.inputFile.current.files.item(0).name,
                changed: false
            });
            fr.readAsText(this.inputFile.current.files.item(0));
        }
    };

    downloadFile = () => {
        let name = this.state.originalName;
        if(name === '') {
            name = prompt(t('editor.enterProjectName'));
            if(name === '') {
                name = 'questions.json';
            }else{
                name += '.json';
                this.setState({originalName: name});
            }
        }
        Downloader(JSON.stringify(this.state.workspace, null, 2), name, 'application/json');
        this.setState({changed: false});
    };

    moveQuestion = (diff) => {
        const oldIndex = this.state.selectedIndex;
        const newIndex = oldIndex + diff;
        let newData = this.state.workspace.slice();
        newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0]);
        this.setState({
            workspace: newData,
            selectedIndex: newIndex,
            changed: true
        });
    };

    deleteQuestion = (confirmed) => {
        if(this.state.selectedIndex >= 0) {
            if(confirmed) {
                let newData = this.state.workspace.slice();
                newData.splice(this.state.selectedIndex, 1);
                let newIndex = this.state.selectedIndex;
                if(newIndex >= newData.length) newIndex = newData.length - 1;
                this.setState({
                    deleteModal: false,
                    workspace: newData,
                    selectedIndex: newIndex,
                    changed: true
                });
            }else{
                this.setState({deleteModal: true});
            }
        }
    };

    addQuestion = (onCurrentIndex) => {
        if(onCurrentIndex) {
            let newData = this.state.workspace.slice();
            newData.splice(this.state.selectedIndex + 1, 0, {
                question: '',
                correct: 0,
                answers: ['', '', '', '']
            });
            this.setState({
                workspace: newData,
                selectedIndex: this.state.selectedIndex + 1,
                changed: true
            });
        }else{
            this.setState({
                workspace: [...this.state.workspace, {
                    question: '',
                    correct: 0,
                    answers: ['', '', '', '']
                }],
                selectedIndex: this.state.workspace.length,
                changed: true
            });
        }
    };

    topButtonsConfig = () => [
        {
            text: t('editor.exit'),
            icon: <CloseIcon/>,
            click: this.exitButton
        },
        {
            customUpload: true,
            text: t('editor.upload'),
            icon: <PublishIcon/>,
            click: this.uploadFile
        },
        {
            variant: this.state.workspace.length === 0 || !this.state.changed ? null : 'success',
            text: t('editor.download'),
            icon: <GetAppIcon/>,
            click: this.downloadFile,
            disabled: this.state.workspace.length === 0 || !this.state.changed
        },
        {
            text: t('editor.moveUp'),
            icon: <ArrowUpwardIcon/>,
            click: () => this.moveQuestion(-1),
            disabled: this.state.selectedIndex < 1
        },
        {
            text: t('editor.moveDown'),
            icon: <ArrowDownwardIcon/>,
            click: () => this.moveQuestion(1),
            disabled: this.state.selectedIndex < 0 || this.state.selectedIndex + 1 === this.state.workspace.length
        },
        {
            text: t('editor.delete'),
            icon: <DeleteForeverIcon/>,
            click: () =>this.deleteQuestion(false),
            disabled: this.state.selectedIndex < 0
        },
        {
            text: t('editor.addHere'),
            icon: <AddBoxIcon/>,
            click: () => this.addQuestion(true)
        },
        {
            text: t('editor.addEnd'),
            icon: <AddBoxIcon/>,
            click: () => this.addQuestion(false)
        }
    ];

    updateQuestion = (data) => {
        if(this.state.selectedIndex >= 0) {
            let newData = this.state.workspace.slice();
            newData[this.state.selectedIndex] = data;
            this.setState({
                workspace: newData,
                changed: true
            });
        }
    };

    render() {
        return(
            <CenterBox {...this.props}>
                <div className={"message-box d-block d-sm-block d-md-none"}>
                    {t('editor.smallDevice')}
                </div>
                <Container fluid className={"editor-container d-none d-sm-none d-md-block"}>
                    <Row style={{height: '100%'}}>
                        <Col xl={4} lg={4} md={4} sm={12}>
                            <QuestionExplorer questions={this.state.workspace}
                                              selectedIndex={this.state.selectedIndex}
                                              selected={this.changeSelecion}/>
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={12}>
                            <div className={"question-editor"}>
                                <Container fluid>
                                    <Row noGutters>
                                        {
                                            this.topButtonsConfig().map(btn => {
                                                if(btn.customUpload) {
                                                    return(
                                                        <Col lg={4} md={6} key={btn.text} className={"editor-button-container"}>
                                                            <span className={"btn btn-secondary btn-file editor-button"}>
                                                                {btn.icon}
                                                                {(btn.icon ? ' ' : '') + btn.text}
                                                                <input type={"file"} accept={"application/json"} onChange={this.uploadFile} ref={this.inputFile}/>
                                                            </span>
                                                        </Col>
                                                    );
                                                }else{
                                                    return(
                                                        <Col lg={4} md={6} key={btn.text} className={"editor-button-container"}>
                                                            <Button variant={btn.variant ? btn.variant : 'secondary'}
                                                                    className={"editor-button"}
                                                                    onClick={btn.click}
                                                                    disabled={btn.disabled}>
                                                                {btn.icon}
                                                                {(btn.icon ? ' ' : '') + btn.text}
                                                            </Button>
                                                        </Col>
                                                    );
                                                }
                                            })
                                        }
                                    </Row>
                                    <Row>
                                        <QuestionEditor question={this.state.selectedIndex < 0 ? null : this.state.workspace[this.state.selectedIndex]}
                                                        update={this.updateQuestion}/>
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={this.state.exitModal} onHide={() => this.setState({exitModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('editor.warning')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('editor.exitModal1')}<br/>{t('editor.exitModal2')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.props.history.push('/')}>{t('editor.yesExit')}</Button>
                        <Button variant="secondary" onClick={() => this.setState({exitModal: false})}>{t('editor.noCancel')}</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} onHide={() => this.setState({deleteModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('editor.warning')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('editor.deleteModal')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => this.deleteQuestion(true)}>{t('editor.yesDelete')}</Button>
                        <Button variant="secondary" onClick={() => this.setState({deleteModal: false})}>{t('editor.noCancel')}</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.uploadModal} onHide={this.cancelUpload}>
                    <Modal.Header closeButton>
                        <Modal.Title>{t('editor.warning')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('editor.uploadModal')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.loadProject}>{t('editor.yesUpload')}</Button>
                        <Button variant="secondary" onClick={this.cancelUpload}>{t('editor.noCancel')}</Button>
                    </Modal.Footer>
                </Modal>
            </CenterBox>
        );
    }
}

export default Editor