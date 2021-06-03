<template>
  <div class="maintenance">
    <div class="content">
      <h1>NFTTunz is under maintenance.</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Maintenance',

  layout: 'maintenance',

  head () {
    return {
      title: 'Maintenance'
    }
  }
}
</script>

<style lang="scss">
.maintenance {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  text-align: center;

  .color-mode-btn {
    background-color: transparent;
    border-color: transparent;
    margin-top: 50px;

    &:hover,
    &:focus,
    &:active {
      outline: none;
      box-shadow: none !important;
    }
  }
}

.light-mode {
  .icon {
    fill: #111;
  }
}
</style>
