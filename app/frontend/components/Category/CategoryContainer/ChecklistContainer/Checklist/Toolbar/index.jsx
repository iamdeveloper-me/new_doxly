import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  FormGroup,
  FormControl
} from 'react-bootstrap'

import Badge from 'components/Badge/index.jsx'
import Colors from 'helpers/Colors'
import FlatIconButton from 'components/Buttons/FlatIconButton/index.jsx'
import PrintChecklist from 'components/Category/PrintChecklist/index.jsx'

class Toolbar extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showPrintChecklist:  false
    }
    this.handleChange = this.handleChange.bind(this)
    this.showPrintChecklist = this.showPrintChecklist.bind(this)
    this.hidePrintChecklist = this.hidePrintChecklist.bind(this)
  }

  handleChange(e) {
    this.props.search(e.target.value)
  }

  showPrintChecklist() {
    this.props.selectTreeElement(null, () => window.print())
    // this.setState({ showPrintChecklist: true }) // this is how we should be doing it, but we didn't have time
  }

  hidePrintChecklist() {
    this.setState({ showPrintChecklist: false })
  }

  render() {
    const { addItems, exportChecklistButton, filterComponent, intl, ongoingUploads, searchQuery, showUploads, unplacedUploadsCount } = this.props
    const { toggleUploads } = this.props
    const uploadsBadge = (() => {
      const ongoingUploadsWithErrors = _.filter(ongoingUploads, { error: true })
      if (ongoingUploadsWithErrors.length > 0) {
        return (
          <div style={styles.uploadsButtonBadge}>
            <Badge color={Colors.pink.normal}>!</Badge>
          </div>
        )
      } else if (unplacedUploadsCount > 0) {
        return (
          <div style={styles.uploadsButtonBadge}>
            <Badge color={Colors.whiteout.navy}>{unplacedUploadsCount}</Badge>
          </div>
        )
      } else {
        return null
      }
    })()
    const inProgress = _.filter(ongoingUploads, { complete: false, error: false, canceled: false}).length > 0
    return (
      <div style={styles.toolbar}>
        <div style={styles.left}>
          <form style={styles.search} onSubmit={e => { e.preventDefault() }}>
            <FormGroup style={styles.searchInput}>
              <FormControl
                bsSize="small"
                type="text"
                value={searchQuery}
                placeholder={intl.formatMessage({id: 'category.checklist.toolbar.search_checklist'})}
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
            </FormGroup>
          </form>
          {filterComponent}
        </div>
        <div style={styles.right}>
          <div style={styles.addButton}>
            {addItems}
          </div>
          <FlatIconButton icon="mdi mdi-printer mdi-24px" iconStyle={styles.iconStyle} style={styles.printChecklistButton} onClick={this.showPrintChecklist} />
          {showUploads ? null : uploadsBadge}
          {exportChecklistButton}
          <FlatIconButton icon="mdi mdi-cloud-upload mdi-18px" style={styles.uploadsButton(showUploads, inProgress)} onClick={toggleUploads} iconStyle={styles.uploadIcon(inProgress)} />
        </div>
        {this.state.showPrintChecklist ? <PrintChecklist hide={this.hidePrintChecklist} /> : null}
      </div>
    )
  }

}

const styles = {
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  left: {
    display: 'flex',
    justifyContent: 'flex-start',
    minWidth: '400px',
    flexBasis: '40%'
  },
  right: {
    display: 'flex'
  },
  toggleBtn: {
    minWidth: '40px'
  },
  search: {
    flex: '1',
    display: 'flex'
  },
  searchInput: {
    flex: '1',
    margin: '0 10px'
  },
  selectFilter: {
    width: '150px'
  },
  uploadsButton: (showUploads, inProgress) => ({
    height: '32px',
    width: '32px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: showUploads ? Colors.blue.darker : Colors.white,
    color: showUploads ? Colors.white : Colors.button.blue,
    borderRadius: '70%',
    borderTop: `solid 2px ${Colors.button.blue}`,
    borderRight: inProgress ? `solid 2px ${Colors.whiteout.status.gray}` : `solid 2px ${Colors.button.blue}`,
    borderBottom: inProgress ? `solid 2px ${Colors.whiteout.status.gray}` : `solid 2px ${Colors.button.blue}`,
    borderLeft: inProgress ? `solid 2px ${Colors.whiteout.status.gray}` : `solid 2px ${Colors.button.blue}`,
    animation: inProgress ? 'spin 1.25s linear infinite' : ''
  }),
  uploadsButtonBadge: {
    position: 'absolute',
    top: '3px',
    right: '6px',
    zIndex: 1
  },
  printChecklistButton: {
    display: 'flex',
    justifyContent: 'center',
    marginRight: '8px',
    width: '32px',
    height: '32px',
    backgroundColor: Colors.white,
    borderRadius: '2px',
    border: `solid 1px ${Colors.button.lightGrayBlue}`
  },
  iconStyle: {
    color: Colors.text.darkBlue,
  },
  uploadIcon: inProgress => ({
    animation: inProgress ? 'reverse-spin 1.25s linear infinite' : '',
    height: '20px',
  }),
  addButton: {
    marginRight: '8px'
  }
}

Toolbar.propTypes = {
  exportChecklistButton: PropTypes.element,
  filterComponent: PropTypes.element.isRequired,
  intl: intlShape.isRequired,
  ongoingUploads: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  showUploads: PropTypes.bool.isRequired,
  unplacedUploadsCount: PropTypes.number.isRequired,

  search: PropTypes.func.isRequired,
  selectTreeElement: PropTypes.func.isRequired,
  toggleUploads: PropTypes.func.isRequired,
}

export default injectIntl(Toolbar)
