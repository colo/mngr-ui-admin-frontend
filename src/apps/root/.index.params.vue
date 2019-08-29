<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <tables-page ref="all" v-if="!$route.params.table" />
  <table-page :ref="$route.params.table" v-else :table="$route.params.table"/>
</template>
<script>
/* global EventBus */
// import { EventBus } from '@libs/eventbus'

import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root')

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import TablePage from './components/tablePage'
import TablesPage from './components/tablesPage'

export default {

  components: { TablesPage, TablePage },
  name: 'root',

  data () {
    return {

    }
  },

  beforeCreate: function (next) {
    // debug('beforeCreate', this)

    // https://webpack.js.org/guides/dependency-management/#require-context
    const requireComponent = require.context(
      // Look for files in the current directory
      '@apps/root/components/',
      // Do not look in subdirectories
      true,
      // Only include "_base-" prefixed .vue files
      /[\w-]+\.vue$/
    )

    // For each matching file name...
    requireComponent.keys().forEach((fileName) => {
      // Get the component config

      const componentConfig = requireComponent(fileName)
      // Get the PascalCase version of the component name
      const componentName = upperFirst(
        camelCase(
          fileName
            // Remove the "./_" from the beginning
            // .replace(/^\.\/_/, '')
            // Remove the file extension from the end
            .replace(/\.\w+$/, '')
        )
      )
      // Globally register the component
      // console.log('componentName')
      Vue.component(componentName, componentConfig.default || componentConfig)
    })

    if (next) { next() }
  },
  created: function () {
    debug('created ', this.$route.params)
  }

}
</script>
