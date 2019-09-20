<template>
  <div id="q-app">
    <!-- <router-view /> -->
    <router-view :key="$route.fullPath"></router-view>
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

<style src="@skins/flatlogic/lightblue/styles/theme.scss" lang="scss" />
