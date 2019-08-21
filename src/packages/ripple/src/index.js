const Ripple = {
  bind: function (el, binding) {
    let timer = null
    const props = {
      event: 'mousedown',
      transition: 2000,
      bg: 'rgba(0, 0, 0, 0.35)',
      zIndex: '9999'
    }

    el.addEventListener(props.event, function (event) {
      rippler(event, el)
    })

    function rippler (event, el) {
      const target = el
      const rect = target.getBoundingClientRect()
      const style = window.getComputedStyle(target)
      const left = rect.left
      const top = rect.top
      const width = target.offsetWidth
      const height = target.offsetHeight
      const dx = event.clientX - left
      const dy = event.clientY - top
      const maxX = Math.max(dx, width - dx)
      const maxY = Math.max(dy, height - dy)
      const radius = Math.sqrt((maxX * maxX) + (maxY * maxY))
      const border = parseInt(style.borderWidth)

      const ripple = document.createElement('div')
      const rippleContainer = document.createElement('div')

      _setStyle(ripple, {
        width: '1px',
        height: '1px',
        borderRadius: '50%',
        pointerEvents: 'none',
        position: 'relative',
        marginLeft: dx + 'px',
        marginTop: dy + 'px',
        transition: 'all ' + props.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: props.zIndex,
        backgroundColor: props.bg
      })

      _setStyle(rippleContainer, {
        position: 'absolute',
        left: 0 - border + 'px',
        top: 0 - border + 'px',
        borderRadius: style.borderRadius,
        pointerEvents: 'none',
        overflow: 'hidden',
        width: width + 'px',
        height: height + 'px'
      })

      const storedTargetPosition = style.position
      if (storedTargetPosition === 'static') {
        target.style.position = 'relative'
      }
      rippleContainer.appendChild(ripple)
      target.appendChild(rippleContainer)

      setTimeout(function () {
        _setStyle(ripple, {
          width: radius * 2 + 'px',
          height: radius * 2 + 'px',
          marginLeft: dx - radius + 'px',
          marginTop: dy - radius + 'px'
        })
      }, 0)
      setTimeout(function () {
        ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }, props.transition / 4)
      setTimeout(function () {
        rippleContainer.parentNode.removeChild(rippleContainer)
      }, props.transition)
      clearTimeout(timer)
      timer = setTimeout(function () {
        target.style.position = storedTargetPosition
      }, props.transition)
    }
    function _setStyle (el, data) {
      Object.keys(data).forEach(e => {
        el.style[e] = data[e]
      })
    }
  }
}

export default Ripple
