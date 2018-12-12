<template>
  <div class="app" id="app">
    <div class="container">
      <div class="container-inner">
        <virtual-stream :items="items" reversed :items-per-chunk="8" :preloadOffset="50">
          <template slot-scope="{ item, index }">
            <div class="item">
              <div class="message">{{ item.message }}</div>
            </div>
          </template>
        </virtual-stream>
      </div>
      <button v-on:click="addMessage">Add message</button>
    </div>
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
      items: this.generateMessages(80)
    }
  },
  methods: {
    generateMessages(num) {
      const messages = []
      for (let i = 0; i < num; i++) {
        messages.push(this.generateMessage(i))
      }
      return messages.reverse()
    },
    generateMessage(id) {
      return {
        id,
        message: LoremIpsum({
          sentenceLowerBound: 5,
          sentenceUpperBound: 100,
        })
      }
    },
    addMessage() {
      this.items.splice(0, 0, this.generateMessage(this.items.length))
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>

<style scoped>
.app {
  background: #0a7e8c;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item {
  font-size: 16px;
  line-height: 1.75em;
  margin: 32px 0;
  max-width: 80%;
  padding: 8px 12px;
  background: #f3f3f3;
  border-radius: 12px;
}

.item:nth-child(2n) {
  margin-left: auto;
}

.container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 40px 240px rgba(0, 0, 0, .35);
  flex: 1 1 100%;
  margin: 60px auto;
  max-width: 800px;
  padding: 30px;
  width: 90%;
}

.container-inner {
  height: 100%;
  position: relative;
}
</style>
