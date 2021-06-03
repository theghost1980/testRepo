<template>
  <div class="home">
    <section class="hp-section masthead noBoxShadow">
      <h1 class="secondaryFont bold whitishColor textShadowBluishSofter">
        Collectible, Scarce, Tokenized Music
      </h1>
      <div class="container-fluid">
        <div class="row flex-lg-row-reverse justify-content-center align-items-center g-5 py-5 marginTB containerConstrast">
          <div class="col-lg-6">
            <h1 class="thirdFont ligthFont whitishColor text-center textShadowBluishSofter">
              We are changing the way artists play with music.
            </h1>
            <p class="lead thirdFont whitishColor">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a facilisis lorem. Curabitur scelerisque eleifend sollicitudin. Maecenas et lorem suscipit, rhoncus nisl non, posuere orci. Pellentesque id convallis diam.
            </p>
            <div class="d-grid gap-2 d-md-flex justify-content-center marginB">
              <button type="button" class="btn btn-primary btn-lg px-4 me-md-2 btnGeneral thirdFont">
                Find more
              </button>
            </div>
          </div>
          <div class="col-10 col-sm-8 col-lg-6">
            <img src="~/assets/images/pexels-pixabay-210922.jpeg" class="img-fluid bordersWhitish roundedBordersBig">
          </div>
        </div>
        <div class="row flex-lg-row-reverse justify-content-center align-items-center g-5 py-5 marginTB">
          <div class="col-10 col-sm-8 col-lg-6">
            <img src="~/assets/images/pexels-wendy-wei-1916824.jpeg" class="img-fluid bordersWhitish roundedBordersBig">
          </div>
          <div class="col-lg-6">
            <h1 class="thirdFont ligthFont whitishColor text-center textShadowBluishSofter marginT">
              Artists playing with tokens.
            </h1>
            <p class="lead thirdFont whitishColor">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a facilisis lorem. Curabitur scelerisque eleifend sollicitudin. Maecenas et lorem suscipit, rhoncus nisl non, posuere orci. Pellentesque id convallis diam.
            </p>
          </div>
        </div>
        <div class="row flex-lg-row-reverse justify-content-center align-items-center g-5 py-5 marginTB containerConstrast">
          <div class="col-lg-6">
            <h1 class="thirdFont ligthFont whitishColor text-center textShadowBluishSofter">
              Tokenise, play and enjoy.
            </h1>
            <p class="lead thirdFont whitishColor">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a facilisis lorem. Curabitur scelerisque eleifend sollicitudin. Maecenas et lorem suscipit, rhoncus nisl non, posuere orci. Pellentesque id convallis diam.
            </p>
          </div>
          <div class="col-10 col-sm-8 col-lg-6">
            <img src="~/assets/images/pexels-victor-freitas-733767.jpeg" class="img-fluid bordersWhitish roundedBordersBig">
          </div>
        </div>
      </div>
      <div class="mt-5">
        <b-button v-if="!isAuthenticated" variant="primary" :to="{name: 'get-started'}" class="btnGeneral thirdFont">
          Get Started
        </b-button>
      </div>
    </section>

    <section class="hp-section recent-activity">
      <h3 class="section-title primaryfont bold whitishColor">
        Featured
        <small class="thirdFont">
          <nuxt-link class="links" :to="{name: 'gallery'}">view gallery</nuxt-link>
        </small>
      </h3>

      <template v-if="loading">
        <Loading />
      </template>

      <template v-else>
        <div v-if="featured.length <= 0" class="text-center">
          <p class="h5 thirdFont whitishColor">
            No featured contents are found!
          </p>
        </div>

        <b-row>
          <b-col v-for="(h,i) of featured" :key="i" md="4">
            <ContentCard :series="h" route="gallery-collectible" type="featured" />
          </b-col>
        </b-row>
      </template>
    </section>

    <section class="hp-section recent-activity">
      <h3 class="section-title primaryfont bold whitishColor">
        Recent Activity
        <small class="thirdFont">
          <nuxt-link class="links" :to="{name: 'gallery'}">view gallery</nuxt-link>
        </small>
      </h3>

      <template v-if="loading">
        <Loading />
      </template>

      <template v-else>
        <div v-if="trades_history.length <= 0" class="text-center">
          <p class="h5 thirdFont whitishColor">
            No activities found!
          </p>
        </div>

        <b-row>
          <b-col v-for="(h,i) of trades_history.slice(0,3)" :key="i" md="4">
            <ContentCardTH :data="h" route="gallery-collectible" />
          </b-col>
        </b-row>
      </template>
    </section>

    <section class="hp-section recent-activity">
      <h3 class="section-title primaryfont bold whitishColor">
        Freshly Tokenized Music
        <small class="thirdFont">
          <nuxt-link class="links" :to="{name: 'gallery'}">view gallery</nuxt-link>
        </small>
      </h3>

      <template v-if="loading">
        <Loading />
      </template>

      <template v-else>
        <div v-if="latest.length <= 0" class="text-center">
          <p class="h5 thirdFont whitishColor">
            No new music found!
          </p>
        </div>

        <b-row>
          <b-col v-for="(series,i) in latest" :key="i" md="4">
            <ContentCard :series="series" route="gallery-collectible" />
          </b-col>
        </b-row>
      </template>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCard from '@/components/cards/ContentCard.vue'
import ContentCardTH from '@/components/cards/ContentCardTH.vue'

export default {
  name: 'Home',

  components: {
    ContentCard,
    ContentCardTH
  },

  data () {
    return {
      dataLoaded: false
    }
  },

  async fetch () {
    this.loading = true

    await Promise.all([
      this.fetchTradesHistory(3),
      this.fetchLatestCollectibles(3),
      this.fetchFeaturedCollectibles()
    ])

    this.loading = false
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated']),
    ...mapGetters('market', ['trades_history']),
    ...mapGetters('collectible', ['latest', 'featured'])
  },

  methods: {
    ...mapActions('market', ['fetchTradesHistory']),
    ...mapActions('collectible', ['fetchLatestCollectibles', 'fetchFeaturedCollectibles'])
  }
}
</script>
