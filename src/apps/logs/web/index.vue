<template>
  <q-page :style="{height: height}">
    <!-- <all-page v-if="!table"/>
    <table-page v-else :table="table"/> -->
  </q-page>
</template>
<script>
/* global EventBus */
// import { EventBus } from '@libs/eventbus'

import { dom } from 'quasar'
const { height, width } = dom

import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('pages:logs')

import AdminLteMixin from '@components/mixins/adminlte'
import DataSourcesMixin from '@components/mixins/dataSources'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import LogsPipeline from '../pipelines/index'

// import { dom } from 'quasar'
// const { height, width } = dom

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export default {
  mixins: [AdminLteMixin, DataSourcesMixin],

  // components: { GridView },
  name: 'web',

  computed: {
    table () {
      return this.$route.query.table
    }
  },
  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,

      id: 'web',
      path: 'logs'

    }
  },

  watch: {
    '$route': function (val) {
      debug('ROUTE %o', val)
    }
  },

  beforeCreate: function (next) {
    // debug('beforeCreate', this)

    // https://webpack.js.org/guides/dependency-management/#require-context
    const requireComponent = require.context(
      // Look for files in the current directory
      '@apps/logs/components/',
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

  },

  methods: {

    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 700 + 'px'
      this.height = height + 200 + 'px'
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {

    }

    /**
    * @end pipelines
    **/

  }

}
</script>
