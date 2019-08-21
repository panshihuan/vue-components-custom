function broadcast (checkCurrent, eventName, params) {
  if (!this.$children || !this.$children.length) return false
  this.$children.forEach(child => {
    let checked = false
    if (typeof checkCurrent === 'function') {
      checked = checkCurrent(child)
    } else if (!checkCurrent) {
      checked = true
    } else {
      const componentName = child.$options.name
      checked = componentName === checkCurrent
    }

    if (checked) {
      child.$emit.apply(child, [eventName].concat([params]))
    } else {
      broadcast.apply(child, [checkCurrent, eventName].concat([params]))
    }
  })
}

function dispatch (checkCurrent, eventName, params) {
  let parent = this.$parent
  if (!parent) return false
  let checked = false
  if (typeof checkCurrent === 'function') {
    checked = checkCurrent(parent)
  } else if (!checkCurrent) {
    checked = true
  } else {
    const componentName = parent.$options.name
    checked = componentName === checkCurrent
  }
  if (checked) {
    parent.$emit.apply(parent, [eventName].concat([params]))
  } else {
    dispatch.apply(parent, [checkCurrent, eventName].concat([params]))
  }
}
export default {
  methods: {
    dispatch (checkCurrent, eventName, params) {
      dispatch.call(this, checkCurrent, eventName, params)
    },
    broadcast (checkCurrent, eventName, params) {
      broadcast.call(this, checkCurrent, eventName, params)
    }
  }
}
