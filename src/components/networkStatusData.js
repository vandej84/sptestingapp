import React from 'react';
import Card from 'react-bootstrap/Card';

import Amplify from 'aws-amplify';
import awsconfig from './../aws-exports';
import '@aws-amplify/ui/dist/style.css';

import { PubSub, Auth } from 'aws-amplify';

Amplify.configure(awsconfig);

// Apply plugin with configuration


class NetStatus extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          netStatusMsg: '{"null": 0}'
        };
    }

    componentDidMount(){
        PubSub.subscribe('mydorm-networkstatus-iot-policy').subscribe({
          next: data => {
            try{
				console.log(data)
              this.setState({ netStatusMsg: data.value });
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
        const { netStatusMsg } = this.state;
        let netStatusData = netStatusMsg[this.props.name];

        return(
            <div className="NetStatus">
				<Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>{this.props.name} Status</Card.Title>
                        <Card.Text> 
                            { netStatusData }
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default NetStatus;