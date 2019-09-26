<template>
  <Widget
    class="bg-transparent"
    :title="'<h5>Table <span class=\'fw-semi-bold\'>&nbsp;'+table+'</span></h5>'"
    settings refresh close customHeader
  >
    <p>Status: <strong>Live</strong></p>
    <p>
      <span class="circle bg-warning text-white"><i class="fa fa-hashtag" /></span> &nbsp;
      {{count}}
    </p>

    <q-list class="rounded-borders col-12">
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
        <!-- hide-header -->
        <q-separator />
        <q-card class="transparent">
          <q-card-section>
            <input-table-groups-chart :id="table" :data="groups_chart_data"/>
          </q-card-section>
        </q-card>

      </q-expansion-item>

      <!-- <q-expansion-item
        expand-separator
        icon="add_circle_outlined"
        label="Groups"
        caption="stats"
        default-opened
      >
        <input-table-groups-chart :id="table" :data="groups_chart_data"/>

      </q-expansion-item> -->
    </q-list>

    <q-list bordered class="rounded-borders col-12" >
    <!-- <template v-for="(group, index) in groups"> -->

      <q-expansion-item
        expand-separator
        icon="add_circle_outlined"
        label="Groups"
      >
      <template v-for="(group, index) in groups">
      <!-- caption="live data" -->
        <!-- <q-card>
          <q-card-section> -->
      <!-- <b-row :key="index"> -->
        <!-- <b-col lg="16" md="12" xs="2"> -->
          <input-table-group :key="index" :group="group"/>
        <!-- </b-col> -->
      <!-- </q-card-section>
      </q-card> -->
      </template>
    </q-expansion-item>
      <!-- </b-row> -->

    </q-list>

  </Widget>
</template>

<script>
// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root:components:inputTable')

// // import AdminLteMixin from '@components/mixins/adminlte'
// import DataSourcesMixin from '@components/mixins/dataSources'
//
// import GridView from '@components/gridView'
//
// // import Test from '@components/test/test.vue'
//
// import Pipeline from 'js-pipeline'
// import RootPipeline from '../pipelines/index'
//

let moment = require('moment')

import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
import StatsCard from '@apps/root/components/creativetim/argon/StatsCard'

import DataSourcesMixin from '@components/mixins/dataSources'

import Pipeline from 'js-pipeline'
import RootPipeline from '@apps/root/pipelines/index'

const MAX_FEED_DATA = 10

export default {
  mixins: [DataSourcesMixin],

  name: 'InputTable',
  // components: { GridView, Widget, StatsCard },
  components: { Widget, StatsCard },

  // pipelines: {},
  props: {
    // feed: {
    //   type: Array,
    //   default: function () { return {} }
    // },
    table: {
      type: String,
      default: undefined
    },
    groups: {
      type: Array,
      default: function () { return {} }
    }
  },

  data () {
    return {
      id: 'all',
      path: 'all',

      groups_chart_data: {
        labels: [],
        datasets: []
      },
      feed_pagination: { rowsPerPage: 0 },
      feed_data: [],
      feed_columns: [
        {
          name: 'Time',
          required: true,
          label: 'Document timestamp',
          align: 'left',
          field: row => moment(row.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
          // format: val => new Date(`${val}`)
          // sortable: true
        },
        { name: 'id', align: 'center', label: 'doc id', field: 'id' },
        { name: 'host', label: 'Host', field: 'host' },
        { name: 'path', label: 'Path', field: 'path' },
        // { name: 'tag', label: 'Tags', field: 'tag' },
        { name: 'type', label: 'Type', field: 'type' }
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ],

      components: {
        'feed': [{
          source: {
            requests: {
              once: [
                {
                  params: {
                    path: 'all',
                    query: {
                      from: this.table,
                      // register: 'changes',
                      'q': [
                        // { 'data': ['log'] },
                        'metadata'
                      ],
                      'transformation': [
                        { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                        'slice:0:10'
                      ]
                    }

                  },
                  callback: function (val, metadata, key, vm) {
                    // const MAX_FEED_DATA = 10

                    debug('MyTable ONCE %o %o', val, metadata)

                    if (JSON.parse(JSON.stringify(vm.feed_data)).length === 0) {
                      let table = vm.table
                      val = JSON.parse(JSON.stringify(val))
                      val = val[table]

                      let feed = []
                      Array.each(val, function (docs) {
                        feed.combine(docs.map(function (item, index) {
                          return item.metadata
                        }))
                      })

                      feed.sort(function (a, b) {
                        if (a.timestamp > b.timestamp) {
                          return -1
                        }
                        if (a.timestamp < b.timestamp) {
                          return 1
                        }
                        // a must be equal to b
                        return 0
                      })

                      if (feed.length > MAX_FEED_DATA) {
                        // let feed_data = JSON.parse(JSON.stringify(this.feed_data)).slice(Math.max(JSON.parse(JSON.stringify(this.feed_data)).length - MAX_FEED_DATA, 1))
                        feed = feed.slice(0, MAX_FEED_DATA)
                      }

                      debug('MyTable ONCE2 %o %o', feed)
                      vm.$set(vm, 'feed_data', feed)
                    }
                  }
                },
                {
                  params: {
                    path: 'all',
                    query: {
                      from: this.table,
                      register: 'changes',
                      'q': [
                        // { 'data': ['log'] },
                        // 'id',
                        'metadata'
                      ]
                      // 'transformation': [
                      //   { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      //   'slice:0:9'
                      // ]
                    }

                  },
                  callback: function (val, metadata, key, vm) {
                    // debug('MyTable changes %o %o', val, metadata)

                    val = JSON.parse(JSON.stringify(val))
                    // let table = metadata.from
                    let new_feed = (vm.feed_data) ? JSON.parse(JSON.stringify(vm.feed_data)) : []
                    // let feed = []
                    // debug('MyTable changes %o %o', val, feed, metadata)

                    new_feed.combine(val.map(function (item, index) {
                      return item.metadata
                    }))

                    // let ids = []
                    // ids.combine(new_feed.map(function (item) {
                    //   return item.id
                    // }))

                    // debug('MyTable changes %o %o', new_feed, ids)

                    let feed = {}
                    new_feed.each(function (item) {
                      feed[item.id] = item
                    })
                    // Array.each(ids, function (id) {
                    //   Array.each(new_feed, function (item) {
                    //     if (item.id === id) { feed[id] = item }
                    //   })
                    // })

                    feed = Object.values(feed)

                    debug('MyTable changes %o %o %o', new_feed, feed)

                    feed.sort(function (a, b) {
                      if (a.timestamp > b.timestamp) {
                        return -1
                      }
                      if (a.timestamp < b.timestamp) {
                        return 1
                      }
                      // a must be equal to b
                      return 0
                    })

                    if (feed.length > MAX_FEED_DATA) {
                      // let feed_data = JSON.parse(JSON.stringify(this.feed_data)).slice(Math.max(JSON.parse(JSON.stringify(this.feed_data)).length - MAX_FEED_DATA, 1))
                      feed = feed.slice(0, MAX_FEED_DATA)
                    }

                    vm.$set(vm, 'feed_data', feed)
                  }
                }
              ]

            }

          }
        }]
      }
    }
  },

  watch: {
    // this.$store.state[this.id + '_sources']['logs?register=periodical&transformation=limit%3A30000']
    groups: function (groups) {
      debug('watch groups', groups)
      let label = moment(Date.now()).format('DD/MM/YYYY, h:mm:ss a')

      if (!this.groups_chart_data.labels.contains(label)) { this.groups_chart_data.labels.push(label) }

      let index_of_value = this.groups_chart_data.labels.indexOf(label)

      Array.each(groups, function (val) {
        // Array.each(data, function (val) {
        debug('MyChart cb ', val, label)

        let name = val.path
        // if (name.indexOf(metadata.from) > -1) {
        //   name = name.substring(name.indexOf(metadata.from + '.') + metadata.from.length + 1)
        //   name = (name === '') ? metadata.from : name
        // }

        let dataset = { name: name, chartType: 'bar', values: [], _key: val.path }
        for (let index = 0; index < this.groups_chart_data.datasets.length; index++) {
          if (this.groups_chart_data.datasets[index].name === dataset.name) { dataset = this.groups_chart_data.datasets[index] }
        }
        Array.each(this.groups_chart_data.datasets, function (_dataset, index) {
          if (_dataset.name === dataset.name) { dataset = _dataset }
        })

        dataset.values[index_of_value] = val.count * 1

        let found = false
        Array.each(this.groups_chart_data.datasets, function (_dataset, index) {
          for (let index = 0; index < this.groups_chart_data.datasets.length; index++) {
            let _dataset = this.groups_chart_data.datasets[index]
            if (_dataset.name === dataset.name) {
              found = true

              this.groups_chart_data.datasets[index] = dataset
            }
          }
        }.bind(this))

        if (!found) {
          this.groups_chart_data.datasets.push(dataset)
          debug('MyChart cb NOT FOUND', dataset.name)
        }
        // }.bind(this))
      }.bind(this))
    }
    // feed: function (val) {
    //   debug('watch feed', val, this.feed_data.length)
    //   let feed = JSON.parse(JSON.stringify(this.feed_data))
    //   Array.each(val, function (doc) {
    //     feed.push(doc)
    //   })
    //
    //   feed.sort(function (a, b) {
    //     if (a.timestamp > b.timestamp) {
    //       return -1
    //     }
    //     if (a.timestamp < b.timestamp) {
    //       return 1
    //     }
    //     // a must be equal to b
    //     return 0
    //   })
    //
    //   if (feed.length > MAX_FEED_DATA) {
    //     debug('watch feed2', val, this.feed_data.length)
    //     // let feed_data = JSON.parse(JSON.stringify(this.feed_data)).slice(Math.max(JSON.parse(JSON.stringify(this.feed_data)).length - MAX_FEED_DATA, 1))
    //     feed = feed.slice(0, MAX_FEED_DATA)
    //   }
    //   this.$set(this, 'feed_data', feed)
    // }
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

  },
  computed: {
    count: function () {
      let result = 0
      Array.each(this.groups, function (group) {
        result += group.count
      })

      return result
    }
  },
  mounted: function () {
    debug('mounted')
  }

}
</script>
