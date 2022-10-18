import React from 'react' ;
import Tilty from 'react-tilty';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return(
		<div className="ma4 mt0">
			<Tilty className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }} >
 				<div className="Tilt-inner">
 					<img src={brain} style={{paddingTop: '25px'}} alt="LOGO" />
 				</div>
			</Tilty>
		</div>
		);
}

export default Logo;