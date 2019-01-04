<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll.passive="handleScroll">
      <div class="VirtualStream__Track" ref="track">
        <Item v-for="(item, index) in currentView" :key="item.id" ref="items" :id="item.id || index" :index="index" :maxIndex="currentView.length - 1" @resizeitem="updateItemDimension" @setstart="handleStart" @setend="handleEnd">
          <slot
            :item="item"
            :index="index"
          />
        </Item>
      </div>
    </div>
  </div>
</template>

<script>
  import getBrowser from '../utils/getBrowser'
  import Item from './Item'

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
      preload: {
        type: Number,
        default: 25,
      },
    },
    data() {
      return {
        start: 0,
        end: 0,
        dimensions: {},
        totalHeight: 0,
      }
    },
    computed: {
      currentView() {
        return this.items.slice(this.startIndex, this.endIndex)
      },
      startIndex() {
        return ((this.start - this.preload) < 0) ? 0 : this.start - this.preload
      },
      endIndex() {
        return ((this.end + this.preload) > this.items.length) ? this.items.length : this.end + this.preload
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
      handleScroll() {
        this.$emit('scroll', {
          start: this.$refs.wrapper.scrollTop,
          end: this.$refs.wrapper.offsetHeight + this.$refs.wrapper.scrollTop,
        })
      },
      handleStart(id) {
        console.log(this.dimensions)
        console.log('SET START', id)
        const newStart = this.identifier.ids[id]
        this.start = newStart
      },
      handleEnd(id) {
        console.log('SET END', id)
        const newEnd = this.identifier.ids[id]
        this.end = newEnd
      },
      updateItemDimensions(d) {
        this.$refs.items.forEach((item, i) => {
          const top = (() => {
            const previousIndex = this.identifier.ids[item.id] - 1
            if (previousIndex < 0) return 0
            const previousId = this.identifier.indexes[previousIndex]
            if (!this.dimensions[previousId]) return 0
            return this.dimensions[previousId].top + this.dimensions[previousId].height
          })()
          this.dimensions[item.id] = { height: item.$el.offsetHeight, width: item.$el.offsetWidth, top }
          this.$emit('dimensions', this.dimensions)
        })

        this.totalHeight = Object.values(this.dimensions).reduce((dimensionA, dimensionB) => {
          const aVal = (dimensionA.height) ? dimensionA.height : dimensionA
          const bVal = (dimensionB.height) ? dimensionB.height : dimensionB
          return aVal + bVal
        })
        this.$refs.track.style.height = this.totalHeight + 'px'
      },
      updateItemDimension(d) {
        Object.assign(this.dimensions[d.id], d.dimensions)
      }
    },
    watch: {
      currentView(n) {
        this.$nextTick(() => {
          this.updateItemDimensions()
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.updateItemDimensions()
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
    -webkit-overflow-scrolling: touch;
    height: 100%;
    overflow: auto;
    transform: translate3d(0,0,0);
    width: 100%;
  }

  .VirtualStream__Items {
    transform: translate3d(0,0,0);
  }

  .VirtualStream__Item {
    position: absolute;
    top: 0;
  }
</style>
