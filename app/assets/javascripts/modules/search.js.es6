
// In the tree argument, each 'container' must represent 1 div
// that you either want to include or exclude, it should NOT be a group of divs like "children"
function performNestedSearch(query, tree, parent, foundInParent) {
  let childShown = false
  const trimmedQuery = query.toLowerCase().trim()
  // search tree
  for(var i = 0; i < tree.length; i++){
    let element = tree[i]
    // find matches at this level
    const matches = $(parent).find(`.${element.container}`)
    for(var j = 0; j < matches.length; j++) {
      const match = matches[j]
      let show = foundInParent

      // check if the text matches
      let data = $(match).find(`.${element.data}`)
      if(data.text().toLowerCase().includes(trimmedQuery)) {
        show = true
      }

      // search children
      if('children' in element) {
        show = performNestedSearch(query, element.children, match, show) || show
      }

      // set visibility
      show ? $(match).show() : $(match).hide()
      childShown = childShown || show
    }
  }
  return childShown
}
