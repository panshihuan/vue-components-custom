
export default {
  methods: {
    touchStart (event) {
      this.resetTouchStatus()
      this.startX = event.touches[0].clientX
      this.startY = event.touches[0].clientY
      var request = new XMLHttpRequest()
      request.open('POST', '/clientX')
      request.send(JSON.stringify({ clientX: this.startX }))
      console.log('clientX:::', this.startX)
    },

    touchMove (event) {
      const touch = event.touches[0]
      this.deltaX = touch.clientX - this.startX
      this.deltaY = touch.clientY - this.startY
      this.offsetX = Math.abs(this.deltaX)
      this.offsetY = Math.abs(this.deltaY)
    },

    resetTouchStatus () {
      this.deltaX = 0
      this.deltaY = 0
      this.offsetX = 0
      this.offsetY = 0
    }
  }
}
