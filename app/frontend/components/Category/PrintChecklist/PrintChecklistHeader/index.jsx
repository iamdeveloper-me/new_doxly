import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { Button } from 'react-bootstrap'

import FlatIconButton from 'components/Buttons/FlatIconButton/index.jsx'

const PrintChecklistHeader = props => {
  const { hide, print } = props
  return (
    <div style={styles.header} className="do-not-print">
      <div style={styles.returnToChecklist}>
        <FlatIconButton 
          icon="fa fa-long-arrow-left"
          style={styles.returnToChecklistButton}
          text={<FormattedMessage id="category.document_viewer.return_to_checklist" />}
          onClick={hide}
        />
      </div>
      <div>
        <Button bsSize="small" bsStyle="primary">
          <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>&nbsp;
          Download 
        </Button>
        <Button bsSize="small" bsStyle="primary" onClick={print}>
          <i className="fa fa-sticky-note fa-lg" aria-hidden="true"></i>&nbsp;
          Print 
        </Button>
      </div>
    </div>
  )
}

const styles = {
  header: {
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px'
  },
  returnToChecklist: {
    width: '150px'
  },
  returnToChecklistButton: {
    fontSize: '14px'
  },
}

PrintChecklistHeader.propTypes = {
  hide: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired
}

export default PrintChecklistHeader