<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll.passive="handleScroll">
      <div class="VirtualStream__Track VirtualStream__Track--newItems" ref="newItemsList">
        <Item v-for="(item, index) in newItems" :id="item.id" :index="index" :maxIndex="newItems.length" :key="item.id" ref="newItems">
          <slot :item="item" :index="index" />
        </Item>
      </div>
      <div class="VirtualStream__Track" ref="track">
        <Item
          v-for="index in count"
          :key="(currentView[index - 1]) ? currentView[index - 1].id : null" ref="items"
          :id="(currentView[index - 1]) ? currentView[index - 1].id : null"
          :index="index - 1"
          :maxIndex="currentView.length - 1"
          @resizeitem="updateItemDimension"
        >
          <slot v-if="currentView[index - 1]" :item="currentView[index -1]" :index="index - 1" />
        </Item>
      </div>
    </div>
  </div>
</template>

<script>
  import throttle from 'lodash/throttle'
  import debounce from 'lodash/debounce'
  import getBrowser from '../utils/getBrowser'
  import Item from './Item.vue'

  const browser = getBrowser()
  let locked = false

  export default {
    name: 'VirtualStream',
    components: {
      Item
    },
    props: {
      items: {
        type: Array,
        required: true,
      },
      reversed: {
        type: Boolean,
        default: false,
      },
      count: {
        type: Number,
        default: 40,
      },
      offset: {
        type: Number,
        default: 5,
      }
    },
    data() {
      return {
        position: 0,
        dimensions: {},
        totalHeight: 0,
        ready: false,
        trigger: {
          start: false,
          end: false,
        },
        triggerDimensions: false,
        newItems: [],
        receivedNewItems: false,
      }
    },
    computed: {
      itemCount() {
        return this.items.length
      },
      correctedCount() {
        return Math.round(this.count / 2)
      },
      currentView() {
        const startPos = (this.position - this.correctedCount < 0) ? 0 : this.position - this.correctedCount
        const endPos = (this.position + this.correctedCount > this.items.length) ? this.items.length : this.position + this.correctedCount
        return this.items.slice(startPos, endPos)
      },
      identifier() {
        let indexes = []
        let ids = {}
        this.items.forEach((item, index) => {
          indexes[index] = item.id
          ids[item.id] = index
        })
        return { indexes, ids }
      },
    },
    methods: {
      updateCurrentPosition(force) {
        const positions = {}

        positions.start = (!this.reversed) ?
          this.$refs.wrapper.scrollTop :
          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)

        positions.end = (!this.reversed) ?
          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :
          this.totalHeight - this.$refs.wrapper.scrollTop
        
        if (positions.end === this.totalHeight) this.$emit('scroll', 'end')

        if (positions.start === 0) {
          this.$emit('scroll', 'start')
        } else if (positions.end === this.totalHeight) {
          this.$emit('scroll', 'end')
        } else {
          this.$emit('scroll', positions)
        }

        if (!this.ready && !force) return false

        if (this.triggerDimensions && this.triggerDimensions.start) {
          if (this.position > 0 && (positions.start <= this.triggerDimensions.start.end)) {
            this.updatePosition(this.trigger.start.id)
          }
        }

        if (this.triggerDimensions && this.triggerDimensions.end) {
          if (positions.end >= this.triggerDimensions.end.start) {
            this.updatePosition(this.trigger.end.id)
          }
        }

        if (positions.start < this.triggerDimensions.start.start || positions.end > this.triggerDimensions.end.end) {
          const dimensions = Object.values(this.dimensions)

          const currentPosition = dimensions.filter(dimension => {
            const dimensionEnd = dimension.top + dimension.height
            return ((positions.end >= dimension.top && positions.end <= dimensionEnd))
          })

          if (currentPosition[0]) {
            this.updatePosition(currentPosition[0].id)
          }
        }
      },
      handleScroll: throttle(function() {
        this.updateCurrentPosition()
      }, 100),
      updatePosition(id) {
        this.position = this.identifier.ids[id]
      },
      getPreviousItemHeight(item) {
        const id = item.id

        const previousIndex = (() => {
          const index = this.identifier.ids[id] - 1
          return (index >= 0) ? index : false
        })()

        const previousId = (() => {
          const id = (previousIndex !== false) ? this.identifier.indexes[previousIndex] : false
          return (id) ? id : false
        })()

        return this.getItemHeight(previousId)
      },
      getItemHeight(id) {
        const dimensionItem = this.dimensions[id] || false
        return (dimensionItem) ? dimensionItem.top + dimensionItem.height : 0
      },
      updateItemDimensions() {
        this.ready = false
        const sortedItems = this.$refs.items.filter((item) => {
          return (item.id !== null)
        }).sort((a, b) => {
          if (a.index > b.index) return 1
          if (a.index < b.index) return -1
          return 0
        })

        sortedItems.forEach((item, i) => {
          const top = this.getPreviousItemHeight(item)
          this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top }
        })

        const oldTotalHeight = this.totalHeight
        const oldScrollTop = this.$refs.wrapper.scrollTop

        this.totalHeight = !this.dimensions.length ? 0 : Object.values(this.dimensions).reduce((dimensionA, dimensionB) => {
          const aVal = (dimensionA.height) ? dimensionA.height : dimensionA
          const bVal = (dimensionB.height) ? dimensionB.height : dimensionB
          return aVal + bVal
        })

        if (this.receivedNewItems) {
          if (!this.reversed) {
            if (oldScrollTop !== 0) {
              if (oldTotalHeight < this.totalHeight) {
                const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)
                window.requestAnimationFrame(() => {
                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
                  this.$refs.wrapper.scrollTop = oldScrollTop + heightDiff
                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
                })
              }
            }  
          }
        } else {
          if (oldScrollTop !== 0) {
            if (this.reversed && oldTotalHeight < this.totalHeight) {
              const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)
              window.requestAnimationFrame(() => {
                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
                this.$refs.wrapper.scrollTop = oldScrollTop + heightDiff
                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
              })
            }
          }
        }

        this.trigger = {
          start: sortedItems[0],
          end: sortedItems[sortedItems.length - this.offset]
        }

        this.triggerDimensions = {
          full: {
            start: this.dimensions[this.trigger.start.id],
            end: this.dimensions[this.trigger.end.id],
          },
          start: {
            start: this.dimensions[this.trigger.start.id].top,
            end: this.dimensions[this.trigger.start.id].top + this.dimensions[this.trigger.start.id].height
          },
          end: {
            start: this.dimensions[this.trigger.end.id].top,
            end: this.dimensions[this.trigger.end.id].top + this.dimensions[this.trigger.end.id].height
          }
        }

        this.$refs.track.style.height = this.totalHeight + 'px'
        this.$emit('dimensions', this.dimensions)

        window.setTimeout(() => {
          this.ready = true
          this.receivedNewItems = false
        }, 100)
      },
      updateItemDimension(d) {
        Object.assign(this.dimensions[d.id], d.dimensions)
      },
      updateAllDimensions() {
        const sortedItems = this.$refs.items.filter((item) => {
          return (item.id !== null)
        }).sort((a, b) => {
          if (a.index > b.index) return 1
          if (a.index < b.index) return -1
          return 0
        })

        if (this.$refs.newItems) {
          this.$refs.newItems.forEach((item, i) => {
            this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, id: item.id, top: 0 }
          })
        }

        const newItemHeight = (!this.$refs.newItems) ? false : this.$refs.newItems.reduce((a, b) => {
          const aVal = (typeof a === 'number') ? a : a.$el.offsetHeight
          const bVal = (typeof b === 'number') ? b : b.$el.offsetHeight
          return aVal + bVal
        }, 0)

        const newDimensions = {}

        Object.keys(this.dimensions).forEach((key, i) => {
          const dimension = this.dimensions[key]
          Object.assign(this.dimensions[key], { top: dimension.top + newItemHeight })
        })
      }
    },
    watch: {
      currentView(n) {
        this.$nextTick(() => {
          this.updateItemDimensions()
          this.$nextTick(() => {
            this.updateCurrentPosition()
          })
        })
      },
      itemCount(newVal, oldVal) {
        if (newVal !== oldVal) {
          const diffCount = Math.abs(newVal - oldVal)
          this.newItems = this.items.slice(0, diffCount)
          this.receivedNewItems = true
          this.$emit('newitem')
        } else {
          this.newItems = []
          this.receivedNewItems = false
        }

        this.updateAllDimensions()
        
        this.$nextTick(() => {
          this.updateCurrentPosition(true)
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updateItemDimensions()
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
        if (this.reversed) this.$refs.wrapper.scrollTop = this.totalHeight
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'

        this.updateCurrentPosition()

        window.setTimeout(() => {
          this.ready = true
        }, 100)

        window.addEventListener('resize', debounce(() => {
          this.$refs.track.style.height = 0
          this.updateItemDimensions()
        }, 60))
      })
    }
  }
</script>

<style scoped>
  .VirtualStream__Scroller {
    height: 100%;
    left: 0;
    overflow: auto;
    position: absolute;
    top: 0;
    transform: translate3d(0,0,0);
    width: 100%;
  }

  .VirtualStream__Wrapper {
    /* -webkit-overflow-scrolling: touch; */
    height: 100%;
    overflow: auto;
    transform: translate3d(0,0,0);
    width: 100%;
  }

  .VirtualStream__Track {
    position: relative;
  }

  .VirtualStream__Track--newItems {
    left: -99999px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform: translateX(-99999999px);
    width: 100%;
  }

  .VirtualStream__Items {
    transform: translate3d(0,0,0);
  }
</style>
