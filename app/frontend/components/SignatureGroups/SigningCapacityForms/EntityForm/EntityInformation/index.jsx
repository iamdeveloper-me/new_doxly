import PropTypes from 'prop-types'
import React from 'react'

import BlockAlert from 'components/SignatureGroups/SigningCapacityForms/BlockAlert/index.jsx'
import Entity from './Entity/index.jsx'
import SignerInformation from './SignerInformation/index.jsx'

export default class EntityInformation extends React.PureComponent {
  render() {
    const { descendants, entityName, formSubmitted, isEditing, nameAlerts, signerAlerts, signingCapacities  } = this.props
    const { addDescendant, addPlaceholder, addSigningCapacity, removeDescendant, removeSigningCapacity, setAttribute, subtractPlaceholder } = this.props

    return (
      <div>
        <BlockAlert
          alerts={nameAlerts}
          isEditing={isEditing}
        />
        <Entity
          entityName={entityName}
          descendants={descendants}
          formSubmitted={formSubmitted}
          addDescendant={addDescendant}
          removeDescendant={removeDescendant}
          setAttribute={setAttribute}
        />
        <SignerInformation
          signingCapacities={signingCapacities}
          formSubmitted={formSubmitted}
          alerts={signerAlerts}
          isEditing={isEditing}
          addSigningCapacity={addSigningCapacity}
          removeSigningCapacity={removeSigningCapacity}
          setAttribute={setAttribute}
          addPlaceholder={addPlaceholder}
          subtractPlaceholder={subtractPlaceholder}
        />
      </div>
    )
  }
}

EntityInformation.propTypes = {
  descendants: PropTypes.array.isRequired,
  entityName: PropTypes.string.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  nameAlerts: PropTypes.object.isRequired,
  signerAlerts: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  signingCapacities: PropTypes.array.isRequired,

  addDescendant: PropTypes.func.isRequired,
  addPlaceholder: PropTypes.func.isRequired,
  addSigningCapacity: PropTypes.func.isRequired,
  removeDescendant: PropTypes.func.isRequired,
  removeSigningCapacity: PropTypes.func.isRequired,
  setAttribute: PropTypes.func.isRequired,
  subtractPlaceholder: PropTypes.func.isRequired
}
