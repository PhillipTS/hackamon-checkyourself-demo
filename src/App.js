import React, { Component } from 'react';
import Centre from 'react-center';
import {
  TextField,
  Avatar
} from 'material-ui';
import {
  Row,
  Col
} from 'react-flexbox-grid';
import axios from 'axios';

const localAPI = false;

const baseAvatarStyles = {
  margin: 10,
  height: '70px',
  width: '70px'
}

const avatarStyles = {
  default: { 
    ...baseAvatarStyles,
    color: 'grey',
    backgroundColor: 'grey'
  },
  green: {
    ...baseAvatarStyles,
    color: 'green',
    backgroundColor: 'green',
  },
  yellow: {
    ...baseAvatarStyles,
    color: 'yellow',
    backgroundColor: 'yellow',
  },
  red: {
    ...baseAvatarStyles,
    color: 'red',
    backgroundColor: 'red',
  }
}

const messages = {
  good: 'This is friendly and nice. Good job!',
  neutral: 'This is neutral text and fine to post.',
  bad: 'What you\'ve written may be interpreted as offensive or hurtful. Please reconsider your language.'
}

function callAPI(text) {
  return axios(localAPI ? 'http://localhost:8080' : 'http://hackamon-checkyourself.appspot.com', {
    method: 'POST',
    data: text
  }).then(resp => resp.data)
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analysed: false,
      safe: null
    };
  }

  analyse(text) {
    console.log("Text", text);
    callAPI(text).then((data)=>{
      console.log(data)
      this.setState({analysed: true, safe: data.safe})
    })
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={1} sm={1} md={1} lg={1}/>
          <Col xs={10} sm={10} md={10} lg={10}>
            <Centre>
              <h1>Check Your Self Demo</h1>
            </Centre>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col xs={3} sm={3} md={3} lg={3}/>
          <Col xs={6} sm={6} md={6} lg={6}>
            <Centre>
              <TextField
                fullWidth
                label='Enter text here'
                onChange={(event)=>{this.setState({analysed: false})}}
                onBlur={(event)=>{this.analyse(event.target.value)}}
              />
            </Centre>
          </Col>
        </Row>
        <br/>
        <br/>
        <Row>
          <Col xs={1} sm={1} md={1} lg={1}/>
          <Col xs={10} sm={10} md={10} lg={10}>
            <Centre>
              <StatusLights status={this.state.analysed ? this.state.safe : null}/>
            </Centre>
          </Col>
        </Row>
        <br/>
        <Row>
        <Col xs={1} sm={1} md={1} lg={1}/>
          <Col xs={10} sm={10} md={10} lg={10}>
            <Centre>
              <StatusMessage status={this.state.analysed ? this.state.safe : null}/>
            </Centre>
          </Col>
        </Row>
      </div>
    );
  }
}

const StatusMessage = props => {
  const { status } = props;
  if (!status) {return <div/>}
  const getMessage = status => {
    switch(status) {
      case "Good":
        return messages.good
      case "Neutral":
        return messages.neutral
      case "Bad":
        return messages.bad
      default:
        console.error("Invalid Status");
        return ''
    }
  }
  return <h4>{getMessage(status)}</h4>
}

const StatusLights = props => {
  const { status } = props;
  return (
    <div>
      <Light styles={avatarStyles.green} active={status === "Good"}/>
      <Light styles={avatarStyles.yellow} active={status === "Neutral"}/>
      <Light styles={avatarStyles.red} active={status === "Bad"}/>
    </div>
  )
}

const Light = props => {
  const { styles, active } = props;
  return <Avatar alt={Object.keys(styles)[0] + '-light'} style={active ? styles : avatarStyles.default} children='A'/>
}

export default App;
