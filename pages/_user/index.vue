<script>
export default {
  middleware: [
    function ({ redirect, route }) {
      redirect(`/${route.params.user}/collection`)
    }
  ]
}
</script>
