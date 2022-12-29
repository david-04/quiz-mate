import React, {Component} from 'react';
import {Dropdown} from "react-bootstrap";
import {languages, changeLanguage} from "../../lang";
import {getLanguage} from 'react-switch-lang'

class LanguageSwitch extends Component {
    render() {
        return (
            <Dropdown drop={"up"}>
                <Dropdown.Toggle variant={"secondary"}> Language: {getLanguage()} </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        languages.map(item => {
                            return(
                                <Dropdown.Item key={item} onClick={() => changeLanguage(item)}>
                                    {item}
                                </Dropdown.Item>
                            )
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default LanguageSwitch;