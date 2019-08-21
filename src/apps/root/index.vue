<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->
  <grid-view :id="id" :components="components" :grid="grid"/>
</template>
<script>
/* global EventBus */
import { EventBus } from '@libs/eventbus'

import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('pages:root')

import AdminLteMixin from '@components/mixins/adminlte'
import DataSourcesMixin from '@components/mixins/dataSources'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import RootPipeline from './pipelines/root'

// import { dom } from 'quasar'
// const { height, width } = dom
let moment = require('moment')

export default {
  mixins: [AdminLteMixin, DataSourcesMixin],

  components: { GridView },
  name: 'root',
  // components: { GridView },

  // pipelines: {},
  grid_template: {

    layouts: {
      'lg': [
        { x: 0, y: 0, w: 12, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 3, h: 7, i: 'count' },
        { x: 3, y: 1, w: 3, h: 7, i: 'range' },
        { x: 6, y: 1, w: 3, h: 7, i: 'tags' },
        { x: 9, y: 1, w: 3, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 1, w: 10, h: 2, i: '6' },
        { x: 0, y: 2, w: 12, h: 16, i: 'chart' }
        // { x: 0, y: 3, w: 12, h: 30, i: '8' }
        // { x: 0, y: 4, w: 12, h: 2, i: '9' }
      ],
      'md': [
        { x: 0, y: 0, w: 8, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 2, h: 7, i: 'count' },
        { x: 2, y: 1, w: 2, h: 7, i: 'range' },
        { x: 4, y: 1, w: 2, h: 7, i: 'tags' },
        { x: 6, y: 1, w: 2, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 1, w: 6, h: 2, i: '6' },
        { x: 0, y: 2, w: 8, h: 16, i: 'chart' }
        // { x: 0, y: 3, w: 8, h: 20, i: '8' }
        // { x: 0, y: 4, w: 8, h: 2, i: '9' }

      ],
      'sm': [
        { x: 0, y: 0, w: 6, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 3, h: 7, i: 'count' },
        { x: 3, y: 1, w: 3, h: 7, i: 'range' },
        { x: 0, y: 2, w: 3, h: 7, i: 'tags' },
        { x: 3, y: 2, w: 3, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 2, w: 4, h: 2, i: '6' },
        { x: 0, y: 3, w: 6, h: 16, i: 'chart' }
        // { x: 0, y: 4, w: 6, h: 20, i: '8' }
        // { x: 0, y: 5, w: 6, h: 2, i: '9' }
      ]

    }

  },

  components_template: {
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
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                  'limit:30000'
                ]
              }

            },
            callback: function (val, metadata, key) {
              debug('Count', val, key)
              let count = 0
              Array.each(val, function (table) {
                Array.each(table, function (data) {
                  debug('Count table data', data.count)
                  count += data.count
                })
              })

              this.props.inner.text = count
            }
          }]
        }
      }

    }],
    'chart': [{
      component: 'MyChart',
      props: {
        id: 'chart',
        data: {
          labels: [],
          datasets: []
        }
      },
      events: {
        updated: 'proxyEvent'
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
              params: {
                path: 'all',
                query: {
                  from: undefined,
                  register: 'periodical',
                  'transformation': [
                    { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                    'limit:30000'
                  ]
                }

              },
              callback: function (table, metadata, key, vm) {
                if (table) {
                  vm.$once('chart.' + metadata.from + ':updated', function (data) {
                    debug('chart.' + metadata.from + ':updated %o', data)
                    this.current.data = data
                  }.bind(this))

                  let label = moment(metadata.timestamp).format('DD/MM/YYYY, h:mm:ss a')

                  if (!this.current.data.labels.contains(label)) { this.current.data.labels.push(label) }

                  let index_of_value = this.current.data.labels.indexOf(label)

                  debug('MyChart TABLE ', table, metadata, key)

                  Array.each(table, function (data) {
                    Array.each(data, function (val) {
                      debug('MyChart cb ', val, metadata, label, index_of_value, table)

                      let name = val.path
                      if (name.indexOf(metadata.from) > -1) {
                        name = name.substring(name.indexOf(metadata.from + '.') + metadata.from.length + 1)
                        name = (name === '') ? metadata.from : name
                      }

                      let dataset = { name: name, chartType: 'bar', values: [], _key: val.path }
                      for (let index = 0; index < this.current.data.datasets.length; index++) {
                        if (this.current.data.datasets[index].name === dataset.name) { dataset = this.current.data.datasets[index] }
                      }
                      Array.each(this.current.data.datasets, function (_dataset, index) {
                        if (_dataset.name === dataset.name) { dataset = _dataset }
                      })

                      dataset.values[index_of_value] = val.count * 1

                      let found = false
                      Array.each(this.current.data.datasets, function (_dataset, index) {
                        for (let index = 0; index < this.current.data.datasets.length; index++) {
                          let _dataset = this.current.data.datasets[index]
                          if (_dataset.name === dataset.name) {
                            found = true

                            this.current.data.datasets[index] = dataset
                          }
                        }
                      }.bind(this))

                      if (!found) {
                        this.current.data.datasets.push(dataset)
                        debug('MyChart cb NOT FOUND', dataset.name)
                      }
                    }.bind(this))
                  }.bind(this))

                  debug('MyChart cb UPDATING2', this.current.data.datasets, this.current.keys)

                  let data = JSON.parse(JSON.stringify(this.current.data))
                  debug('MyChart cb UPDATING3', data)

                  this.props.data = data
                }
              }
            }

          ]

        }
      }

    }]
  },

  data () {
    return {
      /**
      * dataSources
      **/
      store: false,

      root: {
        count: undefined
      },
      range: [0, 1],

      id: 'all',

      grid: {
        layouts: {
          'lg': [
          ],
          'md': [
          ],
          'sm': [

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
        isDraggable: true,
        isResizable: true,
        preview: false
      },

      components: {}
    }
  },

  watch: {
    components: {
      // immediate: true,
      deep: true,
      handler: function (components) {
        debug('watch components', components)
        // Object.each(this.$options.pipelines, function (pipe, id) {
        //   debug('watch components pipe %s %o', id, pipe)
        //   Array.each(pipe.inputs, function (input, index) {
        //     debug('watch components pipe input %o', input)
        //     let options = Object.clone(input.options)
        //
        //   })
        // })
        // components = JSON.parse(JSON.stringify(components))
        // // for (const index in components) {
        // //   for (const i in components[index]) {
        // //     this.resolveComponent(components[index][i])
        // //   }
        // // }
        // components.id = this.id
        // this.viewComponents = components
        this.destroy_pipelines()
        this.create_pipelines()
      }
    }
  },
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
    // if (!components || Object.keys(components).length === 0) {
    components = {
      'all': [{
        source: {
          requests: {
            once: [{
              params: {
                path: 'all'
              },
              callback: function (tables, metadata, key, vm) {
                debug('All callback', tables, vm.$options.grid_template)
                let grid = JSON.parse(JSON.stringify(vm.grid))
                let grid_template = Object.clone(vm.$options.grid_template)

                let last_component_row = 0
                Object.each(tables, function (data, rt_tb) {
                  debug('All %s', rt_tb)
                  Object.each(grid_template.layouts, function (layout, layout_name) {
                    debug('All layout_name %s', layout_name)
                    Array.each(layout, function (component, index) {
                      let cloned_component = Object.clone(component)
                      cloned_component.i = cloned_component.i + '.' + rt_tb
                      cloned_component.y = cloned_component.y + last_component_row

                      if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
                      grid.layouts[layout_name].push(cloned_component)
                    })
                    last_component_row++
                  })
                })

                let components = JSON.parse(JSON.stringify(vm.components))
                let components_template = Object.clone(vm.$options.components_template)
                Object.each(tables, function (data, rt_tb) {
                  debug('All table %s', rt_tb, components_template)
                  Object.each(components_template, function (component, id) {
                    let cloned_component = Array.clone(component)

                    debug('All component %s %o', id, cloned_component)
                    id += '.' + rt_tb
                    Array.each(cloned_component, function (widget, index) {
                      if (widget.props.id) widget.props.id += '.' + rt_tb

                      widget.source.requests.once[0].params.query.from = rt_tb
                    })

                    components[id] = cloned_component
                  })
                })

                // vm.grid = grid
                debug('All grid / components %o', grid, components)

                for (const key in grid) {
                  vm.$set(vm.grid, key, grid[key])
                }
                // vm.components = components
                for (const key in components) {
                  vm.$set(vm.components, key, components[key])
                }

                // this.props.inner.text = val[0][0].count
              }
            }]
          }
        }
      }]
    }
    // }

    for (const key in components) {
      this.$set(this.components, key, components[key])
    }

    // if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)

    // EventBus.$on('root', this.__process_dashboard_root.bind(this))
    // this.create_pipelines()
  },

  methods: {

    // myStyle: function (offset) {
    //   // const size = `calc(100vh - ${offset}px)`
    //   const size = height(document.getElementById('root')) + 500
    //   return {
    //     minHeight: size,
    //     height: size
    //   }
    // }
    // getRange: function () {
    //   debug('getRange', this.root)
    //   return (this.root && this.root.range) ? this.root.range : []
    // },
    // getGridHeight: function () {
    //   debug('getGridHeight', height(document.getElementById('root')))
    //   return height(document.getElementById('root')) + 700
    // },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      // if (root && Array.isArray(root)) {
      //   Array.each(root, function (log) {
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
      // debug('RootPipeline ', template.input[0].poll.conn[0])

      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))
      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
      // template.input[0].poll.conn[0].queries = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))

      // debug('RootPipeline ', template.input[0].poll.conn[0].requests)

      // if (!this.$options.pipelines[pipeline_id]) {
      let pipe = new Pipeline(template)

      this.$options.pipelines[pipeline_id] = pipe

      // debug('RootPipeline ', this.$options.pipelines[pipeline_id].inputs[0])
      // this.$options.pipelines[pipeline_id].inputs[0].addEvent('onConnect', this.$options.pipelines[pipeline_id].fireEvent('onOnce'))

      // this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
      //   debug('RootPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
      //   this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // }

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/

  },
  mounted: function () {
    debug('mounted')
  }

}
</script>
