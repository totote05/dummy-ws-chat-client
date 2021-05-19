<template>
  <div id="app">

    <h1>Dummy WS chat Client</h1>

    <nickname
      v-if="nickname === ''"
      @send="setNickname"
    ></nickname>

    <chat
      v-else
      :nickname="nickname"
      :messages="messages"
      @send="sendMessage"
    ></chat>

  </div>
</template>

<script>

import registerServiceWorker from './registerServiceWorker'

import Nickname from './components/Nickname'
import Chat from './components/Chat'

export default {
  name: 'App',
  components: { Nickname, Chat },
  data () {
    return {
      messages: [],
      client: null,
      nickname: ''
    }
  },
  methods: {
    setNickname (value) {
      if (value !== '') {
        this.client.sendCommand({
          command: 'nickname',
          payload: value
        })
        this.nickname = value
      }
    },
    sendMessage (value) {
      if (value !== '') {
        this.client.sendCommand({
          command: 'message',
          payload: value
        })
      }
    }
  },
  async created () {
    try {
      const { serviceWorkerMessenger } = await registerServiceWorker()
      this.client = serviceWorkerMessenger
      this.client.messageReceived = data => {
        this.messages.push(data)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
