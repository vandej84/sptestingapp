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


class Sensors extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          sensorMsg: '{"null": 0}'
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-light-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
              this.setState({ sensorMsg: data.value });
            }
            catch (error){
              console.log("Error, are you sending the correct data?");
            }
          },
          error: error => console.error(error),
          close: () => console.log('Done'),
        });
      }

    render(){
        const { sensorMsg } = this.state;
        let sensorData = sensorMsg[this.props.name];

        return(
            <div className="Sensor">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
                            { sensorData } { this.props.unit }
                        </Card.Text>
                    </Card.Body>
                </Card>

            </div>
        )
    }
}

export default Sensors;