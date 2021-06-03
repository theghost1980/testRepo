export default function ({ route, store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user.authenticated) {
    let uri = ''

    if (process.server) {
      uri = Buffer.from(`${route.fullPath}`).toString('base64')
    } else {
      uri = btoa(`${route.fullPath}`)
    }

    return redirect(`/?redirect=${uri}`)
  }
}
