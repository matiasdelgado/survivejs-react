import React from 'react';
import Lane from '../lane';

const Lanes = ({lanes}) => {
	return (
		<div className='lanes'>{lanes.map(lane =>
			<Lane className='lane' key={lane.id} lane={lane}>
			</Lane>
		)}</div>
	);
}

Lanes.propTypes = {
	lanes: React.PropTypes.array
};
Lanes.defaultProps = {
	lanes: []
};

export default Lanes;
