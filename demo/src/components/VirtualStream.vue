<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll.passive="handleScroll">
      <div class="VirtualStream__Track" ref="track">
        <Item v-for="(item, index) in currentView" :key="item.id" ref="items" :id="item.id || index" @resizeitem="updateItemDimension">
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
      count: {
        type: Number,
        default: 25,
      },
      preload: {
        type: Number,
        default: 25,
      },
      offset: {
        type: Number,
        default: 80
      },
    },
    data() {
      return {
        currentItem: 0,
        dimensions: {},
        totalHeight: 0,
      }
    },
    computed: {
      currentView() {
        return this.items.slice(this.start, this.end)
      },
      start() {
        return ((this.currentItem - this.preload) < 0) ? 0 : this.currentItem - this.preload
      },
      end() {
        return ((this.currentItem + this.preload) > this.items.length) ? this.items.length : this.currentItem + this.preload
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
        this.$emit('scroll', this.$refs.wrapper.scrollTop)
      },
      updateItemDimensions(d) {
        this.$refs.items.forEach((item, i) => {
          const top = (() => {
            const previousIndex = this.identifier.ids[item.id] - 1
            if (previousIndex < 0) return 0
            const previousId = this.identifier.indexes[previousIndex]
            if (!this.dimensions[previousId]) return 0
            return this.dimensions[previousId].top + this.dimensions[previousId].h
          })()
          this.dimensions[item.id] = { h: item.$el.offsetHeight, w: item.$el.offsetWidth, top }
          this.$emit('dimensions', this.dimensions)
        })

        this.totalHeight = Object.values(this.dimensions).reduce((a, b) => {
          const aVal = (a.h) ? a.h : a
          const bVal = (b.h) ? b.h : b
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
        this.$emit('streamItemsUpdated', n)
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
