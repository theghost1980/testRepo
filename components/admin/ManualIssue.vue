<template>
  <div class="manual-issue">
    <b-row class="mt-5" align-h="center">
      <b-col lg="6">
        <b-alert show="" dismissible variant="warning">
          Please be extra careful while using this tool. This is an extremely
          powerful tool, if misused or used carelessly, it might corrupt the NFT
          history.
        </b-alert>

        <b-form-group label="Transaction ID">
          <b-form-input
            v-model.trim="trxId"
            autocomplete="off"
            :state="$v.trxId.$dirty ? !$v.trxId.$error : null"
          />
        </b-form-group>

        <b-button
          variant="primary"
          :disabled="trxId.length < 40"
          @click="issueManually"
        >
          Issue Manually
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { required, alphaNum, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'ManualIssue',

  data () {
    return {
      trxId: ''
    }
  },

  validations: {
    trxId: {
      required,
      alphaNum,
      minLength: minLength(40)
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on('MANUAL_ISSUE_PROCESSED', () => {
      self.trxId = ''
      self.$v.$reset()
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('MANUAL_ISSUE_PROCESSED')
  },

  methods: {
    ...mapActions('admin', ['requestManualIssue']),

    issueManually () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      return this.requestManualIssue({ trx_id: this.trxId })
    }
  }
}
</script>

<style>
</style>
