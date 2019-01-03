<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" ref="wrapper" @scroll="handleScroll">
      <Chunk v-for="(chunk, key) in loadedChunks" :key="key" :items="chunk">
        <slot
          v-for="(item, index) in chunk"
          :item="item"
          :index="index"
        />
      </Chunk>
    </div>
  </div>
</template>

<script>
  import getBrowser from '../utils/getBrowser'
  import Chunk from './Chunk'

  const browser = getBrowser()
  let locked = false

  export default {
    name: 'VirtualStream',
    components: {
      Chunk,
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
      itemsPerChunk: {
        type: Number,
        default: 50,
      },
      preload: {
        type: Number,
        default: 25,
      },
      offset: {
        type: Number,
        default: 30
      },
    },
    data() {
      return {
        currentChunk: 0,
        maxChunk: 0,
      }
    },
    computed: {
      chunkItems () {
        let chunkIndex = 0
        let itemIndex = 0
        const chunks = []

        for (let i = 0; i < this.items.length; i++) {
          if (!chunks[chunkIndex]) { chunks[chunkIndex] = [] }
          if (this.reversed) {
            chunks[chunkIndex].push(this.items[i])
          } else {
            chunks[chunkIndex].unshift(this.items[i])
          }
          itemIndex++

          if (itemIndex >= this.itemsPerChunk) {
            chunkIndex++
            itemIndex = 0
          }
        }
        return (this.reversed) ? chunks : [...chunks].reverse()
      },
      chunkCount () {
        return Math.ceil(this.items.length / this.itemsPerChunk) - 1
      },
      loadedChunks () {
        const chunks = []
        const maxChunk = this.maxChunk + this.preload

        for (let i = 0; i < maxChunk; i++) {
          if (this.chunkItems[i]) {
            chunks.push(this.chunkItems[i])
          }
        }

        return this.chunkItems
      }
    },
    methods: {
      handleScroll() {
        this.$emit('scroll', this.$refs.wrapper.scrollTop)
      }
    },
    watch: {
      items(n) {
        this.$emit('streamItemsUpdated', n)
      }
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
</style>
