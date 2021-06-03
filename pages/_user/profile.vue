<template>
  <div id="edit-profile">
    <h1 class="h4">
      Profile
    </h1>
    <hr>

    <b-alert variant="info" dismissible show>
      Please fill out the profile information before applying to the whitelist, blank applications will be denied.
    </b-alert>

    <b-form-group
      label-sr-only
      label="Avatar"
      description="Click to select avatar. Maximum file size is 1 MB"
    >
      <image-input v-model="avatarImage" :max-size="1" :disabled="uploading">
        <div slot="activator">
          <b-avatar
            v-if="!avatarImage"
            rounded
            size="200px"
            :disabled="uploading"
          />
          <b-avatar v-else rounded size="200px" :src="avatarImage.url" />
        </div>
      </image-input>
    </b-form-group>

    <b-form-group label-sr-only label="Full Name" label-for="fullname">
      <b-form-input v-model="full_name" placeholder="First and Last Name" />
    </b-form-group>

    <b-form-group label-sr-only label="Bio" label-for="bio">
      <b-form-textarea v-model="bio" placeholder="Bio" />
    </b-form-group>

    <b-form-group label-sr-only label="Location" label-for="location">
      <b-form-input v-model="location" placeholder="Location" />
    </b-form-group>

    <b-form-group label-sr-only label="Website" label-for="website">
      <b-form-input v-model="website" type="url" placeholder="Website" />
    </b-form-group>

    <b-form-group label-sr-only label="Portfolio Link">
      <b-form-input v-model="portfolio" type="url" placeholder="Portfolio Link" />
    </b-form-group>

    <b-form-group label-sr-only label="Instagram Link">
      <b-form-input v-model="instagram" type="url" placeholder="Instagram Link" />
    </b-form-group>

    <b-form-group label-sr-only label="Twitter Link">
      <b-form-input v-model="twitter" type="url" placeholder="Twitter Link" />
    </b-form-group>

    <b-form-group label-sr-only label="SoundCloud Link">
      <b-form-input v-model="soundcloud" type="url" placeholder="SoundCloud Link" />
    </b-form-group>

    <b-button variant="primary" @click="updateProfile">
      Update Profile
    </b-button>

    <h1 class="h4 mt-5">
      Display Preference
    </h1>
    <hr>

    <b-form-group label="Not safe for work (NSFW) Photographs">
      <b-form-select v-model="nsfw" :options="nsfwOptions" />
    </b-form-group>

    <h1 class="h4 mt-5">
      Apply for Whitelist
    </h1>
    <hr>

    <b-alert variant="info" dismissible :show="showWhitelistAlert">
      Your whitelist application was successful. Please wait for a moderator to process your application.
    </b-alert>

    <p v-if="isWhitelisted" class="text-muted">
      You are already a whitelisted member.
    </p>

    <p v-else-if="profile.whitelist_applied" class="text-muted">
      We have received your whitelist application. Please wait for a moderator to process your application.
    </p>

    <template v-else>
      <p class="text-muted">
        To sell your music you need to be Whitelisted. Please fill out your profile details and then apply for the whitelist.
      </p>

      <b-checkbox id="accept_tos" v-model="accept_tos" value="accepted" unchecked-value="not_accepted">
        I have read the <nuxt-link :to="{ name: 'tos' }">
          TOS
        </nuxt-link> and I agree to only tokenize music I created and does not infringe on any copyright. I understand that if I violate the TOS I may be blacklisted from the site.
      </b-checkbox>

      <b-button
        class="mt-3"
        variant="primary"
        :disabled="accept_tos !== 'accepted'"
        @click.prevent="requestApplyForWhitelist"
      >
        Apply
      </b-button>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { url, maxLength } from 'vuelidate/lib/validators'
import ImageInput from '@/components/ImageInput.vue'

export default {
  name: 'UserProfile',

  components: {
    ImageInput
  },

  middleware: 'authenticated',

  data () {
    return {
      avatarImage: null,
      avatar: '',
      full_name: '',
      bio: '',
      location: '',
      website: '',
      instagram: '',
      twitter: '',
      portfolio: '',
      soundcloud: '',
      nsfw: 'warn',
      accept_tos: 'not_accepted',
      nsfwOptions: [
        { value: 'hide', text: 'Always Hide' },
        { value: 'warn', text: 'Always Warn' },
        { value: 'show', text: 'Always Show' }
      ],
      showWhitelistAlert: false,
      uploading: false
    }
  },

  async fetch () {
    this.loading = true

    await this.fetchProfile()

    this.full_name = this.profile.full_name
    this.bio = this.profile.bio
    this.location = this.profile.location
    this.website = this.profile.website
    this.instagram = this.profile.instagram
    this.twitter = this.profile.twitter
    this.portfolio = this.profile.portfolio
    this.soundcloud = this.profile.soundcloud

    if (this.profile.avatar) { this.avatarImage = { url: this.profile.avatar } }

    this.nsfw = this.$cookies.get('nsfw_pref') || 'warn'

    this.loading = false
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'isWhitelisted', 'profile'])
  },

  watch: {
    nsfw (value) {
      this.$cookies.set('nsfw_pref', value, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'strict'
      })
    },

    async avatarImage () {
      if (!this.avatarImage || !this.avatarImage.imageFile) { return }
      await this.uploadFile(this.avatarImage.imageFile)
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on('whitelist-apply-successful', () => {
      self.showWhitelistAlert = true
      self.accept_tos = 'not_accepted'
    })

    this.$eventBus.$on('user-profile-updated', async () => {
      await self.$fetch()
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('whitelist-apply-successful', 'user-profile-updated')
  },

  methods: {
    ...mapActions('user', ['fetchProfile', 'requestUpdateProfile', 'requestApplyForWhitelist']),

    uploadFile (image) {
      this.uploading = true

      const reader = new FileReader()
      reader.readAsBinaryString(image)

      reader.onload = async () => {
        try {
          const formData = new FormData()
          formData.append('image', image)

          const data = await this.$API.post('avatar/upload', formData)

          this.uploading = false

          this.avatar = data.url
        } catch (e) {
          console.log(e.message)

          this.uploading = false
        }
      }
    },

    updateProfile () {
      const data = {
        full_name: this.full_name,
        bio: this.bio,
        location: this.location,
        website: this.website,
        instagram: this.instagram,
        twitter: this.twitter,
        portfolio: this.portfolio,
        soundcloud: this.soundcloud
      }

      return this.requestUpdateProfile(data)
    }
  },

  validations: {
    full_name: {
      maxLength: maxLength(255)
    },

    bio: {
      maxLength: maxLength(1000)
    },

    location: {

    },

    website: {
      url
    },

    instagram: {
      url
    },

    twitter: {
      url
    },

    portfolio: {
      url
    },

    soundcloud: {
      url
    }
  }
}
</script>

<style>
</style>
