<template>
  <div class="dashboard-page">
    <h1 class="page-title">Dashboard &nbsp;
      <small>
        <small>The Lucky One</small>
      </small>
    </h1>
    <template v-for="(groups, table) in tables">
      <b-row :key="table">
        <b-col lg="12">
          <input-table :table="table" :groups="groups"/>
          <!-- :feed="(tables_feeds[`${table}`]) ? tables_feeds[`${table}`] : []" -->
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
import Vue from 'vue'
// // import Group from '@apps/root/components/group'
// import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
// import Map from './components/Map/Map'
// // import AnimatedNumber from 'animated-number-vue'
// import AreaChart from './components/AreaChart/AreaChart'
// import StatsCard from '@apps/root/components/creativetim/argon/StatsCard'

import * as Debug from 'debug'
const debug = Debug('apps:root:pages:flatlogic:lightblue:Dashboard:Dashboard')

import DataSourcesMixin from '@components/mixins/dataSources'

import Pipeline from 'js-pipeline'
import RootPipeline from '@apps/root/pipelines/index'

export default {
  mixins: [ DataSourcesMixin ],

  name: 'Dashboard',
  components: {
    // StatsCard,
    // Widget,
    // Map,
    // AnimatedNumber,
    // AreaChart
  },
  data () {
    return {
      id: 'all',
      path: 'all',

      tables: {},
      // tables_feeds: {},
      components: {
        'all': [
          {
            source: {
              requests: {
                periodical: [
                  {
                    params: {
                      path: 'all'
                    },
                    callback: function (tables, metadata, key, vm) {
                      debug('All callback', tables)

                      Object.each(tables, function (data, table) {
                        vm.$set(vm.tables, table, data)
                      })

                      // let components = {}
                      //
                      // let changed = false
                      // Object.each(tables, function (data, table) {
                      //   if (!vm.components[table + '_feed']) {
                      //     changed = true
                      //     components[table + '_feed'] = [{
                      //       source: {
                      //         requests: {
                      //           once: [
                      //             // {
                      //             //   params: {
                      //             //     path: 'all',
                      //             //     query: {
                      //             //       from: table,
                      //             //       // register: 'changes',
                      //             //       'q': [
                      //             //         // { 'data': ['log'] },
                      //             //         'metadata'
                      //             //       ],
                      //             //       'transformation': [
                      //             //         { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      //             //         'slice:0:9'
                      //             //       ]
                      //             //     }
                      //             //
                      //             //   },
                      //             //   callback: function (val, metadata, key, vm) {
                      //             //     const MAX_FEED_DATA = 10
                      //             //
                      //             //     debug('MyTable ONCE %o %o', val, metadata)
                      //             //     let table = metadata.from[0]
                      //             //     val = JSON.parse(JSON.stringify(val))
                      //             //     val = val[table]
                      //             //
                      //             //     let feed = []
                      //             //     Array.each(val, function (docs) {
                      //             //       feed = docs.map(function (item, index) {
                      //             //         return item.metadata
                      //             //       })
                      //             //     })
                      //             //
                      //             //     // if (!Array.isArray(feed)) feed = [feed]
                      //             //
                      //             //     if (!vm.tables_feeds[table] || JSON.parse(JSON.stringify(vm.tables_feeds[table])).length < MAX_FEED_DATA) vm.$set(vm.tables_feeds, table, feed)
                      //             //
                      //             //     debug('MyTable ONCE2 %o %o', vm.tables_feeds, metadata)
                      //             //   }
                      //             // },
                      //             {
                      //               params: {
                      //                 path: 'all',
                      //                 query: {
                      //                   from: table,
                      //                   register: 'changes',
                      //                   'q': [
                      //                     // { 'data': ['log'] },
                      //                     'metadata'
                      //                   ]
                      //                   // 'transformation': [
                      //                   //   { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      //                   //   'slice:0:9'
                      //                   // ]
                      //                 }
                      //
                      //               },
                      //               callback: function (val, metadata, key, vm) {
                      //                 val = JSON.parse(JSON.stringify(val))
                      //                 let table = metadata.from
                      //                 // let feed = (vm.tables_feeds[table]) ? JSON.parse(JSON.stringify(vm.tables_feeds[table])) : []
                      //                 // let feed = []
                      //                 let feed = val.map(function (item, index) {
                      //                   return item.metadata
                      //                 })
                      //
                      //                 // feed.sort(function (a, b) {
                      //                 //   if (a.timestamp < b.timestamp) {
                      //                 //     return -1
                      //                 //   }
                      //                 //   if (a.timestamp > b.timestamp) {
                      //                 //     return 1
                      //                 //   }
                      //                 //   // a must be equal to b
                      //                 //   return 0
                      //                 // })
                      //
                      //                 // if (!Array.isArray(feed)) feed = [feed]
                      //
                      //                 // if (!vm.tables_feeds[table]) vm.$set(vm.tables_feeds, table, [])
                      //
                      //                 vm.$set(vm.tables_feeds, table, feed)
                      //
                      //                 debug('MyTable changes %o %o', vm.tables_feeds, metadata)
                      //               }
                      //             }
                      //           ]
                      //
                      //           // periodical: [
                      //           //   {
                      //           //     params: {
                      //           //       path: 'all',
                      //           //       query: {
                      //           //         from: table,
                      //           //         // register: 'changes',
                      //           //         register: 'periodical',
                      //           //         'q': [
                      //           //           // { 'data': ['log'] },
                      //           //           'metadata'
                      //           //         ],
                      //           //         'transformation': [
                      //           //           { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      //           //           { 'sample': 10 }
                      //           //         ]
                      //           //       }
                      //           //
                      //           //     },
                      //           //     callback: function (val, metadata, key, vm) {
                      //           //       const MAX_FEED_DATA = 10
                      //           //
                      //           //       debug('MyTable ONCE %o %o', val, metadata)
                      //           //       let table = metadata.from
                      //           //       val = JSON.parse(JSON.stringify(val))
                      //           //       // val = val[table]
                      //           //
                      //           //       let feed = []
                      //           //       Array.each(val, function (docs) {
                      //           //         feed.combine(docs.map(function (item, index) {
                      //           //           return item.metadata
                      //           //         }))
                      //           //       })
                      //           //
                      //           //       feed.sort(function (a, b) {
                      //           //         if (a.timestamp > b.timestamp) {
                      //           //           return -1
                      //           //         }
                      //           //         if (a.timestamp < b.timestamp) {
                      //           //           return 1
                      //           //         }
                      //           //         // a must be equal to b
                      //           //         return 0
                      //           //       })
                      //           //       // if (!Array.isArray(feed)) feed = [feed]
                      //           //
                      //           //       // if (!vm.tables_feeds[table] || JSON.parse(JSON.stringify(vm.tables_feeds[table])).length < MAX_FEED_DATA)
                      //           //       if (feed.length > 0) { vm.$set(vm.tables_feeds, table, feed) }
                      //           //
                      //           //       debug('MyTable ONCE2 %o %o', vm.tables_feeds, metadata)
                      //           //     }
                      //           //   }
                      //           // ]
                      //         }
                      //
                      //       }
                      //     }]
                      //
                      //     vm.$set(vm.components, table + '_feed', components[table + '_feed'])
                      //   }
                      // })
                      //
                      // // Object.each(tables, function (data, table) {
                      // //   if (!vm.components[table + '_feed']) {
                      // //     let paths = []
                      // //     Array.each(data, function (group) {
                      // //       paths.push(group.path)
                      // //     })
                      // //
                      // //     components[table + '_feed'] = []
                      // //
                      // //     Array.each(paths, function (path) {
                      // //       let feed_by_path = {
                      // //         source: {
                      // //           requests: {
                      // //             periodical: [
                      // //               {
                      // //                 params: {
                      // //                   path: 'all',
                      // //                   query: {
                      // //                     from: table,
                      // //                     // register: 'changes',
                      // //                     // register: 'periodical',
                      // //                     'q': [
                      // //                       // { 'data': ['log'] },
                      // //                       'metadata'
                      // //                     ],
                      // //                     'transformation': [
                      // //                       { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                      // //                       'limit:1'
                      // //                     ],
                      // //                     'filter': { 'metadata': { 'path': path } }
                      // //                   }
                      // //
                      // //                 },
                      // //                 callback: function (val, metadata, key, vm) {
                      // //                   const MAX_FEED_DATA = 10
                      // //
                      // //                   debug('MyTable ONCE %o %o', val, metadata)
                      // //                   let table = metadata.from
                      // //                   val = JSON.parse(JSON.stringify(val))
                      // //                   val = val[table]
                      // //
                      // //                   let feed = (vm.tables_feeds[table]) ? JSON.parse(JSON.stringify(vm.tables_feeds[table])) : []
                      // //
                      // //                   Array.each(val, function (docs) {
                      // //                     feed.combine(docs.map(function (item, index) {
                      // //                       return item.metadata
                      // //                     }))
                      // //                   })
                      // //
                      // //                   feed.sort(function (a, b) {
                      // //                     if (a.timestamp < b.timestamp) {
                      // //                       return -1
                      // //                     }
                      // //                     if (a.timestamp > b.timestamp) {
                      // //                       return 1
                      // //                     }
                      // //                     // a must be equal to b
                      // //                     return 0
                      // //                   })
                      // //                   // if (!Array.isArray(feed)) feed = [feed]
                      // //
                      // //                   // if (!vm.tables_feeds[table] || JSON.parse(JSON.stringify(vm.tables_feeds[table])).length < MAX_FEED_DATA)
                      // //                   feed = feed.slice(0, MAX_FEED_DATA)
                      // //
                      // //                   // if (table === 'os') {  }
                      // //                   debug('MyTable ONCE2 %o %o', feed)
                      // //
                      // //                   if (feed.length > 0) { vm.$set(vm.tables_feeds, table, feed) }
                      // //
                      // //                   // debug('MyTable ONCE2 %o %o', feed)
                      // //                 }
                      // //               }
                      // //             ]
                      // //           }
                      // //
                      // //         }
                      // //       }
                      // //
                      // //       components[table + '_feed'].push(feed_by_path)
                      // //     })
                      // //     debug('All callback PATHS', paths)
                      // //     changed = true
                      // //
                      // //     vm.$set(vm.components, table + '_feed', components[table + '_feed'])
                      // //   }
                      // // })
                      //
                      // debug('register tables components %o %o', components, changed)
                      // if (changed) {
                      //   vm.destroy_pipelines()
                      //   vm.create_pipelines()
                      //   // vm.$options.pipelines['input.root'].inputs[0].conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')
                      // }
                    }
                  }

                ]
              }
            }
          }

        ]
      }
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

}
</script>

<style src="./Dashboard.scss" lang="scss" />
