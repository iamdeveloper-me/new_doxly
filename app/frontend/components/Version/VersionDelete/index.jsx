import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import {
  Tooltipster,
  TooltipsterHeader,
  TooltipsterBody,
  TooltipsterButtons,
  TooltipsterText
} from 'components/Whiteout/Tooltipster/index.jsx'

class VersionDelete extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false
    }
    this.toggleTooltip = this.toggleTooltip.bind(this)
    this.deleteVersion = this.deleteVersion.bind(this)
  }

  toggleTooltip(showTooltip = !this.state.showTooltip) {
    this.setState({ showTooltip })
  }

  deleteVersion() {
    const { treeElement, version } = this.props
    this.props.deleteVersion(treeElement, version)
  }

  render() {
    const { currentDealEntityUser, intl, treeElement, version, versions } = this.props
    const hasDeletePermission = currentDealEntityUser.is_owner || currentDealEntityUser.entity.id === version.uploader.entity_id
    const deletableVersion = !_.some(versions, docVersion => docVersion.position >= version.position && docVersion.status === 'executed')
    const tooltipDelete = (
      <TooltipsterBody>
        <TooltipsterHeader>
          <p><FormattedMessage id='category.document_viewer.delete_version' /></p>
        </TooltipsterHeader>
        <TooltipsterText>
          <p className="gray"><FormattedMessage id='category.document_viewer.permanently_remove' /></p>
        </TooltipsterText>
        <TooltipsterButtons>
          <Button
            size='small'
            type='secondary'
            text={intl.formatMessage({id: 'buttons.cancel'})}
            onClick={() => this.toggleTooltip(false)}
          />
          <Button
            size='small'
            type='removal'
            text={intl.formatMessage({id: 'buttons.delete'})}
            icon='delete'
            onClick={() => this.deleteVersion(treeElement, version)}
          />
        </TooltipsterButtons>
      </TooltipsterBody>
    )

    const tooltipInfo = (
      <TooltipsterBody>
        <TooltipsterText>
          <p className="gray">
            {!hasDeletePermission ?
              <FormattedMessage id='category.document_viewer.deletion_permission' />
            :
              <FormattedMessage id='category.document_viewer.executed_version_deletion' />
            }
          </p>
        </TooltipsterText>
      </TooltipsterBody>
    )

    return (
      <div style={styles.delete}>
        <Tooltipster
          open={this.state.showTooltip}
          triggerElement={
            <div
              className='mdi mdi-delete'
              onClick={() => this.toggleTooltip(true)}
            >
            </div>
          }
          content={(!deletableVersion || !hasDeletePermission) ? tooltipInfo : tooltipDelete}
          interactive={true}
          repositionsOnScroll={true}
          side='bottom'
          theme='tooltipster-doxly-whiteout'
          handleClickOutside={() => this.toggleTooltip(false)}
        />
      </div>
    )
  }

}

const styles = {
  delete: {
    flexShrink: '0',
    color: Colors.whiteout.carmine,
    fontSize: '1.6rem'
  }
}

VersionDelete.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  treeElement: PropTypes.object.isRequired,
  version: PropTypes.object.isRequired,
  versions: PropTypes.array.isRequired,

  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteVersion: PropTypes.func.isRequired
}

export default injectIntl(VersionDelete)
