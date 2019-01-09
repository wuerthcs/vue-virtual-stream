<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll.passive="handleScroll">
      <div class="VirtualStream__Track" ref="track">
        <Item
          v-for="(item, index) in currentView"
          :key="item.id" ref="items"
          :id="item.id || index"
          :index="index"
          :maxIndex="currentView.length - 1"
          @resizeitem="updateItemDimension"
        >
          <slot :item="item" :index="index" />
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
      }
    },
    computed: {
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
      updateCurrentPosition() {
        if (!this.ready) return false
        const positions = {}

        positions.start = (!this.reversed) ?
          this.$refs.wrapper.scrollTop :
          this.totalHeight - (this.$refs.wrapper.scrollTop + this.$refs.wrapper.offsetHeight)

        positions.end = (!this.reversed) ?
          this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop :
          this.totalHeight - this.$refs.wrapper.scrollTop

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
        this.$emit('scroll')
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
        const sortedItems = this.$refs.items.sort((a, b) => {
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

        this.totalHeight = Object.values(this.dimensions).reduce((dimensionA, dimensionB) => {
          const aVal = (dimensionA.height) ? dimensionA.height : dimensionA
          const bVal = (dimensionB.height) ? dimensionB.height : dimensionB
          return aVal + bVal
        })

        if (oldScrollTop !== 0) {
          if (this.reversed && oldTotalHeight < this.totalHeight) {
            const heightDiff = this.totalHeight - oldTotalHeight
            window.requestAnimationFrame(() => {
              this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
              this.$refs.wrapper.scrollTop = oldScrollTop + heightDiff
              this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
            })
          }
        }

        this.trigger = {
          start: sortedItems[0],
          end: sortedItems[this.$refs.items.length - this.offset]
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
        }, 100)
      },
      updateItemDimension(d) {
        Object.assign(this.dimensions[d.id], d.dimensions)
      },
    },
    watch: {
      currentView(n) {
        this.$nextTick(() => {
          this.updateItemDimensions()
        })
      },
      items() {
        this.$nextTick(() => {
          this.updateCurrentPosition()
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

  .VirtualStream__Items {
    transform: translate3d(0,0,0);
  }
</style>
