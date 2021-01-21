const directivesFunctions = {
  'v-model': function(node, key) {
    node.value = this.data[key]
    new Watcher(this.data, key, value => {
      node.value = value // 将差值表达式的值替换为对应的属性值
    })
    // 添加双向绑定
    node.addEventListener('input', () => {
      this.data[key] = node.value
    })
  },
  'v-text': function(node, key) {
    node.textContent = this.data[key]
    new Watcher(this.data, key, value => {
      node.textContent = value // 将差值表达式的值替换为对应的属性值
    })
  },
  'v-html': function(node, key) {
    node.innerHTML = this.data[key]
    new Watcher(this.data, key, value => {
      node.innerHTML = value // 将差值表达式的值替换为对应的属性值
    })
  }
}

function arrToObj(arr) {
  const obj = {}
  arr.forEach(key => {
    obj[key] = true
  })
  return obj
}

function handleVon(attr, node, key) {
  const self = this
  const eventArr = attr.split(':')[1].split('.')
  const modifier = arrToObj(eventArr.slice(1))
  node.addEventListener(eventArr[0], function(e) {
    if (modifier.stop) { // .stop
      e.stopPropagation()
    }
    if(modifier.prevent) { // .prevent
      e.preventDefault()
    }
    if (modifier.self && e.target !== node) return //.self
    if(modifier.left && e.button && e.button !== 0) return //.left
    if(modifier.middle && e.button && e.button !== 1) return //.middle
    if(modifier.right && e.button && e.button !== 2) return //.middle

    if (self.vm[key]) {
      self.vm[key](e)
    } else {
      (function() { // 构建eval的执行环境
        const $event = e
        eval(key)
      })()
    }
  }, {
    capture: modifier.capture,
    once: modifier.once,
    passive: modifier.passive
  })
}

class Compiler {
  constructor(vm) {
    this.vm = vm
    this.data = vm.$data
    this.el = vm.$el
    this.compile(this.el)
  }
  // 遍历子节点
  compile(node) {
    const childNodes = node.childNodes
    if (!childNodes || !childNodes.length) return 
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileTextNode(node)
      } else if(this.isElementNode(node)){
        this.compileElementNode(node)
      }
      this.compile(node)
    })
  }
  compileTextNode(node) {
    // 获取节点内容
    const content = node.textContent
    const reg = /\{\{(.+?)\}\}/;
    if(reg.test(content)) { // 如果是差值表达式
      const key = RegExp.$1.trim() // 获取属性
      node.textContent = content.replace(reg, this.data[key]) // 将差值表达式的值替换为对应的属性值
      new Watcher(this.data, key, value => {
        node.textContent = content.replace(reg, value) // 将差值表达式的值替换为对应的属性值
      })
    }
  }
  compileElementNode(node) {
    const arrts = node.attributes // 获取属性
    Array.from(arrts).forEach(attr => {
      if(this.isDirective(attr.name)) {
        if (attr.name.startsWith('v-on')) {
          handleVon.call(this, attr.name, node, attr.value)
        } else {
          directivesFunctions[attr.name] && directivesFunctions[attr.name].call(this, node, attr.value)
        }
      }
    })
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isDirective(attr) {
    return attr.startsWith('v-')
  }
}