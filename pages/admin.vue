<template>
  <div id="admin">
    <h1 class="h4">
      Admin
    </h1>
    <hr>

    <b-tabs content-class="mt-3" align="center" class="mt-5" lazy>
      <b-tab title="Dashboard" active>
        <Dashboard />
      </b-tab>
      <b-tab title="Manage User/Collectible">
        <ManageUserAndCollectible />
      </b-tab>
      <b-tab title="All Collectibles">
        <Collectibles />
      </b-tab>
      <b-tab title="All Users">
        <Users />
      </b-tab>
      <b-tab title="Whitelist Applications">
        <WhitelistApplications />
      </b-tab>
      <b-tab title="Reports">
        <Reports />
      </b-tab>
      <b-tab title="Transactions">
        <Transactions />
      </b-tab>
      <b-tab title="Issue Manually">
        <ManualIssue />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Dashboard from '@/components/admin/Dashboard.vue'
import WhitelistApplications from '@/components/admin/WhitelistApplications.vue'
import Transactions from '@/components/admin/Transactions.vue'
import ManualIssue from '@/components/admin/ManualIssue.vue'
import Users from '@/components/admin/Users.vue'
import ManageUserAndCollectible from '@/components/admin/ManageUserAndCollectible.vue'
import Reports from '@/components/admin/Reports.vue'
import Collectibles from '@/components/admin/Collectibles.vue'

export default {
  name: 'Admin',

  components: {
    Dashboard,
    WhitelistApplications,
    Reports,
    Transactions,
    ManageUserAndCollectible,
    Collectibles,
    Users,
    ManualIssue
  },

  middleware: 'admin',

  head () {
    return {
      title: 'Admin Panel'
    }
  }
}
</script>

<style>
</style>
