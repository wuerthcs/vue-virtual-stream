<template>
    <div
        class="Avatar"
        :style="avatarStyle"
        :class="{ 'Avatar--isRound': this.round }"
        v-tooltip="alt"
    >
        <img :src="url" :alt="alt" class="Avatar__Image" />
    </div>
</template>

<script>
export default {
    props: {
        url: {
            required: true,
            type: String,
        },
        alt: {
            required: true,
            type: String,
        },
        size: {
            default: 24,
            type: Number,
        },
        round: {
            default: false,
            type: Boolean,
        },
    },
    computed: {
        avatarStyle() {
            return `width: ${this.size}px; height: ${this.size}px;`
        }
    }
}
</script>

<style scoped>
.Avatar {
    height: 100%;
    overflow: hidden;
    width: 100%;
}

.Avatar--isRound {
    border-radius: 50%;
}

.Avatar__Image {
    height: 100%;
    object-fit: cover;
    width: 100%;
}
</style>
