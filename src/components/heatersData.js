import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

// Apply plugin with configuration


class Heaters extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
			heaterMsg: '{"null": 0}', value: ''};
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
	  
	  handleChange = e => {
		console.log('Heater value is changing; no action until publishSetTemperature is called');
		this.setState({value: e.target.value});

	  }
	
	  publishSetTemperature = e => {
		const newHeaterVal =  this.state.value;
		console.log('Heater Val: ' + this.state.value);
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-heater-iot-policy', {"Heater":newHeaterVal})
	  }
	  
    render(){
        const { heaterMsg } = this.state;
        let heaterData = heaterMsg[this.props.name];

        return(
            <div className="Heater">
                <Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							Desired Temperature:
							<input type="text" size="5" value={this.state.value} onChange={this.handleChange} />
							<br/>
							<br/>
							<button onClick={this.publishSetTemperature}>Set Temperature</button>
                        </Card.Text>
                    </Card.Body>
                </Card>
				<Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { heaterData }°F
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Heaters;