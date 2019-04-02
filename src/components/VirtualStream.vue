<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll.passive="handleScroll">
      <div class="VirtualStream__Track VirtualStream__Track--newItems" ref="newItemsList">
        <Item v-for="(item, index) in newItems" :id="item.id" :index="index" :maxIndex="newItems.length" :key="item.id" ref="newItems" disableResizer>
          <slot :item="item" :index="index" />
        </Item>
      </div>
      <div class="VirtualStream__Track" ref="track">
        <Item
          v-for="index in count"
          :key="(currentView[index - 1]) ? currentView[index - 1].id : null"
          :id="(currentView[index - 1]) ? currentView[index - 1].id : null"
          :index="index - 1"
          :maxIndex="currentView.length - 1"
          ref="items"
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
  import diff from 'deep-object-diff/dist/diff'
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
      reverseItems: {
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
      },
      watchResizes: {
        type: Boolean,
        default: true,
      },
      attachToStart: {
        type: Boolean,
        default: false,
      },
      attachToEnd: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        currentView: [],
        identifier: {
          ids: {},
          indexes: [],
        },
        position: 0,
        oldPosition: 0,
        oldScrollTop: 0,
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
        scrollAttachedTo: false,
        oldWindowSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }
    },
    computed: {
      renderedItems() {
        const output = [...this.items]
        if (this.reverseItems) output.reverse()
        return output
      },
      itemCount() {
        return this.items.length
      },
      correctedCount() {
        return Math.round(this.count / 2)
      },
    },
    methods: {
      
      /**
       * retreives the current scroll positions for the screen start and end edges
       * @returns {object}
       */
      getScrollPosition() {
        const positions = {}
        positions.start = (!this.reversed) ?
          this.$refs.wrapper.scrollTop :
          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)

        positions.end = (!this.reversed) ?
          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :
          this.totalHeight - this.$refs.wrapper.scrollTop
        
        return positions
      },

      /**
       * calculates and updates the current position dependend on the current scroll position
       * @param {boolean} force
       * @returns {void}
       */
      updateCurrentPosition(force) {
        if (!this.ready && !force) return false
        
        const positions = this.getScrollPosition()
        if (positions.end === this.totalHeight) this.$emit('scroll', 'end')

        if (positions.start <= 0) {
          this.$emit('scroll', 'start')
          this.scrollAttachedTo = 'start'
        } else if (positions.end === this.totalHeight) {
          this.$emit('scroll', 'end')
          this.scrollAttachedTo = 'end'
        } else {
          this.$emit('scroll', positions)
          this.scrollAttachedTo = false
        }
        
        if (this.triggerDimensions && this.triggerDimensions.start) {
          if (this.position > 0 && (positions.start <= this.triggerDimensions.start.end)) {
            this.updatePosition(this.trigger.start.id)
          }
        } else if (this.triggerDimensions && this.triggerDimensions.end) {
          if (positions.end >= this.triggerDimensions.end.start) {
            this.updatePosition(this.trigger.end.id)
          }
        }

        if (positions.start < this.triggerDimensions.start.start || positions.end > this.triggerDimensions.end.end) {
          this.updatePositionFromUnknownScrollPosition(positions)
        }
      },

      /**
       * updates the virtualization position when the scroll position is not in any dimension of the currently rendered items
       * (when scrolled very fast to a speficic position)
       * @param {object} positions
       * @returns {void}
       */
      updatePositionFromUnknownScrollPosition(positions) {
        const dimensions = Object.values(this.dimensions)
        let currentPosition = []
        for (let i = 0; i < dimensions.length; i++) {
          const dimension = dimensions[i]
          if (this.filterCurrentPosition(dimension, positions)) currentPosition.push(dimension)
        }
        if (currentPosition[0]) {
          this.updatePosition(currentPosition[0].id)
        }
      },

      /**
       * filters through all positions
       * @param {object} dimension
       * @param {object} positions
       * @returns {boolean}
       */
      filterCurrentPosition(dimension, positions) {
        const dimensionEnd = dimension.top + dimension.height
        return ((positions.end >= dimension.top && positions.end <= dimensionEnd))
      },
      
      /**
       * handles the scroll position when the wrapper is scrolled
       * @returns {void}
       */
      handleScroll: throttle(function() {
        this.updateCurrentPosition()
        window.setTimeout(() => {
          this.updateCurrentPosition()
        }, 150)
      }, 100),
      
      /**
       * updates the current virtualization position to a specific id
       * @param {number} id
       * @returns {void}
       */
      updatePosition(id) {
        this.position = this.identifier.ids[id]
      },

      /**
       * gets the item height of the previous item
       * @param {object} item
       * @returns {number}
       */
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
      
      /**
       * Gets the height from an item via the dimensions object
       * @param {number} id
       * @returns {number}
       */
      getItemHeight(id) {
        const dimensionItem = this.dimensions[id] || false
        return (dimensionItem) ? dimensionItem.top + dimensionItem.height : 0
      },
      
      /**
       * Updates item dimensions known to the component via mapping through the currently rendered items and recalculating their heights and top positions
       */
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
        this.oldScrollTop = (this.$refs.wrapper) ? this.$refs.wrapper.scrollTop : this.oldScrollTop

        const dimensionArray = Object.values(this.dimensions)
        this.totalHeight = (!dimensionArray.length) ? 0 : dimensionArray.reduce((dimensionA, dimensionB) => {
          const aVal = (typeof dimensionA === 'object') ? dimensionA.height : dimensionA
          const bVal = (typeof dimensionB === 'object') ? dimensionB.height : dimensionB
          return aVal + bVal
        })
        if (dimensionArray.length === 1) this.totalHeight = dimensionArray[0].height

        if (this.receivedNewItems) {
          if (!this.reversed) {
            if (this.oldScrollTop !== 0) {
              if (oldTotalHeight < this.totalHeight) {
                const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)
                window.requestAnimationFrame(() => {
                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
                  this.$refs.wrapper.scrollTop = this.oldScrollTop + heightDiff
                  this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
                })
              }
            }  
          }
        } else {
          if (this.oldScrollTop !== 0) {
            if (this.reversed && oldTotalHeight < this.totalHeight) {
              const heightDiff = Math.abs(this.totalHeight - oldTotalHeight)
              window.requestAnimationFrame(() => {
                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
                this.$refs.wrapper.scrollTop = this.oldScrollTop + heightDiff
                this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
              })
            }
          }
        }

        const startIndex = 0
        const endIndex = ((sortedItems.length - 1) - (this.count - this.offset) < 0) ?  (sortedItems.length === 1) ? 1 : sortedItems.length - 1 : this.count - this.offset

        this.trigger = {
          start: sortedItems[startIndex],
          end: sortedItems[sortedItems.length - endIndex]
        }

        if (dimensionArray.length) {
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
        }

        this.$refs.track.style.height = this.totalHeight + 'px'
        this.$emit('dimensions', this.dimensions)

        window.setTimeout(() => {
          this.ready = true
          this.receivedNewItems = false
        }, 100)
      },

      /**
       * update the dimension of a specific item
       * @param {object} item
       */
      updateItemDimension(item) {
        Object.assign(this.dimensions[item.id], item.dimensions)
      },

      /**
       * update all dimensions with the height of all new items
       * used when new items are added to the list of virtualized items
       * @returns {void}
       */
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

        const newItemHeight = (!this.$refs.newItems) ? false : (this.$refs.newItems || []).reduce((a, b) => {
          const aVal = (typeof a === 'number') ? a : a.$el.offsetHeight
          const bVal = (typeof b === 'number') ? b : b.$el.offsetHeight
          return aVal + bVal
        }, 0)

        const newDimensions = {}

        Object.keys(this.dimensions).forEach((key, i) => {
          const dimension = this.dimensions[key]
          Object.assign(this.dimensions[key], { top: dimension.top + newItemHeight })
        })
      },
      getCurrentView(position, items) {
        const startPos = (position - this.correctedCount < 0) ? 0 : position - this.correctedCount
        const endPos = (position + this.count > items.length) ? items.length : position + this.count
        return this.renderedItems.slice(startPos, endPos)
      },
      getIdentifiers(items) {
        let indexes = []
        let ids = {}

        if (!this.reverseItems) {
          for(let i = 0; i < items.length; i++) {
            indexes[i] = items[i].id
            ids[items[i].id] = i
          }
        } else {
          for(let i = items.length - 1; i >= 0; i--) {
            indexes[i] = items[i].id
            ids[items[i].id] = i
          }
        }
        return { indexes, ids }
      },
      getUpdatedIdentifiers(itemDiff) {
        const indexes = Object.keys(itemDiff)
        const currentIdentifiers = this.identifier

        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i]
          const id = (itemDiff[index].id) ? itemDiff[index].id : this.renderedItems[index].id
          
          currentIdentifiers.indexes[index] = id
          currentIdentifiers.ids[id] = index
        }

        return currentIdentifiers
      },
    },
    watch: {
      items(newItems, oldItems) {
        const itemDiff = diff(oldItems, newItems)
        if (Object.keys(itemDiff).length > 0) {
          this.currentView = this.getCurrentView(this.position, newItems)
        }
      },
      position(newPosition, oldPosition) {
        if (oldPosition !== newPosition) {
          this.currentView = this.getCurrentView(newPosition, this.items)
        }
      },
      renderedItems(newRenderedItems, oldRenderedItems) {
        const itemDiff = diff(oldRenderedItems, newRenderedItems)
        if (Object.keys(itemDiff).length > 0) {
          this.identifier = this.getUpdatedIdentifiers(itemDiff)
        }
      },
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
          const index = (!this.reverseItems) ? 0 : this.renderedItems.length - diffCount
          this.newItems = this.renderedItems.slice(index, diffCount)
          this.receivedNewItems = true
          this.$emit('newitem')
        } else {
          this.newItems = []
          this.receivedNewItems = false
        }

        this.updateAllDimensions()
        
        this.$nextTick(() => {
          if (newVal > oldVal) {
            if (this.attachToStart && this.scrollAttachedTo === 'start') {
              this.$refs.wrapper.scrollTop = (!this.reversed) ? 0 : this.totalHeight
            }

            if (this.attachToEnd && this.scrollAttachedTo === 'end') {
              this.$refs.wrapper.scrollTop = (!this.reversed) ? this.totalHeight : 0
            }
          }
          this.updateCurrentPosition(true)
        })
      }
    },
    created() {
      this.$on('resize-item', (data) => {
        if (this.watchResizes) {
          if (data.dimensions.w !== this.dimensions[data.id].width || data.dimensions.h !== this.dimensions[data.id].height) {
            if (this.position === this.oldPosition) {
              this.updateItemDimensions()
            }
            window.setTimeout(() => {
              this.oldPosition = this.position
            }, 50)
          }
        }
      })
    },
    mounted() {
      this.currentView = this.getCurrentView(0, this.items)
      this.identifier = this.getIdentifiers(this.renderedItems)
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
          const windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
          }

          if (windowSize.width !== this.oldWindowSize.width) {
            this.position = 0
            this.dimensions = {}
            this.newItems = []
            this.oldPosition = 0
            this.totalHeight = 0
            this.trigger = {
              start: false,
              end: false,
            }
            this.triggerDimensions = {
              start: false,
              end: false,
            }
  
            this.updateItemDimensions()
            this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
            if (this.$refs.wrapper && this.reversed) this.$refs.wrapper.scrollTop = this.totalHeight
            this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
          }

          this.oldWindowSize = windowSize
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
