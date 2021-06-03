<template>
  <span v-if="isWhitelisted" v-b-tooltip.hover.v-primary title="Verified Artist">
    <v-icon name="check-circle" class="text-primary verified-badge" />
  </span>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VerifiedBadge',

  computed: {
    ...mapGetters('user', ['isWhitelisted'])
  }
}
</script>

<style>
.verified-badge.icon {
  width: 20px;
}
</style>
