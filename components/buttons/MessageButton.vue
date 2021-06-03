<template>
  <b-button
    v-if="isAuthenticated && user !== username"
    :size="size"
    :variant="variant"
    @click.prevent="requestNewMessage(user)"
  >
    Message
  </b-button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MessageButton',

  props: {
    user: { type: String, required: true },
    size: { type: String, default: 'sm' },
    variant: { type: String, default: 'primary' }
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'username'])
  },

  methods: {
    ...mapActions('message', ['requestNewMessage'])
  }
}
</script>

<style>
</style>
