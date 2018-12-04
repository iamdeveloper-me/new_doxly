import _ from 'lodash'
import { DragSource, DropTarget } from 'react-dnd'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Checkbox from 'components/Whiteout/Checkbox/index.jsx'
import ClosingBookDocument from './ClosingBookDocument/index.jsx'
import ClosingBookDragHandle from '../ClosingBookDragHandle/index.jsx'
import ClosingBookIndexItem from '../ClosingBookIndexItem/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import EditableText from 'components/EditableText/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import RomanNumeral from 'components/RomanNumeral/index.jsx'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
} from 'components/Whiteout/Tooltipster/index.jsx'

class ClosingBookSection extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showDeleteTooltip: false,
      mouseDown: false
    }
    this.isActive = this.isActive.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.removeClosingBookDocument = this.removeClosingBookDocument.bind(this)
    this.updateClosingBookDocument = this.updateClosingBookDocument.bind(this)
    this.openDeleteTooltip = this.openDeleteTooltip.bind(this)
    this.hideDeleteTooltip = this.hideDeleteTooltip.bind(this)
    this.remove = this.remove.bind(this)
    this.setName = this.setName.bind(this)
    this.ignoreMouseDown = this.ignoreMouseDown.bind(this)
  }

  onMouseEnter() {
    this.setState({ hover: true })
  }

  onMouseLeave() {
    this.setState({ 
      hover: false,
      mouseDown: false // in case they leave the bounds of the component without releasing their mouse down 
    })
  }

  onMouseDown() {
    this.setState({ mouseDown: true })
  }

  onMouseUp() {
    this.setState({ mouseDown: false })
  }

  ignoreMouseDown(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  isActive() {
    return (this.state.hover && this.props.draggingTreeElementId === null) || this.state.showDeleteTooltip
  }

  removeClosingBookDocument(documentId) {
    let closingBookSection = _.cloneDeep(this.props.closingBookSection)
    _.remove(closingBookSection.closing_book_documents, {
      document_id: documentId
    })
    this.props.updateClosingBookSection(closingBookSection)
  }

  updateClosingBookDocument(updatedClosingBookDocument) {
    let closingBookSection = _.cloneDeep(this.props.closingBookSection)
    let closingBookDocument = _.find(closingBookSection.closing_book_documents, {
      document_id: updatedClosingBookDocument.document_id
    })
    _.assign(closingBookDocument, updatedClosingBookDocument)
    this.props.updateClosingBookSection(closingBookSection)
  }

  openDeleteTooltip(e) {
    this.setState({ showDeleteTooltip: true })
    e.preventDefault()
  }

  hideDeleteTooltip() {
    this.setState({
      hover: false, // need to make sure the hover state is set to false
      showDeleteTooltip: false
    })
  }

  remove() {
    this.props.removeClosingBookSection(this.props.closingBookSection.section_id)
  }

  setName(name) {
    // check that the name isn't blank
    const trimmedName = _.trim(name)
    if (!trimmedName) {
      ErrorHandling.setErrors({
        messages: {
          errors: [
            this.props.intl.formatMessage({ id: 'closing_books.create_wizard.build_table_of_contents.name_cannot_be_blank' })
          ]
        }
      })
      return
    }

    // update closing book section
    const closingBookSection = _.cloneDeep(this.props.closingBookSection)
    closingBookSection.name = trimmedName
    this.props.updateClosingBookSection(closingBookSection)
  }

  render() {
    const { closingBookSection, draggingTreeElementId, isDragging, isDraggingSection, intl, showDeleteConfirmation } = this.props
    const { connectDragSource, connectDropTarget, handleDropTargetHover, setIsDragging, toggleShowDeleteConfirmation } = this.props

    const dragHandle = <ClosingBookDragHandle isActive={this.isActive()} />
    const position = (
      <div style={styles.numbering}>
        <RomanNumeral
          number={closingBookSection.position}
          suffix='.'
        />
      </div>
    )
    const name = (
      <div style={styles.name}>
        <EditableText
          label={intl.formatMessage({id: 'closing_books.create_wizard.build_table_of_contents.section_name'})}
          value={closingBookSection.name}
          placeholder={intl.formatMessage({id: 'closing_books.create_wizard.build_table_of_contents.section_name'})}
          handleSubmit={this.setName}
          showLabel={false}
        />
      </div>
    )
    const actions = (
      showDeleteConfirmation || this.state.showDeleteTooltip ? 
        <Tooltipster
          open={this.state.showDeleteTooltip}
          triggerElement={
            <div style={styles.deleteButton} onClick={this.openDeleteTooltip} onMouseDown={this.ignoreMouseDown}>
              <i className='mdi mdi-delete'></i>
            </div>
          }
          content={
            <div onMouseDown={this.ignoreMouseDown}>
              <TooltipsterBody>
                <TooltipsterHeader>
                  <p onMouseDown={this.ignoreMouseDown}><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.remove_section' /></p>
                </TooltipsterHeader>
                <TooltipsterText>
                  <p className="gray" style={styles.description}>
                    <FormattedMessage id='closing_books.create_wizard.build_table_of_contents.you_can_re_add_this_section' />
                  </p>
                  <Checkbox
                    text={
                      <div style={styles.doNotShowAgain}>
                        <FormattedMessage id='common_words.do_not_show_this_message_again' />
                      </div>
                    }
                    checked={!showDeleteConfirmation}
                    onChange={toggleShowDeleteConfirmation}
                  />
                </TooltipsterText>
                <TooltipsterButtons>
                  <Button size='small' type='secondary' text={<FormattedMessage id='buttons.cancel' />} onClick={this.hideDeleteTooltip} />
                  <Button size='small' type='removal' text={<FormattedMessage id='buttons.remove' />} icon='delete' onClick={this.remove} />
                </TooltipsterButtons>
              </TooltipsterBody>
            </div>
          }
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          onClickOutside={this.hideDeleteTooltip}
        />
      :
        <div style={styles.deleteButton} onClick={this.remove} onMouseDown={this.ignoreMouseDown}>
          <i className='mdi mdi-delete'></i>
        </div>
    )

    return (
      <div>
        {
          connectDragSource(connectDropTarget(
            <div
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp}
              style={styles.container(this.isActive(), isDragging)}
            >
              <ClosingBookIndexItem
                dragHandle={dragHandle}
                position={position}
                name={name}
                actions={this.isActive() ? actions : null}
                style={styles.row}
              />
              {
                this.state.mouseDown && _.size(closingBookSection.closing_book_documents) > 0 ? 
                  <div style={styles.documentCount}>
                    <FormattedMessage
                      id='closing_books.create_wizard.build_table_of_contents.number_of_documents'
                      values={{
                        numberOfDocuments: _.size(closingBookSection.closing_book_documents)
                      }}
                    />
                  </div>
                :
                  null
              }
            </div>
          ))
        }
        <div style={styles.children(isDragging, isDraggingSection)}>
          {
            _.map(closingBookSection.closing_book_documents, (closingBookDocument, index) => (
              <ClosingBookDocument
                key={`closing_book_document_${closingBookDocument.document_id}`}
                documentIndex={index}
                closingBookDocument={closingBookDocument}
                draggingTreeElementId={draggingTreeElementId}
                showDeleteConfirmation={showDeleteConfirmation}
                toggleShowDeleteConfirmation={toggleShowDeleteConfirmation}
                handleDropTargetHover={handleDropTargetHover}
                removeClosingBookDocument={this.removeClosingBookDocument}
                setIsDragging={setIsDragging}
                updateClosingBookDocument={this.updateClosingBookDocument}
              />
            ))
          }
        </div>
      </div>
    )
  }

}

/**
 * Implements the drag source contract.
 */
const closingBookSectionSource = {
  beginDrag(props, monitor, component) {
    props.setIsDragging(props.closingBookSection.section_id, true)
    component.setState({
      hover: false
    })
    return {
      closingBookSection: props.closingBookSection,
      sectionIndex: props.sectionIndex
    }
  },
  endDrag(props) {
    props.setIsDragging(null)
  },
  isDragging(props) {
    return props.draggingTreeElementId === props.closingBookSection.section_id
  }
}

const closingBookSectionTarget = {
  hover(props, monitor, component) {
    props.handleDropTargetHover(props, monitor, component)
  }
}

const styles = {
  container: (isActive, isDragging) => ({
    cursor: 'move',
    position: 'relative',
    outline: isActive ? `0.1em solid ${Colors.whiteout.gray}` : `0.1em solid ${Colors.whiteout.white}`,
    boxShadow: isActive ? `0 .2em 1em 0 ${Colors.whiteout.status.gray}` : 'none',
    opacity: isDragging ? 0 : 1
  }),
  children: (isDragging, isDraggingSection) => ({
    display: isDragging ? 'none' : 'block',
    opacity: isDraggingSection ? 0.25 : 1
  }),
  row: {
    fontWeight: 'bold'
  },
  numbering: {
    padding: '1em 0'
  },
  deleteButton: {
    color: Colors.whiteout.carmine,
    cursor: 'pointer'
  },
  description: {
    paddingBottom: '0.8rem'
  },
  doNotShowAgain: {
    fontSize: '1.2rem'
  },
  documentCount: {
    position: 'absolute',
    top: '50%',
    marginTop: '-1.6em',
    right: '2.4rem',
    color: Colors.whiteout.text.default,
    padding: '0.8em',
    fontFamily: '"Roboto", "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif',
    fontSize: '0.8em',
    height: '3.2em',
    display: 'flex',
    alignItems: 'center'
  },
  name: {
    padding: '1em 0'
  }
}

ClosingBookSection.propTypes = {
  closingBookSection: PropTypes.object.isRequired,
  draggingTreeElementId: PropTypes.number,
  isDraggingSection: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  showDeleteConfirmation: PropTypes.bool.isRequired,

  handleDropTargetHover: PropTypes.func.isRequired,
  removeClosingBookSection: PropTypes.func.isRequired,
  setIsDragging: PropTypes.func.isRequired,
  toggleShowDeleteConfirmation: PropTypes.func.isRequired,
  updateClosingBookSection: PropTypes.func.isRequired,

  // ReactDnD
  isDragging: PropTypes.bool.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired
}

export default _.flow(
  injectIntl,
  DragSource(
    DragDropItemTypes.CLOSING_BOOK_SECTION,
    closingBookSectionSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    })
  ),
  DropTarget(
    [DragDropItemTypes.CLOSING_BOOK_SECTION, DragDropItemTypes.CLOSING_BOOK_DOCUMENT],
    closingBookSectionTarget,
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )
)(ClosingBookSection)
