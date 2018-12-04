import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { AutoSizer, CellMeasurer, CellMeasurerCache, MultiGrid } from 'react-virtualized'

import Button from 'components/Whiteout/Buttons/Button/index.jsx'
import Colors from 'helpers/Colors'
import DocumentName from './DocumentName/index.jsx'
import VotingInterestGroupName from './VotingInterestGroupName/index.jsx'
import VotingInterestGroupTotalNumberOfShares from './VotingInterestGroupTotalNumberOfShares/index.jsx'
import VotingInterestThreshold from './VotingInterestThreshold/index.jsx'

const cache = new CellMeasurerCache({
  minHeight: 40,
  maxHeight: 100,
  minWidth: 100,
  maxWidth: 400
});

export default class VotingThresholdsTable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      addingVotingInterestGroup: false
    }
    this.formatDataIntoTable = this.formatDataIntoTable.bind(this)
  }

  componentDidUpdate() {
    this.grid.forceUpdateGrids()
  }

  formatDataIntoTable() {
    const { documents, votingInterestGroups, votingInterestThresholds } = this.props
    const { addVotingInterestGroup, createVotingInterestGroup, deleteVotingInterestGroup, updateVotingInterestGroup, createVotingInterestThreshold, deleteVotingInterestThreshold, updateVotingInterestThreshold } = this.props
    let result = []
    result.push([
      <div><FormattedMessage id='signature_management.voting_threshold.voting_interest_group_name' /></div>,
      ..._.map(votingInterestGroups, votingInterestGroup => (
        <VotingInterestGroupName
          votingInterestGroup={votingInterestGroup}
          createVotingInterestGroup={createVotingInterestGroup}
          deleteVotingInterestGroup={deleteVotingInterestGroup}
          updateVotingInterestGroup={updateVotingInterestGroup}
        />
      )),
      <div style={styles.addNewVotingInterestGroup} onClick={addVotingInterestGroup}>
        <Button
          rounded={true}
          type='primary'
          icon='plus'
        />
        <div style={styles.addNewVotingInterestGroupLabel}><FormattedMessage id='signature_management.voting_threshold.add_voting_interest_group' /></div>
      </div>
    ])
    result.push([
      <div><FormattedMessage id='signature_management.voting_threshold.total_number_of_shares' /></div>,
      ..._.map(votingInterestGroups, votingInterestGroup => (
        <VotingInterestGroupTotalNumberOfShares
          votingInterestGroup={votingInterestGroup}
          updateVotingInterestGroup={updateVotingInterestGroup}
        />
      )),
      <div></div>
    ])
    result.push(
      ..._.map(documents, document => (
        [ 
          <DocumentName document={document} />,
          ..._.map(votingInterestGroups, votingInterestGroup => {
            const votingInterestThreshold = _.find(votingInterestThresholds, { document_id: document.id, voting_interest_group_id: votingInterestGroup.id }) || { document_id: document.id, voting_interest_group_id: votingInterestGroup.id, threshold: 0 }
            return (
              <VotingInterestThreshold
                votingInterestGroup={votingInterestGroup}
                votingInterestThreshold={votingInterestThreshold}
                createVotingInterestThreshold={createVotingInterestThreshold}
                updateVotingInterestThreshold={updateVotingInterestThreshold}
                deleteVotingInterestThreshold={deleteVotingInterestThreshold}
              />
            )
          }),
          <div></div>
        ]
      ))
    )
    return result
  }

  render() {
    const table = this.formatDataIntoTable()
    const cellRenderer = ({ parent, columnIndex, rowIndex, key, style }) => {
      const id = _.uniqueId() // force the grid to re-render. ideally, this would be the id would be constant for a given cell
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={columnIndex}
          key={id}
          parent={parent}
          rowIndex={rowIndex}
        >
          <div key={id} style={_.assign(style, styles.cell)}>
            {table[rowIndex][columnIndex]}
          </div>
        </CellMeasurer>
      )
    }
    if (_.isEmpty(table)) {
      return <div></div>
    }
    return (
      <div style={styles.tableContainer}>
        <AutoSizer>
          {({ height, width }) => (
            <MultiGrid
              ref={(ref) => this.grid = ref}
              cellRenderer={cellRenderer}
              columnWidth={cache.columnWidth}
              columnCount={_.first(table).length}
              fixedColumnCount={1}
              fixedRowCount={2}
              height={height}
              rowHeight={cache.rowHeight}
              rowCount={table.length}
              width={width}
              styleBottomLeftGrid={styles.documentHeader}
              styleTopRightGrid={styles.votingInterestGroupHeader}
              styleTopLeftGrid={styles.header}
              deferredMeasurementCache={cache}
            />
          )}
        </AutoSizer>
      </div>
    )
  }

}

const styles = {
  tableContainer: {
    position: 'absolute',
    top: '4.8rem',
    right: '10%',
    bottom: '5%',
    left: '10%',
    overflow: 'hidden',
    marginTop: '6.4rem',
    border: `0.1rem solid ${Colors.whiteout.mediumGray}`,
    background: Colors.white
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `0.1rem solid ${Colors.whiteout.mediumGray}`,
    borderRight: `0.1rem solid ${Colors.whiteout.mediumGray}`
  },
  documentHeader: {
    borderRight: `0.2rem solid ${Colors.whiteout.moderateGray}`,
    backgroundColor: Colors.whiteout.lightGray
  },
  votingInterestGroupHeader: {
    borderBottom: `0.2rem solid ${Colors.whiteout.moderateGray}`,
    backgroundColor: Colors.whiteout.lightGray
  },
  header: {
    borderRight: `0.2rem solid ${Colors.whiteout.moderateGray}`,
    borderBottom: `0.2rem solid ${Colors.whiteout.moderateGray}`,
    backgroundColor: Colors.whiteout.lightGray
  },
  addNewVotingInterestGroup: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '1.6rem',
    width: '12.8rem',
    cursor: 'pointer'
  },
  addNewVotingInterestGroupLabel: {
    color: Colors.whiteout.blue,
    marginTop: '0.8rem',
    textAlign: 'center',
    width: '100%'
  }
}

VotingThresholdsTable.propTypes = {
  documents: PropTypes.object.isRequired,
  votingInterestGroups: PropTypes.object.isRequired,
  votingInterestThresholds: PropTypes.object.isRequired,

  addVotingInterestGroup: PropTypes.func.isRequired,
  createVotingInterestGroup: PropTypes.func.isRequired,
  deleteVotingInterestGroup: PropTypes.func.isRequired,
  updateVotingInterestGroup: PropTypes.func.isRequired,
  createVotingInterestThreshold: PropTypes.func.isRequired,
  deleteVotingInterestThreshold: PropTypes.func.isRequired,
  updateVotingInterestThreshold: PropTypes.func.isRequired
}
