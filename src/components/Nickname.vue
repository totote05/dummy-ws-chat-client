<template>
  <div>
    <h3>Nickname</h3>

    <input type="text" v-model="nickname" @keyup.enter="sendNickname"/>

    <button @click="sendNickname">Go!</button>
  </div>
</template>

<script>
export default {
  emit: ['send'],
  data () {
    return {
      nickname: ''
    }
  },
  methods: {
    sendNickname () {
      this.$emit('send', this.nickname)
    }
  }
}
</script>
