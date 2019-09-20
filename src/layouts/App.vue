<template>
  <!-- <q-layout view="lHh Lpr lFf"> -->
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="transparent">
      <q-toolbar class="full-width">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />

        </q-btn>
        <q-space />
        <!-- <q-toolbar-title>
          Quasar App
        </q-toolbar-title> -->

        <!-- <div>Quasar v{{ $q.version }}</div> -->
        <flat-logic-light-blue-helper-helper />
        <flat-logic-light-blue-header-header />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      none
      :width="250"
      :breakpoint="500"
    >
    <!-- :class="'transparent'"
    content-class="dashboard-page"
    :content-style="{ backgroundColor: 'rgba(0,0,0,0)' }" -->
    <!-- <q-drawer
        v-model="leftDrawerOpen"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"

        :width="200"
        :breakpoint="500"
        bordered
        content-class="transparent"
      > -->
      <Sidebar />

    </q-drawer>

    <q-page-container>
      <q-page>
      <div class="content animated fadeInUp">
        <transition name="router-animation">
          <router-view />
        </transition>
      </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

import Sidebar from '@components/Sidebar/flatlogic/lightblue/Sidebar'
export default {
  name: 'MyLayout',

  components: { Sidebar },

  data () {
    return {
      leftDrawerOpen: false
      // miniState: true
    }
  },
  methods: {
    openURL
  }
}
</script>
<style src="@skins/flatlogic/lightblue/components/Layout/Layout.scss" lang="scss" />
