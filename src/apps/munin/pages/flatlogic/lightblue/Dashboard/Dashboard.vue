<template>
  <div class="dashboard-page">
    <h1 class="page-title">Munin &nbsp;
      <small>
        <small>The Lucky One</small>
      </small>
    </h1>

    <template v-for="(group, index) in groups">
      <b-row :key="index" v-if="!host || group.host === host">
        <b-col lg="12">
          <input-table-group :group="group"/>
        </b-col>
      </b-row>
    </template>

    <router-view :key="$route.fullPath"></router-view>

  </div>
</template>

<script>
import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:pages:flatlogic:lightblue:Dashboard:Dashboard')

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

const MINUTE = 60000

export default {
  mixins: [ DataSourcesMixin ],

  name: 'MuninDashboard',
  components: {
    // StatsCard,
    // Widget,
    // Map,
    // AnimatedNumber,
    // AreaChart
  },

  start_components: {
    'all': [
      {
        source: {
          requests: {
            // TEST register periodical
            once: [
              {
                params: {
                  path: 'all',
                  // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
                  query: {
                    from: 'munin',
                    index: 'host',
                    'q': [
                      { 'metadata': ['host', 'timestamp'] }
                    ],
                    'aggregation': 'max'
                  }

                },
                callback: function (data, metadata, key, vm) {
                  debug('All callback TEST %o %o %o', data, metadata, vm.$options.pipelines['input.munin'].get_input_by_id('input.munin'))

                  let components = {}

                  Object.each(data.munin, function (group, index) {
                    components[group.metadata.host] = Object.clone(vm.$options.per_host_component)
                    components[group.metadata.host].source.requests.once[0].params.range = 'posix ' + (group.metadata.timestamp - MINUTE) + '-' + group.metadata.timestamp + '/*'
                    components[group.metadata.host].source.requests.once[0].params.query.filter.metadata.host = group.metadata.host
                  })

                  vm.components = components
                  // vm.components = Object.merge(Object.clone(vm.components), components)

                  // Object.each(data.munin, function (group, index) {
                  //   vm.$set(vm.groups, index, group)
                  // })

                  // vm.$set(vm.components.all[0].source.requests, 'periodical', [vm.$options.periodical_component])
                  // debug('All callback COMPONENTS %o', vm.components, vm.$options.pipelines['input.munin'].get_input_by_id('input.munin'))

                  // vm.destroy_pipelines()
                  // vm.create_pipelines()

                  vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
                  vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
                }
              }
            ]
            // periodical: []

          }
        }
      }

      // {
      //   source: {
      //     requests: {
      //       // TEST register periodical
      //       once: [
      //         {
      //           params: {
      //             path: 'all',
      //             range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      //             query: {
      //               from: 'munin',
      //               index: 'host'
      //             }
      //
      //           },
      //           callback: function (data, metadata, key, vm) {
      //             debug('All callback TEST %o', data, metadata, vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0])
      //
      //             Object.each(data.munin, function (group, index) {
      //               vm.$set(vm.groups, index, group)
      //             })
      //
      //             // vm.$set(vm.components.all[0].source.requests, 'periodical', [vm.$options.periodical_component])
      //             // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
      //             // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
      //           }
      //         }
      //       ],
      //       periodical: []
      //
      //     }
      //   }
      // }

    ]
  },

  per_host_component: {
    source: {
      requests: {
        // TEST register periodical
        once: [{
          params: {
            path: 'all',
            // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
            range: undefined,
            query: {
              from: 'munin',
              index: 'host',
              'filter': { 'metadata': { 'host': undefined } }
            }

          },
          callback: function (data, metadata, key, vm) {
            // if (data && data.munin && data.munin.length === 1) {
            debug('GROUP DATA %o', data, metadata)
            // vm.groups.push(data.munin[0])
            let host = data.munin[0].host

            vm.$set(vm.groups, host, data.munin[0])
            let periodical = Object.clone(vm.$options.per_host_component_periodical)

            periodical.host = host
            vm.$set(vm.components, host + '_periodical', periodical)

            vm.__bind_components_to_sources(vm.components)
            vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
            vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
          }
        }]
      }
    }
  },

  per_host_component_periodical: {
    host: undefined,
    source: {
      requests: {
        // TEST register periodical
        // once: [{
        //   params: {
        //     path: 'all',
        //     // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
        //     range: undefined,
        //     query: {
        //       from: 'munin',
        //       index: 'host',
        //       'filter': { 'metadata': { 'host': undefined } }
        //     }
        //
        //   },
        //   callback: function (data, metadata, key, vm) {
        //     // if (data && data.munin && data.munin.length === 1) {
        //     debug('GROUP DATA %o', data)
        //     vm.groups.push(data.munin[0])
        //     // }
        //     // Object.each(tables, function (data, table) {
        //     //   vm.$set(vm.tables, table, data)
        //     // })
        //   }
        // }],
        periodical: [{
          params: function (_key, vm) {
            debug('PERIODICAL %o', this)

            const MINUTE = 60000

            let source
            let key

            if (!_key) {
              key = [this.host + '.periodical.range']
            }

            // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

            if (
              _key
            ) {
              source = [{
                params: { id: _key },
                path: 'all',
                range: 'posix ' + (Date.now() - MINUTE) + '-' + Date.now() + '/*',
                query: {
                  from: 'munin',
                  index: 'host',
                  'filter': { 'metadata': { 'host': this.host } }
                }
              }]
            }

            debug('PERIODICAL KEY %s %o', key, source)

            return { key, source }
          },
          callback: function (data, metadata, key, vm) {
            debug('PERIODICAL CALLBACK %o %o', data, metadata)

            let host = data.munin[0].host

            vm.$set(vm.groups, host, data.munin[0])

            // Object.each(data.munin, function (plugin, name) {
            //   // if(!vm.plugins[name]) vm.$set(vm.plugins, name, {})
            //   vm.$set(vm.plugins, name, plugin)
            // })
            // // vm.$set(vm.munin, data.munin)
            // //
            // // // Object.each(data., function (data, table) {
            // // //   vm.$set(vm.munin, table, data)
            // // // })
            // //
            // // vm.$set(vm.components, 'periodical', )
            // // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
            // // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
          }
        }]
      }
    }
  },

  data () {
    return {
      id: 'all',
      path: 'all',

      groups: {},
      // tables: {},
      // tables_feeds: {},

      components: {}
    }
  },
  watch: {
    '$route': function (val) {
      debug('ROUTE %o', val)
    }
  },
  mounted: function () {
    debug('ROUTE %o', this.$route)
  },
  computed: {
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  },
  methods: {

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o', Pipeline)

      this.components = this.$options.start_components

      let template = Object.clone(Pipeline)

      let pipeline_id = template.input[0].poll.id

      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)

      let pipe = new JSPipeline(template)

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

}
</script>

<style src="./Dashboard.scss" lang="scss" />
