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
