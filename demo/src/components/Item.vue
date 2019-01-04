<template>
    <div class="VirtualStream__Item" ref="item" :style="styles" data-id="id">
        <slot />
    </div>
</template>

<script>
export default {
    data() {
        return {
            dimension: null
        }
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        maxIndex: {
            type: Number,
            required: true,
        }
    },
    mounted() {
        this.$parent.$on('dimensions', (d) => {
            this.dimension = (d[this.id]) ? d[this.id] : null
        })

        this.$parent.$on('scroll', (position) => {
            this.recheckScrollPosition(position)
        })

        this.ro = new ResizeObserver(elements => {
            elements.forEach((el, i) => {
                this.$emit('resizeitem', {
                    id: this.id,
                    dimensions: {
                        w: el.target.offsetWidth,
                        h: el.target.offsetHeight,
                    }
                })
            })

        })

        this.ro.observe(this.$el)
    },
    methods: {
        recheckScrollPosition(position) {
            if (this.index === 0 || this.index === this.maxIndex) {
                if (this.index === 0) {
                    if (position.start < this.dimension.top) {
                        this.$emit('setstart', this.id)
                        this.$nextTick(() => {
                            this.recheckScrollPosition(position)
                        })
                    }
                }

                if (this.index === this.maxIndex) {
                    if (position.end > this.dimension.top + this.dimension.height) {
                        this.$emit('setend', this.id)
                        this.$nextTick(() => {
                            this.recheckScrollPosition(position)
                        })
                    }
                }
            } else {
                if ((position.start >= this.dimension.top) && (position.start <= this.dimension.top + this.dimension.height)) {
                    this.$emit('setstart', this.id)
                }
    
                if ((position.end >= this.dimension.top) && (position.end <= this.dimension.top + this.dimension.height)) {
                    this.$emit('setend', this.id)
                }
            }
        }
    },
    computed: {
        styles() {
            if (!this.dimension) return ''
            return `transform: translate3d(0, ${this.dimension.top}px, 0)`
        }
    }
}
</script>

<style scoped>
    .VirtualStream__Item {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
</style>
