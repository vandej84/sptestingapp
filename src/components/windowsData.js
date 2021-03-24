import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

// Apply plugin with configuration


class Windows extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          windowMsg: '{"null": 0}',
		  sliderVal: "50"
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-window-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
				this.setState({ windowMsg: data.value })
				const { windowMsg } = this.state;
				console.log("Window this state is: " + this.state);
				console.log("Window props name is: " + this.props.name);
				let dataval = windowMsg[this.props.name];
				console.log("Window dataval is: " + dataval);
                this.updateSliderValue(dataval)
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
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-window-iot-policy', {"Window":"Open"});
	  }
	  
	  publishCloseWindow = () => {
		console.log('Publishing...');
		PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-window-iot-policy', {"Window":25});

	  }
	  
	  updateSliderValue(data) {
		console.log("Data is " + data);
		this.setState({ sliderValue: data});
	  }
	  
	  handleChange = e => {
		const newWindowVal =  e.target.value;
		console.log("SLIDER VALUE IS " + newWindowVal);
		//PubSub.publish('mydorm-networkstatus-iot-policy', {"Network":"Offline"});
		PubSub.publish('mydorm-window-iot-policy', {"Window":e.target.value});
		};
	
	  handleNullChange = e => {
		this.setState({sliderValue: e.target.value});
		console.log("Slider moved to " + e.target.value + ", no action taken");
		};

	  componentWillUnmount() {
		// fix Warning: Can't perform a React state update on an unmounted component
		this.setState = (state,callback)=>{
		return;
		};
		}
	
    render(){
		
        const { windowMsg } = this.state;
        let windowData = windowMsg[this.props.name];
		

        return(
            <div className="Window">
                <Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name}</Card.Title>
                        <Card.Text> 
							<input
							  type="range"
							  min="0"
							  max="100"
							  step="25"
							  value={this.state.sliderValue}
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
				<Card style={{ width: '14rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { windowData + "% Open" }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Windows;