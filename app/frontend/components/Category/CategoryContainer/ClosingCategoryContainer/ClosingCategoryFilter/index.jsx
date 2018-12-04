import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Api from 'helpers/Api'
import Checkbox from 'components/Checkbox/index.jsx'
import Colors from 'helpers/Colors'
import DocumentBadge from 'components/Version/DocumentBadge/index.jsx'
import Filter from 'components/Filter/index.jsx'
import Params from 'helpers/Params'
import { ProductContext, can } from 'components/ProductContext/index.jsx'
import Routes from 'helpers/Routes'

export default class ClosingCategoryFilter extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      responsibleParties: []
    }
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
  }

  componentDidMount() {
    this.getResponsibleParties()
  }

  getResponsibleParties() {
    const params = Params.fetch()
    Api.get(Routes.dealRoles(params.deals, ['deal_entities.entity']))
      .then(roles => {
        const responsibleParties = []
        _.each(roles, (role) => {
          responsibleParties.push(...role.deal_entities)
        })
        this.setState({ responsibleParties: _.uniqBy(responsibleParties, 'id') })
      })
  }

  handleCheckboxChange(type, value) {
    this.props.toggleFilter(type, value)
  }

  render() {
    const header = (
      <ProductContext.Consumer>
        {features => (
          <div style={styles.header}>
            <div style={styles.filterBy}><FormattedMessage id="category.checklist.toolbar.closing_filter.filter_by" /></div>
            <div style={styles.columnHeaders}>
              {can(/R/, features.responsible_parties) ?
                <div style={styles.columnHeader}><FormattedMessage id="category.checklist.toolbar.closing_filter.active_party" /></div>
              :
                null
              }
              <div style={styles.columnHeader}><FormattedMessage id="category.checklist.toolbar.closing_filter.item_status" /></div>
            </div>
          </div>
        )}
      </ProductContext.Consumer>
    )
    const responsibleParties = this.state.responsibleParties.map(responsibleParty => (
      <Checkbox
        key={responsibleParty.id}
        value={responsibleParty.id}
        label={
          <div style={styles.status(responsibleParty.id)}>
            {responsibleParty.entity.name}
          </div>
        }
        handleCheckboxChange={value => this.handleCheckboxChange('parties', value)}
        isChecked={_.includes(this.props.filter.parties, responsibleParty.id)}
      />
    ))
    const documentStatuses = ['task', 'not_started', 'draft', 'final', 'executed'].map(status => (
      <Checkbox
        key={status}
        value={status}
        label={
          <DocumentBadge
            categoryType='ClosingCategory'
            formattedMessage = {
              <FormattedMessage
                id={`category.tree_element.attachment.version.status.${(status === 'not_started' || status === 'task') ? status : `${status}_no_version`}`}
              />
            }
            currentDealEntityUser={this.props.currentDealEntityUser}
            deletePlacedUploadVersion={this.props.deletePlacedUploadVersion}
            statusStyle={styles.statuses[status]}
          />
        }
        handleCheckboxChange={value => this.handleCheckboxChange('documents', value)}
        isChecked={_.includes(this.props.filter.documents, status)}
      />
    ))
    const menuItems = (
      <ProductContext.Consumer>
        {features => (
          <div style={styles.container}>
            {can(/R/, features.responsible_parties) ?
              <div style={styles.columnBody}>
                <div style={styles.showAll}>
                  <Checkbox
                    key="show_all_parties"
                    value="show_all_parties"
                    label={<FormattedMessage id="category.checklist.toolbar.closing_filter.show_all_parties" />}
                    handleCheckboxChange={value => this.handleCheckboxChange('parties', value)}
                    isChecked={_.includes(this.props.filter.parties, "show_all_parties")}
                  />
                </div>
                {responsibleParties}
              </div>
            :
              null
            }
            <div style={styles.columnBody}>
              <div style={styles.showAll}>
                <Checkbox
                  key="show_all_documents"
                  value="show_all_documents"
                  label={<FormattedMessage id="category.checklist.toolbar.closing_filter.show_all_items" />}
                  handleCheckboxChange={value => this.handleCheckboxChange('documents', value)}
                  isChecked={_.includes(this.props.filter.documents, "show_all_documents")}
                />
              </div>
              {documentStatuses}
            </div>
          </div>
        )}
      </ProductContext.Consumer>
    )
    const label = () => {
      const partiesFiltered = _.without(this.props.filter.parties, "show_all_parties").length > 0
      const documentsFiltered = _.without(this.props.filter.documents, "show_all_documents").length > 0
      if (partiesFiltered && documentsFiltered) {
        return <FormattedMessage id="category.checklist.toolbar.closing_filter.filtered_by_party_and_status" />
      } else if (partiesFiltered) {
        return <FormattedMessage id="category.checklist.toolbar.closing_filter.filtered_by_party" />
      } else if (documentsFiltered) {
        return <FormattedMessage id="category.checklist.toolbar.closing_filter.filtered_by_status" />
      } else {
        return <FormattedMessage id="category.checklist.toolbar.closing_filter.no_filter" />
      }
    }
    return (
      <Filter
        header={header}
        label={label()}
        menuItems={menuItems}
      />
    )
  }
}

const styles = {
  container: {
    display: 'flex'
  },
  leftButton: {
    marginRight: '8px'
  },
  checkbox: {
    padding: '4px 0',
    display: 'flex',
    alignItems: 'center'
  },
  checkboxInputStyle: {
    height: '14px',
    width: '14px',
    marginTop: '0px',
    marginRight: '8px'
  },
  imageStyle: {
    marginRight: '8px'
  },
  notUploaded: {
    color: Colors.blue.darker,
  },
  reviewed: {
    color: Colors.reviewStatus.reviewed
  },
  needsReview: {
    color: Colors.reviewStatus.needsReview,
  },
  showAll: {
    marginBottom: '8px'
  },
  labelStyle: {
    fontWeight: 'normal'
  },
  header: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterBy: {
    color: Colors.blueGray.darker,
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  columnHeaders: {
    display: 'flex'
  },
  columnHeader: {
    width: '160px',
    color: Colors.blueGray.darker,
    fontSize: '14px'
  },
  columnBody: {
    width: '160px'
  },
  status: dealEntityId => ({
    width: '128px',
    padding: '8px',
    borderRadius: '4px',
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: '12px',
    background: getPartyColor(dealEntityId),
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  statuses: {
    task: {
      color: Colors.gray.light,
      borderColor: Colors.gray.light
    },
    not_started: {
      color: '#ce5362',
      borderColor: '#ce5362'
    },
    draft: {
      color: '#d4a13e',
      borderColor: '#d4a13e'
    },
    final: {
      color: '#34a059',
      borderColor: '#34a059'
    },
    executed: {
      color: Colors.white,
      borderColor: '#34a059',
      background: '#34a059'
    }
  }
}

const getPartyColor = (dealEntityId) => {
  return Colors.responsibleParty[dealEntityId % 20]
}

ClosingCategoryFilter.propTypes = {
  currentDealEntityUser: PropTypes.object.isRequired,
  filter: PropTypes.object.isRequired,

  deletePlacedUploadVersion: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired
}
