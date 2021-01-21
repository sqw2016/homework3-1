/**
 * 观察目标
 */

class Dep {
  constructor() {
    this.subs = []
  }
  addWatcher(sub) {
    if (!sub || !sub.update) return
    this.subs.push(sub)
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}