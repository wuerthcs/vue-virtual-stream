<template>
  <div id="app">
    <virtual-stream :items="items" reversed :items-per-chunk="15">
      <template slot-scope="{ item, index }">
        <div class="item">
          <div>{{ item.id }}</div>
          <div class="message">{{ item.message }}</div>
        </div>
      </template>
    </virtual-stream>
  </div>
</template>

<script>
import LoremIpsum from 'lorem-ipsum'
import VirtualStream from '../../dist/vue-virtual-stream.esm'

export default {
  name: 'App',
  components: {
    VirtualStream
  },
  data() {
    return {
      items: this.generateMessages(3000)
    }
  },
  methods: {
    generateMessages(num) {
      const messages = []
      for (let i = 0; i < num; i++) {
        messages.push(this.generateMessage(i))
      }
      return messages
    },
    generateMessage(id) {
      return {
        id,
        message: LoremIpsum({
          sentenceLowerBound: 5,
          sentenceUpperBound: 100,
        })
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style scoped>
.item {
  margin: 64px 0;
}

.message {
  font-size: 20px;
  line-height: 32px;
}
</style>
