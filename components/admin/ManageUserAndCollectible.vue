<template>
  <div id="manage-user-collectible">
    <ManageUser />
    <ManageCollectible class="mt-5" />
  </div>
</template>

<script>
import ManageUser from '@/components/admin/ManageUser.vue'
import ManageCollectible from '~/components/admin/ManageCollectible.vue'

export default {
  name: 'ManageUserAndCollectible',
  components: {
    ManageUser,
    ManageCollectible
  }
}
</script>

<style>
</style>
