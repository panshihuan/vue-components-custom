export function getCurrentStyle (node) {
  return node.currentStyle ? node.currentStyle : getComputedStyle(node)
}

export function traverseParent (node, cb) {
  if (!node) return
  let target = node.parentNode
  while (target && target !== document.documentElement) {
    cb && cb(target)
    target = target.parentNode
  }
}
