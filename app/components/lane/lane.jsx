import React from 'react';
import AltContainer from 'alt-container';
import { DropTarget } from 'react-dnd';

import Notes from '../notes';
import NoteActions from '../../actions/noteActions';
import NoteStore from '../../stores/noteStore';
import LaneActions from '../../actions/laneActions';
import Editable from '../editable';
import ItemTypes from '../../constants/itemTypes';

const noteTarget = {
	hover(targetProps, monitor) {
		const sourceProps = monitor.getItem();
		const sourceId = sourceProps.id;

		if (!targetProps.lane.notes.length) {
			LaneActions.attachToLane({
				laneId: targetProps.lane.id,
				noteId: sourceId
			})
		}
	}
}

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
	connectDropTarget: connect.dropTarget()
}))
class Lane extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {connectDropTarget, lane, ...props} = this.props; // eslint-disable-line no-unused-vars
		return connectDropTarget(
			<div {...props}>
				<div className='lane-header' onClick={this.activateLaneEdit}>
					<div className='lane-add-note'>
						<button onClick={this.addNote}>+</button>
					</div>
					<Editable className='lane-name' editing={lane.editing} value={lane.name} onEdit={this.editName} />
					<div className='lane-delete'>
						<button onClick={this.deleteLane}>x</button>
					</div>
				</div>
				<AltContainer
					stores={[NoteStore]}
					inject={{
						notes: () => NoteStore.getNotesByIds(lane.notes)
					}}>
					<Notes
						onValueClick={this.activateNoteEdit}
						onEdit={this.editNote}
						onDelete={this.deleteNote} />
				</AltContainer>
			</div>
		);
	}

	editNote = (id, task) => {
		if (!task.trim()) {
			NoteActions.update({ id, editing: false });
			return;
		}
		NoteActions.update({ id, task, editing: false});
	}

	addNote = (e) => {
		e.stopPropagation();
		const laneId = this.props.lane.id;
		const note = NoteActions.create({ task: 'New task' });

		LaneActions.attachToLane({
			noteId: note.id,
			laneId
		});
	}

	deleteNote = (noteId, e) => {
		e.stopPropagation();
		const laneId = this.props.lane.id;
		LaneActions.detachFromLane({ laneId, noteId });
		NoteActions.delete(noteId);
	}

	editName = (name) => {
		const laneId = this.props.lane.id;
		// Don't modify if trying set an empty value
		if(!name.trim()) {
			LaneActions.update({id: laneId, editing: false});
			return;
		}
		LaneActions.update({id: laneId, name, editing: false});
	};

	deleteLane = () => {
		const laneId = this.props.lane.id;
		LaneActions.delete(laneId);
	};

	activateLaneEdit = () => {
		const laneId = this.props.lane.id;
		LaneActions.update({id: laneId, editing: true});
	};

	activateNoteEdit = (id) => {
		NoteActions.update({id, editing: true});
	}
}

Lane.Header = class LaneHeader extends React.Component {

}

Lane.Notes = class LaneNotes extends React.Component {

}

Lane.propTypes = {
	lane: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		editing: React.PropTypes.bool,
		name: React.PropTypes.string,
		notes: React.PropTypes.array
	}).isRequired,
	connectDropTarget: React.PropTypes.func
};

export default Lane;
