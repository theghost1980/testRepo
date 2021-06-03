<template>
  <div class="loading-screen text-center d-flex justify-content-center align-items-center flex-column">
    <b-spinner class="align-middle" type="grow" />

    <p class="mt-3 mb-0 h6">
      Loading...
    </p>
  </div>
</template>

<script>
export default {
  name: 'Loading'
}
</script>

<style lang="scss">
.loading-screen {
  margin-top: 100px;
  margin-bottom: 100px;
}
</style>
