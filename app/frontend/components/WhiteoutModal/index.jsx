import PropTypes from 'prop-types'
import React from 'react'
import {
  injectIntl,
  intlShape
} from 'react-intl'

import 'react-tippy/dist/tippy.css'
import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Tooltip,
  TooltipBody,
  TooltipButtons,
  TooltipHeader,
  TooltipText
} from 'components/Whiteout/Tooltip/index.jsx'

class WhiteoutModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showTooltip: false
    }
    this.getButton = this.getButton.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.showTooltip = this.showTooltip.bind(this)
  }

  hideTooltip() {
    this.setState({ showTooltip: false })
  }

  showTooltip() {
    this.setState({ showTooltip: true })
  }

  getButton(button, position) {
    const { intl, quit } = this.props

    return (
      <Tooltip
        position={position}
        hideTooltip={this.hideTooltip}
        showTooltip={this.state.showTooltip}
        content={
          <TooltipBody>
            <TooltipHeader>
              {intl.formatMessage({id: 'executed_versions.discard_changes'})}
            </TooltipHeader>
            <TooltipText>
              {intl.formatMessage({id: 'executed_versions.discard_changes_description'})}
            </TooltipText>
            <TooltipButtons>
              <Button size='small' type='secondary' text={intl.formatMessage({id: 'buttons.cancel'})} onClick={this.hideTooltip} />
              <Button size='small' type='removal' text={intl.formatMessage({id: 'buttons.quit'})} onClick={quit} />
            </TooltipButtons>
          </TooltipBody>
        }
        trigger={<div onClick={this.showTooltip}>{button}</div>}
      />
    )
  }

  render() {
    const { body, bottomLeftButton, bottomRightButton, header, title, topLeftButton, topRightButton } = this.props

    return (
      <div className="whiteout-ui" style={styles.container}>
        <div style={styles.leftTop}>{topLeftButton}</div>
        <div style={styles.rightTop}>
          {this.getButton(topRightButton, 'bottom')}
        </div>
        <div style={styles.content}>
          <div>
            <div style={styles.header}><h2>{header}</h2></div>
            <div style={styles.title}><h1>{title}</h1></div>
          </div>
          <div style={styles.body}>{body}</div>
        </div>
        <div style={styles.leftBottom}>{bottomLeftButton}</div>
        <div style={styles.rightBottom}>{bottomRightButton}</div>
      </div>
    )
  }

}

const styles = {
  container: {
    position: 'fixed',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    zIndex: '9998',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 40px 60px',
    background: Colors.white,
    overflow: 'hidden'
  },
  leftTop: {
    position: 'absolute',
    left: '0',
    marginLeft: '40px'
  },
  rightTop: {
    position: 'absolute',
    right: '0',
    marginRight: '40px'
  },
  leftBottom: {
    position: 'absolute',
    bottom: '0',
    left:'0',
    margin: '40px'
  },
  rightBottom: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    margin: '40px'
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    overflow: 'hidden'
  },
  headerContent: {
    flexShrink: 0
  },
  header: {
    paddingTop: '20px'
  },
  title: {
    paddingTop: '8px'
  },
  body: {
    flexGrow: '1',
    minWidth: '70%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '40px 0px',
    margin: 'auto'
  },
  tooltip: {
    maxWidth: '175px',
    padding: '8px'
  },
  tooltipContent: {
    textAlign: 'left',
    fontSize: '12px',
    color: Colors.gray.darkest
  },
  tooltipHeader: {
    fontWeight: 'bold'
  },
  tooltipText: {
    paddingTop: '8px',
  },
  tooltipButtons: {
    margin: '16px 16px 0px 16px',
  },
  tooltipButton: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
  tooltipQuitButton: {
    color: Colors.white,
    backgroundColor: Colors.pink.normal
  }
}

WhiteoutModal.propTypes = {
  body: PropTypes.element.isRequired,
  bottomLeftButton: PropTypes.element,
  bottomRightButton: PropTypes.element,
  header: PropTypes.element.isRequired,
  intl: intlShape.isRequired,
  title: PropTypes.element.isRequired,
  topLeftButton: PropTypes.element,
  topRightButton: PropTypes.element
}

export default injectIntl(WhiteoutModal)
