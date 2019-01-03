<template>
    <div class="VirtualStream__Chunk" :style="style">
        <slot v-if="active"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chunkHeight: 0,
            active: true,
        }
    },
    mounted() {
        window.requestAnimationFrame(() => {
            this.calcMinHeight()
            window.setTimeout(() => {
                this.checkActiveState()
            }, 100)
        })

        window.addEventListener('resize', () => {
            this.calcMinHeight()
        })
        this.$parent.$on('streamItemsUpdated', (d) => {
            this.calcMinHeight()
        })
        this.$parent.$on('scroll', this.handleScroll)
    },
    props: {
        items: {
            type: Array,
            required: true,
        }
    },
    computed: {
        style() {
            return `min-height: ${this.chunkHeight}px`
        }
    },
    methods: {
        calcMinHeight() {
            if (this.active) {
                this.chunkHeight = 0
                window.requestAnimationFrame(() => {
                    this.chunkHeight = this.$el.offsetHeight
                })
            }
        },
        checkActiveState() {
            const windowPosStart = this.$parent.$refs.wrapper.scrollTop
            const windowPosEnd = windowPosStart + this.$parent.$refs.wrapper.offsetHeight
            const chunkPosStart = this.$el.offsetTop - this.$parent.$refs.wrapper.offsetHeight
            const chunkPosEnd = chunkPosStart + (this.$el.offsetHeight * 2)

            console.log({windowPosStart, chunkPosEnd, windowPosEnd, chunkPosStart})

            this.active = (windowPosStart <= chunkPosEnd && windowPosEnd >= chunkPosStart)
        },
        handleScroll() {
            this.checkActiveState()
        }
    },
    watch: {
        active() {
            this.calcMinHeight()
        },
        items() {
            this.calcMinHeight()
        }
    }
}
</script>

<style scoped>
    .VirtualStream__Chunk {

    }
</style>
