import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Colors from 'helpers/Colors'
import { DmsMetadata } from 'components/Version/DmsMetadata/index.jsx'
import VersionDocumentBadge from 'components/Version/VersionDocumentBadge/index.jsx'
import VersionDate from 'components/Version/VersionDate/index.jsx'
import VersionDelete from 'components/Version/VersionDelete/index.jsx'
import VersionDetails from 'components/Version/VersionDetails/index.jsx'

export default class DocumentViewerVersion extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
    this.expandSigners = this.expandSigners.bind(this)
    this.signerHtml = this.signersHtml.bind(this)
  }

  expandSigners() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  signersHtml() {
    const { version } = this.props
    const signers = Array.from(new Set(version.signature_page_executions.map(spe => spe.user.name)))
    const signersCount = signers.length
    const signerWord = <FormattedMessage id='category.document_viewer.signer' values={{signersCount: signersCount}} />
    const caret = this.state.expanded ?
        <i className={"fa fa-caret-down"} ariaHidden="true"></i>
      :
        <i className={"fa fa-caret-up"} ariaHidden="true"></i>

    return (
      <div style={styles.signersContainer}>
        <div onClick={this.expandSigners} style={styles.expandTrigger}>
          {signersCount} {signerWord} {caret}
        </div>
        {this.state.expanded ?
          <div style={styles.signers}>
            {
              signers.map((signer, i) => {
                return(
                  <div key={i} style={styles.signer}>
                    {signer}
                  </div>
                )
              })
            }
          </div>
        :
          null
        }
      </div>
    )
  }


  render() {
    const { categoryType, currentDealEntityUser, dmsType, documentViewerAlreadyShown, noteError, notesLoading, publicNotes, teamNotes, treeElement, version, versions } = this.props
    const { addNote, deleteNote, deletePlacedUploadVersion, deleteVersion, getNotes, hideDocumentViewer } = this.props
    const versionDetails = <VersionDetails version={version} />
    const versionDate = <VersionDate version={version} />
    const versionDelete = <VersionDelete
                            version={version}
                            versions={versions}
                            currentDealEntityUser={currentDealEntityUser}
                            deletePlacedUploadVersion={deletePlacedUploadVersion}
                            deleteVersion={deleteVersion}
                            treeElement={treeElement}
                            hideDocumentViewer={hideDocumentViewer}
                          />
    const executed = version.status === "executed"
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
                                    dmsType={dmsType}
                                    currentDealEntityUser={currentDealEntityUser}
                                    deletePlacedUploadVersion={deletePlacedUploadVersion}
                                  />

    return (
      <div style={styles.content}>
        <div style={styles.badgeAndDate}>
          {versionDocumentBadge}
          {versionDate}
          {versionDelete}
        </div>
        {versionDetails}
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
        {
          executed ?
            this.signersHtml()
          :
            null
        }
      </div>
    )
  }
}

const styles = {
  badgeAndDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontWeight: 500,
    color: Colors.gray.darker,
    fontSize: '12px',
    overflow: 'hidden'
  },
  expandTrigger: {
    color: Colors.button.blue,
    marginTop: '8px'
  },
  signers: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: Colors.text.gray,
    marginTop: '8px',
    fontWeight: '400',
    lineHeight: '1.5'
  },
  dmsMetadata: {
    display: 'flex'
  }
}

DocumentViewerVersion.defaultProps = {
  documentViewerAlreadyShown: false
}

DocumentViewerVersion.propTypes = {
  categoryType: PropTypes.string,
  currentDealEntityUser: PropTypes.object.isRequired,
  documentViewerAlreadyShown: PropTypes.bool,
  dmsType: PropTypes.string,
  noteError: PropTypes.bool,
  notesLoading: PropTypes.bool,
  publicNotes: PropTypes.array,
  teamNotes: PropTypes.array,
  treeElement: PropTypes.object,
  version: PropTypes.object.isRequired,
  versions: PropTypes.array.isRequired,

  addNote: PropTypes.func,
  deleteNote: PropTypes.func,
  deletePlacedUploadVersion: PropTypes.func.isRequired,
  deleteVersion: PropTypes.func.isRequired,
  getNotes: PropTypes.func,
  hideDocumentViewer: PropTypes.func
}
