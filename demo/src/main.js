// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VTooltip from 'v-tooltip'
import Stats from 'stats.js'

function numDomNodes(node) {
  if(!node.children || node.children.length == 0)
    return 0;
  var childrenCount = Array.from(node.children).map(numDomNodes);
  return node.children.length + childrenCount.reduce(function(p, c){ return p + c; }, 0);
}

const stats = new Stats()
const domPanel = new Stats.Panel('DOM nodes', '#0ff', '#002')
stats.addPanel(domPanel)
stats.showPanel(3)
document.body.appendChild(stats.dom)

const domNodeFunc = () => {
  window.requestIdleCallback(() => {
    domPanel.update(numDomNodes(document.body), 1500)
  })

  setTimeout(domNodeFunc, 100)
}

window.setTimeout(domNodeFunc, 100)

Vue.use(VTooltip)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
