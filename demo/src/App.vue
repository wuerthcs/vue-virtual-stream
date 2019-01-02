<template>
  <div class="app" :class="{ 'app--isDebugging': debug }" id="app">
    <div class="container">
      <div class="container-inner">
        <virtual-stream :items="items" reversed :items-per-chunk="itemsPerChunk" :preloadOffset="80" ref="stream">
          <template slot-scope="{ item, index }">
            <div class="item">
              <div class="message">{{ item.message }}</div>
            </div>
          </template>
        </virtual-stream>
      </div>
      <div class="toolbar">
        <div>
          <button v-on:click="addMessage">Add message</button>
          <div>
            <label>
              Items per Chunk
              <input type="number" :value="itemsPerChunk" v-on:change="updateItemsPerChunk" min="8" max="100" />
            </label>
          </div>
        </div>
        <label>
          Enable debugging view
          <input type="checkbox" :checked="debug" v-on:click="toggleDebug" />
        </label>
        <div v-if="debug">
          Current Chunk: {{ stream.currentChunk }}<br />
          Chunk Count: {{ stream.chunkCount }}<br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoremIpsum from 'lorem-ipsum'
import VirtualStream from './components/VirtualStream'

export default {
  name: 'App',
  components: {
    VirtualStream
  },
  data() {
    return {
      items: this.generateMessages(1200),
      itemsPerChunk: 24,
      debug: false,
      stream: false,
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
    },
    toggleDebug() {
      this.debug = !this.debug
    },
    updateItemsPerChunk(e) {
      this.itemsPerChunk = Number(e.currentTarget.value)
    }
  },
  mounted() {
    this.stream = this.$refs.stream
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

.app >>> .VirtualStream__Items {
  position: relative;
}

.app.app--isDebugging >>> .VirtualStream__Items--isPrev:before,
.app.app--isDebugging >>> .VirtualStream__Items--isNext:before {
  background: #ff0000;
  bottom: 0;
  content: '';
  display: block;
  height: 32px;
  top: 0;
  width: 100%;
  position: absolute;
  margin: auto;
}

.app >>> .VirtualStream__Items--isPrev:before {
  transform: translateY(32px);
}

.app >>> .VirtualStream__Items--isNext:before {
  transform: traslateY(-32px);
}

.app.app--isDebugging >>> .VirtualStream__Items--isPrev {
  background: #ccfccc;
}

.app.app--isDebugging >>> .VirtualStream__Items--isCurrent {
  background: #fccccc;
}

.app.app--isDebugging >>> .VirtualStream__Items--isNext {
  background: #ccccfc;
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
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  margin: 60px auto;
  max-width: 800px;
  overflow: hidden;
  padding: 30px;
  width: 90%;
}

.container-inner {
  height: 100%;
  position: relative;
}

.toolbar {
  display: grid;
  padding: 16px 0;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  grid-gap: 16px;
}
</style>
