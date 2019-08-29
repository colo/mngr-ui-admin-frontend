<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <!-- <grid-view :id="id" :components="components" :grid="grid"/> -->
  <q-page :style="{height: height}">
    <grid-view :id="'grid_'+table" :components="components" :grid="grid" v-on:height="setHeight"/>
  </q-page>
</template>

<script>
import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root:table')

import AdminLteMixin from '@components/mixins/adminlte'
import DataSourcesMixin from '@components/mixins/dataSources'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import RootPipeline from '../pipelines/root'

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

let moment = require('moment')

export default {
  mixins: [AdminLteMixin, DataSourcesMixin],

  name: 'TablePage',
  components: { GridView },

  // pipelines: {},

  props: {
    table: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,

      // logs: {
      //   count: undefined
      // },
      // range: [0, 1],
      // counter: {
      //   inner: {
      //     header: 'Count',
      //     text: ''
      //   }
      // },

      // height: '0px',
      id: 'table',
      path: 'all',

      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 6, y: 0, w: 3, h: 7, i: 'tags' },
            { x: 9, y: 0, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 10, h: 2, i: 'range_selector' },
            { x: 0, y: 2, w: 12, h: 16, i: 'chart' },
            { x: 0, y: 3, w: 12, h: 30, i: 'table' }
            // { x: 0, y: 4, w: 12, h: 2, i: '9' }
          ],
          'md': [
            { x: 0, y: 0, w: 2, h: 7, i: 'count' },
            { x: 2, y: 0, w: 2, h: 7, i: 'range' },
            { x: 4, y: 0, w: 2, h: 7, i: 'tags' },
            { x: 6, y: 0, w: 2, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 6, h: 2, i: 'range_selector' },
            { x: 0, y: 2, w: 8, h: 16, i: 'chart' },
            { x: 0, y: 3, w: 8, h: 20, i: 'table' }
            // { x: 0, y: 4, w: 8, h: 2, i: '9' }

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 0, y: 1, w: 3, h: 7, i: 'tags' },
            { x: 3, y: 1, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 2, w: 4, h: 2, i: 'range_selector' },
            { x: 0, y: 3, w: 6, h: 16, i: 'chart' },
            { x: 0, y: 4, w: 6, h: 20, i: 'table' }
            // { x: 0, y: 5, w: 6, h: 2, i: '9' }
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        cols: 12,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
        // rowHeight: 400,
        isDraggable: false,
        isResizable: false,
        preview: true
      },
      components: {}
    }
  },

  // watch:{
  //   this.$store.state[this.id + '_sources']['logs?register=periodical&transformation=limit%3A30000']
  // },
  created: function () {
    let components
    try {
      components = JSON.parse(JSON.stringify(this.$store.getters['components/getComponents'](this.id)))
    } catch (e) {}

    let grid
    try {
      grid = JSON.parse(JSON.stringify(this.$store.getters['grids/getGrid'](this.id)))
    } catch (e) {

    }

    debug('created', components)
    if (!components || Object.keys(components).length === 0) {
      components = {
        'count': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-positive',
            inner: {
              header: 'Count',
              text: ''
              // text: this.logs.count
            }, // this.counter.inner
            icon: 'fa fa-chart-bar'
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all',
                  query: {
                    from: this.table,
                    register: 'periodical',
                    'transformation': [
                      { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                      'limit:30000'
                    ]
                  }

                },
                callback: function (val, metadata, key) {
                  debug('Count', JSON.parse(JSON.stringify(val)), this)
                  let count = 0
                  Array.each(val, function (table) {
                    // Array.each(table, function (data) {
                    debug('Count table data', table)
                    count += table.count
                    // })
                  })

                  this.props.inner.text = count
                }
              }]
            }
          }

        }],
        'range': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Range',
              // text: '26/07/2019 - 27/07/2019'
              text: ''
            },
            icon: 'fa fa-calendar'
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all',
                  query: {
                    from: this.table,
                    register: 'periodical',
                    'transformation': [
                      { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                      'limit:30000'
                    ]
                  }

                },
                callback: function (val) {
                  // this.props.inner.text = val[0][0].range
                  debug('Range', JSON.parse(JSON.stringify(val)), this)
                  let range = [0, 0]
                  Array.each(val, function (table) {
                    // Array.each(table, function (data) {
                    debug('Range table data', table)
                    range[0] = (table.range[0] < range[0] || range[0] === 0) ? table.range[0] : range[0]
                    range[1] = (table.range[1] > range[1]) ? table.range[1] : range[1]
                    // })
                  })

                  this.props.inner.text = range
                }
              }]
            }
          }
        }],
        'tags': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Tags',
              // text: 'nginx - web - apache - stdin'
              text: ''
            },
            icon: 'fa fa-tags'
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all',
                  query: {
                    from: this.table,
                    register: 'periodical',
                    'transformation': [
                      { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                      'limit:30000'
                    ]
                  }

                },
                callback: function (val) {
                  // this.props.inner.text = val[0][0].range
                  debug('Tags', JSON.parse(JSON.stringify(val)), this)
                  let tags = []
                  Array.each(val, function (table) {
                    // Array.each(table, function (data) {
                    debug('Tags table data', table)
                    tags = tags.combine(table.tags)
                    // })
                  })

                  this.props.inner.text = tags
                }
              }]
            }
          }
        }],
        'hosts': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Hosts',
              // text: 'colo'
              text: ''
            },
            icon: 'fa fa-server'
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all',
                  query: {
                    from: this.table,
                    register: 'periodical',
                    'transformation': [
                      { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                      'limit:30000'
                    ]
                  }

                },
                callback: function (val) {
                  // this.props.inner.text = val[0][0].range
                  debug('Hosts', JSON.parse(JSON.stringify(val)), this)
                  let hosts = []
                  Array.each(val, function (table) {
                    // Array.each(table, function (data) {
                    debug('Hosts table data', table)
                    hosts = hosts.combine(table.hosts)
                    // })
                  })

                  this.props.inner.text = hosts
                }
              }]
            }
          }
        }],
        'range_selector': [{
          component: 'MyRange',
          props: {
            // range: this.$store.state[this.id + '_sources']['logs?register=periodical&transformation=limit%3A30000']['range']
            range: [0, 0]
            // range: this.MyRange
            // ref: 'MyRange'
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all',
                  query: {
                    from: this.table,
                    register: 'periodical',
                    'transformation': [
                      { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                      'limit:30000'
                    ]
                  }

                },
                callback: function (val) {
                  debug('Range selector', JSON.parse(JSON.stringify(val)), this)
                  let range = JSON.parse(JSON.stringify(this.props.range))

                  Array.each(val, function (table) {
                    // Array.each(table, function (data) {
                    debug('Range table data', table)
                    range[0] = (table.range[0] < range[0] || range[0] === 0) ? table.range[0] : range[0]
                    range[1] = (table.range[1] > range[1]) ? table.range[1] : range[1]
                    // })
                  })

                  this.props.range = range
                  // if (range[0] !== val[0][0].range[0] && range[1] !== val[0][0].range[1]) { this.props.range = val[0][0].range }
                }
              }]
            }
          }
        }],
        'chart': [{
          component: 'MyChart',
          props: {
            id: 'chart.logs',
            data: {
              labels: [],
              datasets: []
            }
          },
          events: {
            updated: 'proxyEvent'
          },
          // KEYS: [
          //   // '.count',
          //   '.tags.nginx',
          //   '.tags.apache',
          //   '.tags.web',
          //   '.tags.frontail',
          //   '.tags.stdio'
          // ],
          KEYS: [],
          prev: {
            // counter: 0
            range: [0, 0]
          },
          current: {
            // range: [0, 0],
            max_data: 5,
            keys: {},
            data: {
              labels: [],
              datasets: []
            }
          },
          source: {
            requests: {
              once: [
                {
                  // params: {
                  //   path: 'all',
                  //   params: { prop: 'range' }
                  //   // query: {
                  //   //   // register: 'periodical',
                  //   //   'transformation': [
                  //   //     { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                  //   //     'limit:30000'
                  //   //   ]
                  //   // }
                  //
                  // },
                  params: {
                    path: 'all',
                    query: {
                      from: this.table,
                      register: 'periodical',
                      'transformation': [
                        { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                        'limit:30000'
                      ]
                    }

                  },
                  callback: function (val, metadata, key, vm) {
                    debug('MyChart RANGE', val)
                    if (val) {
                      const MINUTE = 60000
                      debug('MyChart RANGE', val, this.prev)
                      // this.prev.range = val[0][0].range
                      // this.prev.range[0] = val[0][0].range[1] - (5 * MINUTE)

                      let range = JSON.parse(JSON.stringify(this.prev.range))
                      Array.each(val, function (table) {
                        // Array.each(table, function (data) {
                        debug('Range table data', table)
                        // range[0] = (table.range[0] < range[0] || range[0] === 0) ? table.range[0] : range[0]
                        range[1] = (table.range[1] > range[1]) ? table.range[1] : range[1]
                        range[0] = range[1] - (5 * MINUTE)
                        // })
                        Array.each(table.tags, function (tag) {
                          if (!this.KEYS.contains('.tags.' + tag)) {
                            this.KEYS.push('.tags.' + tag)
                          }
                        }.bind(this))
                      }.bind(this))

                      this.prev.range = range

                      // vm.destroy_pipelines()
                      // vm.create_pipelines()

                      debug('MyChart RANGE 2', this.prev.range, this.KEYS, vm.$options.pipelines['input.logs'])
                      debug('MyChart RANGE 3', vm.__components_sources_to_requests(vm.components))
                      let periodicals = vm.__components_sources_to_requests(vm.components)['periodical']
                      vm.$options.pipelines['input.root'].inputs[0].conn_pollers[0].options.requests.periodical = periodicals
                      vm.$options.pipelines['input.root'].inputs[0].conn_pollers[0].fireEvent('onPeriodicalRequestsUpdated')

                      // this.prev.range[0] = val.range[1] - MINUTE

                      // Vue.$set(this.prev.range, 1, val.range[1])
                      // Vue.$set(this.prev.range, 0, val.range[1] - 5 * MINUTE)
                      // const PERIODICAL = 5 * 1000 // 5 secs
                      // this.prev.range[0] = val.range[0]
                      // this.prev.range[1] = val.range[0] + PERIODICAL
                    }
                  }
                }

              ],
              periodical: [
                {
                  params: function (_key, vm) {
                    // debug('MyChart ', this.prev, this.current, _key)
                    debug('MyChart periodical', _key, vm, this.prev.range, this.KEYS)

                    const MINUTE = 60000 // 60 secs
                    // const KEYS = [
                    //   // '.count',
                    //   '.tags.nginx',
                    //   '.tags.apache',
                    //   '.tags.web',
                    //   '.tags.frontail',
                    //   '.tags.stdio'
                    // ]
                    // const COUNTS = [
                    //   this.component + '.count',
                    //   this.component + '.count.tags.nginx'
                    // ]

                    let source
                    let key

                    if (!_key && this.KEYS.length > 0) {
                      key = []
                      for (let i = 0; i < this.KEYS.length; i++) {
                        key.push(this.component + this.KEYS[i])
                      }
                    }

                    // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)

                    if (
                      _key &&
                      this.prev.range[1] > 0 &&
                      (!this.current.keys[_key] || (this.current.keys[_key].range[1] < this.prev.range[1]))
                    ) { // || !this.current.keys.contains(_key)
                      debug('MyChart periodical CURRENT', this.current.keys[_key])

                      source = []
                      if (!this.current.keys[_key]) {
                        this.current.keys[_key] = {
                          range: Array.clone(this.prev.range),
                          count: 0
                        }
                        // this.current.keys[_key].range = Array.clone(this.prev.range)
                      }

                      // if (!this.current.keys.contains(_key)) {
                      do {
                        let source_tmp = {

                          params: { id: _key },
                          query: {
                            from: vm.table,
                            'aggregation': 'count'
                          },
                          range: 'posix ' + this.current.keys[_key].range[0] + '-' + (this.current.keys[_key].range[0] + MINUTE) + '/*'
                          // query: {
                          //   // register: 'periodical',
                          //   'transformation': [
                          //     { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                          //     'limit:30000'
                          //   ]
                          // }
                        }

                        if (_key.split('.').length > 2) {
                          let prop = _key.split('.')[1]
                          let value = _key.split('.')[2]
                          source_tmp.params.prop = prop
                          source_tmp.params.value = value
                        }

                        source.push(source_tmp)
                        this.current.keys[_key].range[0] += MINUTE
                        this.current.keys[_key].count++
                        // this.current.keys[_key].range[1] = JSON.parse(JSON.stringify(this.current.keys[_key])).range[1] + (MINUTE * 5)
                      }
                      while (this.current.keys[_key].range[0] < this.prev.range[1])

                      // this.current.keys.push(_key)
                      // }
                    }

                    debug('MyChart periodical KEY ', key, source)

                    return { key, source }
                  },
                  callback: function (val, metadata, key, vm) {
                    // this.prev.keys.push(key)
                    vm.$once('chart.' + metadata.from + ':updated', function (data) {
                      debug('chart.' + metadata.from + ':updated %o', data)
                      this.current.data = data
                    }.bind(this))

                    let label = moment(metadata.range.start).format('DD/MM/YYYY, ha mm:ss') + '-' + moment(metadata.range.end).format('mm:ss')

                    if (!this.current.data.labels.contains(label)) { this.current.data.labels.push(label) }

                    let index_of_value = this.current.data.labels.indexOf(label)
                    debug('MyChart cb ', key, val, metadata, label, index_of_value)

                    let name = key
                    if (name.split('.').length > 2) {
                      // let prop = _key.split('.')[1]
                      name = name.split('.')[2]
                    }

                    let dataset = { name: name, chartType: 'bar', values: [], _key: key }
                    for (let index = 0; index < this.current.data.datasets.length; index++) {
                      if (this.current.data.datasets[index].name === dataset.name) { dataset = this.current.data.datasets[index] }
                    }
                    // Array.each(this.current.data.datasets, function (_dataset, index) {
                    //   if (_dataset.name === dataset.name) { dataset = _dataset }
                    // })

                    // dataset.values.push(val)
                    dataset.values[index_of_value] = val * 1

                    // if (dataset.values.length > this.current.max_data) { dataset.values = dataset.values.slice(Math.max(dataset.values.length - this.current.max_data, 1)) }

                    let found = false
                    // Array.each(this.current.data.datasets, function (_dataset, index) {
                    for (let index = 0; index < this.current.data.datasets.length; index++) {
                      let _dataset = this.current.data.datasets[index]
                      if (_dataset.name === dataset.name) {
                        // debug('MyChart cb FOUND', dataset.name, index)
                        found = true

                        // if (JSON.stringify(this.current.data.datasets[index].values) !== JSON.stringify(dataset.values)) {
                        //   debug('MyChart cb values', JSON.stringify(this.current.data.datasets[index].values), JSON.stringify(dataset.values))
                        // Vue.$set(this.current.data.datasets, index, dataset)
                        this.current.data.datasets[index] = dataset
                        // }
                      }
                    }
                    // }.bind(this))

                    if (!found) {
                      this.current.data.datasets.push(dataset)
                      debug('MyChart cb NOT FOUND', dataset.name)
                    }

                    if (this.KEYS.length === this.current.data.datasets.length) {
                      // let data = JSON.parse(JSON.stringify(this.current.data))
                      debug('MyChart cb UPDATING2', this.current.data.datasets, this.current.keys)
                      // this.props.data = data

                      // debug('MyChart cb UPDATING', this.KEYS.length, this.current.data.datasets.length)

                      let datasets = this.current.data.datasets
                      let match_length = true

                      for (let i = 0; i < this.current.data.datasets.length; i++) {
                        let dataset = this.current.data.datasets[i]
                        if (dataset.values.length !== this.current.keys[dataset._key].count) { match_length = false }
                      }

                      debug('MyChart cb KEYS', this.current.data.datasets, this.current.keys)

                      if (match_length) {
                        // this.update(datasets)

                        // if (this.current.data.labels.length > this.current.max_data) {
                        //   this.current.data.labels = this.current.data.labels.slice(Math.max(this.current.data.labels.length - this.current.max_data, 1))
                        // }

                        let data = JSON.parse(JSON.stringify(this.current.data))
                        debug('MyChart cb UPDATING2', data)
                        this.props.data = data

                        // Vue.$set(this.props, 'data', data)
                        // Object.each(data, function (value, key) {
                        //   debug('MyChart cb UPDATING3', value, key)
                        //   Vue.$set(this.props.data, key, value)
                        // }.bind(this))
                      }
                    }
                  }
                }
                // {
                //   params: function () {
                //     let key = this.component + '.count'
                //     debug('MyChart ', key, this.prev)
                //     // const MINUTE = 60 * 1000
                //     // const PERIODICAL = 5 * 1000 // 5 secs
                //     // this.prev.counter++
                //     // debug('MyChart start time', new Date(1557134755000))
                //     // debug('MyChart start time', new Date(1557134755000))
                //     let source = {
                //
                //       params: { id: key },
                //       query: { 'aggregation': 'count' },
                //       range: 'posix ' + this.prev.range[0] + '-' + this.prev.range[1] + '/*'
                //       // query: {
                //       //   // register: 'periodical',
                //       //   'transformation': [
                //       //     { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                //       //     'limit:30000'
                //       //   ]
                //       // }
                //     }
                //
                //     // this.prev.start += PERIODICAL
                //     // this.prev.end += PERIODICAL
                //
                //     return { key, source }
                //   },
                //   callback: function (val) {
                //     debug('MyChart cb count', val, this.prev)
                //   }
                // }
              ]
            }
          }

        }],

        'table': [{
          component: 'MyTable',
          props: {
            data: []
          },
          source: {
            requests: {
              once: [
                {
                  params: {
                    path: 'all',
                    query: {
                      from: this.table,
                      // register: 'periodical',
                      'q': [
                        { 'data': ['log'] },
                        { 'metadata': ['host', 'tag', 'timestamp'] }
                      ],
                      'transformation': [
                        { 'orderBy': { 'index': 'r.desc(timestamp)' } },
                        'slice:0:10'
                      ]
                    }
                    // body: {
                    //   'transformation': 'limit:30000'
                    //
                    // }
                  },
                  callback: function (val) {
                    val = JSON.parse(JSON.stringify(val[0]))
                    debug('MyTable', val)

                    // if (Array.isArray(val)) val = val[0] // wtf?
                    //
                    // if (!Array.isArray(val)) val = [val]

                    val.sort(function (a, b) {
                      if (a.metadata.timestamp > b.metadata.timestamp) {
                        return -1
                      }
                      if (a.metadata.timestamp < b.metadata.timestamp) {
                        return 1
                      }
                      // a must be equal to b
                      return 0
                    })
                    debug('MyTable row', val)
                    for (let i = 0; i < val.length; i++) {
                      let row = Object.merge(val[i].data, val[i].metadata)

                      row.date = moment(row.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')

                      debug('MyTable', row)
                      this.props.data.push(row)
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
                        { 'data': ['log'] },
                        { 'metadata': ['host', 'tag', 'timestamp'] }
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

                    if (Array.isArray(val)) val = val[0]

                    if (!Array.isArray(val)) val = [val]

                    val.sort(function (a, b) {
                      if (a.metadata.timestamp > b.metadata.timestamp) {
                        return -1
                      }
                      if (a.metadata.timestamp < b.metadata.timestamp) {
                        return 1
                      }
                      // a must be equal to b
                      return 0
                    })

                    for (let i = 0; i < val.length; i++) {
                      let row = Object.merge(val[i].data, val[i].metadata)
                      row.date = moment(row.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')

                      debug('MyTable changes', row)
                      this.props.data.unshift(row)
                    }
                  }
                }
              ]
            }
          }
        }]
        // '9': [{
        //   component: 'MyRange'
        // }]
        // '9': [{
        //   component: 'q-btn'
        // }],
        // '1': [{
        //   id: 1,
        //   component: 'admin-lte-events'
        // }],
        // '2': [{
        //   id: 2,
        //   component: 'admin-lte-fullcalendar'
        // }]
        // '1': [{
        //   id: 0,
        //   component: 'admin-lte-box',
        //   props: {
        //     type: 'box-success',
        //     title: 'MyBox',
        //     body: {
        //       text: 'box content'
        //     },
        //     footer: false
        //   }
        //   // defaultSize: 2
        // }],
        // '2': [
        //   {
        //     id: 2,
        //     component: 'admin-lte-small-box',
        //     // props: {
        //     //   bg: 'bg-primary'
        //     // },
        //     defaultSize: 2
        //   }
        // ],
        // '4': [],
        // '9': [
        //   {
        //     component: 'q-btn',
        //     // defaultSize: 2,
        //     props: {
        //       // round: true,
        //       label: 'edit/preview'
        //       // style: 'position: relative'
        //       // '@click': "$emit('disableGrid')"
        //     },
        //     events: {
        //       click: 'disableGrid'
        //     }
        //     // componentProps: "round color: 'primary'"
        //   },
        //   {
        //     component: 'q-btn',
        //     // defaultSize: 2,
        //     props: {
        //     // round: true,
        //       label: 'draggables'
        //       // style: 'position: relative'
        //     // '@click': "$emit('disableGrid')"
        //     },
        //     events: {
        //       click: 'disableEdit'
        //     }
        //   // componentProps: "round color: 'primary'"
        //   }]
        // '5': [{
        //   // component: 'admin-lte-box'
        //   component: 'TestTest'
        //   // defaultSize: 2
        // }],
        // '6': [{
        //   // component: 'admin-lte-box'
        //   component: 'SecondSecond'
        //   // defaultSize: 2
        // }]
      }
    }

    for (const key in components) {
      this.$set(this.components, key, components[key])
    }

    if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)

    // EventBus.$on('logs', this.__process_dashboard_logs.bind(this))
    // this.create_pipelines()
  },

  methods: {
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 700 + 'px'
      this.height = height + 200 + 'px'
    },
    // myStyle: function (offset) {
    //   // const size = `calc(100vh - ${offset}px)`
    //   const size = height(document.getElementById('logs')) + 500
    //   return {
    //     minHeight: size,
    //     height: size
    //   }
    // }
    // getRange: function () {
    //   debug('getRange', this.logs)
    //   return (this.logs && this.logs.range) ? this.logs.range : []
    // },
    // getGridHeight: function () {
    //   debug('getGridHeight', height(document.getElementById('logs')))
    //   return height(document.getElementById('logs')) + 700
    // },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      // if (logs && Array.isArray(logs)) {
      //   Array.each(logs, function (log) {
      //     if (log) {
      //       let template = Object.clone(LogPipeline)
      //
      //       template.input[0].poll.conn[0].stat_log = log
      //
      //       template.input[0].poll.id += '-' + log
      //       template.input[0].poll.conn[0].id = template.input[0].poll.id
      //       let pipeline_id = template.input[0].poll.id
      //
      //       // template.input[0].poll.conn[0].id = template.input[0].poll.suspended = true
      //
      //       if (!this.$options.pipelines[pipeline_id]) {
      //         let pipe = new Pipeline(template)
      //
      //         this.$options.pipelines[pipeline_id] = pipe
      //       }
      //     }
      //   }.bind(this))
      // }

      let template = Object.clone(RootPipeline)

      let pipeline_id = template.input[0].poll.id
      // debug('LogsPipeline ', template.input[0].poll.conn[0])

      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))
      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
      // template.input[0].poll.conn[0].queries = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))

      // debug('LogsPipeline ', template.input[0].poll.conn[0].requests)

      // if (!this.$options.pipelines[pipeline_id]) {
      let pipe = new Pipeline(template)

      this.$options.pipelines[pipeline_id] = pipe

      // debug('LogsPipeline ', this.$options.pipelines[pipeline_id].inputs[0])
      // this.$options.pipelines[pipeline_id].inputs[0].addEvent('onConnect', this.$options.pipelines[pipeline_id].fireEvent('onOnce'))

      // this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
      //   debug('LogsPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
      //   this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // }

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/
    // __process_dashboard_logs: function (payload) {
    //   debug('__process_dashboard_logs', payload)
    //
    //   // if (Array.isArray(payload.logs) && payload.logs.length > 0) {
    //   //   let _menu = {}
    //   //   Array.each(payload.logs, function (log) {
    //   //     _menu[log] = {
    //   //       label: log, icon: 'desktop_windows', route: { name: 'log', params: { log: log } }
    //   //     }
    //   //   })
    //   //
    //   //   this.$set(this.panels.charts.menu.logs, 'menu', _menu)
    //   //
    //   //   this.$store.commit('logs/clear')
    //   //   this.$store.commit('logs/set', payload.logs)
    //   //   this.create_pipelines(payload.logs)
    //   // }
    //   // this.logs = payload.logs
    //   // for (const key in payload.logs) {
    //   //   this.$set(this.logs, key, payload.logs[key])
    //   // }
    //   // debug('__process_dashboard_logs', this.logs)
    //
    //   this.$set(this.range, 0, payload.logs.range[0])
    //   this.$set(this.range, 1, payload.logs.range[1])
    //
    //   // this.$set(this.counter.inner, 'text', payload.logs.count)
    //   for (const key in payload.logs) {
    //     if (this.components[key]) { this.$set(this.components[key][0].options.inner, 'text', payload.logs[key]) }
    //   }
    //
    //   // this.$set(this.components[6][0].options.range, 0, payload.logs.range[0])
    //   // this.$refs['MyRange'].range = payload.logs.range
    //   // debug('__process_dashboard_logs', this.$refs['MyRange'])
    // }
  },
  mounted: function () {
    debug('mounted')
  }
  // updated: function () {
  //   // console.log('height:', height(document.getElementById('logs')))
  //   this.height = this.getGridHeight() + 'px'
  // }
}
</script>
