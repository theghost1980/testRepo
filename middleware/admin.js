export default function ({ route, store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user.authenticated ||
    (store.state.user.profile && !store.state.user.profile.admin)) {
    return redirect(`/?redirect=${route.fullPath}`)
  }
}
