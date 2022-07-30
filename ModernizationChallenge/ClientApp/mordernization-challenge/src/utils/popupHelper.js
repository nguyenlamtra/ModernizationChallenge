export class PopupHelper {
  constructor(parent, child, options) {
    this.child = child
    this.options = options
    this.parent = parent

    this.mousechild = false
    this.mouseparent = false
    this.visible = false

    this.bound_child_mousedown = this.child_mousedown.bind(this)
    this.bound_child_mouseup = this.child_mouseup.bind(this)
    this.bound_child_scroll = this.child_scroll.bind(this)
    this.bound_parent_blur = this.parent_blur.bind(this)
    this.bound_parent_focus = this.parent_focus.bind(this)
    this.bound_parent_input = this.parent_input.bind(this)
    this.bound_parent_keydown = this.parent_keydown.bind(this)
    this.bound_parent_keyup = this.parent_keyup.bind(this)
    this.bound_parent_mousedown = this.parent_mousedown.bind(this)
    this.bound_window_mousedown = this.window_mousedown.bind(this)
    this.bound_window_mouseup = this.window_mouseup.bind(this)
    this.bound_window_resize = this.window_resize.bind(this)
    this.bound_window_scroll = this.window_scroll.bind(this)

    this.child.addEventListener('mousedown', this.bound_child_mousedown)
    this.child.addEventListener('mouseup', this.bound_child_mouseup)
    this.child.addEventListener('scroll', this.bound_child_scroll)
  }

  child_mousedown = (e) => {
    e.stopPropagation()
    this.mousechild = true
  }

  child_mouseup = () => {
    this.mousechild = false

    if (this.options.mode === 'focus') {
      this.parent.focus()
    }
  }

  child_scroll = (e) => {
    e.stopPropagation()
  }

  hide = () => {
    this.visible = false

    this.child.style.display = 'none'

    this.parent.classList.remove('focus')

    window.removeEventListener('mousedown', this.bound_window_mousedown)
    window.removeEventListener('resize', this.bound_window_resize)
    window.removeEventListener('scroll', this.bound_window_scroll)

    if (this.options.onhide) {
      this.options.onhide(this.parent, this.child, this.options.data)
    }

    this.parent.blur()
  }

  layout = () => {
    var rect = this.parent.getBoundingClientRect()

    this.child.style.left = rect.left + 'px'
    this.child.style.top = rect.bottom + 'px'

    if (
      this.child.offsetLeft + this.child.offsetWidth >=
        document.documentElement.clientWidth &&
      rect.right - this.child.offsetWidth >= 0
    ) {
      this.child.style.left = rect.right - this.child.offsetWidth + 'px'
    }

    if (
      this.child.offsetTop + this.child.offsetHeight >=
        document.documentElement.clientHeight &&
      rect.top - this.child.offsetHeight >= 0
    ) {
      this.child.style.top = rect.top - this.child.offsetHeight + 'px'
    }
  }

  parent_blur = () => {
    if (this.options.mode === 'focus' && this.visible && !this.mousechild) {
      this.hide()
    }
  }

  parent_focus = () => {
    if (this.options.mode === 'focus' && !this.visible) {
      this.show()
    }
  }

  parent_input = () => {
    if (this.options.oninput) {
      this.options.oninput(this.parent, this.child, this.options.data)
    }
  }

  parent_keydown = () => {
    if (this.options.onkeydown) {
      this.options.onkeydown(this.parent, this.child, this.options.data)
    }
  }

  parent_keyup = () => {
    if (this.options.onkeyup) {
      this.options.onkeyup(this.parent, this.child, this.options.data)
    }
  }

  parent_mousedown = () => {
    this.mouseparent = true

    window.addEventListener('mouseup', this.bound_window_mouseup)

    if (this.options.mode === 'click') {
      if (this.visible) {
        this.hide()
      } else {
        this.show()
      }
    }
  }

  show = () => {
    if (this.options.onshow) {
      this.options.onshow(this.parent, this.child, this.options.data)
    }

    window.addEventListener('mousedown', this.bound_window_mousedown)
    window.addEventListener('resize', this.bound_window_resize)
    window.addEventListener('scroll', this.bound_window_scroll)

    this.parent.classList.add('focus')

    this.child.style.display = 'block'

    this.layout()

    this.visible = true
  }

  window_mousedown = () => {
    if (!this.mouseparent) {
      this.hide()
    }
  }

  window_mouseup = () => {
    window.removeEventListener('mouseup', this.bound_window_mouseup)

    this.mouseparent = false
  }

  window_resize = () => {
    this.layout()
  }

  window_scroll = () => {
    this.layout()
  }

  static init = (parent, child, options) => {
    parent.removeAttribute('onblur')
    parent.removeAttribute('onfocus')
    parent.removeAttribute('onkeydown')
    parent.removeAttribute('onkeyup')
    parent.removeAttribute('oninput')
    parent.removeAttribute('onmousedown')

    parent.popupHelper = new PopupHelper(parent, child, options)

    parent.addEventListener('blur', parent.popupHelper.bound_parent_blur)
    parent.addEventListener('focus', parent.popupHelper.bound_parent_focus)
    parent.addEventListener('input', parent.popupHelper.bound_parent_input)
    parent.addEventListener('keydown', parent.popupHelper.bound_parent_keydown)
    parent.addEventListener('keyup', parent.popupHelper.bound_parent_keyup)
    parent.addEventListener(
      'mousedown',
      parent.popupHelper.bound_parent_mousedown,
    )

    if (options.mode === 'click') {
      parent.popupHelper.parent_mousedown()
    } else if (options.mode === 'focus') {
      parent.popupHelper.parent_focus()
    }
  }
}
