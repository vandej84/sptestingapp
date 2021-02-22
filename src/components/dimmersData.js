import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

// Apply plugin with configuration


class Dimmers extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          dimmerMsg: '{"null": 0}',
		  dimmerVal: "50"
        };
    }

    componentDidMount(){
		const oldDim = "0";
        PubSub.subscribe('mydorm-dimmer-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
				this.setState({ dimmerMsg: data.value })
				const { dimmerMsg } = this.state;
				let dataval = dimmerMsg[this.props.name];
                this.updateDimmerValue(dataval);
				console.log("DATAVAL IS " + dataval);
				if (dataval > 0)
				{
					PubSub.publish('mydorm-light-iot-policy', {"Lights":"On"});
				}
				else if (dataval == 0)
				{	
					PubSub.publish('mydorm-light-iot-policy', {"Lights":"Off"});
				}
            }
            catch (error){
              console.log("Error, are you sending the correct data?");
            }
          },
          error: error => console.error(error),
          close: () => console.log('Done'),
        });
      }
 
	  updateDimmerValue(data) {
		console.log("Dimmer is data is " + data);
		this.setState({ dimmerValue: data});
	  }
	  
	  handleChange = e => {
		const newdimmerVal =  e.target.value;
		console.log("DIMMER SLIDER VALUE IS " + newdimmerVal);
		//PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-dimmer-iot-policy', {"Dimmer":e.target.value});
		};
	
	  handleNullChange = e => {
		this.setState({dimmerValue: e.target.value});
		console.log("Dimmer slider has moved to " + e.target.value + ", no action taken");
		};

	  componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
		return;
		};
		}
	
    render(){
		
        const { dimmerMsg } = this.state;
        let dimmerData = dimmerMsg[this.props.name];

        return(
            <div className="Dimmer">
                <Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							<input
							  type="range"
							  min="0"
							  max="100"
							  step="25"
							  value={this.state.dimmerValue}
							  onMouseUp={this.handleChange}
							  onChange={this.handleNullChange}
							  list="ticks" />
							<datalist id="ticks">
							  <option value="0" />
							  <option value="25" />
							  <option value="50" />
							  <option value="75" />
							  <option value="100" />
							</datalist>
							<br/>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Dimmers;