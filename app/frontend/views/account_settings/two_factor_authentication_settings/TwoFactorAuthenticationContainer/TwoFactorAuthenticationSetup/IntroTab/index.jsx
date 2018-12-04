import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class IntroTab extends React.PureComponent {

  buildEntitiesString(entities) {
    let entitiesString = ''
    const entitiesLength = entities.length
    _.each(entities, (entity, i) => {
      // entity name
      entitiesString += entity.name

      // add separator only if not last item
      if (i !== entitiesLength-1) {
        // comma for 3 or more items or a space for 2 items
        if(entitiesLength === 2) {
          entitiesString += ' '
        } else if (entitiesLength > 2) {
          entitiesString += ', '
        }
      }

      // 'and' if it is the second to last item
      if (entitiesLength > 1 && i === entitiesLength-2) {
        entitiesString += 'and '
      }
    })
    return entitiesString
  }

  render() {
    const { entitiesRequiringTwoFactor } = this.props
    return (
      <div style={styles.container}>
        <i className="mdi mdi-lock" style={styles.icon}></i>
        <h3>
          <FormattedMessage id='account_settings.two_factor_authentication.setup.intro_tab.title' />
        </h3>
        <br />
        <p>
          <FormattedMessage
            id='account_settings.two_factor_authentication.setup.intro_tab.explanation'
            values={{
              entitiesString: this.buildEntitiesString(entitiesRequiringTwoFactor),
              entitiesCount: entitiesRequiringTwoFactor.length
            }}
          />
        </p>
      </div>
    )
  }

}

const styles = {
  container: {
    textAlign: 'center'
  },
  icon: {
    display: 'block',
    fontSize: '7.2rem',
    marginBottom: '1.6rem'
  }
}

IntroTab.propTypes = {
  entitiesRequiringTwoFactor: PropTypes.array.isRequired
}