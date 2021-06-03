<template>
  <b-modal id="reportCollectibleModal" title="Report">
    <b-form-group label="Reason">
      <b-form-radio-group v-model="reason" :options="options" name stacked />
    </b-form-group>

    <b-form-group
      label="Message"
      label-for="report-message"
      description="Please explain your reporting reason in detail. Maximum of 500 characters."
    >
      <b-form-textarea
        id="report-message"
        v-model="message"
        trim
        :state="$v.message.$dirty ? !$v.message.$error : null"
      />
    </b-form-group>

    <template #modal-footer>
      <b-button
        variant="primary"
        :disabled="reason === '' || message.length > 500"
        @click.prevent="reportCollectible"
      >
        Report
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapActions } from 'vuex'
import { required, maxLength, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'ReportModal',

  props: {
    series: { type: String, required: true }
  },

  data () {
    return {
      reason: '',
      message: '',
      options: [
        { text: 'Copyright Infringement', value: 'copyright' },
        { text: 'Plagiarized Content', value: 'plagiarism' },
        { text: 'Failed to tag NSFW', value: 'nsfw' }
      ]
    }
  },

  mounted () {
    const self = this

    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if (modalId === 'reportCollectibleModal') {
        self.$v.$reset()

        self.reason = ''
        self.message = ''
      }
    })

    this.$eventBus.$on('REPORT_COLLECTIBLE_SUCCESSFUL', () => {
      self.$bvModal.hide('reportCollectibleModal')
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('REPORT_COLLECTIBLE_SUCCESSFUL')
  },

  validations: {
    reason: {
      required
    },
    message: {
      required: requiredIf(function () { return this.reason !== 'nsfw' }),
      maxLength: maxLength(500)
    }
  },

  methods: {
    ...mapActions('market', ['requestReportCollectible']),

    reportCollectible () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      const data = {
        series: this.series,
        reason: this.reason,
        message: this.message
      }

      return this.requestReportCollectible(data)
    }
  }
}
</script>

<style>
</style>
