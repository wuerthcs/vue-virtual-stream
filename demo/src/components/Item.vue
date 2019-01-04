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
    },
    mounted() {
        this.$parent.$on('dimensions', (d) => {
            this.dimension = (d[this.id]) ? d[this.id] : null      
        })

        this.$parent.$on('scroll', (position) => {
            if ((position.start >= this.dimension.top) && (position.start <= this.dimension.top + this.dimension.height)) {
                this.$emit('setstart', this.id)
            }

            if ((position.end >= this.dimension.top) && (position.end <= this.dimension.top + this.dimension.height)) {
                this.$emit('setend', this.id)
            }
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
    }
</style>
