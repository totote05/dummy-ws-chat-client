<template>
  <div>

    <h3>Board</h3>

    <div class="input">

      <span class="nickname">{{ nickname }}</span>

      <input type="text" v-model="message" @keyup.enter="sendMessage"/>

      <button @click="sendMessage">Send</button>

    </div>

    <div class="board">
      <p
        class="message"
        v-for="(message, index) in messages"
        :key="index"
      >

        <span
          class="nickname"
        >
          {{ message.nickname }}:
        </span>

        <span
          :class="{'me': message.nickname === 'me'}"
        >
          {{ message.message }}
        </span>

      </p>
    </div>

  </div>
</template>

<script>
export default {
  props: { messages: Array, nickname: String },
  emit: ['send'],
  data () {
    return {
      message: ''
    }
  },
  methods: {
    sendMessage () {
      if (this.message !== '') {
        this.$emit('send', this.message)
        this.message = ''
      }
    }
  }
}
</script>

<style scoped>
.input .nickname {
  font-weight: bold;
  margin-right: 5px;
}

.message .nickname {
  font-weight: bold;
}

.message .me {
  font-style: italic;
}
</style>
