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
import ClosingBookIndexItem from '../../ClosingBookIndexItem/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import ClosingBookDragHandle from '../../ClosingBookDragHandle/index.jsx'
import EditableText from 'components/EditableText/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
} from 'components/Whiteout/Tooltipster/index.jsx'
import WhiteoutPdfViewer from 'components/WhiteoutPdfViewer/index.jsx'

class ClosingBookDocument extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showDeleteTooltip: false,
      showDocumentViewer: false
    }
    this.isActive = this.isActive.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.openDocumentViewer = this.openDocumentViewer.bind(this)
    this.hideDocumentViewer = this.hideDocumentViewer.bind(this)
    this.openDeleteTooltip = this.openDeleteTooltip.bind(this)
    this.hideDeleteTooltip = this.hideDeleteTooltip.bind(this)
    this.remove = this.remove.bind(this)
    this.setName = this.setName.bind(this)
  }

  isActive() {
    return (this.state.hover && this.props.draggingTreeElementId === null) || this.state.showDeleteTooltip
  }

  onMouseEnter() {
    this.setState({ hover: true })
  }

  onMouseLeave() {
    this.setState({ hover: false })
  }

  openDocumentViewer(e) {
    this.setState({ showDocumentViewer: true })
    e.preventDefault()
  }

  hideDocumentViewer() {
    this.setState({ showDocumentViewer: false })
  }

  openDeleteTooltip(e) {
    this.setState({ showDeleteTooltip: true })
    e.preventDefault()
  }

  hideDeleteTooltip() {
    this.setState({
      showDeleteTooltip: false
    })
  }

  remove() {
    this.props.removeClosingBookDocument(this.props.closingBookDocument.document_id)
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

    // update closing book document
    const closingBookDocument = _.cloneDeep(this.props.closingBookDocument)
    closingBookDocument.name = trimmedName
    this.props.updateClosingBookDocument(closingBookDocument)
  }

  render() {
    const { closingBookDocument, intl, isDragging, showDeleteConfirmation } = this.props
    const { connectDragSource, connectDropTarget, toggleShowDeleteConfirmation } = this.props

    const dragHandle = <ClosingBookDragHandle isActive={this.isActive()} />
    const name = (
      <div style={styles.name}>
        <EditableText
          label={intl.formatMessage({id: 'closing_books.create_wizard.build_table_of_contents.document_name'})}
          value={closingBookDocument.name}
          placeholder={intl.formatMessage({id: 'closing_books.create_wizard.build_table_of_contents.document_name'})}
          handleSubmit={this.setName}
          showLabel={false}
        />
        {this.isActive() ?
          <div style={styles.previewButton} onClick={this.openDocumentViewer}>
            <i className='mdi mdi-eye' />
          </div>
        :
          null
        }
      </div>
    )
    const tabNumber = <div>{closingBookDocument.tab_number}</div>
    const actions = (
      showDeleteConfirmation || this.state.showDeleteTooltip ? 
        <Tooltipster
          open={this.state.showDeleteTooltip}
          triggerElement={
            <div style={styles.deleteButton} onClick={this.openDeleteTooltip}>
              <i className='mdi mdi-delete'></i>
            </div>
          }
          content={
            <TooltipsterBody>
              <TooltipsterHeader>
                <p><FormattedMessage id='closing_books.create_wizard.build_table_of_contents.remove_document' /></p>
              </TooltipsterHeader>
              <TooltipsterText>
                <p className="gray" style={styles.description}>
                  <FormattedMessage id='closing_books.create_wizard.build_table_of_contents.you_can_re_add_this_document' />
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
          }
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          onClickOutside={this.hideDeleteTooltip}
        />
      :
        <div style={styles.deleteButton} onClick={this.remove}>
          <i className='mdi mdi-delete'></i>
        </div>
    )

    return connectDragSource(connectDropTarget(
      <div>
        <div
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          style={styles.container(this.isActive(), isDragging)}
        >
          <ClosingBookIndexItem
            dragHandle={dragHandle}
            name={name}
            tabNumber={tabNumber}
            actions={this.isActive() ? actions : null}
          />
        </div>
        {this.state.showDocumentViewer ?
          <WhiteoutPdfViewer
            title={closingBookDocument.name}
            pagePath={closingBookDocument.url}
            onClose={this.hideDocumentViewer}
          />
        :
          null
        }
      </div>
    ))
  }

}

/**
 * Implements the drag source contract.
 */
const closingBookDocumentSource = {
  beginDrag(props, monitor, component) {
    props.setIsDragging(props.closingBookDocument.document_id, false)
    component.setState({
      hover: false
    })
    return {
      closingBookDocument: props.closingBookDocument,
      documentIndex: props.documentIndex
    }
  },
  endDrag(props) {
    props.setIsDragging(null)
  },
  isDragging(props) {
    return props.draggingTreeElementId === props.closingBookDocument.document_id
  }
}

const closingBookDocumentTarget = {
  hover(props, monitor, component) {
    props.handleDropTargetHover(props, monitor, component)
  }
}

const arePropsEqual = (props, otherProps) => {
  // this improves drag and drop performance significantly by reducing the number of re-renders
  return (
    props.documentIndex === otherProps.documentIndex && 
    props.draggingTreeElementId === otherProps.draggingTreeElementId &&
    props.closingBookDocument.name === otherProps.closingBookDocument.name &&
    props.closingBookDocument.tab_number === otherProps.closingBookDocument.tab_number &&
    props.showDeleteConfirmation === otherProps.showDeleteConfirmation
  )
}

const styles = {
  container: (isActive, isDragging) => ({
    cursor: 'move',
    outline: isActive ? `0.1rem solid ${Colors.whiteout.gray}` : `0.1rem solid ${Colors.whiteout.white}`,
    boxShadow: isActive ? `0 .2rem 1rem 0 ${Colors.whiteout.status.gray}` : 'none',
    opacity: isDragging ? 0 : 1
  }),
  name: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.1rem',
    width: '100%'
  },
  previewButton: {
    margin: '0 0.6rem',
    color: Colors.whiteout.blue,
    cursor: 'pointer'
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
  }
}

ClosingBookDocument.propTypes = {
  closingBookDocument: PropTypes.object.isRequired,
  documentIndex: PropTypes.number.isRequired,
  intl: intlShape.isRequired,
  draggingTreeElementId: PropTypes.number,
  showDeleteConfirmation: PropTypes.bool.isRequired,

  handleDropTargetHover: PropTypes.func.isRequired,
  removeClosingBookDocument: PropTypes.func.isRequired,
  setIsDragging: PropTypes.func.isRequired,
  toggleShowDeleteConfirmation: PropTypes.func.isRequired,
  updateClosingBookDocument: PropTypes.func.isRequired,

  // ReactDnD
  connectDragPreview: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired
}

export default _.flow(
  injectIntl,
  DragSource(
    DragDropItemTypes.CLOSING_BOOK_DOCUMENT,
    closingBookDocumentSource,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    }),
    {
      arePropsEqual
    }
  ),
  DropTarget(
    [DragDropItemTypes.CLOSING_BOOK_DOCUMENT, DragDropItemTypes.CLOSING_BOOK_SECTION],
    closingBookDocumentTarget,
    connect => ({
      connectDropTarget: connect.dropTarget()
    })
  )
)(ClosingBookDocument)
