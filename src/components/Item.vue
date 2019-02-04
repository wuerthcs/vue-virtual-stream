<template>
    <div class="VirtualStream__Item" ref="item" :style="styles" data-id="id">
        <slot />
    </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'

export default {
    data() {
        return {
            dimension: null,
        }
    },
    props: {
        id: {
            type: String,
        },
        index: {
            type: Number,
            required: true,
        },
        maxIndex: {
            type: Number,
            required: true,
        },
        disableResizer: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {
        this.$parent.$on('dimensions', (d) => {
            this.dimension = (d[this.id]) ? d[this.id] : null
        })

        if (!this.disableResizer) {
            this.ro = new ResizeObserver(elements => {
                elements.forEach((el, i) => {
                    if (this && this.id) {
                        const payload = {
                            id: this.id,
                            dimensions: {
                                w: el.target.offsetWidth,
                                h: el.target.offsetHeight,
                            }
                        }
                        this.$parent.$emit('resize-item', payload)
                    }
                })
            })

            this.ro.observe(this.$el)
        }
    },
    computed: {
        styles() {
            if (!this.dimension || !this.id) return 'transform: translate3d(0, -9999999999999px, 0);'
            const top = (!this.$parent.reversed) ? this.dimension.top : this.dimension.top * -1
            const position = (!this.$parent.reversed) ? `top: 0;` : `bottom: 0;`
            return `transform: translate3d(0, ${top}px, 0); ${position}`
        }
    }
}
</script>

<style scoped>
    .VirtualStream__Item {
        position: absolute;
        left: 0;
        right: 0;
    }
</style>
