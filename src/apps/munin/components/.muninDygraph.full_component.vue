<template>
  <Widget
    v-if="config && processed_data"
    class="bg-transparent"
    :title="'<h5>Table <span class=\'fw-semi-bold\'>&nbsp;'+title+'</span></h5>'"
    settings refresh close customHeader
  >
    <!-- <p>Status: <strong>Live</strong></p> -->
    <p>{{info}}</p>
    <p>
      <span class="circle bg-warning text-white"><i class="fa fa-hashtag" /></span> &nbsp;
      <!-- {{count}} -->
    </p>

    <component
      :is="tabular === false ? 'chart' : 'chart-tabular'"
      :wrapper="{
        type: 'dygraph'
      }"
      :always_update="true"
      :ref="id"
      :id="id"
      :EventBus="eventbus"
      :stat="{
        length: 300,
        data: [processed_data]
      }"
      :chart="chart"
    >
    </component>
    <!-- :dashboard="host" -->
    <!-- :wrapper="chart.wrapper" -->
    <!-- :always_update="graph_always_update" -->
    <!-- :chart="chart.chart"
    :stat="{
      range: range,
      length: chart.stat.length,
      merged: chart.stat.merged,
      data: chart.stat.sources ? chart.stat.sources.map(function(source){ return $store.state[source.type+'_sources'][source.path]}) : chart.stat.data
    }" -->

    <!-- <q-list class="rounded-borders col-12">
      <q-expansion-item
        expand-separator
        icon="add_circle_outlined"
        label="Data"
        caption="live"
        default-opened
      >
        <q-table
          :pagination.sync="feed_pagination"
          flat
          dense
          hide-bottom
          :data="feed_data"
          :columns="feed_columns"
          row-key="name"
          card-class="transparent"
        />

        <q-separator />
        <q-card class="transparent">
          <q-card-section>
            <input-table-groups-chart :id="table" :data="groups_chart_data"/>
          </q-card-section>
        </q-card>

      </q-expansion-item>

    </q-list> -->

    <!-- <q-list bordered class="rounded-borders col-12" >

      <q-expansion-item
        expand-separator
        icon="add_circle_outlined"
        label="Groups"
      >
      <template v-for="(group, index) in groups">
          <input-table-group :key="index" :group="group"/>
      </template>
    </q-expansion-item>

    </q-list> -->

  </Widget>
</template>

<script>
// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:munin:components:muninDygraph')

import { EventBus } from '@libs/eventbus'

// import chart from '@components/chart'
import chartTabular from '@components/chart.tabular'

import dygraph_line_chart from 'mngr-ui-admin-charts/defaults/dygraph.line'

// // import AdminLteMixin from '@components/mixins/adminlte'
// import DataSourcesMixin from '@components/mixins/dataSources'
//
// import GridView from '@components/gridView'
//
// // import Test from '@components/test/test.vue'
//
// import Pipeline from 'js-pipeline'
// import Pipeline from '../pipelines/index'
//

let moment = require('moment')

import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
import StatsCard from '@apps/munin/components/creativetim/argon/StatsCard'

import DataSourcesMixin from '@components/mixins/dataSources'

import JSPipeline from 'js-pipeline'
import Pipeline from '@apps/munin/pipelines/index'

const MAX_FEED_DATA = 10

const roundMilliseconds = function (timestamp) {
  let d = new Date(timestamp)
  d.setMilliseconds(0)

  return d.getTime()
}

const roundSeconds = function (timestamp) {
  timestamp = roundMilliseconds(timestamp)
  let d = new Date(timestamp)
  d.setSeconds(0)

  return d.getTime()
}

const roundMinutes = function (timestamp) {
  timestamp = roundSeconds(timestamp)
  let d = new Date(timestamp)
  d.setMinutes(0)

  return d.getTime()
}
const roundHours = function (timestamp) {
  timestamp = roundMinutes(timestamp)
  let d = new Date(timestamp)
  d.setHours(0)

  return d.getTime()
}

const SECOND = 1000
const MINUTE = 60 * SECOND

export default {
  mixins: [DataSourcesMixin],

  name: 'muninDygraph',
  // components: { GridView, Widget, StatsCard },
  components: { Widget, StatsCard, chartTabular },

  // pipelines: {},
  props: {
    id: {
      type: String,
      default: undefined
    },
    host: {
      type: String,
      default: undefined
    },
    tabular: {
      type: Boolean,
      default: true
    }

  },

  once_reqs: [
    {
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
          'filter': [{ 'metadata': { 'host': null } }, { 'metadata': { 'path': null } }]
        }

      },
      callback: function (data, metadata, key, vm) {
        debug('CONFIG %o %s %s', data, vm.host, vm.id)
        // let host = metadata.filter[0].metadata.host
        // let name = metadata.filter[1].metadata.path
        let config = (data && data.munin && data.munin[0] && data.munin[0].config) ? data.munin[0].config : undefined

        vm.config = config
      }
    }
  ],
  periodical_reqs: [
    {
      params: function (_key, vm) {
        // debug('PERIODICAL %o %o', _key, vm)

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
              'filter': [{ 'metadata': { 'host': this.host } }, { 'metadata': { 'path': this.path } }]

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
                { 'metadata': { 'host': this.host } },
                { 'metadata': { 'path': this.path } },
                { 'metadata': { 'type': 'minute' } }
              ]

            }
          }]
        }

        // debug('MyChart periodical KEY ', key, source)

        return { key, source }
      },
      callback: function (data, metadata, key, vm) {
        if (vm.id === 'munin.cpu') { debug('PERIODICAL HOST CALLBACK %o %o', data, metadata) }

        if (data.munin && data.munin[vm.id]) {
          vm.$set(vm.data, 'periodical', data.munin[vm.id])
          // Object.each(data.munin, function (plugin, name) {
          //   // if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
          //   vm.$set(vm.plugins[name], 'periodical', plugin)
          //
          //   if (!vm.plugins_config[name]) {
          //     let config_comp_req = Object.clone(vm.$options.config_component_req)
          //
          //     config_comp_req.params.query.filter[0].metadata.host = metadata.filter.metadata.host
          //     config_comp_req.params.query.filter[1].metadata.path = name
          //     debug('CONFIG_COMP %o', config_comp_req)
          //     vm.$set(vm.components, name, {
          //       source: {
          //         requests: {
          //           once: [
          //             config_comp_req
          //           ]
          //         }
          //       }
          //     })
          //
          //     // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].options.requests.once = vm.__components_sources_to_requests(vm.components).once
          //     // vm.$options.pipelines['input.munin'].get_input_by_id('input.munin').conn_pollers[0].fireEvent('onOnceRequestsUpdated')
          //   }
          // })
        } else if (data.munin_historical && data.munin_historical[vm.id]) {
          vm.$set(vm.data, 'minute', data.munin_historical[vm.id])
          // Object.each(data.munin_historical, function (plugin, name) {
          //   if (!vm.plugins[name]) vm.$set(vm.plugins, name, { periodical: undefined, minute: undefined })
          //   vm.$set(vm.plugins[name], 'minute', plugin)
          // })
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
    }
  ],

  data () {
    return {
      // id: 'munin',
      path: 'all',

      config: undefined,
      data: { periodical: undefined, minute: undefined },

      components: {
        all: {
          source: {
            requests: {
              once: [],
              periodical: []
            }
          }
        }

      },

      processed_data: [],
      eventbus: EventBus,
      chart: Object.clone(dygraph_line_chart)

    }
  },
  watch: {
    'data': {
      handler: function (val) {
        if (this.config && Object.getLength(this.config) > 0) {
          val = JSON.parse(JSON.stringify(val))

          debug('data watch %s %o', this.id, JSON.parse(JSON.stringify(this.config)), JSON.parse(JSON.stringify(val.periodical)))
          let periodical = val.periodical
          let minute = val.minute

          this.$set(this.chart.options, 'labels', ['Time'])

          if (this.config.graph && this.config.graph.args) {
            let args = this.config.graph.args.split(' ')
            Array.each(args, function (arg) {
              if (arg === '--logarithmic') { this.$set(this.chart.options, 'logscale', true) }
            }.bind(this))
          }

          let processed_data = []
          let negative_key
          let cdefs = []

          let index = 0
          Object.each(periodical, function (arr, key) {
            let key_config = this.config[key]
            let label = (key_config && key_config.label) ? key_config.label : key
            this.chart.options.labels.push(label)

            if (key_config.negative) { negative_key = key_config.negative.replace('_', '') }

            if (key_config.cdef) { cdefs.push(key_config.cdef) }

            /**
            * if at least one is STAKED, dygraph.options.stackedGraph === true
            **/
            this.$set(this.chart.options, 'stackedGraph', (this.chart.options.stackedGraph && this.chart.options.stackedGraph === true)
              ? this.chart.options.stackedGraph
              : !!((key_config && key_config.draw && key_config.draw === 'STACK'))
            )

            if (this.chart.options.stackedGraph === true) {
              this.$set(this.chart.options, 'fillGraph', true)
              this.$set(this.chart.options, 'fillAlpha', 0.5)
            }
            if (key_config.min) {
              if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
              this.$set(this.chart.options.valueRange, 0, (this.chart.options.valueRange && this.chart.options.valueRange[0] && this.chart.options.valueRange[0] < key_config.min) ? this.chart.options.valueRange[0] : key_config.min)
            }

            if (key_config.max) {
              if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
              this.$set(this.chart.options.valueRange, 1, (this.chart.options.valueRange && this.chart.options.valueRange[1] && this.chart.options.valueRange[1] > key_config.max) ? this.chart.options.valueRange[1] : key_config.max)
            }

            // debug('data watch STAKED %s %o', this.id, this.chart, key_config.draw)

            if (index === 0) {
              processed_data = Array.clone(arr)
            } else {
              Array.each(processed_data, function (row, i) {
                let timestamp = row[0]
                if (arr[i][0] === timestamp) {
                  // arr[i][0] = undefined
                  // arr[i] = arr[i].clean()
                  // processed_data[i].combine(arr[i])
                  processed_data[i].push(arr[i][1])
                }
                // else {
                //   processed_data[i].combine([timestamp, 0])
                // }
              })
            }

            /**
            * 'munin_historical tabular' order
            * "timestamp": 0,
            * "max": 3966 ,
            * "mean": 3944 ,
            * "median": 3945 ,
            * "min": 3919 ,
            * "mode": 3919 ,
            * "range": 47 ,
            * "sum": 23664
            **/

            // debug('MINUTE %o', minute)

            if (minute && minute[key] && Array.isArray(minute[key]) && minute[key].length > 0) {
              if (!this.chart.options.labels.contains(label + '(median)')) {
                this.chart.options.labels.push(label + '(median)')
              }

              let index = this.chart.options.labels.indexOf(label + '(median)')
              let last

              Array.each(processed_data, function (row, i) {
                let timestamp = row[0]
                let added_minute = false

                Array.each(minute[key], function (minute_row) {
                  let minute_row_timestamp = minute_row[0]
                  // debug('TIMESTAMPs %s %s', new Date(roundSeconds(minute_row_timestamp)), new Date(roundSeconds(timestamp)))

                  if (roundSeconds(minute_row_timestamp) === roundSeconds(timestamp) - MINUTE) {
                    processed_data[i][index] = minute_row[3] // median
                    added_minute = true
                  }

                  last = minute_row[3]
                })

                if (added_minute === false) { processed_data[i][index] = last }
              })
            }

            index++
          }.bind(this))

          Object.each(periodical, function (arr, key) {
            let key_config = this.config[key]
            if (key_config.type && (key_config.type === 'DERIVE')) {
              let label = (key_config && key_config.label) ? key_config.label : key

              let index = this.chart.options.labels.indexOf(label)

              if (index > -1) {
                let prev = 0
                // Array.each(processed_data, function (row, i) {
                for (let i = 0; i < processed_data.length; i++) {
                  let row = processed_data[i]

                  if (i === processed_data.length - 1) {
                    processed_data[i][index] = 0
                  } else {
                    processed_data[i][index] = row[index] - processed_data[i + 1][index]
                  }

                // })
                }
              }

              let median_index = this.chart.options.labels.indexOf(label + '(median)')

              if (median_index > -1) {
                let prev = 0
                // Array.each(processed_data, function (row, i) {
                for (let i = 0; i < processed_data.length; i++) {
                  let row = processed_data[i]

                  if (i === processed_data.length - 1) {
                    processed_data[i][median_index] = 0
                  } else {
                    processed_data[i][median_index] = row[median_index] - processed_data[i + 1][median_index]
                  }

                // })
                }
              }
            }
          }.bind(this))

          /**
          * now that we now if there is a negative key, find it and make values negative
          **/
          if (negative_key) {
            // index = 0
            // Object.each(periodical, function (arr, key) {
            // if (negative_key === key) {
            let key_config = this.config[negative_key]
            if (key_config.max) {
              if (!this.chart.options.valueRange) this.$set(this.chart.options, 'valueRange', [])
              this.$set(this.chart.options.valueRange, 0, (this.chart.options.valueRange && this.chart.options.valueRange[0] && this.chart.options.valueRange[0] < (key_config.max * -1)) ? this.chart.options.valueRange[0] : (key_config.max * -1))
            }

            let label = (key_config && key_config.label) ? key_config.label : negative_key

            let index = this.chart.options.labels.indexOf(label)

            if (index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][index] = row[index] * -1
              })
            }

            let median_index = this.chart.options.labels.indexOf(label + '(median)')

            if (median_index > -1) {
              Array.each(processed_data, function (row, i) {
                processed_data[i][median_index] = row[median_index] * -1
              })
            }
            // }
            // }.bind(this))
          }

          /**
          * process cdefs
          **/
          let cdef_data = function (cdef, value) {
            let num = cdef.split(',')[1]
            let op = cdef.split(',')[2]
            // debug('cdef VALUE OP NUM %s %s %s', value, op, num)
            switch (op) {
              case '/': return value / num
              case '*': return value * num
              default: return value
            }
          }

          Array.each(cdefs, function (cdef) {
            if (cdef.split(',').length === 3) {
              let cdef_key = cdef.split(',')[0]

              let key_config = this.config[cdef_key]
              let label = (key_config && key_config.label) ? key_config.label : negative_key

              let index = this.chart.options.labels.indexOf(label)

              if (index > -1) {
                Array.each(processed_data, function (row, i) {
                  processed_data[i][index] = cdef_data(cdef, row[index])
                  // debug('cdef data %d %d', processed_data[i][index], row[index])
                })
              }

              let median_index = this.chart.options.labels.indexOf(label + '(median)')

              if (median_index > -1) {
                Array.each(processed_data, function (row, i) {
                  processed_data[i][median_index] = cdef_data(cdef, row[median_index])
                })
              }
            }
          }.bind(this))

          this.processed_data = processed_data
          // }

          // // Object.each(plugin, function (pl_data, prop) {
          // //       if (data.munin_historical[name]) {
          // //         let historical_data = data.munin_historical[name][prop]
          // //         debug('PERIODICAL HOST CALLBACK median %s %s %o %o', name, prop, historical_data, pl_data)
          // Array.each(pl_data, function (pl_data_row, index) {
          //   let timestamp = pl_data_row[0]
          //   Array.each(historical_data, function (historical_data_row) {
          //     let historical_data_timestamp = historical_data_row[0]
          //     if (roundSeconds(historical_data_timestamp) === historical_data_timestamp(timestamp)) {
          //
          //     }
          //   })
          // })
          // //       }
          // //     })
        }
      },
      deep: true
    }
  },

  methods: {

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      let template = Object.clone(Pipeline)

      // let pipeline_id = template.input[0].poll.id
      let pipeline_id = this.host + '.' + this.id

      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)

      debug('create_pipelines %s %o', this.host + '.' + this.id, template)

      let pipe = new JSPipeline(template)

      this.$options.__pipelines_cfg[pipeline_id] = {
        ids: [],
        connected: [],
        suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
      }

      // this.__after_connect_inputs(
      //   pipe,
      //   this.$options.__pipelines_cfg[pipeline_id],
      //   this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.id, function () {
      //     debug('__resume_pipeline CALLBACK %s', pipeline_id)
      //     // pipe.fireEvent('onOnce')
      //   }], this)
      // )

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
    title: function () {
      return (this.config.graph && this.config.graph.title) ? this.config.graph.title : this.name
    },
    info: function () {
      return (this.config.graph && this.config.graph.info) ? this.config.graph.info : ''
    }
  },
  mounted: function () {
    debug('mounted', this.id)
  },
  created: function () {
    // this.$options.range_component.source.requests.once[0].params.query.filter.metadata.host = this.host
    // this.$options.feed_component.source.requests.periodical[0].params.query.filter.metadata.host = this.host
    // this.$set(this.components, 'range', this.$options.range_component)
    // this.$set(this.components, 'feed', this.$options.feed_component)
    // this.components.range.source.requests.once.push(this.$options.range_component)
    this.components.all.host = this.host
    this.components.all.path = this.id
    let once_reqs = Array.clone(this.$options.once_reqs)
    let periodical_reqs = Array.clone(this.$options.periodical_reqs)

    Array.each(once_reqs, function (req) {
      if (req.params && req.params.query && req.params.query.filter) {
        Array.each(req.params.query.filter, function (filter, index) {
          if (filter.metadata && filter.metadata.host === null) { req.params.query.filter[index].metadata.host = this.host }

          if (filter.metadata && filter.metadata.path === null) { req.params.query.filter[index].metadata.path = this.id }
        }.bind(this))
      }
      this.components.all.source.requests.once.push(req)
    }.bind(this))

    Array.each(periodical_reqs, function (req) {
      if (req.params && req.params.query && req.params.query.filter) {
        Array.each(req.params.query.filter, function (filter, index) {
          if (filter.metadata && filter.metadata.host === null) { req.params.query.filter[index].metadata.host = this.host }

          if (filter.metadata && filter.metadata.path === null) { req.params.query.filter[index].metadata.path = this.id }
        }.bind(this))
      }
      this.components.all.source.requests.periodical.push(req)
    }.bind(this))

    debug('created PLUGIN %s %s %o', this.host, this.id, this.components.all)
  }

}
</script>

<style>

.netdata-chart-alignment {
    margin-left: 55px;
}

.netdata-chart-row {
    width: 100%;
    text-align: center;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    align-items: flex-end;
    -moz-align-items: flex-end;
    -webkit-align-items: flex-end;
    justify-content: center;
    -moz--webkit-justify-content: center;
    -moz-justify-content: center;
    padding-top: 10px;
}

.netdata-container {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-gauge:after {
    padding-top: 60%;
    display: block;
    content: '';
}

.netdata-container-easypiechart {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-container-easypiechart:after {
    padding-top: 100%;
    display: block;
    content: '';
}

.netdata-aspect {
    position: relative;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.netdata-container-with-legend {
    display: inline-block;
    overflow: hidden;

    transform: translate3d(0,0,0);

    /* fix minimum scrollbar issue in firefox */
    min-height: 99px;

    /* required for child elements to have absolute position */
    position: relative;

    /* width and height is given per chart with data-width and data-height */
}

.netdata-legend-resize-handler {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 15px;
    width: 20px;
    background-color: #272b30;
    font-size: 15px;
    vertical-align: middle;
    line-height: 15px;
    cursor: ns-resize;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;
}

.netdata-legend-toolbox {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 15px;
    width: 110px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #373b40;
    text-align: center;
    overflow: hidden;
    z-index: 20;
    padding: 0px;
    margin: 0px;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-legend-toolbox-button {
    display: inline-block;
    position: relative;
    height: 15px;
    width: 18px;
    background-color: #272b30;
    font-size: 12px;
    vertical-align: middle;
    line-height: 15px;
    color: #474b50;
    text-align: center;
    overflow: hidden;
    z-index: 21;
    padding: 0px;
    margin: 0px;
    cursor: pointer;

    /* prevent text selection after double click */
    -webkit-user-select: none; /* webkit (safari, chrome) browsers */
    -moz-user-select: none; /* mozilla browsers */
    -khtml-user-select: none; /* webkit (konqueror) browsers */
    -ms-user-select: none; /* IE10+ */
}

.netdata-message {
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: left;
    vertical-align: top;
    font-weight: bold;
    font-size: x-small;
    overflow: hidden;
    background: inherit;
    z-index: 0;
}

.netdata-message.hidden {
    display: none;
}

.netdata-message.icon {
    color: #2f3338;
    text-align: center;
    vertical-align: middle;
}

.netdata-chart-legend {
    position: absolute; /* within .netdata-container */
    top: 0;
    right: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14px;
    display: block;
    width: 140px; /* --legend-width */
    height: calc(100% - 15px); /* 10px for the resize handler and 5px for the top margin */
    font-size: 11px;/* colo: 10 -> 11 */
    margin-top: 5px;
    text-align: left;
    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-legend-title-date {
    font-size: 10px;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-time {
    font-size: 11px;
    font-weight: bold;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-title-units {
    position: absolute;
    right: 10px;
    float: right;
    font-size: 11px;
    vertical-align: top;
    font-weight: normal;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.netdata-legend-series {
    position: absolute;
    width: 140px; /* legend-width */
    height: calc(100% - 50px);
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 14.5px; /* line spacing at the legend */
    display: block;
    font-size: 10px;
    margin-top: 0px;
}

.netdata-legend-name-table-line {
    display: inline-block;
    width: 13px;
    height: 4px;
    border-width: 0px;
    border-bottom-width: 2px;
    border-bottom-style: solid;
    border-bottom-color: #272b30;
}

.netdata-legend-name-table-area {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-table-stacked {
    display: inline-block;
    width: 13px;
    height: 5px;
    border-width: 1px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: inherit;
}

.netdata-legend-name-tr {
}

.netdata-legend-name-td {
}

.netdata-legend-name {
    text-align: left;
    font-size: 11px; /* legend: dimension name size */
    font-weight: bold;
    vertical-align: bottom;
    margin-top: 0px;
    z-index: 9;
    padding: 0px;
    width: 80px !important;
    max-width: 80px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    cursor: pointer;
    -webkit-print-color-adjust: exact;
}

.netdata-legend-value {
    /*margin-left: 14px;*/
    position: absolute;
    right: 10px;
    float: right;
    text-align: right;
    font-size: 11px; /* legend: dimension value size */
    font-weight: bold;
    vertical-align: bottom;
    background-color: #272b30;
    margin-top: 0px;
    z-index: 10;
    padding: 0px;
    padding-left: 15px;
    cursor: pointer;
    /* -webkit-font-smoothing: none; */
}

.netdata-legend-name.not-selected {
    font-weight: normal;
    opacity: 0.3;
}

.netdata-chart {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: inline-block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    z-index: 5;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-chart-with-legend-right {
    position: absolute; /* within .netdata-container */
    top: 0; /* within .netdata-container */
    left: 0; /* within .netdata-container */
    display: block;
    overflow: hidden;
    margin-right: 140px; /* --legend-width */
    width: calc(100% - 140px); /* --legend-width */
    height: 100%;
    z-index: 5;
    flex-grow: 1;

    /* width and height is calculated (depends on the appearance of the legend) */
}

.netdata-peity-chart {

}

.netdata-sparkline-chart {

}

.netdata-morris-chart {

}

.netdata-google-chart {

}

/* fix for sparkline tooltip under bootstrap */
.jqstooltip {
    width: auto !important;
    height: auto !important;
}

.easyPieChart {
    position: relative;
    text-align: center;
}

.easyPieChart canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.easyPieChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: normal;
    text-shadow: #272b30 0px 0px 1px;
    /* -webkit-font-smoothing: none; */
}

.easyPieChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 64%;
    margin-left: 18% !important;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.easyPieChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 60%;
    margin-left: 20% !important;
    text-align: center;
    color: #676b70;
    font-weight: normal;
}

.gaugeChart {
    position: relative;
    text-align: center;
}

.gaugeChart canvas {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 0;
}

.gaugeChartLabel {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #BBB;
    font-weight: bold;
    z-index: 1;
    text-shadow: #272b30 0px 0px 1px;
    /* text-shadow: #CCC 1px 1px 0px, #CCC -1px -1px 0px, #CCC 1px -1px 0px, #CCC -1px 1px 0px; */
    /* -webkit-text-stroke: 1px #777; */
    /* -webkit-font-smoothing: none; */
}

.gaugeChartTitle {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    width: 100%;
    text-align: center;
    color: #676b70;
    font-weight: bold;
}

.gaugeChartUnits {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: left;
    margin-left: 5%;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMin {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 92%;
    margin-left: 8%;
    text-align: left;
    color: #676b70;
    font-weight: normal;
}

.gaugeChartMax {
    display: inline-block;
    position: absolute;
    float: left;
    left: 0;
    bottom: 8%;
    width: 95%;
    margin-right: 5%;
    text-align: right;
    color: #676b70;
    font-weight: normal;
}

.popover-title {
    font-weight: bold;
    font-size: 12px;
}

.popover-content {
    font-size: 11px;
}

.netdata-dygraph-chart {

}
.dygraph-ylabel {
}

.dygraph-axis-label-x {
    overflow-x: hidden;
}

.dygraph-legend {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-axis-label {
    color: #6c7075;
    font-size: 11px;
}

.dygraph-label-rotate-left {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
}

/* For y2-axis label */
.dygraph-label-rotate-right {
    text-align: center;
    /* See http://caniuse.com/#feat=transforms2d */
    transform: rotate(-90deg);
    -webkit-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
}

.dygraph-title {
    text-indent: 56px;
    text-align: left;
    position: absolute;
    left: 0px;
    top: 4px;
    font-size: 11px;
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
