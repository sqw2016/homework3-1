class Vue {
  constructor(options) {
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
    // 转换data并注入到Vue实例
    this._proxyData(this.$data)
    // 将data转换为响应式对象
    new Observer(this.$data)
    // 编译模板
    new Compiler(this)
  }
  _proxyData(data) {
    if (typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        set(newValue) {
          if (newValue === data[key]) return
          data[key] = newValue
        },
        get() {
          return data[key]
        }
      })
    })
  }
}