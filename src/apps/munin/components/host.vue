<template>
  <div>
  <template v-for="(plugin, name) in plugins">
    <b-row :key="name">
      <b-col lg="12">
        <munin-dygraph :id="name" :data="plugin" :config="plugins_config[name]"/>
        <!-- :feed="(tables_feeds[`${table}`]) ? tables_feeds[`${table}`] : []" -->
      </b-col>
    </b-row>
  </template>
</div>
</template>

<script>
// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:components:host')

//

let moment = require('moment')

import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
import StatsCard from '@apps/root/components/creativetim/argon/StatsCard'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

const MAX_FEED_DATA = 10

export default {
  mixins: [DataSourcesMixin],

  name: 'Host',
  // components: { GridView, Widget, StatsCard },
  components: { Widget, StatsCard },

  config_component_req: {
    params: {
      path: 'all',
      // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
      query: {
        'from': 'munin',
        'index': false,

        'q': [
          // 'id',
          'config'
        ],
        'transformation': [
          { 'orderBy': { 'index': 'r.desc(timestamp)' } },
          'slice:0:1'
        ],
        'filter': [{ 'metadata': { 'host': undefined } }, { 'metadata': { 'path': undefined } }]
      }

    },
    callback: function (data, metadata, key, vm) {
      // debug('CONFIG %o %o', data, metadata)
      let host = metadata.filter[0].metadata.host
      let name = metadata.filter[1].metadata.path
      let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined

      vm.$set(vm.plugins_config, name, config)

      // let components = {}
      //
      // Object.each(data.munin, function (group, index) {
      //   components[group.metadata.host] = Object.clone(vm.$options.per_host_component)
      //   components[group.metadata.host].source.requests.once[0].params.range = 'posix ' + (group.metadata.timestamp - MINUTE) + '-' + group.metadata.timestamp + '/*'
      //   components[group.metadata.host].source.requests.once[0].params.query.filter.metadata.host = group.metadata.host
      // })
      // vm.components = components
      // // Object.each(data.munin, function (group, index) {
      // //   vm.$set(vm.groups, index, group)
      // // })
      //
      // // vm.$set(vm.components.all[0].source.requests, 'periodical', [vm.$options.periodical_component])
      // // debug('All callback COMPONENTS %o', vm.components, vm.$options.pipelines['input.munin'].get_input_by_id('input.munin'))
      // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
      //
      // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
    }
  },

  range_component: {
    params: function (_key, vm) {
      debug('PERIODICAL %o %o', _key, vm)

      const MINUTE = 60000

      let source
      let key

      if (!_key) {
        key = ['munin.periodical.range']
      }

      // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

      if (
        _key
      ) {
        source = [{
          params: { id: _key },
          path: 'all',
          range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
          query: {
            'from': 'munin',
            // 'register': 'changes',
            'format': 'tabular',
            'index': false,
            /**
            * right now needed to match OUTPUT 'id' with this query (need to @fix)
            **/
            'q': [
              // {
              //   'metadata': [
              //     'timestamp',
              //     'path'
              //   ]
              // },
              // 'metadata',
              'data'
            ],
            'transformation': [
              {
                'orderBy': { 'index': 'r.desc(timestamp)' }
              }
            ],
            'filter': { 'metadata': { 'host': vm.host } }

          }
        },
        {
          params: { id: _key },
          path: 'all',
          range: 'posix ' + (Date.now() - (6 * MINUTE)) + '-' + Date.now() + '/*',
          query: {
            'from': 'munin_historical',
            // 'register': 'changes',
            'format': 'tabular',
            'index': false,
            /**
            * right now needed to match OUTPUT 'id' with this query (need to @fix)
            **/
            'q': [
              // {
              //   'metadata': [
              //     'timestamp',
              //     'path'
              //   ]
              // },
              // 'metadata',
              'data'
            ],
            'transformation': [
              {
                'orderBy': { 'index': 'r.desc(timestamp)' }
              }
            ],
            'filter': [
              { 'metadata': { 'host': vm.host } },
              { 'metadata': { 'type': 'minute' } }
            ]

          }
        }]
      }

      // debug('MyChart periodical KEY ', key, source)

      return { key, source }
    },
    callback: function (data, metadata, key, vm) {
      // debug('PERIODICAL HOST CALLBACK %o %o', data, metadata)

      if (data.munin) {
        Object.each(data.munin, function (plugin, name) {
          if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
          vm.$set(vm.plugins[name], 'periodical', plugin)

          if (!vm.plugins_config[name]) {
            let config_comp_req = Object.clone(vm.$options.config_component_req)

            config_comp_req.params.query.filter[0].metadata.host = metadata.filter.metadata.host
            config_comp_req.params.query.filter[1].metadata.path = name
            debug('CONFIG_COMP %o', config_comp_req)
            vm.$set(vm.components, name, {
              source: {
                requests: {
                  once: [
                    config_comp_req
                  ]
                }
              }
            })
          }
        })

        // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].options.requests.once = vm.__components_sources_to_requests(vm.components).once
        // // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnceRequestsUpdated')
        // vm.$options.pipelines[vm.host].get_input_by_id(vm.host).conn_pollers[0].fireEvent('onOnce')
        vm.destroy_pipelines()
        vm.create_pipelines()
      } else if (data.munin_historical) {
        Object.each(data.munin_historical, function (plugin, name) {
          if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
          vm.$set(vm.plugins[name], 'minute', plugin)
        })
      }

      // vm.$set(vm.munin, data.munin)
      //
      // // Object.each(data., function (data, table) {
      // //   vm.$set(vm.munin, table, data)
      // // })
      //
      // vm.$set(vm.components, 'periodical', )
      // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].options.requests = vm.__components_sources_to_requests(vm.components)
      // vm.$options.pipelines['input.root'].get_input_by_id('input.root').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
    }
  },

  data () {
    return {
      id: 'all',
      path: 'all',

      // munin: [],
      plugins: {},
      plugins_config: {},

      components: {
        range: {
          source: {
            requests: {
              once: [],
              periodical: []
            }
          }
        }

      }
    }
  },

  watch: {

  },
  methods: {

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines %o %o %o', Object.clone(Pipeline), this.$options.__pipelines_cfg, this.components)

      let template = Object.clone(Pipeline)

      let pipeline_id = template.input[0].poll.id = this.host
      // let pipeline_id = this.host

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
        this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], pipeline_id, function () {
          debug('__resume_pipeline CALLBACK %s', pipeline_id)
          // pipe.fireEvent('onOnce')
        }], this)
      )

      this.$options.pipelines[pipeline_id] = pipe
      // pipe.fireEvent('onOnce')

      if (next) { next() }
    }

    // create_pipelines: function (next) {
    //   debug('create_pipelines %o', this.$options.pipelines['input.munin'])
    //
    //   if (this.$options.pipelines['input.munin'] && this.$options.pipelines['input.munin'].get_input_by_id('input.munin')) {
    //     let requests = this.__components_sources_to_requests(this.components)
    //     if (requests.once) {
    //       this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests.once.combine(requests.once)
    //       this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
    //     }
    //
    //     if (requests.periodical) {
    //       this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests.periodical.combine(requests.periodical)
    //       this.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
    //     }
    //   } else {
    //     let template = Object.clone(Pipeline)
    //
    //     let pipeline_id = template.input[0].poll.id
    //
    //     template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
    //
    //     let pipe = new JSPipeline(template)
    //
    //     this.$options.__pipelines_cfg[pipeline_id] = {
    //       ids: [],
    //       connected: [],
    //       suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
    //     }
    //
    //     this.__after_connect_inputs(
    //       pipe,
    //       this.$options.__pipelines_cfg[pipeline_id],
    //       this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
    //         debug('__resume_pipeline CALLBACK')
    //         pipe.fireEvent('onOnce')
    //       }], this)
    //     )
    //
    //     this.$options.pipelines[pipeline_id] = pipe
    //
    //     if (next) { next() }
    //   }
    // }

    /**
    * @end pipelines
    **/

  },
  computed: {
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  },
  // computed: {
  //
  // //   count: function () {
  // //     let result = 0
  // //     Array.each(this.groups, function (group) {
  // //       result += group.count
  // //     })
  // //
  // //     return result
  // //   }
  // },
  created: function () {
    debug('mounted HOST %s %o %o', this.host, this.$options.range_component, this.$options.__pipelines_cfg)
    // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.host = this.host
    // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.host = this.host
    // this.$set(this.components, 'range', this.$options.range_component)
    // this.$set(this.components, 'feed', this.$options.feed_component)
    // this.components.range.source.requests.once.push(this.$options.range_component)

    this.components.range.source.requests.periodical.push(this.$options.range_component)
  }

}
</script>
