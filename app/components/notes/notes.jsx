/* what */
import React from 'react';
import Editable from '../editable';
import Note from '../note/note';
import LaneActions from '../../actions/laneActions';

const Notes = ({notes, onValueClick, onEdit, onDelete}) => {
	return (
		<ul className='notes'>{notes.map(note =>
			<Note className='note' id={note.id} key={note.id}
				editing={note.editing} onMove={LaneActions.move}>
				<Editable
					editing={note.editing}
					value={note.task}
					onValueClick={onValueClick.bind(null, note.id)}
					onEdit={onEdit.bind(null, note.id)}
					onDelete={onDelete.bind(null, note.id)} />
			</Note>
		)}</ul>
	);
}

Notes.propTypes = {
	notes: React.PropTypes.array,
	onEdit: React.PropTypes.func,
	onDelete: React.PropTypes.func,
	onValueClick: React.PropTypes.func
};
Notes.defaultProps = {
	notes: [],
	onEdit: () => {}
}

export default Notes;
