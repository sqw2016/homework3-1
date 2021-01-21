class Watcher {
  constructor(data, key, cb) {
    this.data = data
    this.key = key
    this.cb = cb
    Dep.target = this // 将自身设置为观察者
    this.oldValue = data[key] // 保存观察者到观察目标
    Dep.target = null // 防止重复添加
  }
  update() {
    const newValue = this.data[this.key]
    if(this.oldValue === newValue) return
    this.cb(newValue)
  }
}