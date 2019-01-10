<template>
    <div class="Status" :class="statusClass" v-tooltip="state"></div>
</template>

<script>
export default {
    props: {
        state: {
            type: String,
            required: true,
        }
    },
    computed: {
        statusClass() {
            switch (this.state) {
                case 'SEND':
                    return 'Status--isSent'
                case 'READ':
                    return 'Status--isRead'
                default:
                    return ''
            }
        }
    }
}
</script>

<style scoped>
    .Status {
        width: 16px;
        height: 16px;
        background: #777;
    }

    .Status--isSent {
        background: #34f;
    }

    .Status--isRead {
        background: #3f4;
    }
</style>
