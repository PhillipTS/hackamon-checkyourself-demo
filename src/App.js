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
};

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
};

const messages = {
  good: 'This is friendly and nice. Good job!',
  neutral: 'This is neutral text and fine to post.',
  bad: 'What you\'ve written may be interpreted as offensive or hurtful. Please reconsider your language.'
};

const getMessage = status => {
  // Function that selects a message based on a status
  switch(status) {
    case "Good":
      return messages.good
    case "Neutral":
      return messages.neutral
    case "Bad":
      return messages.bad
    default:
      console.error("Invalid Status: ", status);
      return
  }
}

function callAPI(text) {
  // Making the call to the back end. Uses axios to make the request and return a Promise
  return axios(localAPI ? 'http://localhost:8080' : 'http://hackamon-checkyourself.appspot.com', {
    method: 'POST',
    data: text
  }).then(resp => resp.data)
}

// React Class Component
class App extends Component {
  
  constructor(props) {
    super(props);
    // Declare the components state and initialise values
    this.state = {
      analysed: false,  // Whether or not the text is currently analyse/when a status light should be activated
      safe: null  //  Result from call to API. The safe status of the current;y analysed text(Bad/Neutral/Good)
    };
  }

  analyse(text) {
    // Function that belongs to the component so that it can access the state and keep all the components logic in the component
    console.log("Text: ", text);
    callAPI(text).then((data)=>{
      console.log(data)
      this.setState({analysed: true, safe: data.safe})  // Calls function to change values in the state. Never mutate state directly
    })
  }

  render() {
    // Render method for a React Class Component returns what will be rendered on the screen
    return (
      // Language from here on is JSX. HTML style tags but you caan write js in braces.
      // Render method should always be kept pure!
      <div>
        <Row>
          <Col xs={1} sm={1} md={1} lg={1}/>  {/*Different values set the size of the column on differet sized screens. Enables responsivness*/}
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
              <TextField  // Materual UI Next Pre-made component that follows Material Design convention
                // Props given to this component
                fullWidth // fullwidth={true}
                label='Enter text here'
                // Callback functions
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

// React Functional Component. Doesn't need it's own state or a lot of logic so it can be written as a function that takes props as params
const StatusMessage = props => {
  const { status } = props; // Object Destructuring. const status = props.status;
  if (!status) {return <div/>}
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
};

const Light = props => {
  const { styles, active } = props;
  return <Avatar alt='status-light' style={active ? styles : avatarStyles.default} children='A'/>
};

// Musst always remember to export the component that needs to be called elsewhere
export default App;
