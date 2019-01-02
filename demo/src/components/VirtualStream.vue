<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" :class="{ 'VirtualStream__Wrapper--isReversed': reversed }" ref="wrapper" @scroll="handleScroll">
      <div class="VirtualStream__Items VirtualStream__Items--isPrev" ref="itemsPrev" v-if="chunkItems[currentChunk - 1]">
        <slot
          v-for="(item, index) in chunkItems[currentChunk - 1]"
          :item="item"
          :index="index"
        />
      </div>
      <div class="VirtualStream__Items VirtualStream__Items--isCurrent" ref="itemsCurrent">
        <slot
          v-for="(item, index) in chunkItems[currentChunk]"
          :item="item"
          :index="index"
        />
      </div>
      <div class="VirtualStream__Items VirtualStream__Items--isNext" ref="itemsNext" v-if="chunkItems[currentChunk + 1]">
        <slot
          v-for="(item, index) in chunkItems[currentChunk + 1]"
          :item="item"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import getBrowser from '../utils/getBrowser'
  const browser = getBrowser()

  export default {
    name: 'VirtualStream',
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
      maxChunkPreload: {
        type: Number,
        default: 1,
      },
      preloadOffset: {
        type: Number,
        default: 50
      },
    },
    data() {
      return {
        currentChunk: 0,
      }
    },
    computed: {
      chunkItems () {
        let chunkIndex = 0
        let itemIndex = 0
        const chunks = []

        for (let i = 0; i < this.items.length; i++) {
          if (!chunks[chunkIndex]) { chunks[chunkIndex] = [] }
          chunks[chunkIndex].push(this.items[i])
          itemIndex++

          if (itemIndex >= this.itemsPerChunk) {
            chunkIndex++
            itemIndex = 0
          }
        }

        return chunks
      },
      chunkCount () {
        return Math.ceil(this.items.length / this.itemsPerChunk) - 1
      }
    },
    methods: {
      handleScroll() {
        const scrollTop = (browser === 'safari') ?
          (this.$refs.wrapper.scrollTop + this.$refs.wrapper.scrollHeight - this.$refs.wrapper.offsetHeight) :
          this.$refs.wrapper.scrollTop
        const prevScrollOffset = this.getPrevScrollOffset(scrollTop)
        const nextScrollOffset = this.getNextScrollOffset(scrollTop)

        if (prevScrollOffset && prevScrollOffset > this.preloadOffset) {
          this.currentChunk--
          window.requestAnimationFrame(() => {
            this.correctScrollPosition(false)
          })
        }

        if (nextScrollOffset && nextScrollOffset > this.preloadOffset) {
          this.currentChunk++
          window.requestAnimationFrame(() => {
            this.correctScrollPosition(true)
          })
        }
      },
      getPrevScrollOffset(scrollTop) {
        if (this.$refs.itemsPrev) {
          const offset = this.$refs.itemsCurrent.offsetHeight + ((this.$refs.itemsNext) ? this.$refs.itemsNext.offsetHeight : 0)
          const height = this.$refs.itemsPrev.offsetHeight
          const scrollBottom = (scrollTop + this.$refs.wrapper.offsetHeight) - offset

          if (scrollBottom >= 0) {
            return (scrollBottom / height) * 100
          }
          return 0
        }

        return false
      },
      getNextScrollOffset(scrollTop) {
        if (this.$refs.itemsNext) {
          const height = this.$refs.itemsNext.offsetHeight
          if (scrollTop <= height) {
            return 100 - ((scrollTop / height) * 100)
          }
          return 0
        }

        return false
      },
      correctScrollPosition(wasNext) {
        if (wasNext) {
          this.correctTopScrollPosition()
        } else {
          this.correctBottomScrollPosition()
        }
      },
      correctTopScrollPosition() {
        const wrapperHeight = this.$refs.wrapper.offsetHeight
        const offsetter = this.getOffsetter()
        const offset = (this.$refs.itemsNext) ? this.$refs.itemsNext.offsetHeight : 0
        const scrollPos = (browser === 'safari') ? ((offset + offsetter) - wrapperHeight) * -1 : offset + offsetter
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
        this.$refs.wrapper.scrollTop = scrollPos
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
        window.requestAnimationFrame(() => {
          this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
          this.$refs.wrapper.scrollTop = scrollPos
          this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
        })
      },
      correctBottomScrollPosition() {
        const wrapperHeight = this.$refs.wrapper.offsetHeight
        const offsetter = this.getOffsetter()
        const offset = (browser === 'safari') ? 
          ((this.$refs.itemsPrev) ? this.$refs.itemsPrev.offsetHeight : 0) + this.$refs.itemsCurrent.offsetHeight :
          ((this.$refs.itemsNext) ? this.$refs.itemsNext.offsetHeight : 0) + this.$refs.itemsCurrent.offsetHeight
        const scrollPos = (browser === 'safari') ? (offset - offsetter) * -1 : offset - offsetter
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
        this.$refs.wrapper.scrollTop = scrollPos
        this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
        window.requestAnimationFrame(() => {
          this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'auto'
          this.$refs.wrapper.scrollTop = scrollPos
          this.$refs.wrapper.style['-webkit-overflow-scrolling'] = 'touch'
        })
      },
      getOffsetter(el) {
        const curr = (this.$refs.itemsCurrent.offsetHeight * (this.preloadOffset / 100))
        return curr
      },
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
    width: 100%;
  }

  .VirtualStream__Wrapper {
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    width: 100%;
  }

  .VirtualStream__Wrapper--isReversed {
    flex-direction: column-reverse;
  }

  .VirtualStream__Items {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
  }

  .VirtualStream__Wrapper--isReversed .VirtualStream__Items {
    flex-direction: column-reverse;
  }
</style>
