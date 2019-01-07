<template>
  <div class="app" id="app">
    <div class="container">
      <div class="container-inner">
        <virtual-stream :items="items" reversed :preload="40" ref="stream" :throttle-timing="5000">
          <template slot-scope="{ item }">
            <Message :data="item" />
          </template>
        </virtual-stream>
      </div>
      <div class="toolbar">
        <div>
          <button v-on:click="addMessage">Add message</button><br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoremIpsum from 'lorem-ipsum'
import faker from 'faker'
import uuid from 'uuid/v4'
import VirtualStream from '../../dist/vue-virtual-stream.esm'
import Message from './components/Message'
export default {
  name: 'App',
  components: {
    VirtualStream,
    Message
  },
  data() {
    return {
      items: this.generateMessages(1500),
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
      const isRight = (Math.floor((Math.random()) * 10) > 7)
      const hasAttachment = (Math.floor((Math.random() * 20)) > 16)

      return {
        id: uuid(),
        author: faker.name.findName(),
        avatar: faker.fake(`{{image.avatar}}`),
        message: LoremIpsum({
          sentenceLowerBound: 5,
          sentenceUpperBound: 30,
        }),
        attachment: (hasAttachment) ? faker.fake(`{{image.imageUrl}}`) : null,
        isRight,
      }
    },
    addMessage() {
      this.items.unshift(this.generateMessage(this.items.length))
    },
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

.app >>> .VirtualStream__Items--isPrev:before {
  transform: translateY(32px);
}

.app >>> .VirtualStream__Items--isNext:before {
  transform: traslateY(-32px);
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

@media screen and (max-width: 500px) {
  .container {
    border-radius: 0;
    margin: 0;
    padding: 0 16px;
    width: 100%;
  }
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

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>