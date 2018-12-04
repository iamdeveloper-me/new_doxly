const Params = {
  fetch: () => {
    let params = {}
    const splitPath = window.location.pathname.substr(1).split('/')
    for(var i=0; i<splitPath.length; i += 2) {
      params[splitPath[i]] = splitPath[i+1]
    }
    return params
  }
}
export default Params
