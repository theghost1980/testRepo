export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    if (to.query && (to.query.ref || to.query.r)) {
      const ref = to.query.r || to.query.ref
      if (ref && process.client) { localStorage.setItem('ref', ref) }
    }

    next()
  })
}
