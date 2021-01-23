import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

Amplify.configure(awsconfig);

// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
 aws_pubsub_region: 'us-east-1',
 aws_pubsub_endpoint: 'wss://afz62ntog0e2g-ats.iot.us-east-1.amazonaws.com/mqtt',
}));


class Windows extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          windowMsg: '{"null": 0}'
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-window-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
              this.setState({ windowMsg: data.value });
            }
            catch (error){
              console.log("Error, are you sending the correct data?");
            }
          },
          error: error => console.error(error),
          close: () => console.log('Done'),
        });
      }
	  
	  publishOpenWindow = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-window-iot-policy', {"Window":"Open"});
	  }
	  publishCloseWindow = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-window-iot-policy', {"Window":"Closed"});
	  }
	  
    render(){
        const { windowMsg } = this.state;
        let windowData = windowMsg[this.props.name];

        return(
            <div className="Window">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							<button onClick={this.publishOpenWindow}>Open Window</button>
							<br/>
							<br/>
							<button onClick={this.publishCloseWindow}>Close Window</button>
                        </Card.Text>
                    </Card.Body>
                </Card>
				<Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { windowData }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Windows;