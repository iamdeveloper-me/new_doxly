import _ from 'lodash'
import React from 'react'

export const ProductContext = React.createContext({})
export const can = (action, feature) => action.test(feature)