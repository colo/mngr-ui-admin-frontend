<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <!-- <q-page :style="{height: height}">
    <all-page key="all" v-if="!table"/>
    <table-page v-else :table="table" :key="table"/>
  </q-page> -->
  <!-- <table-page v-else :table="$route.params.table"/> -->
  <div></div>
</template>
<script>
/* global EventBus */
// import { EventBus } from '@libs/eventbus'

import * as Debug from 'debug'
const debug = Debug('apps:root')

import DataSourcesMixin from '@components/mixins/dataSources'

import Pipeline from 'js-pipeline'
import RootPipeline from './pipelines/index'

export default {
  mixins: [ DataSourcesMixin ],

  // components: { GridView },
  name: 'root',

  components: {
    'all': [
      {
        source: {
          requests: {
            once: [
              {
                params: {
                  path: 'all'
                },
                callback: function (tables, metadata, key, vm) {
                  debug('All callback', tables, vm.$options.grid_template)
                  // let grid = JSON.parse(JSON.stringify(vm.grid))
                  let grid_template = Object.clone(vm.$options.grid_template)

                  let last_component_row = 0
                  Object.each(tables, function (data, rt_tb) {
                    debug('All %s', rt_tb)
                    Object.each(grid_template.layouts, function (layout, layout_name) {
                      debug('All layout_name %s', layout_name)
                      Array.each(layout, function (component, index) {
                        let cloned_component = Object.clone(component)
                        cloned_component.i = cloned_component.i + '_' + rt_tb
                        cloned_component.y = cloned_component.y + last_component_row

                        // if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
                        if (!vm.grid.layouts) vm.$set(vm.grid, 'layouts', {})
                        if (!vm.grid.layouts[layout_name]) vm.$set(vm.grid.layouts, layout_name, [])

                        if (vm.grid.layouts[layout_name].every(function (item) { return item.i !== cloned_component.i })) {
                          vm.grid.layouts[layout_name].push(cloned_component)
                        }
                      })
                      last_component_row++
                    })
                  })

                  // let components = JSON.parse(JSON.stringify(vm.components))
                  // let components = {}
                  let components_template = Object.clone(vm.$options.components_template)
                  let modified = false
                  Object.each(tables, function (data, rt_tb) {
                    debug('All table %s', rt_tb, components_template)
                    Object.each(components_template, function (component, id) {
                      let cloned_component = Array.clone(component)

                      debug('All component %s %o', id, cloned_component)
                      id += '_' + rt_tb
                      Array.each(cloned_component, function (widget, index) {
                        widget.props.table = rt_tb
                        widget.props.data = data
                        widget.props.pipeline = 'root/pipelines/root'
                        widget.props.path = vm.path
                        // if (widget.props.id) widget.props.id += '.' + rt_tb

                        // widget.source.requests.once[0].params.query.from = rt_tb
                      })

                      // components[id] = cloned_component
                      // vm.$set(vm.components, id, cloned_component)
                      if (!vm.components[key]) {
                        vm.$set(vm.components, id, cloned_component)
                        modified = true
                      }
                    })
                  })

                  // vm.grid = grid
                  // debug('All grid / components %o', grid, components)

                  // for (const key in grid) {
                  //   vm.$set(vm.grid, key, grid[key])
                  // }

                  // for (const key in components) {
                  //   if (!vm.components[key]) {
                  //     vm.$set(vm.components, key, components[key])
                  //   }
                  // }

                  // vm.__bind_components_to_sources(vm.components)
                  // if (modified === true) {
                  //   vm.destroy_pipelines()
                  //   vm.create_pipelines()
                  // }
                  // this.props.inner.text = val[0][0].count
                }
              },
              {
                params: {
                  path: 'all',
                  query: {
                    register: 'changes',
                    'q': [
                      // { 'data': ['log'] },
                      'metadata'
                    ]
                    // 'transformation': [
                    //   { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                    //   'slice:0:9'
                    // ]
                  }
                // body: {
                //   'transformation': 'limit:30000'
                //
                // }
                },
                callback: function (val) {
                  val = JSON.parse(JSON.stringify(val))
                  debug('MyTable changes', val)

                  // if (Array.isArray(val)) val = val[0]
                  //
                  // if (!Array.isArray(val)) val = [val]
                  //
                  // val.sort(function (a, b) {
                  //   if (a.metadata.timestamp > b.metadata.timestamp) {
                  //     return -1
                  //   }
                  //   if (a.metadata.timestamp < b.metadata.timestamp) {
                  //     return 1
                  //   }
                  //   // a must be equal to b
                  //   return 0
                  // })
                  //
                  // for (let i = 0; i < val.length; i++) {
                  //   let row = Object.merge(val[i].data, val[i].metadata)
                  //   row.date = moment(row.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
                  //
                  //   debug('MyTable changes', row)
                  //   this.props.data.unshift(row)
                  // }
                }
              }
            ]
          }
        }
      }

    ]
    /**
    * @todo
    * test queries -> http://colo:8080/?from=munin&params[prop]=tags&params[value]=["memory"]
    **/
  },

  // computed: {
  //   table () {
  //     return this.$route.query.table
  //   }
  // },
  data () {
    return {

      id: 'all',
      path: 'all'

    }
  },

  watch: {
    '$route': function (val) {
      debug('ROUTE %o', val)
    }
  },

  created: function () {
    debug('ROUTE %o', this.$route)
  },

  methods: {

    /**
  * @start pipelines
  **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      let template = Object.clone(RootPipeline)

      let pipeline_id = template.input[0].poll.id

      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.$options.components)

      let pipe = new Pipeline(template)

      this.$options.__pipelines_cfg[pipeline_id] = {
        ids: [],
        connected: [],
        suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
      }

      this.__after_connect_inputs(
        pipe,
        this.$options.__pipelines_cfg[pipeline_id],
        this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
          debug('__resume_pipeline CALLBACK')
          pipe.fireEvent('onOnce')
        }], this)
      )

      this.$options.pipelines[pipeline_id] = pipe

      if (next) { next() }
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
