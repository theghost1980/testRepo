<template>
  <footer class="footer">
    <ul class="list-inline text-center">
      <li class="list-inline-item">
        <nuxt-link :to="{ name: 'faq' }" class="links">
          FAQ
        </nuxt-link>
      </li>
      <li class="list-inline-item">
        <nuxt-link :to="{ name: 'tos' }" class="links">
          TOS
        </nuxt-link>
      </li>
      <li class="list-inline-item">
        <a href="https://peakd.com/@lensy" class="links">Blog</a>
      </li>
      <li class="list-inline-item">
        <a href="https://discord.lensy.io" class="links">Discord</a>
      </li>
      <li class="list-inline-item">
        <a href="https://twitter.com/lensynft" class="links">Twitter</a>
      </li>
      <li class="list-inline-item">
        <a href="https://www.instagram.com/lensy.io" class="links">Instagram</a>
      </li>
    </ul>

    <p class="text-center whitishColor">
      &copy; NFTTunz
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style>
</style>
