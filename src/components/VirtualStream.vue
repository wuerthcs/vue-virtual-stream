<template>
  <div class="VirtualStream__Scroller" ref="container">
    <div class="VirtualStream__Wrapper" :class="{ 'VirtualStream__Wrapper--isReversed': reversed }" ref="wrapper" @scroll="handleScroll">
      <div class="VirtualStream__Items" ref="itemsPrev" v-if="chunkItems[currentChunk - 1]">
        <slot
          v-for="(item, index) in chunkItems[currentChunk - 1]"
          :item="item"
          :index="index"
        />
      </div>
      <div class="VirtualStream__Items" ref="itemsCurrent">
        <slot
          v-for="(item, index) in chunkItems[currentChunk]"
          :item="item"
          :index="index"
        />
      </div>
      <div class="VirtualStream__Items" ref="itemsNext" v-if="chunkItems[currentChunk + 1]">
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
        console.log('scroll!')
        const scrollTop = this.$refs.wrapper.scrollTop
        const prevScrollOffset = this.getPrevScrollOffset(scrollTop)
        const nextScrollOffset = this.getNextScrollOffset(scrollTop)

        if (prevScrollOffset && prevScrollOffset > this.preloadOffset) {
          this.currentChunk--
          this.correctScrollPosition(false)
        }

        if (nextScrollOffset && nextScrollOffset > this.preloadOffset) {
          this.currentChunk++
          this.correctScrollPosition(true)
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
        const offsetter = (this.$refs.itemsCurrent.offsetHeight * (this.preloadOffset / 100))

        if (wasNext) {
          const offsetNext = (this.$refs.itemsNext) ? this.$refs.itemsNext.offsetHeight : 0
          const scrollPos = offsetNext + offsetter
          this.$refs.wrapper.scrollTop = scrollPos
        } else {
          const offsetPrev = ((this.$refs.itemsNext) ? this.$refs.itemsNext.offsetHeight : 0) + this.$refs.itemsCurrent.offsetHeight
          const scrollPos = offsetPrev - this.$refs.wrapper.offsetHeight - offsetter
          this.$refs.wrapper.scrollTop = scrollPos
        }
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
    width: 100%;
  }

  .VirtualStream__Wrapper {
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
