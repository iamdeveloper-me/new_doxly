import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

import Assets from 'helpers/Assets'

export default class Breadcrumbs extends React.PureComponent {

  render() {
    const { ancestors, firstImagePath, secondImagePath } = this.props
    const chevron = <i style={styles.chevronIcon} className="mdi mdi-chevron-right"></i>
    const lastImagePath = ancestors.length > 1 ? secondImagePath : firstImagePath
    return (
      <div style={styles.breadcrumbsContainer}>
        {ancestors.length > 1 ?
          <div style={styles.breadcrumb}>
            <img style={styles.icon} src={Assets.getPath(firstImagePath)} />
            <div style={styles.name}>
              {_.first(ancestors).name}
            </div>
            {chevron}
          </div>
        :
          null
        }
        {ancestors.length > 2 ?
          <div style={styles.breadcrumb}>
            ...
            {chevron}
          </div>
        :
          null
        }
        <div style={styles.breadcrumb}>
          <img style={styles.icon} src={Assets.getPath(lastImagePath)} />
          <div style={styles.name}>
            {_.last(ancestors).name}
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.4rem'
  },
  icon: {
    marginRight: '.8rem',
    height: '1.8rem'
  },
  chevronIcon: {
    margin: '0 .4rem',
    fontSize: '2rem'
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center'
  },
  name: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minWidth: 0,
    maxWidth: '15rem'
  }
}

Breadcrumbs.propTypes = {
  ancestors: PropTypes.array.isRequired,
  firstImagePath: PropTypes.string,
  secondImagePath: PropTypes.string
}
