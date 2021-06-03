<template>
  <div class="tokenize">
    <h1 class="h4">
      Issue Token
    </h1>
    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <b-alert variant="info" show>
        <p>
          Your current balance is <strong>{{ currencyBalance }} {{ settings.currency }}</strong>, <span v-html=" maxPossibleEditions > 0 ? `which is enough to tokenize up to <strong>${maxPossibleEditions}</strong> editions` : 'which is not enough to tokenize any editions'" />.
        </p>
        <p class="mb-0">
          The first edition costs <strong>{{ settings.token_issuance_base_fee + settings.token_issuance_fee }} {{ settings.currency }}</strong>
          and each additional edition costs <strong>{{ settings.token_issuance_fee }} {{ settings.currency }}</strong>. Please check your balance now and complete a deposit of SWAP.HIVE to the Hive-Engine <nuxt-link :to="{ name: 'user-wallet', params: { username } }">
            wallet
          </nuxt-link>
          <span v-html="maxPossibleEditions > 0 ? `if you plan to issue more than <strong>${maxPossibleEditions}</strong> tokens` : '<strong>before</strong> you attempt to issue tokens'" />.
        </p>
      </b-alert>

      <b-alert variant="warning" dismissible show>
        At this stage of the project the information provided can not be edited. Please ensure everything in the form is correct.
      </b-alert>

      <b-form-group label="What are you tokenizing?" description="If you change this in the middle of filling out the form, your progress will be lost.">
        <b-form-radio-group v-model="tokenizing" :options="tokenizingOptions" buttons name="tokenizing-options" button-variant="outline-secondary" />
      </b-form-group>

      <b-form-row>
        <b-col>
          <b-form-group label="Thumbnail *" :state="$v.thumbnailURL.$dirty ? !$v.thumbnailURL.$error : null">
            <FileInput v-model="thumbnail" class="d-block" :max-size="tokenizing === 'video' ? 5 : 1" :disabled="uploading" :accepts="supportedThumbnailTypes">
              <template #activator>
                <b-avatar
                  :src="thumbnailSrc"
                  square
                  style="height:250px; width:100%"
                  :disabled="uploading"
                >
                  <template v-if="!thumbnailSrc">
                    <div class="flex-column">
                      <p v-if="tokenizing === 'video'">
                        MP4. Max 5mb.
                      </p>

                      <p v-else>
                        PNG, JPG, or GIF. Max 1mb.
                      </p>

                      <b-button variant="primary">
                        Choose Thumbnail
                      </b-button>
                    </div>
                  </template>

                  <video
                    v-if="tokenizing === 'video' && thumbnailSrc"
                    :key="thumbnailSrc"
                    preload="auto"
                    style="background-color: #000"
                  >
                    <source :src="`${thumbnailSrc}`" type="video/mp4">
                  </video>
                </b-avatar>
              </template>
            </FileInput>

            <template #invalid-feedback>
              Thumbnail is required.
            </template>
          </b-form-group>

          <b-progress v-if="thumbnail" class="mb-3" max="100">
            <b-progress-bar :value="progress['thumbnail']" />
          </b-progress>
        </b-col>

        <b-col>
          <b-form-group label="File *" :state="$v.fileURL.$dirty ? !$v.fileURL.$error : null">
            <FileInput v-model="file" class="d-block" :max-size="100" :disabled="uploading" :accepts="supportedFileTypes">
              <template #activator>
                <b-avatar
                  :src="fileSrc"
                  square
                  style="height:250px; width:100%"
                  :disabled="uploading"
                >
                  <template v-if="!fileSrc">
                    <div class="flex-column">
                      <p v-if="tokenizing === 'video'">
                        MP4. Max 30mb.
                      </p>

                      <p v-else-if="tokenizing === 'audio'">
                        MP3 or WAV. Max 30 MB
                      </p>

                      <p v-else>
                        PNG, JPG, or GIF. Max 30mb.
                      </p>

                      <b-button variant="primary">
                        Choose File
                      </b-button>
                    </div>
                  </template>

                  <video
                    v-if="tokenizing === 'video' && fileSrc"
                    :key="fileSrc"
                    preload="auto"
                    style="background-color: #000"
                  >
                    <source :src="`${fileSrc}`" :type="file.uploadedFile.type">
                  </video>

                  <audio
                    v-if="tokenizing === 'audio' && fileSrc"
                    :key="fileSrc"
                    controls
                    muted="true"
                    preload="auto"
                    style="background-color: #000"
                  >
                    <source :src="`${fileSrc}`" :type="file.uploadedFile.type">
                  </audio>
                </b-avatar>
              </template>
            </FileInput>

            <template #invalid-feedback>
              File is required.
            </template>
          </b-form-group>

          <b-progress v-if="file" class="mb-3" max="100">
            <b-progress-bar :value="progress['file']" />
          </b-progress>
        </b-col>
      </b-form-row>

      <b-form-group label="Name *">
        <b-form-input v-model.trim="name" :state="$v.name.$dirty ? !$v.name.$error : null" />
      </b-form-group>

      <label>Collection name</label>
      <b-row>
        <b-col md="4">
          <b-form-group label-sr-only label="Select Collection" label-for>
            <b-form-select
              v-model="selectedCollection"
              :options="existingCollections"
            />
          </b-form-group>
        </b-col>
        <b-col md="8">
          <b-form-group
            label-sr-only
            label="Collection name *"
            label-for="collection"
            description="Maximum 100 characters are allowed."
          >
            <b-form-input
              id="collection"
              v-model="$v.collection.$model"
              type="text"
              placeholder="Collection name *"
              autocomplete="off"
              :state="$v.collection.$dirty ? !$v.collection.$error : null"
            />
          </b-form-group>
        </b-col>
      </b-row>

      <b-form-group label="Description *">
        <b-form-textarea v-model.trim="description" :state="$v.description.$dirty ? !$v.description.$error : null" />
      </b-form-group>

      <b-form-row>
        <b-col sm="8">
          <b-form-group label="Rights *" description="By selecting 'Private' the owner has no rights to reproduce or use the work commercially. By selecting 'Limited Reproduction Rights' the artist grants the owner full commercial rights for the work to be used or recreated in commerce, but does not give away the creator's license.">
            <b-form-select
              v-model="rights"
              :options="rightsOptions"
              :state="$v.rights.$dirty ? !$v.rights.$error : null"
            />
          </b-form-group>
        </b-col>

        <b-col sm="4">
          <b-form-group label="Number of editions *">
            <b-form-input
              v-model.number="editions"
              type="number"
              autocomplete="off"
              min="1"
              max="1000"
              :state="$v.editions.$dirty ? !$v.editions.$error : null"
            />
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-form-row>
        <b-col>
          <b-form-group label="Category *">
            <b-form-select
              v-model="category"
              :options="categoryOptions"
              :state="$v.category.$dirty ? !$v.category.$error : null"
            />
          </b-form-group>
        </b-col>

        <b-col>
          <b-form-group label="Is this work Not Safe For Work (NSFW)?">
            <b-form-checkbox v-model="nsfw" size="lg" switch>
              {{ nsfw ? 'Yes' :'No' }}
            </b-form-checkbox>
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-form-group label="Tags *" label-for="tags">
        <b-form-tags
          v-model="tags"
          input-id="tags"
          tag-variant="primary"
          tag-pills
          separator=" ,;"
          placeholder="Enter new tags separated by space"
          autocomplete="off"
          :tag-validator="tagValidator"
          :state="$v.tags.$dirty ? !$v.tags.$error : null"
        />
      </b-form-group>

      <b-checkbox
        id="model_release"
        v-model="model_release"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        I have obtained consent and model release of all recognizable models (if any) in this content and can provide the release upon request.
      </b-checkbox>

      <b-checkbox
        id="accept_tos"
        v-model="accept_tos"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        I agree to only tokenize work I created that does not infringe on any copyright. If I am referencing someone else's art or work for more than 5% of the content I have received their consent.
      </b-checkbox>

      <b-checkbox
        id="accept_no_copy"
        v-model="accept_no_copy"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        I will not tokenize the same piece again.
      </b-checkbox>

      <b-checkbox
        id="accept_nsfw-2"
        v-model="accept_nsfw"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        Graphic violence of flesh and blood of humans has been marked "NSFW".
      </b-checkbox>

      <b-checkbox
        id="accept_no_child"
        v-model="accept_no_child"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        No sexual content of children in any format is tolerated on the site.  Minimum age is 18, our decision is final.
      </b-checkbox>

      <b-checkbox
        id="accept_content"
        v-model="accept_content"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        Borderline pieces will be removed from display and our file system and not refunded.
      </b-checkbox>

      <b-checkbox
        id="accept_no_violance"
        v-model="accept_no_violance"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        Work that calls for violence we be removed and authors banned.
      </b-checkbox>

      <b-checkbox
        id="accept_blist"
        v-model="accept_blist"
        value="accepted"
        class="mt-3"
        unchecked-value="not_accepted"
      >
        I understand that if I violate the Terms of Service I may be blacklisted from the site.
      </b-checkbox>

      <p class="mt-4 h6">
        Total Issuance fee for {{ editions }} edition(s): {{ issuanceFee }} {{ settings.currency }}
      </p>

      <b-button class="mt-4" variant="primary" :disabled="accept_tos !== 'accepted' || accept_blist !== 'accepted' || model_release !== 'accepted' || accept_nsfw !== 'accepted' || accept_no_child !== 'accepted' || accept_content !== 'accepted' || accept_no_violance !== 'accepted' || accept_no_copy !== 'accepted' || currencyBalance < issuanceFee" @click.prevent="issueTokens">
        Mint Tokens
      </b-button>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { required, numeric, maxLength, between, url } from 'vuelidate/lib/validators'
import { slugify } from '@/helpers'
import FileInput from '@/components/FileInput.vue'

export default {
  name: 'Tokenize',

  components: {
    FileInput
  },

  middleware: ({ redirect, store }) => {
    if (!store.state.user.whitelisted) {
      redirect('/')
    }
  },

  data () {
    return {
      thumbnail: null,
      thumbnailSrc: '',
      thumbnailURL: '',

      file: null,
      fileSrc: '',
      fileURL: '',

      name: '',
      collection: '',
      description: '',
      category: null,
      editions: 1,
      rights: null,
      rightsOptions: [
        { value: null, text: 'Select an option' },
        { value: 1, text: 'Private' },
        { value: 2, text: 'Limited Reproduction Rights' }
      ],
      nsfw: false,
      tags: [],

      tokenizing: 'audio',
      tokenizingOptions: [
        { text: 'Audio', value: 'audio' },
        { text: 'Video', value: 'video' }
      ],

      selectedCollection: null,
      existingCollections: [],

      accept_tos: null,
      accept_blist: null,
      model_release: null,
      accept_nsfw: null,
      accept_no_copy: null,
      accept_no_child: null,
      accept_content: null,
      accept_no_violance: null,

      currencyBalance: 0,

      uploading: false,
      progress: {
        thumbnail: 0,
        file: 0
      }
    }
  },

  async fetch () {
    this.loading = true

    const [[balance]] = await Promise.all([
      this.$sidechain.getBalances(this.username, this.settings.currency),
      this.fetchCollectibles()
    ])

    this.currencyBalance = balance ? Number(balance.balance) : 0

    this.existingCollections = [{ value: null, text: 'Create new' }]

    if (this.collectibles.length > 0) {
      this.existingCollections.push(...Array.from(new Set(this.collectibles.map(a => a.collection_name))))
      this.existingSeries = Array.from(new Set(this.collectibles.map(a => a.series)))
    }

    this.loading = false
  },

  head () {
    return {
      title: 'Tokenize'
    }
  },

  computed: {
    ...mapGetters(['settings']),
    ...mapGetters('user', ['isWhitelisted', 'username']),
    ...mapGetters('collectible', ['collectibles']),

    categoryOptions () {
      return [{ value: null, text: 'Select an option' }, ...this.settings.categories]
    },

    nftName () {
      return `${this.username}_${slugify(this.collection)}_${slugify(this.name)}`.toLowerCase()
    },

    maxPossibleEditions () {
      return Math.floor((this.currencyBalance - this.settings.token_issuance_base_fee) / (this.settings.token_issuance_fee * 1))
    },

    issuanceFee () {
      return this.toFixedWithoutRounding(this.settings.token_issuance_base_fee + (this.settings.token_issuance_fee * this.editions), 3)
    },

    supportedFileTypes () {
      const supportedFileTypes = {
        audio: ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav', 'audio/x-pn-wav'],
        video: ['video/mp4']
      }

      return supportedFileTypes[this.tokenizing].toString()
    },

    supportedThumbnailTypes () {
      const supportedFileTypes = {
        audio: ['image/gif', 'image/png', 'image/jpeg'],
        video: ['video/mp4']
      }

      return supportedFileTypes[this.tokenizing].toString()
    }
  },

  watch: {
    async thumbnail (value) {
      if (value) {
        this.thumbnailSrc = value.url
        await this.uploadFile(value.uploadedFile, 'thumbnail')
      }
    },

    async file (value) {
      if (value) {
        this.fileSrc = value.url
        await this.uploadFile(value.uploadedFile, 'file')
      }
    },

    tokenizing () {
      this.thumbnailURL = ''
      this.fileURL = ''

      this.thumbnail = null
      this.file = null

      this.thumbnailSrc = ''
      this.fileSrc = ''
    },

    selectedCollection (v) {
      this.collection = v
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on('issue-tokens-successful', async (data) => {
      self.thumbnail = null
      self.thumbnailSrc = ''
      self.thumbnailURL = ''

      self.file = null
      self.fileSrc = ''
      self.fileURL = ''

      self.name = ''
      self.collection = ''
      self.description = ''
      self.category = null
      self.editions = 1
      self.rights = null
      self.nsfw = false
      self.tags = []

      self.selectedCollection = null

      self.accept_tos = null
      self.accept_blist = null
      self.model_release = null
      self.accept_nsfw = null
      self.accept_no_copy = null
      self.accept_no_child = null
      self.accept_content = null
      self.accept_no_violance = null

      self.$v.$reset()

      self.loading = true

      await self.validateTransaction(data.id)

      await self.$fetch()
    })

    this.$eventBus.$once('issue-tokens-validated', () => {
      try {
        self.$root.$bvModal.msgBoxOk('Congratulations, your music has been tokenized! Please visit your collection to list your music for sale.', {
          title: 'Congratulations!',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
          .then((value) => {
            if (value) { self.$nuxt.refresh() }
          })
      } catch (e) {
        console.log(e.message)
      }
    })
  },

  beforeDestroy () {
    this.$eventBus.$off(['issue-tokens-successful', 'issue-tokens-validated'])
  },

  methods: {
    ...mapActions('collectible', ['fetchCollectibles']),
    ...mapActions('token', ['requestMintTokens', 'validateTransaction']),

    uploadFile (file, type) {
      const self = this
      this.uploading = true
      this.progress[type] = 0

      const reader = new FileReader()
      reader.readAsBinaryString(file)

      reader.onload = async () => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('type', type)

          const config = {
            onUploadProgress (progressEvent) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

              self.progress[type] = percentCompleted
            }
          }

          const { url } = await self.$API.$post('upload', formData, config)

          if (type === 'thumbnail') {
            this.thumbnailURL = url
          } else {
            this.fileURL = url
          }
        } catch (e) {
          console.log(e.message)
        }

        self.uploading = false
      }
    },

    issueTokens () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        const payload = {
          action: 'mint',
          name: this.name,
          collection: this.collection,
          category: this.category,
          rights: this.rights,
          editions: this.editions,
          nsfw: this.nsfw,
          type: this.tokenizing,
          thumbnail: this.thumbnailURL,
          file: this.fileURL,
          notes: this.notes,
          tags: this.tags,
          description: this.description
        }

        this.requestMintTokens({ fee: this.issuanceFee, payload })
      }
    },

    tagValidator (tag) {
      return tag === tag.toLowerCase() && tag.length > 1 && tag.length < 16 && /^[a-z0-9_-]*$/.test(tag)
    }
  },

  validations: {
    name: {
      required
    },

    collection: {
      required,
      maxLength: maxLength(100)
    },

    description: {
      required
    },

    rights: {
      required
    },

    editions: {
      required,
      numeric,
      between: between(1, 1000)
    },

    tags: {
      required
    },

    category: {
      required
    },

    thumbnailURL: {
      required,
      url
    },

    fileURL: {
      required,
      url
    }
  }
}
</script>

<style>

</style>
