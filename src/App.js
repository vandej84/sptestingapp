import React, { Component } from 'react';

import "./components/cognitoLayout.css"
import '@aws-amplify/ui/dist/style.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

import Lights from './components/lightsData';
import Doors from './components/doorsData';
import Windows from './components/windowsData';
import Heaters from './components/heatersData';
import NetStatus from './components/networkStatusData';
import Dimmers from './components/dimmersData';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';

import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

import { Auth } from 'aws-amplify';

/**
 * Put in your values from cognito created by cloudformation template
 */

Amplify.configure(awsconfig);

Amplify.addPluggable(new AWSIoTProvider({
 aws_pubsub_region: 'us-east-1',
 aws_pubsub_endpoint: 'wss://afz62ntog0e2g-ats.iot.us-east-1.amazonaws.com/mqtt',
}));

class App extends Component {

  componentDidMount = async() => {
    Auth.currentCredentials().then((info) => {
      console.log('Identity id:', info._identityId);
    });
	
	Auth.currentCredentials().then(creds => console.log(creds));

  }
    

  render() {
    return (
	<div id="parent">
			<header id="banner" role="banner">
				<div id="heading">
					<h1 class="site-title">
						<a class="logo custom-logo" href="/web/home-community" title="Go to home-community">
							<img alt="home-community" height="61" src="/header_image.png" width="2118" />
						</a>
					</h1>
					<h2 class="page-title">
						<span tabindex="0">Home</span>
					</h2>
				</div>
				<nav class="sort-pages modify-pages" id="navigation">
					<h1>
					<span>Navigation</span>
					</h1>
					<div class="navigation-gradient">
					</div>
					<div class="search">
						<form action="https://myfsu.ferris.edu/web/home-community/1?p_p_auth=zfv5HZO0&amp;p_p_id=77&amp;p_p_lifecycle=0&amp;p_p_state=maximized&amp;p_p_mode=view&amp;_77_struts_action=%2Fjournal_content_search%2Fsearch" class="aui-form" method="post" name="_77_fm" onSubmit="submitForm(this); return false;">
							<span class="aui-field aui-field-text aui-field-inline lfr-search-keywords">
								<span class="aui-field-content">
									<span class="aui-field-element ">
										<input class="aui-field-input aui-field-input-text"  id="keywords"  name="keywords"    title="Search Web Content" type="text" value="Search&#x2e;&#x2e;&#x2e;&#x2e;&#x2e;"  onBlur="if (this.value == '') { this.value = '\u0053\u0065\u0061\u0072\u0063\u0068\u002e\u002e\u002e\u002e\u002e'; }" onFocus="if (this.value == '\u0053\u0065\u0061\u0072\u0063\u0068\u002e\u002e\u002e\u002e\u002e') { this.value = ''; }" size="30"  />
									</span>
								</span>
							</span>
							<span class="aui-field aui-field-text aui-field-inline lfr-search-button">
								<span class="aui-field-content">
									<span class="aui-field-element ">
										<input class="aui-field-input aui-field-input-text"  id="search"  name="search"     type="image"   alt="search" src="https://myfsu.ferris.edu/LP5-ellucian-theme/images/common/search.png"  />
									</span>
								</span>
							</span>
						</form>
					</div>


					<ul>
						<li class="selected">
							<a href="https://myfsu.ferris.edu/web/home-community/1" ><span tabindex="0">Home</span></a>
						</li>
						<li>
							<a href="https://myfsu.ferris.edu/web/home-community/student-hidden-" ><span tabindex="0">Student</span></a>
						</li>
						<li>
							<a href="https://myfsu.ferris.edu/web/home-community/forms" ><span tabindex="0">Forms</span></a>
						</li>
						<li>
							<a href="https://ferris.edu/library" target="_blank"><span tabindex="0">Library</span></a>
						</li>
						<li>
							<a href="https://myfsu.ferris.edu/web/home-community/new-evernt" ><span tabindex="0">Communities</span></a>
						</li>
						<li>
							<a href="#"><span tabindex="0">MyDorm</span></a>
						</li>
					</ul>
				</nav>
			</header>
			
		<div class="content">
			<div class="info">
				<h1>Ferris State University MyDorm</h1>
				<p>Use the buttons below to control your dorm room's lights, door lock, window, and heater.</p>
			</div>

			<div class="statuses">
				<div class="row">
					<div class="lights col">
						<Col md="auto"> <Lights name="Lights"/> </Col>
						<Col md="auto"> <Dimmers name="Dimmer"/> </Col>
					</div>
					<div class="door col">
						<Col md="auto"> <Doors name="Door"/> </Col>
					</div>
					<div class="window col">
						<Col md="auto"> <Windows name="Window"/> </Col>
					</div>
					<div class="heaters col">
						<Col md="auto"> <Heaters name="Heater"/> </Col>
					</div>
				</div>
				<div class="row">
					<div class="networkstatus col">
						<Col md="auto"> <NetStatus name="Network"/> </Col>
					</div>
				</div>
				
			</div>
		</div>
	</div>
  );
}
}



// Uncomment to use WITHOUT auth
//export default App;

// Uncomment to use auth
export default withAuthenticator(App, true); 