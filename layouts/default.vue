<template>
  <div class="app purpleLigther">
    <Header class="primaryfont" />
    <!-- removed class="mt-5" from container bellow -->
    <b-container fluid="md">
      <Nuxt />
    </b-container>

    <ActivityModal />
    <LoginModal />
    <Footer class="primaryfont darkerBG" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import LoginModal from '@/components/modals/Login.vue'
import ActivityModal from '@/components/modals/Activity.vue'

export default {
  name: 'DefaultLayout',

  components: {
    ActivityModal,
    Header,
    Footer,
    LoginModal
  },

  methods: {
    ...mapActions(['fetchHivePrice']),

    async hivePrice () {
      await this.fetchHivePrice()
    }
  },

  timers: {
    hivePrice: {
      time: 5 * 60 * 1000,
      autostart: true,
      immediate: true,
      repeat: true
    }
  }
}
</script>

<style>
</style>
