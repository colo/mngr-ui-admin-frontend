<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <q-page :style="{height: height}">
    <all-page key="all" v-if="!table"/>
    <table-page v-else :table="table" :key="table"/>
  </q-page>
  <!-- <table-page v-else :table="$route.params.table"/> -->
</template>
<script>
/* global EventBus */
// import { EventBus } from '@libs/eventbus'

import { dom } from 'quasar'
const { height, width } = dom

import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root')

import AdminLteMixin from '@components/mixins/adminlte'
import DataSourcesMixin from '@components/mixins/dataSources'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import RootPipeline from './pipelines/index'

// import { dom } from 'quasar'
// const { height, width } = dom

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export default {
  mixins: [AdminLteMixin, DataSourcesMixin],

  // components: { GridView },
  name: 'root',

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

      id: 'all',
      path: 'all'

      // components: {
      //   'all': [{
      //     source: {
      //       requests: {
      //         once: [{
      //           params: {
      //             path: 'all'
      //           },
      //           callback: function (tables, metadata, key, vm) {
      //             debug('All callback', tables, vm.$options.grid_template)
      //             // let grid = JSON.parse(JSON.stringify(vm.grid))
      //             let grid_template = Object.clone(vm.$options.grid_template)
      //
      //             let last_component_row = 0
      //             Object.each(tables, function (data, rt_tb) {
      //               debug('All %s', rt_tb)
      //               Object.each(grid_template.layouts, function (layout, layout_name) {
      //                 debug('All layout_name %s', layout_name)
      //                 Array.each(layout, function (component, index) {
      //                   let cloned_component = Object.clone(component)
      //                   cloned_component.i = cloned_component.i + '_' + rt_tb
      //                   cloned_component.y = cloned_component.y + last_component_row
      //
      //                   // if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
      //                   if (!vm.grid.layouts) vm.$set(vm.grid, 'layouts', {})
      //                   if (!vm.grid.layouts[layout_name]) vm.$set(vm.grid.layouts, layout_name, [])
      //
      //                   if (vm.grid.layouts[layout_name].every(function (item) { return item.i !== cloned_component.i })) {
      //                     vm.grid.layouts[layout_name].push(cloned_component)
      //                   }
      //                 })
      //                 last_component_row++
      //               })
      //             })
      //
      //             // let components = JSON.parse(JSON.stringify(vm.components))
      //             // let components = {}
      //             let components_template = Object.clone(vm.$options.components_template)
      //             let modified = false
      //             Object.each(tables, function (data, rt_tb) {
      //               debug('All table %s', rt_tb, components_template)
      //               Object.each(components_template, function (component, id) {
      //                 let cloned_component = Array.clone(component)
      //
      //                 debug('All component %s %o', id, cloned_component)
      //                 id += '_' + rt_tb
      //                 Array.each(cloned_component, function (widget, index) {
      //                   widget.props.table = rt_tb
      //                   widget.props.data = data
      //                   widget.props.pipeline = 'root/pipelines/root'
      //                   widget.props.path = vm.path
      //                   // if (widget.props.id) widget.props.id += '.' + rt_tb
      //
      //                   // widget.source.requests.once[0].params.query.from = rt_tb
      //                 })
      //
      //                 // components[id] = cloned_component
      //                 // vm.$set(vm.components, id, cloned_component)
      //                 if (!vm.components[key]) {
      //                   vm.$set(vm.components, id, cloned_component)
      //                   modified = true
      //                 }
      //               })
      //             })
      //
      //             // vm.grid = grid
      //             // debug('All grid / components %o', grid, components)
      //
      //             // for (const key in grid) {
      //             //   vm.$set(vm.grid, key, grid[key])
      //             // }
      //
      //             // for (const key in components) {
      //             //   if (!vm.components[key]) {
      //             //     vm.$set(vm.components, key, components[key])
      //             //   }
      //             // }
      //
      //             // vm.__bind_components_to_sources(vm.components)
      //             // if (modified === true) {
      //             //   vm.destroy_pipelines()
      //             //   vm.create_pipelines()
      //             // }
      //             // this.props.inner.text = val[0][0].count
      //           }
      //         }]
      //       }
      //     }
      //   }]
      // }
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

  },

  methods: {
    // hide: function (table, event, vnode) {
    //   debug('hide', table, this.grid)
    //   for (const layout in this.grid.layouts) {
    //     for (let i = 0; i < this.grid.layouts[layout].length; i++) {
    //       let row = this.grid.layouts[layout][i]
    //       if (row.i === 'rethinkdb_table_' + table) {
    //         this.$set(this.grid.layouts[layout][i], 'h', 2)
    //       }
    //     }
    //   }
    //
    //   debug('hiden', table, this.grid)
    // },
    // show: function (table, event, vnode) {
    //   debug('show', table, this.grid)
    //   for (const layout in this.grid.layouts) {
    //     for (let i = 0; i < this.grid.layouts[layout].length; i++) {
    //       let row = this.grid.layouts[layout][i]
    //       if (row.i === 'rethinkdb_table_' + table) {
    //         this.$set(this.grid.layouts[layout][i], 'h', 27)
    //       }
    //     }
    //   }
    //
    //   debug('shown', table, this.grid)
    // },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 700 + 'px'
      this.height = height + 200 + 'px'
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      // debug('create_pipelines')
      //
      // let template = Object.clone(RootPipeline)
      //
      // let pipeline_id = template.input[0].poll.id
      //
      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
      //
      // let pipe = new Pipeline(template)
      //
      // this.$options.__pipelines_cfg[pipeline_id] = {
      //   ids: [],
      //   connected: [],
      //   suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
      // }
      //
      // this.__after_connect_inputs(
      //   pipe,
      //   this.$options.__pipelines_cfg[pipeline_id],
      //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
      //     debug('__resume_pipeline CALLBACK')
      //     pipe.fireEvent('onOnce')
      //   }], this)
      // )
      //
      // this.$options.pipelines[pipeline_id] = pipe
      //
      // if (next) { next() }
    }

    /**
    * @end pipelines
    **/

  }
  // mounted: function () {
  //   debug('mounted refs', this.$refs)
  // //   // console.log('height:', height(document.getElementById('logs')))
  // //   this.height = this.getGridHeight() + 700 + 'px'
  // }

}
</script>
