<template>
  <div class="Message">
    <div class="Message__Bubble" :class="{'Message__Bubble--isAuthor': data.isRight }">
      <div class="Author" v-if="!data.isRight">
        <img :src="data.avatar" :alt="data.author" class="Author__Avatar" />
        <span class="Author__Name">{{ data.author }}</span>
      </div>
      <div class="Text">{{ data.message }}</div>
      <div v-if="data.attachment" class="Attachment">
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

.Message__Bubble {
  font-size: 16px;
  line-height: 1.75em;
  max-width: 80%;
  padding: 16px;
  background: #f3f3f3;
  border-radius: 12px;
}

.Message__Bubble--isAuthor {
  margin-left: auto;
  background: hsl(125deg, 100%, 95%);
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
  overflow: hidden;
  width: 100%;
  margin-top: 16px;
}

.Attachment__Preview {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
