import React from 'react';
import { renderIntoDocument } from 'react-addons-test-utils';
import TestBackend from 'react-dnd-test-backend';
import { DragDropContext } from 'react-dnd';
import assert from 'assert';
import Note from '../app/components/note';

function wrapInTestContext(DecoratedComponent) {
	@DragDropContext(TestBackend)
	class TestContextContainer extends React.Component {
		render() {
			return <DecoratedComponent {...this.props} />;
		}
	}
	return TestContextContainer;
}

describe('Note', () => {
	it('renders children', () => {
		const test = 'test';
		const NoteContent = wrapInTestContext(Note);
		const component = renderIntoDocument(
			<NoteContent id='demo'>{test}</NoteContent>
		);

		assert.equal(component.props.children, test);
	});
});