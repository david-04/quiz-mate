import fileDownload from 'js-file-download';
import { Component, createRef } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import AddBox from "../../assets/icons/add_box.svg";
import ArrowDownward from "../../assets/icons/arrow_downward.svg";
import ArrowUpward from "../../assets/icons/arrow_upward.svg";
import Close from "../../assets/icons/close.svg";
import DeleteForever from "../../assets/icons/delete_forever.svg";
import GetApp from "../../assets/icons/get_app.svg";
import "../../assets/icons/material-ui-icon.css";
import Publish from "../../assets/icons/publish.svg";
import CenterBox from "../../components/CenterBox";
import QuestionEditor from "../../components/QuestionEditor";
import QuestionExplorer from "../../components/QuestionExplorer";
import { upliftQuiz, validateQuiz } from "../../utilities/quiz-data";
import { SAMPLE_QUIZ } from "../../utilities/sample-quiz";
import './Editor.css';

const SPACE_PER_TAB = 4;

class Editor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            originalName: '',
            workspace: [],
            title: '',
            selectedIndex: -1,
            changed: false,
            exitModal: false,
            deleteModal: false,
            uploadModal: false,
            downloadModal: false,
            downloadModalMessage: undefined
        };
        this.inputFile = createRef();
        this.onTitleChange = this.onTitleChange.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.hideExitModal = this.hideExitModal.bind(this);
        this.navigateToStartPage = this.navigateToStartPage.bind(this);
        this.hideDeleteModal = this.hideDeleteModal.bind(this);
        this.deleteQuestionWithoutConfirmation = this.deleteQuestionWithoutConfirmation.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    onTitleChange(event) {
        this.setState({ title: event.target.value, changed: true });
    }

    hideExitModal() {
        this.setState({ exitModal: false });
    }

    navigateToStartPage() {
        this.props.navigate('/');
    }

    hideDeleteModal() {
        this.setState({ deleteModal: false });
    }

    changeSelection(index) {
        this.setState({
            selectedIndex: index
        });
    };

    exitButton = () => {
        if (this.state.changed) {
            this.setState({ exitModal: true });
        } else {
            this.props.navigate('/');
        }
    };

    uploadFile() {
        if (this.state.changed) {
            this.setState({ uploadModal: true });
        } else {
            this.loadProject();
        }
    }

    cancelUpload = () => {
        this.setState({ uploadModal: false });
        this.inputFile.current.value = "";
    };

    cancelDownload = () => {
        this.setState({ downloadModal: false, downloadModalMessage: undefined });
    };

    loadProject = () => {
        this.setState({ uploadModal: false });
        const fr = new FileReader();
        fr.onload = e => {
            this.displayLoadedQuizQuestions(upliftQuiz(JSON.parse(e.target.result)));
            this.inputFile.current.value = "";
        };
        if (this.inputFile.current.files.item(0)) {
            this.setState({
                originalName: this.inputFile.current.files.item(0).name,
                changed: false
            });
            fr.readAsText(this.inputFile.current.files.item(0));
        }
    };

    loadSampleQuiz = () => {
        this.displayLoadedQuizQuestions(SAMPLE_QUIZ);
    };

    displayLoadedQuizQuestions = ({ title, questions }) => {
        this.setState({ title: title, workspace: questions, selectedIndex: questions.length ? 0 : -1 });
    };


    downloadButton = () => {
        try {
            validateQuiz(this.assembleDownloadableQuiz());
            this.downloadFile();
        } catch (error) {
            const downloadModalMessage = error instanceof Error ? error.message : `${error}`;
            this.setState({ downloadModal: true, downloadModalMessage });
        }
    };

    downloadFile = () => {
        this.setState({ downloadModal: false, downloadModalMessage: undefined });
        let name = this.state.originalName;
        if (name === "") {
            name = prompt("Enter the project name or leave the field empty:");
            if (name === '') {
                name = 'questions.json';
            } else {
                name += '.json';
                this.setState({ originalName: name });
            }
        }
        const json = JSON.stringify(this.assembleDownloadableQuiz(), null, SPACE_PER_TAB);
        fileDownload(json, name);
        this.setState({ changed: false });
    };

    assembleDownloadableQuiz = () => ({ title: this.state.title, questions: this.state.workspace });

    moveQuestion = diff => {
        const oldIndex = this.state.selectedIndex;
        const newIndex = oldIndex + diff;
        const newData = this.state.workspace.slice();
        newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0]);
        this.setState({
            workspace: newData,
            selectedIndex: newIndex,
            changed: true
        });
    };

    deleteQuestion() {
        if (this.state.selectedIndex >= 0) {
            this.setState({ deleteModal: true });
        }
    };

    deleteQuestionWithoutConfirmation() {
        const newData = this.state.workspace.slice();
        newData.splice(this.state.selectedIndex, 1);
        let newIndex = this.state.selectedIndex;
        if (newIndex >= newData.length) {
            newIndex = newData.length - 1;
        }
        this.setState({
            deleteModal: false,
            workspace: newData,
            selectedIndex: newIndex,
            changed: true
        });
    }

    addQuestion = onCurrentIndex => {
        if (onCurrentIndex) {
            const newData = this.state.workspace.slice();
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
        } else {
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
            text: "Exit",
            icon: <img src={Close} className="material-ui-icon" alt="Close" />,
            click: this.exitButton
        },
        {
            customUpload: true,
            text: "Upload",
            icon: <img src={Publish} className="material-ui-icon" alt="Upload" />,
            click: this.uploadFile
        },
        {
            variant: this.state.workspace.length === 0 || !this.state.changed ? null : 'success',
            text: "Download",
            icon: <img src={GetApp} className="material-ui-icon" alt="Download" />,
            click: this.downloadButton,
            disabled: this.state.workspace.length === 0 || !this.state.changed
        },
        {
            text: "Move up",
            icon: <img src={ArrowUpward} className="material-ui-icon" alt="Move up" />,
            click: () => this.moveQuestion(-1),
            disabled: this.state.selectedIndex < 1
        },
        {
            text: 'Move down',
            icon: <img src={ArrowDownward} className="material-ui-icon" alt="Move down" />,
            click: () => this.moveQuestion(1),
            disabled: this.state.selectedIndex < 0 || this.state.selectedIndex + 1 === this.state.workspace.length
        },
        {
            text: 'Delete question',
            icon: <img src={DeleteForever} className="material-ui-icon" alt="Delete" />,
            click: this.deleteQuestion,
            disabled: this.state.selectedIndex < 0
        },
        {
            text: 'Insert question',
            icon: <img src={AddBox} className="material-ui-icon" alt="Add here" />,
            click: () => this.addQuestion(true)
        },
        {
            text: 'Append question',
            icon: <img src={AddBox} className="material-ui-icon" alt="Add at the end" />,
            click: () => this.addQuestion(false)
        }
    ];

    updateQuestion = data => {
        if (this.state.selectedIndex >= 0) {
            const newData = this.state.workspace.slice();
            newData[this.state.selectedIndex] = data;
            this.setState({
                workspace: newData,
                changed: true
            });
        }
    };

    render() {
        return (
            <CenterBox {...this.props}>
                <div className="message-box d-block d-sm-block d-md-none">
                    The browser window is too small to display the quiz editor
                </div>
                <Container fluid className="editor-container d-none d-sm-none d-md-block">
                    <Row style={{ height: '100%', padding: "15px 0 15px 0" }}>
                        <Col xl={4} lg={4} md={4} sm={12}>
                            <QuestionExplorer questions={this.state.workspace}
                                selectedIndex={this.state.selectedIndex}
                                selected={this.changeSelection} />
                        </Col>
                        <Col xl={8} lg={8} md={8} sm={12} style={{ paddingLeft: "5px" }}>
                            <div className="question-editor">
                                <Container fluid>
                                    <Row style={{ padding: "20px 0px 20px 0px" }}>
                                        <Col lg={12} md={12}>
                                            <Form.Control
                                                as="input"
                                                value={this.state.title}
                                                onChange={this.onTitleChange}
                                                className={this.state.title ? '' : 'missing-title'}
                                                placeholder="Quiz Title"
                                                maxLength="200"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="editor-button-container-row">
                                        {
                                            this.topButtonsConfig().map(btn => {
                                                if (btn.customUpload) {
                                                    return (
                                                        <Col lg={4} md={6} key={btn.text}
                                                            className="editor-button-container">
                                                            <span className="btn btn-secondary btn-file editor-button">
                                                                {btn.icon}
                                                                {(btn.icon ? ' ' : '') + btn.text}
                                                                <input
                                                                    type="file"
                                                                    accept="application/json"
                                                                    onChange={this.uploadFile}
                                                                    ref={this.inputFile}
                                                                />
                                                            </span>
                                                        </Col>
                                                    );
                                                } else {
                                                    return (
                                                        <Col lg={4} md={6} key={btn.text}
                                                            className="editor-button-container">
                                                            <Button variant={btn.variant ? btn.variant : 'secondary'}
                                                                className="editor-button"
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
                                        <QuestionEditor
                                            question={
                                                this.state.selectedIndex < 0
                                                    ? null
                                                    : this.state.workspace[this.state.selectedIndex]
                                            }
                                            update={this.updateQuestion}
                                            loadSampleQuiz={this.loadSampleQuiz} />
                                    </Row>
                                </Container>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <Modal show={this.state.exitModal} onHide={this.hideExitModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Unsaved changes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you want to exit without saving your changes?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.navigateToStartPage}>Yes, discard changes</Button>
                        <Button variant="secondary" onClick={this.hideExitModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} onHide={this.hideDeleteModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you want to delete this question?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.deleteQuestionWithoutConfirmation}>Yes</Button>
                        <Button variant="secondary" onClick={this.hideDeleteModal}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.uploadModal} onHide={this.cancelUpload}>
                    <Modal.Header closeButton>
                        <Modal.Title>Unsaved changes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you want to open this quiz without saving your previous changes?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.loadProject}>Yes, discard changes</Button>
                        <Button variant="secondary" onClick={this.cancelUpload}>Cancel</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.downloadModal} onHide={this.cancelDownload}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.state.downloadModalMessage}. </p>
                        <p>Do you still want to download the quiz?<br /> You can re-upload and edit it later.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.downloadFile}>Yes, download anyway</Button>
                        <Button variant="secondary" onClick={this.cancelDownload}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </CenterBox>
        );
    }
}

const EditorWithNavigate = props => (<Editor {...props} navigate={useNavigate()} />);

export default EditorWithNavigate;
