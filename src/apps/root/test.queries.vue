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
                  debug('All callback', tables)
                  let components = {}

                  let changed = false
                  Object.each(tables, function (data, table) {
                    if (!vm.components[table]) {
                      changed = true
                      components[table] = [{
                        source: {
                          requests: {
                            once: {
                              params: {
                                path: 'all',
                                query: {
                                  from: table,
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
                              }
                            }
                          }
                        }
                      }]

                      vm.$set(vm.components, table, components[table])
                    }
                  })
                  debug('register tables components %o %o', components, changed)
                  if (changed) {
                    vm.destroy_pipelines()
                    vm.create_pipelines()
                  }
                  // Object.each(components, function (data, component) {
                  //   vm.$set(vm.components, component, data)
                  // })
                  // let once = vm.__components_sources_to_requests(components)['once']
                  // vm.destroy_pipelines()
                  // vm.create_pipelines()
                  // vm.$options.pipelines['input.root'].inputs[0].conn_pollers[0].options.requests.once = once
                  // vm.$options.pipelines['input.root'].inputs[0].conn_pollers[0].fireEvent('onOnce')
                }
              }

            ]
          }
        }
      }

    ]

  },

  /**
  * works
  * http://localhost:8083/?from=munin&params[prop]=tags&params[value]=["memory"]
  * http://localhost:8083/?from=logs&q=data&fields=body_bytes_sent&aggregation=sum:('body_bytes_sent')
  * http://localhost:8083/?from=logs_historical&q=data&transformation=limit:1
  **/

  components_query: {
    'query': [
      {
        source: {
          requests: {
            once: {
              params: {
                path: 'all',
                query: undefined
              // body: {
              //   'transformation': 'limit:30000'
              //
              // }
              },
              callback: function (val) {
                val = JSON.parse(JSON.stringify(val))
                debug('from query changes', val)
              }
            }
          }
        }
      }
    ]
  },

  data () {
    return {

      id: 'all',
      path: 'all',

      components: {}
    }
  },

  watch: {
    '$route': function (val) {
      debug('ROUTE %o', val)
    }
  },

  created: function () {
    debug('ROUTE %o', this.$route)
    if (this.$route.query && Object.getLength(this.$route.query) > 0) {
      let components = Object.clone(this.$options.components_query)
      Object.each(components, function (data, component) {
        Array.each(data, function (value, index) {
          value.source.requests.once.params.query = this.$route.query
        }.bind(this))

        debug('DATA %o', data)
        this.$set(this.components, component, data)
      }.bind(this))
    } else {
      Object.each(this.$options.components, function (data, component) {
        this.$set(this.components, component, data)
      }.bind(this))
    }
  },

  methods: {

    /**
  * @start pipelines
  **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      let template = Object.clone(RootPipeline)

      let pipeline_id = template.input[0].poll.id

      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)

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
