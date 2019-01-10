<template>
  <div class="Message" v-tooltip="data.index + ' - ' + data.id">
    <div class="Message__Wrapper" :class="{'Message__Wrapper--isAuthor': data.isRight }">
      <div class="Message__Bubble" :class="{'Message__Bubble--isAuthor': data.isRight }">
        <div class="Author" v-if="!data.isRight">
          <Avatar :url="data.avatar" :alt="data.author" round />
          <span class="Author__Name">{{ data.author }}</span>
        </div>
        <div class="Text">
          {{ data.message }}
        </div>
        <Status :state="status" />
      </div>
      <div v-if="data.attachment" class="Attachment" :class="{'Attachment--isAuthor': data.isRight }">
        <div class="Attachment__Overlay">
          <div class="Attachment__Author">{{ data.author }}</div>
        </div>
        <img :src="data.attachment" class="Attachment__Preview" />
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from './Avatar'
import Status from './Status'

export default {
  components: {
    Avatar,
    Status,
  },
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      status: 'SENDING',
      statusTimer: false,
    }
  },
  mounted() {
    this.simulateStatus()
  },
  beforeDestroy() {
    window.clearTimeout(this.statusTimer)
    this.statusTimer = false
  },
  methods: {
    simulateStatus() {
      this.setStatus('SEND', 1500)
        .then(() => { this.setStatus('READ', 3000) })
    },
    setStatus(status, timeout) {
      return new Promise((resolve, reject) => {
        this.statusTimer = window.setTimeout(() => {
          this.status = status
          resolve(true)
        }, timeout)
      })
    }
  }
}
</script>

<style scoped>
.Message {
  padding: 16px 0;
  width: 100%;
}

.Message__Wrapper {
  max-width: 80%;
}

.Message__Wrapper--isAuthor {
  margin-left: auto;
}

.Message__Bubble {
  font-size: 16px;
  line-height: 1.75em;
  padding: 16px;
  background: #f3f3f3;
  border-radius: 12px;
}

.Message__Bubble--isAuthor {
  background: #0bb3af;
  color: #fff;
  font-weight: 500;
}

.Text {
  font-size: 14px;
  line-height: 1.7;
}

.Author {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
}

.Author__Name {
  font-weight: 600;
  line-height: 1;
  margin-left: 8px;
}

.Attachment {
  border-radius: 4px;
  display: block;
  height: 200px;
  margin-top: 16px;
  max-width: 320px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.Attachment__Overlay {
  background: rgba(0, 0, 0, .2);
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 1);
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
}

.Attachment__Author {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  left: 0;
  padding: 8px;
  position: absolute;
  text-shadow: 0 0 40px rgba(0, 0, 0, 1);
  top: 0;
  width: 100%;
}

.Attachment__Preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
