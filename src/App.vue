<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import * as Debug from 'debug'
const debug = Debug('App')

export default {
  name: 'App',

  created: function () {
    debug('created')
    this.$store.commit('app/setTheme', 'white')
  }
}
</script>

<style>
</style>
