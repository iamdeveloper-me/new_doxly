import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
 } from 'react-intl'

import Colors from 'helpers/Colors'
import { Tooltip, TooltipText } from 'components/Whiteout/Tooltip/index.jsx'

class DocumentIssue extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
  }

  showTooltip() {
    this.setState({ showTooltip: true })
  }

  hideTooltip() {
    this.setState({ showTooltip: false})
  }

  getQuestionTooltip(){
    const { intl } = this.props
    return (
      <Tooltip
         position='bottom'
         hideTooltip={this.hideTooltip}
         showTooltip={this.state.showTooltip}
         content={
           <TooltipText style={styles.questionToolitp}>
               {intl.formatMessage({id: 'executed_versions.could_not_be_converted'})}
             <div style={styles.bottomBox}>
               {intl.formatMessage({id: 'executed_versions.supported_file_types_are'})}
               <span style={styles.formatTypes}>
                 {intl.formatMessage({id: 'executed_versions.supported_file_types_list'})}
               </span>
             </div>
           </TooltipText>
         }
         trigger={
           <div
             className="mdi mdi-help-circle-outline"
             style={styles.questionIcon}
             onMouseOver={this.showTooltip}
             onMouseLeave={this.hideTooltip}
           >
           </div>
         }
       />
    )
  }

  getValue(value){
    switch (typeof value) {
      case 'string':
        return value
      case 'object':
        if (value["key"] === 'could_not_be_processed') {
          return <div style={styles.issue}>
                   <p><FormattedMessage id={`executed_versions.incomplete_statuses.${value["key"]}`} /></p>
                   {this.getQuestionTooltip()}
                 </div>
        } else {
          return <p><FormattedMessage id={`executed_versions.incomplete_statuses.${value["key"]}`} /></p>
        }
    }
    value === "" ? this.getQuestionTooltip() : null
  }

  render() {
    return (
      <div>
        {this.getValue(this.props.issue)}
      </div>
    )
  }

}

const styles = {
  questionIcon: {
    color: Colors.button.blue,
    marginLeft: '4px',
    cursor: 'pointer'
  },
  questionTooltip: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    fontSize: '12px',
    maxWidth: '200px',
    color: Colors.gray.dark
  },
  bottomBox: {
    marginTop: '12px'
  },
  formatTypes: {
    fontStyle: 'italic'
  },
  issue: {
    display: 'flex',
    alignItems: 'center'
  }
}

DocumentIssue.propTypes = {
  intl: intlShape.isRequired,
  issue: PropTypes.object.isRequired
}

export default injectIntl(DocumentIssue)
