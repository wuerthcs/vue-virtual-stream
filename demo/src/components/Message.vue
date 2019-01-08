<template>
  <div class="Message">
    <div class="Message__Wrapper" :class="{'Message__Wrapper--isAuthor': data.isRight }">
      <div class="Message__Bubble" :class="{'Message__Bubble--isAuthor': data.isRight }">
        <div class="Author" v-if="!data.isRight">
          <img :src="data.avatar" :alt="data.author" class="Author__Avatar" />
          <span class="Author__Name">{{ data.author }}</span>
        </div>
        <div class="Text">
          {{ data.message }}<br />
          {{ data.id }}
        </div>
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
export default {
  props: {
    data: {
      type: Object,
      required: true
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

.Author__Avatar {
  border-radius: 50%;
  height: 24px;
  width: 24px;
  margin-right: 8px;
}

.Author__Name {
  font-weight: 600;
  line-height: 1;
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
