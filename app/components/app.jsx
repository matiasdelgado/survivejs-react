import React from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Lanes from './lanes.jsx';
import LaneActions from '../actions/laneActions';
import LaneStore from '../stores/laneStore';

@DragDropContext(HTML5Backend)
export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = LaneStore.getState();
	}

	render() {
		const lanes = this.state.lanes;
		return (
			<div>
				<button className='add-lane' onClick={this.addLane}>+</button>
				<Lanes lanes={lanes} />
			</div>
		);
	}

	componentDidMount() {
		LaneStore.listen(this.storeChanged);
	}

	componentWillUnmount() {
		LaneStore.unlisten(this.storeChanged);
	}

	storeChanged = (state) => {
		this.setState(state);
	}

	addLane = () => {
		LaneActions.create({ task: 'New lane' });
	}
}
