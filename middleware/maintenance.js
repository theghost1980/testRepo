export default function ({ route, store, redirect }) {
  if (store.state.settings.maintenance && !route.path.match(/^\/(login|admin|maintenance)/)) {
    redirect('/maintenance')
  }
}
