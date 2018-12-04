import _ from 'lodash'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import VersionDocumentBadge from 'components/Version/VersionDocumentBadge/index.jsx'
import FlatIconButton from 'components/Buttons/FlatIconButton/index.jsx'
import { DmsMetadata } from 'components/Version/DmsMetadata/index.jsx'
import VersionDate from 'components/Version/VersionDate/index.jsx'
import VersionDetails from 'components/Version/VersionDetails/index.jsx'


export default class SidebarVersion extends React.PureComponent {

  constructor(props) {
    super(props)
    this.markAsFinal = this.markAsFinal.bind(this)
  }

  markAsFinal() {
    const { treeElement, version, updateVersion } = this.props
    if (updateVersion) {
      let newVersion = _.cloneDeep(version)
      newVersion.status = version.status === 'final' ? 'draft' : 'final'
      updateVersion(treeElement, newVersion)
    }
  }

  render() {
    const { categoryType, currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, publicNotes, showMarkAsFinal, teamNotes, treeElement, version } = this.props
    const { addNote, clickFileName, deleteNote, deletePlacedUploadVersion, getNotes } = this.props
    const isFinal = version.status === 'final'

    const versionDetails = <VersionDetails version={version} clickFileName={clickFileName} />
    const versionDate = <VersionDate version={version} />
    const versionDocumentBadge =  <VersionDocumentBadge
                                    categoryType={categoryType}
                                    treeElement={treeElement}
                                    documentViewerAlreadyShown={documentViewerAlreadyShown}
                                    publicNotes={publicNotes}
                                    teamNotes={teamNotes}
                                    notesLoading={notesLoading}
                                    noteError={noteError}
                                    addNote={addNote}
                                    deleteNote={deleteNote}
                                    getNotes={getNotes}
                                    version={version}
                                    statusStyle={styles.statusStyle}
                                    dmsType={dmsType}
                                    currentDealEntityUser={currentDealEntityUser}
                                    deletePlacedUploadVersion={deletePlacedUploadVersion}
                                  />
    return (
      <div style={styles.content}>
        <div style={styles.topBox}>
          {versionDocumentBadge}
          {showMarkAsFinal && version.status !== 'executed' ?
            <div>
              {isFinal ?
                <FlatIconButton onClick={this.markAsFinal}
                  icon={"fa fa-flag-o"}
                  text={<FormattedMessage id={"category.tree_element.attachment.version.undo_final"}/>}
                  style={styles.undoFinal}
                />
              :
                <FlatIconButton onClick={this.markAsFinal}
                  icon={"fa fa-flag"}
                  text={<FormattedMessage id={"category.tree_element.attachment.version.mark_as_final"}/>}
                  style={styles.markAsFinal}
                />
              }
            </div>
          :
            null
          }
        </div>
        <div style={styles.middleBox}>
          {versionDetails}
        </div>
        <div style={styles.bottomBox}>
          {versionDate}
        </div>
        {dmsType ?
          <div style={styles.dmsMetadata}>
            <DmsMetadata
              version={version}
              dmsType={dmsType}
            />
          </div>
        :
          null
        }
      </div>
    )
  }

}

const styles = {
  topBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  markAsFinal: {
    borderRadius: '2px',
    color: Colors.white,
    backgroundColor: Colors.button.blue,
    width: '134px',
    height: '32px',
    justifyContent: 'center'
  },
  undoFinal: {
    borderRadius: '2px',
    width: '134px',
    height: '32px',
    border: `solid 1px ${Colors.button.lightGrayBlue}`,
    justifyContent: 'center',
    color: Colors.button.blue,
    backgroundColor: Colors.white
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 500,
    color: Colors.gray.darker,
    fontSize: '12px',
    overflow: 'hidden'
  },
  statusStyle: {
    height: '32px',
    width: '120px'
  },
  dmsMetadata: {
    display: 'flex'
  }
}

SidebarVersion.defaultProps = {
  documentViewerAlreadyShown: false
}

SidebarVersion.propTypes = {
  categoryType: PropTypes.string,
  currentDealEntityUser: PropTypes.object.isRequired,
  dmsType: PropTypes.string,
  documentViewerAlreadyShown: PropTypes.bool,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  showMarkAsFinal: PropTypes.bool,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object.isRequired,

  addNote: PropTypes.func,
  clickFileName: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func,
  updateVersion: PropTypes.func
}
