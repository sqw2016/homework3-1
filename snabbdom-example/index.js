import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class.js'
import { propsModule } from 'snabbdom/build/package/modules/props.js'
import { styleModule } from 'snabbdom/build/package/modules/style.js'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners.js'
import  { h } from 'snabbdom/build/package/h'
import { lastIndexOf } from 'core-js/fn/array'

const patch = init([classModule, propsModule, styleModule, eventListenersModule])

const MARGIN = 8
const sortBtns = [
  {
    id: 1,
    name: 'Rank',
    value: 'rank'
  },
  {
    id: 2,
    name: 'Title',
    value: 'title'
  },
  {
    id: 3,
    name: 'Description',
    value: 'desc'
  },
]
const originalData = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
  { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0 },
  { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0 },
  { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0 },
  { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0 },
  { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0 },
  { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0 },
  { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0 },
  { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0 },
  { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0 },
]

let data = [...originalData]
let sortBy = sortBtns[0]
let vnode = document.getElementById('app')
let nextId = 11

function movieView(movie) {
  return h('div.row', {
    key: movie.rank,
    style: {
      opacity: '0',
      transform: 'translate(-200px)',
      delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
      remove: { opacity: '0', transform: `translateY(${movie.offset}px) translateX(200px)` }
    },
    hook: {
      insert(vnode) {
        movie.elmHeight = vnode.elm.offsetHeight
      }
    }
  } ,[
    h('div', { style: { fontWeight: 'bold' } }, movie.rank),
    h('div', movie.title),
    h('div', movie.desc),
    h('div.rm-btn', {
      on: {
        click: () => { remove(movie) }
      }
    }, 'x')
  ])
}
// 删除电影
function remove(movie) {
  data = data.filter(item => item !== movie)
  render()
}
// 添加电影
function add() {
  const m = originalData[Math.floor(Math.random() * 10)]
  data.unshift({ rank: nextId++, title: m.title, desc: m.desc })
  changeSort(sortBy)
  render()
}

function render() {
  // 计算每个元素的offset
  data = data.reduce((acc, elm) => {
    const last = acc[acc.length - 1]
    elm.offset = last ? last.offset + last.elmHeight + MARGIN : MARGIN
    return acc.concat(elm)
  }, [])
  // 计算总的高度
  const len = data.length
  const last = data[len - 1]
  // 渲染
  vnode = patch(vnode, view(data))
}

// 改变排序
function changeSort(sort) {
  sortBy = sort
  data.sort((a, b) => {
    if (a[sort.value] > b[sort.value]) return 1
    if (a[sort.value] < b[sort.value]) return -1
    return 0
  })
  render()
}

function view(viewData) {
  return h('div', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', {
        on: {
          click: add
        }
      }, 'add'),
      'Sort by: ',
      h('span', sortBtns.map(item => h('a.btn', {
        class: { active: sortBy.id === item.id },
        on: {
          click: () => { changeSort(item) }
        }
      }, item.name)))
    ]),
    h('div.list', viewData.map(movieView))
  ])
}

window.addEventListener('DOMContentLoaded', () => {
  var container = document.getElementById('app')
  // 这里patch两次是因为虚拟DOM没有elm，需要在插入到DOM树上才会将真实DOM存到elm
  vnode = patch(container, view(data))
  render()
})