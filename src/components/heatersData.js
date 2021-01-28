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


class Heaters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          heaterMsg: '{"null": 0}'
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-heater-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
              this.setState({ heaterMsg: data.value });
            }
            catch (error){
              console.log("Error, are you sending the correct data?");
            }
          },
          error: error => console.error(error),
          close: () => console.log('Done'),
        });
      }
	  
	  publishHeaterOn = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Online"});
		PubSub.publish('mydorm-heater-iot-policy', {"Heater":"On"});
	  }
	  publishHeaterOff = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-heater-iot-policy', {"Heater":"Off"});
	  }
	  
    render(){
        const { heaterMsg } = this.state;
        let heaterData = heaterMsg[this.props.name];

        return(
            <div className="Heater">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							<button onClick={this.publishHeaterOn}>Turn Heater On</button>
							<br/>
							<br/>
							<button onClick={this.publishHeaterOff}>Turn Heater Off</button>
                        </Card.Text>
                    </Card.Body>
                </Card>
				<Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { heaterData }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Heaters;