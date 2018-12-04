import _ from 'lodash'
import { DragDropContext } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import {
  injectIntl,
  intlShape,
  FormattedMessage
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Alert from 'components/Whiteout/Alert/index.jsx'
import BackButton from 'components/Whiteout/Buttons/BackButton/index.jsx'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import BuildTableOfContentsToolbar from './BuildTableOfContentsToolbar/index.jsx'
import CloseButton from 'components/Whiteout/Buttons/CloseButton/index.jsx'
import ClosingBookHeader from './ClosingBookHeader/index.jsx'
import ClosingBookSection from './ClosingBookSection/index.jsx'
import Colors from 'helpers/Colors'
import DragDropItemTypes from 'helpers/DragDropItemTypes'
import {
  Dropdown,
  DropdownColumn,
  DropdownItem,
  DropdownRow,
  DropdownTrigger
} from 'components/Whiteout/Dropdown/index.jsx'
import ErrorHandling from 'helpers/ErrorHandling'
import HTML5Backend from 'react-dnd-html5-backend'
import LoadingSpinner from 'components/LoadingSpinner/index.jsx'
import NextButton from 'components/Whiteout/Buttons/NextButton/index.jsx'
import WhiteoutModal from 'components/WhiteoutModal/index.jsx'

class BuildTableOfContents extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      formSubmitted: false,
      draggingTreeElementId: null,
      isDraggingSection: false,
      showDeleteConfirmation: true
    }

    this.toggleShowDeleteConfirmation = this.toggleShowDeleteConfirmation.bind(this)
    this.setFontSize = this.setFontSize.bind(this)
    this.setFont = this.setFont.bind(this)

    // drag and drop
    this.setIsDragging = this.setIsDragging.bind(this)
    this.handleDocumentOnDocument = this.handleDocumentOnDocument.bind(this)
    this.handleDocumentOnSection = this.handleDocumentOnSection.bind(this)
    this.handleSectionOnDocument = this.handleSectionOnDocument.bind(this)
    this.handleSectionOnSection = this.handleSectionOnSection.bind(this)
    this.handleDropTargetHover = this.handleDropTargetHover.bind(this)

    // updating data
    this.setFontSize = this.setFontSize.bind(this)
    this.moveClosingBookSection = this.moveClosingBookSection.bind(this)
    this.removeClosingBookSection = this.removeClosingBookSection.bind(this)
    this.updateClosingBookSection = this.updateClosingBookSection.bind(this)
    this.updateClosingBookSections = this.updateClosingBookSections.bind(this)

    // validations
    this.atLeastOneDocumentSelected = this.atLeastOneDocumentSelected.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  toggleShowDeleteConfirmation() {
    this.setState({ showDeleteConfirmation: !this.state.showDeleteConfirmation })
  }

  // validation functions
  atLeastOneDocumentSelected() {
    return _.size(this.props.closingBook.closing_book_sections) > 0 && _.some(this.props.closingBook.closing_book_sections, closingBookSection => _.size(closingBookSection.closing_book_documents) > 0)
  }

  submitForm() {
    this.setState({ formSubmitted: true })

    const validations = [
      this.atLeastOneDocumentSelected()
    ]

    if (_.every(validations)) {
      this.props.createClosingBook()
    }
  }

  // updating data functions
  setFontSize(fontSize) {
    this.props.setAttribute('font_size', fontSize)
  }

  setFont(font) {
    this.props.setAttribute('font', font)
  }

  moveClosingBookSection(dragIndex, hoverIndex) {
    let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
    const dragClosingBookSection = closingBookSections[dragIndex]
    closingBookSections.splice(dragIndex, 1)
    closingBookSections.splice(hoverIndex, 0, dragClosingBookSection)
    this.updateClosingBookSections(closingBookSections)
  }

  removeClosingBookSection(sectionId) {
    if (_.size(this.props.closingBook.closing_book_sections) === 1) {
      ErrorHandling.setErrors({
        messages: {
          errors: [
            this.props.intl.formatMessage({ id: 'closing_books.create_wizard.build_table_of_contents.cannot_remove_last_section' })
          ]
        }
      })
      return
    }
    let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
    _.remove(closingBookSections, {
      section_id: sectionId
    })
    this.updateClosingBookSections(closingBookSections)
  }

  updateClosingBookSection(updatedClosingBookSection) {
    let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
    let closingBookSection = _.find(closingBookSections, {
      section_id: updatedClosingBookSection.section_id
    })
    _.assign(closingBookSection, updatedClosingBookSection)
    this.updateClosingBookSections(closingBookSections)
  }

  updateClosingBookSections(updatedClosingBookSections) {
    let sectionPosition = 1
    let tabNumber = 1
    _.each(updatedClosingBookSections, closingBookSection => {
      closingBookSection.position = sectionPosition++
      _.each(closingBookSection.closing_book_documents, closingBookDocument =>
        closingBookDocument.tab_number = tabNumber++
      )
    })

    this.props.setAttribute('closing_book_sections', updatedClosingBookSections)
  }

  // drag and drop functions
  setIsDragging(treeElementId = null, isSection = false) {
    this.setState({ 
      draggingTreeElementId: treeElementId,
      isDraggingSection: treeElementId !== null && isSection
    })
  }

  handleDropTargetHover(dropTargetProps, monitor, dropTargetComponent) {
    // this function decides what to do when a drag source is over a drop target
    // determine type and index of target and source
    const dragSourceType = monitor.getItemType()
    const dragSource = dragSourceType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT ? monitor.getItem().closingBookDocument : monitor.getItem().closingBookSection
    const dragSourceIndex = dragSourceType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT ? monitor.getItem().documentIndex : monitor.getItem().sectionIndex
    const dropTargetType = _.has(dropTargetProps, 'closingBookDocument') ? DragDropItemTypes.CLOSING_BOOK_DOCUMENT : DragDropItemTypes.CLOSING_BOOK_SECTION
    const dropTarget = dropTargetType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT ? dropTargetProps.closingBookDocument : dropTargetProps.closingBookSection
    const dropTargetIndex = dropTargetType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT ? dropTargetProps.documentIndex : dropTargetProps.sectionIndex

    // make sure the source and target are different
    if (dragSourceType === dropTargetType && dragSourceIndex === dropTargetIndex) {
      return
    }

    // find the dragSource and dropTarget locations on the screen
    const dropTargetBoundingRect = dropTargetType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT ? findDOMNode(dropTargetComponent).getBoundingClientRect() : _.first(findDOMNode(dropTargetComponent).children).getBoundingClientRect()
    const dropTargetMiddleY = (dropTargetBoundingRect.bottom - dropTargetBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const dropTargetClientY = clientOffset.y - dropTargetBoundingRect.top   

    // handle dropping for different cases
    if (dragSourceType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT && dropTargetType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT) {
      // dragging a document over a document
      this.handleDocumentOnDocument(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY)
    } else if (dragSourceType === DragDropItemTypes.CLOSING_BOOK_SECTION && dropTargetType === DragDropItemTypes.CLOSING_BOOK_SECTION) {
      // dragging a section over a section
      this.handleSectionOnSection(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY)
    } else if (dragSourceType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT && dropTargetType === DragDropItemTypes.CLOSING_BOOK_SECTION) {
      // dragging a document over a section
      this.handleDocumentOnSection(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY)
    } else if (dragSourceType === DragDropItemTypes.CLOSING_BOOK_SECTION && dropTargetType === DragDropItemTypes.CLOSING_BOOK_DOCUMENT) {
      // dragging a section over a document
      this.handleSectionOnDocument(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY)
    }
  }

  handleDocumentOnDocument(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY) {
    // this is always allowed

    if (dragSource.section_id === dropTarget.section_id) {
      // same section

      // only continue if moved past 50% of the way
      if (dragSourceIndex < dropTargetIndex && dropTargetClientY < dropTargetMiddleY) {
        return
      } else if (dragSourceIndex > dropTargetIndex && dropTargetClientY > dropTargetMiddleY) {
        return
      }

      // perform move
      const closingBookSection = _.cloneDeep(_.find(this.props.closingBook.closing_book_sections, { section_id: dragSource.section_id }))
      closingBookSection.closing_book_documents.splice(dragSourceIndex, 1)
      closingBookSection.closing_book_documents.splice(dropTargetIndex, 0, dragSource)
      this.updateClosingBookSection(closingBookSection)

      monitor.getItem().documentIndex = dropTargetIndex
    } else if(dragSource.section_id === null) {
      // if adding a new document
      // perform move
      const closingBookSection = _.cloneDeep(_.find(this.props.closingBook.closing_book_sections, { section_id: dropTarget.section_id }))
      dragSource.section_id = closingBookSection.section_id
      closingBookSection.closing_book_documents.splice(dropTargetIndex, 0, dragSource)
      this.updateClosingBookSection(closingBookSection)

      monitor.getItem().documentIndex = dropTargetIndex
    } else {
      // different sections
      // the only way for this to happen is if the user drags a document so that it doesn't pass the section heading on the way
      // which will probably never happen because they would have to drag it pretty far horizontally before this would happen
      // but hey, why not play it safe and handle it anyway?
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      const oldClosingBookSection = _.find(closingBookSections, { section_id: dragSource.section_id })
      const newClosingBookSection = _.find(closingBookSections, { section_id: dropTarget.section_id })
      oldClosingBookSection.closing_book_documents.splice(dragSourceIndex, 1)
      dragSource.section_id = newClosingBookSection.section_id
      newClosingBookSection.closing_book_documents.splice(dropTargetIndex, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().documentIndex = dropTargetIndex
    }
  }

  handleSectionOnSection(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY) {
    // this is always allowed above the section and only allowed below the section if the section does not have any children
    if (dragSource.position === null) {
      // add a section
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      closingBookSections.splice(dropTargetIndex, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().sectionIndex = dropTargetIndex
      return
    }
    if (dragSourceIndex < dropTargetIndex) {
      if (dropTargetClientY < dropTargetMiddleY || !_.isEmpty(dropTarget.closing_book_documents)) {
        return
      }
    } else if (dragSourceIndex > dropTargetIndex && dropTargetClientY > dropTargetMiddleY) {
      return
    }

    // perform move
    let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
    closingBookSections.splice(dragSourceIndex, 1)
    closingBookSections.splice(dropTargetIndex, 0, dragSource)
    this.updateClosingBookSections(closingBookSections)

    monitor.getItem().sectionIndex = dropTargetIndex
  }

  handleDocumentOnSection(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY) {
    // always a valid move
    // check if it is a new document
    if (dragSource.section_id === null) {
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      const newClosingBookSection = _.find(closingBookSections, { section_id: dropTarget.section_id })
      dragSource.section_id = newClosingBookSection.section_id
      newClosingBookSection.closing_book_documents.splice(0, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().documentIndex = 0
      return
    }
    // find the section the document belongs to and compare it to the drop target
    const dragSourceClosingBookSection = _.find(this.props.closingBook.closing_book_sections, { section_id: dragSource.section_id })
    if (dragSourceClosingBookSection.position < dropTarget.position) {
      // dragging down
      if (dropTargetClientY < dropTargetMiddleY) {
        return
      }

      // perform move
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      const oldClosingBookSection = _.find(closingBookSections, { section_id: dragSource.section_id })
      const newClosingBookSection = _.find(closingBookSections, { section_id: dropTarget.section_id })
      oldClosingBookSection.closing_book_documents.splice(dragSourceIndex, 1)
      dragSource.section_id = newClosingBookSection.section_id
      newClosingBookSection.closing_book_documents.splice(0, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().documentIndex = 0
    } else if (dragSourceClosingBookSection.position >= dropTarget.position && dropTarget.position > 1) {
      // dragging up
      if (dropTargetClientY > dropTargetMiddleY) {
        return
      }

      // perform move
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      const oldClosingBookSection = _.find(closingBookSections, { section_id: dragSource.section_id })
      const newClosingBookSection = _.find(closingBookSections, { position: dropTarget.position-1 })
      oldClosingBookSection.closing_book_documents.splice(dragSourceIndex, 1)
      dragSource.section_id = newClosingBookSection.section_id
      newClosingBookSection.closing_book_documents.push(dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().documentIndex = _.size(newClosingBookSection.closing_book_documents)-1
    }
  }

  handleSectionOnDocument(monitor, dragSource, dragSourceType, dragSourceIndex, dropTarget, dropTargetType, dropTargetIndex, dropTargetMiddleY, dropTargetClientY) {
    // this is only valid if the document is the last in a section and the drag direction is down
    // determine drag direction by finding the section the document belongs to and comparing it
    const dropTargetClosingBookSection = _.find(this.props.closingBook.closing_book_sections, { section_id: dropTarget.section_id })
    if (_.size(dropTargetClosingBookSection.closing_book_documents)-1 === dropTargetIndex) {
      return
    }
    if (dragSource.position === null) {
      // new section
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      closingBookSections.splice(dropTargetClosingBookSection.position-1, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().sectionIndex = dropTargetClosingBookSection.position-1
      return
    }
    if (dragSource.position < dropTargetClosingBookSection.position) {
      // drag direction is down
      if (dropTargetClientY < dropTargetMiddleY) {
        return
      }

      // perform move
      let closingBookSections = _.cloneDeep(this.props.closingBook.closing_book_sections)
      closingBookSections.splice(dragSourceIndex, 1)
      closingBookSections.splice(dropTargetClosingBookSection.position-1, 0, dragSource)
      this.updateClosingBookSections(closingBookSections)

      monitor.getItem().sectionIndex = dropTargetClosingBookSection.position-1
    }
  }

  render() {
    const { closingBook, tree } = this.props
    const { back, createClosingBook, toggleCreateWizard } = this.props

    const body = (
      <div style={styles.container}>
        <p style={styles.details}>
          <FormattedMessage id='closing_books.create_wizard.build_table_of_contents.add_remove_reorder' />
        </p>
        {this.state.formSubmitted && !this.atLeastOneDocumentSelected() ?
          <div style={styles.alert}>
            <Alert
              status='error'
              messageTitle={<FormattedMessage id='closing_books.create_wizard.build_table_of_contents.at_least_one_document_required' />}
            />
          </div>
        :
          null
        }
        <BuildTableOfContentsToolbar
          closingBookSections={closingBook.closing_book_sections}
          font={closingBook.font}
          fontSize={closingBook.font_size}
          tree={tree}
          setFont={this.setFont}
          setFontSize={this.setFontSize}
          setIsDragging={this.setIsDragging}
        />
        <div style={styles.documentPreview}>
          <div style={styles.fontWrapper(closingBook.font_size, closingBook.font)}>
            <ClosingBookHeader />
            {_.map(closingBook.closing_book_sections, (closingBookSection, index) => (
              <ClosingBookSection
                key={`closing_book_section_${closingBookSection.section_id}`}
                sectionIndex={index}
                closingBookSection={closingBookSection}
                draggingTreeElementId={this.state.draggingTreeElementId}
                isDraggingSection={this.state.isDraggingSection}
                showDeleteConfirmation={this.state.showDeleteConfirmation}
                removeClosingBookSection={this.removeClosingBookSection}
                setIsDragging={this.setIsDragging}
                toggleShowDeleteConfirmation={this.toggleShowDeleteConfirmation}
                updateClosingBookSection={this.updateClosingBookSection}
                handleDropTargetHover={this.handleDropTargetHover}
              />
            ))}
          </div>
        </div>
        <div style={styles.button}>
          <Button
            type="primary"
            disabled={this.state.formSubmitted && !this.atLeastOneDocumentSelected()}
            text={<FormattedMessage id='closing_books.create_wizard.confirm_contents.create_closing_book'/>}
            onClick={this.submitForm}
          />
        </div>
      </div>
    )

    return (
      <WhiteoutModal
        header={<FormattedMessage id='closing_books.create_wizard.create_closing_book' />}
        title={<FormattedMessage id='closing_books.create_wizard.build_table_of_contents.build_table_of_contents' />}
        quit={toggleCreateWizard}
        body={this.props.loading ? <LoadingSpinner showLoadingBox={false} /> : body}
        topLeftButton={
          <BackButton
            onClick={back}
          />
        }
        topRightButton={
          <CloseButton />
        }
      />
    )
  }

}

const styles = {
  alert: {
    marginBottom: '0.8rem'
  },
  button: {
    alignSelf: 'center',
    marginTop: '1.6rem'
  },
  container: {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    width: '90rem',
    alignSelf: 'center'
  },
  details: {
    marginBottom: '2.4rem'
  },
  documentPreview: {
    width: '90rem',
    textAlign: 'left',
    border: `0.1rem solid ${Colors.gray.lighter}`,
    overflow: 'auto',
    flexGrow: '1',
    padding: '6.4rem 0',
    fontFamily: 'Times New Roman',
    color: Colors.black,
    fontSize: '95%'
  },
  fontWrapper: (fontSize, font) => ({
    fontSize: `${fontSize/10}em`,
    fontFamily: font
  })
}

BuildTableOfContents.propTypes = {
  closingBook: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  loading: PropTypes.bool.isRequired,
  tree: PropTypes.array.isRequired,

  back: PropTypes.func.isRequired,
  createClosingBook: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
  toggleCreateWizard: PropTypes.func.isRequired
}

export default _.flow(
  injectIntl,
  DragDropContext(HTML5Backend)
)(BuildTableOfContents)