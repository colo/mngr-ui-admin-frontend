<template>
  <div>
  <template v-for="plugin in plugins">
    <b-row :key="plugin">
      <b-col lg="12">
        <munin-dygraph :id="plugin" :host="host"/>
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

  paths_component: {
    params: function (_key, vm) {
      debug('paths_component %o %o', _key, vm)

      const MINUTE = 60000

      let source
      let key

      if (!_key) {
        key = ['munin.host.paths']
      }

      // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

      if (
        _key
      ) {
        source = [{
          params: { id: _key },
          path: 'all',
          // range: 'posix ' + (Date.now() - (5 * MINUTE)) + '-' + Date.now() + '/*',
          query: {
            'from': 'munin',
            'params': { 'prop': 'paths' },
            // 'q': [
            // ],
            // 'transformation': [
            // ],
            'index': 'host',
            'filter': { 'metadata': { 'host': vm.host } }

          }
        }]
      }

      debug('MyChart periodical KEY ', key, source)

      return { key, source }
    },
    callback: function (data, metadata, key, vm) {
      if (data.munin && data.munin.length > 0 && data.munin[0].paths) {
        Array.each(data.munin[0].paths, function (path) {
          if (!vm.plugins.contains(path)) {
            debug('paths_component CALLBACK %s', path)
            vm.plugins.push(path)
          }
        })
        // vm.plugins = data.munin[0].paths
      }
    }
  },

  data () {
    return {
      id: 'all',
      path: 'all',

      // munin: [],
      plugins: [],
      // plugins_config: {},

      components: {
        paths: {
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
      debug('create_pipelines')

      let template = Object.clone(Pipeline)

      // let pipeline_id = template.input[0].poll.id
      let pipeline_id = this.host

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
          debug('__resume_pipeline CALLBACK %s', pipeline_id)
          // pipe.fireEvent('onOnce')
        }], this)
      )

      this.$options.pipelines[pipeline_id] = pipe
      // pipe.fireEvent('onOnce')

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/

  },
  computed: {
    'host': function () {
      return (this.$route && this.$route.params && this.$route.params.host) ? this.$route.params.host : undefined
    }
  },
  created: function () {
    debug('created HOST %s %o %o', this.host, this.$options.paths_component, this.$options.__pipelines_cfg)
    // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.host = this.host
    // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.host = this.host
    // this.$set(this.components, 'range', this.$options.range_component)
    // this.$set(this.components, 'feed', this.$options.feed_component)
    // this.components.range.source.requests.once.push(this.$options.range_component)
    this.components.paths.source.requests.periodical.push(this.$options.paths_component)
  }

}
</script>
