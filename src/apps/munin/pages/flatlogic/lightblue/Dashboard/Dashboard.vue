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

  periodical_component: {
    params: {
      path: 'all'
    },
    callback: function (tables, metadata, key, vm) {
      debug('All callback', tables)

      Object.each(tables, function (data, table) {
        vm.$set(vm.tables, table, data)
      })
    }
  },

  data () {
    return {
      id: 'all',
      path: 'all',

      groups: [],
      // tables: {},
      // tables_feeds: {},

      components: {
        'all': [
          {
            source: {
              requests: {
                // TEST register periodical
                once: [
                  {
                    params: {
                      path: 'all',
                      query: {
                        from: 'munin',
                        index: 'host'
                      }
                      // query: {
                      //   // from: 'os',
                      //   register: 'periodical'
                      //   // 'q': [
                      //   //   // { 'data': ['log'] },
                      //   //   'metadata'
                      //   // ],
                      //   // 'transformation': [
                      //   //   { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      //   //   'slice:0:9'
                      //   // ]
                      // }

                    },
                    callback: function (data, metadata, key, vm) {
                      debug('All callback TEST %o', data, metadata, vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0])

                      Object.each(data.munin, function (group, index) {
                        vm.$set(vm.groups, index, group)
                      })

                      // vm.$set(vm.components.all[0].source.requests, 'periodical', [vm.$options.periodical_component])
                      // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
                      // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
                    }
                  }
                ],
                periodical: []

              }
            }
          }

        ]
      }
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
      debug('create_pipelines')

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
