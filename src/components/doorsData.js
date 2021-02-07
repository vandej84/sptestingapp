import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

// Apply plugin with configuration


class Doors extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          doorMsg: '{"null": 0}'
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-door-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
              this.setState({ doorMsg: data.value });
            }
            catch (error){
              console.log("Error, are you sending the correct data?");
            }
          },
          error: error => console.error(error),
          close: () => console.log('Done'),
        });
      }
	  
	  publishOpenDoor = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Online"});
		PubSub.publish('mydorm-door-iot-policy', {"Door":"Unlocked"});
	  }
	  publishCloseDoor = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-door-iot-policy', {"Door":"Locked"});
	  }
	  
    render(){
        const { doorMsg } = this.state;
        let doorData = doorMsg[this.props.name];

        return(
            <div className="Door">
                <Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							<button onClick={this.publishOpenDoor}>Unlock Door</button>
							<br/>
							<br/>
							<button onClick={this.publishCloseDoor}>Lock Door</button>
                        </Card.Text>
                    </Card.Body>
                </Card>
				<Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { doorData }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Doors;