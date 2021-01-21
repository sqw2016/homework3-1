// 将对象转换成响应式对象
class Observer {
  constructor(data) {
    // 遍历对象
    this.walk(data)
  }
  walk(data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(data, key, value) {// value是被闭包函数set和get引用，所以value修改，获取的值也会改变
    const _this = this
    this.walk(value)
    const dep = new Dep()
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      set(newValue) {
        if(value === newValue) return
        value = newValue
        _this.walk(newValue)
        dep.notify()
      },
      get() {
        // 添加观察者
        Dep.target && dep.addWatcher(Dep.target)
        return value
      }
    })
  }
}