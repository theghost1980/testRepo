<template>
  <div id="get-started">
    <h1 class="h3">
      Get Started
    </h1>
    <hr>

    <section class="hp-section">
      <b-row>
        <b-col md="4">
          <h3 class="h4">
            Hive Account Creation
          </h3>
        </b-col>
        <b-col md="8">
          <a href="https://hiveonboard.com/?ref=nfttunz">https://hiveonboard.com/?ref=nfttunz</a>
        </b-col>
      </b-row>
    </section>

    <section class="hp-section">
      <b-row>
        <b-col md="4">
          <h3 class="h4">
            Install Keychain
          </h3>
        </b-col>
        <b-col md="8">
          Download Keychain on:
          <ul class="list-unstyled">
            <li>
              <a
                href="https://chrome.google.com/webstore/detail/hive-keychain/jcacnejopjdphbnjgfaaobbfafkihpep"
              >Chrome/Brave</a>
            </li>
            <li>
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/hive-keychain/"
              >Mozilla Firefox</a>
            </li>
          </ul>
          <p class="h6">
            Video tutorial:
          </p>
          <div>
            <b-embed
              type="iframe"
              aspect="16by9"
              src="https://www.youtube.com/embed/3Q5itfZHxOM"
              allowfullscreen
            />
          </div>
        </b-col>
      </b-row>
    </section>

    <section class="hp-section">
      <b-row>
        <b-col md="4">
          <h3 class="h4">
            Get Hive
          </h3>
        </b-col>
        <b-col md="8">
          Use any of the following exchanges to get HIVE.
          <br>Bittrex, Binance, Huobi
        </b-col>
      </b-row>
    </section>

    <section class="hp-section">
      <b-row>
        <b-col md="4">
          <h3 class="h4">
            Deposit Hive
          </h3>
        </b-col>
        <b-col md="8">
          <template v-if="!isAuthenticated">
            First
            <a href @click.prevent="$bvModal.show('loginModal')">login</a> and the head over to your
            <code>Wallet</code> to deposit HIVE into Hive-Engine. Then you can deposit SWAP.HIVE into the platform for token creation or keep it in Hive-Engine for market purchases.
          </template>
          <template v-else>
            Please visit your <nuxt-link :to="{name: 'user-wallet', params:{ user: username }}">
              wallet
            </nuxt-link> page to deposit and withdraw HIVE.
          </template>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'GetStarted',

  computed: {
    ...mapGetters('user', ['username', 'isAuthenticated'])
  }
}
</script>

<style>
</style>
