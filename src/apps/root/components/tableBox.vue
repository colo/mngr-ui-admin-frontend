<template>
  <!-- <div> -->
  <admin-lte-box
    :id="table+'.box'"
    :key="table+'.box'"
    :type="'box-default box-solid'"
    :footer="false"
    :body="{class: 'bg-secondary'}"
    v-on:hide="hide"
    v-on:show="show"
    :header="{tools: false, class: 'with-border', component: {type: 'router-link', props: {to: table}, text: 'Table: '+table}}"
  >
  <!-- :header="{ title: 'Table: <a href=/'+table+'>'+table+'</a>', tools: false }" -->
  <!-- :body="{class: 'bg-secondary'}" -->
    <div :style="{height: grid_container_height}" :key="table+'.grid.container'">
      <!-- <grid-view :id="table+'.grid'" :components="components" :grid="grid" :className="''"/> -->
      <grid-view v-if="grid.layouts && Object.getLength(components) > 0" :swap_components="true" :id="id+'_'+table" :key="id+'_'+table" :components="components" :grid="grid" :className="''"/>
      <!--   -->
      <!-- v-on:height="setHeight" -->
    </div>
  </admin-lte-box>
  <!-- </div> -->
</template>
<script>

import * as Debug from 'debug'
const debug = Debug('components:TableBox')

import GridView from '@components/gridView'
let moment = require('moment')

import DataSourcesMixin from '@components/mixins/dataSources'

import Pipeline from 'js-pipeline'

export default {
  mixins: [DataSourcesMixin],

  name: 'TableBox',

  components: { GridView },

  // grid_template: {
  //
  //   layouts: {
  //     'lg': [
  //
  //       { x: 0, y: 0, w: 3, h: 7, i: 'count' },
  //       { x: 3, y: 0, w: 3, h: 7, i: 'range' },
  //       { x: 6, y: 0, w: 3, h: 7, i: 'tags' },
  //       { x: 9, y: 0, w: 3, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4' },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5' },
  //       // second row
  //       // { x: 1, y: 1, w: 10, h: 2, i: '6' },
  //       { x: 0, y: 1, w: 12, h: 16, i: 'chart' }
  //       // { x: 0, y: 3, w: 12, h: 30, i: '8' }
  //       // { x: 0, y: 4, w: 12, h: 2, i: '9' }
  //     ],
  //     'md': [
  //       { x: 0, y: 0, w: 2, h: 7, i: 'count' },
  //       { x: 2, y: 0, w: 2, h: 7, i: 'range' },
  //       { x: 4, y: 0, w: 2, h: 7, i: 'tags' },
  //       { x: 6, y: 0, w: 2, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4' },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5' },
  //       // second row
  //       // { x: 1, y: 1, w: 6, h: 2, i: '6' },
  //       { x: 0, y: 1, w: 8, h: 16, i: 'chart' }
  //       // { x: 0, y: 3, w: 8, h: 20, i: '8' }
  //       // { x: 0, y: 4, w: 8, h: 2, i: '9' }
  //
  //     ],
  //     'sm': [
  //       { x: 0, y: 0, w: 3, h: 7, i: 'count' },
  //       { x: 3, y: 0, w: 3, h: 7, i: 'range' },
  //       { x: 0, y: 1, w: 3, h: 7, i: 'tags' },
  //       { x: 3, y: 1, w: 3, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4' },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5' },
  //       // second row
  //       // { x: 1, y: 2, w: 4, h: 2, i: '6' },
  //       { x: 0, y: 2, w: 6, h: 16, i: 'chart' }
  //       // { x: 0, y: 4, w: 6, h: 20, i: '8' }
  //       // { x: 0, y: 5, w: 6, h: 2, i: '9' }
  //     ]
  //
  //   }
  //
  // },

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
              path: undefined,
              query: {
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } }
                  // 'limit:30000'
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
              path: undefined,
              query: {
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } }
                  // 'limit:30000'
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
              path: undefined,
              query: {
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } }
                  // 'limit:30000'
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

              if (tags.length > 5) { tags = tags.slice(Math.max(tags.length - 5, 1)) }

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
              path: undefined,
              query: {
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } }
                  // 'limit:30000'
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

              if (hosts.length > 5) { hosts = hosts.slice(Math.max(hosts.length - 5, 1)) }

              this.props.inner.text = hosts
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
                path: undefined,
                query: {
                  from: undefined,
                  register: 'periodical',
                  'transformation': [
                    { 'orderBy': { 'index': 'r.asc(timestamp)' } }
                    // 'limit:30000'
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

                  Array.each(table, function (val) {
                    // Array.each(data, function (val) {
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
                    // }.bind(this))
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

  props: {
    path: {
      type: [String],
      default: undefined
    },
    table: {
      type: [String],
      default: ''
    },
    data: {
      type: [Array],
      default: function () {
        return undefined
      }
    },
    pipeline: {
      type: [String],
      default: undefined
    }

  },
  computed: {
    id: function () {
      return this.path
    }
  },
  // created: function () {
  //   this.id = this.path
  // },
  data () {
    return {
      grid_container_height: '460px',
      height: '0px',

      // id: 'all',

      // type: 'box-success',
      // footer: false,

      grid: {
        layouts: {
          'lg': [

            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 6, y: 0, w: 3, h: 7, i: 'tags' },
            { x: 9, y: 0, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4' },
            // { x: 10, y: 0, w: 2, h: 7, i: '5' },
            // second row
            // { x: 1, y: 1, w: 10, h: 2, i: '6' },
            { x: 0, y: 1, w: 12, h: 16, i: 'chart', immobile: true }
            // { x: 0, y: 3, w: 12, h: 30, i: '8', immobile: true }
            // { x: 0, y: 4, w: 12, h: 2, i: '9', immobile: true }
          ],
          'md': [
            { x: 0, y: 0, w: 2, h: 7, i: 'count' },
            { x: 2, y: 0, w: 2, h: 7, i: 'range' },
            { x: 4, y: 0, w: 2, h: 7, i: 'tags' },
            { x: 6, y: 0, w: 2, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4' },
            // { x: 10, y: 0, w: 2, h: 7, i: '5' },
            // second row
            // { x: 1, y: 1, w: 6, h: 2, i: '6' },
            { x: 0, y: 1, w: 8, h: 16, i: 'chart', immobile: true }
            // { x: 0, y: 3, w: 8, h: 20, i: '8' }
            // { x: 0, y: 4, w: 8, h: 2, i: '9' }

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 0, y: 1, w: 3, h: 7, i: 'tags' },
            { x: 3, y: 1, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4' },
            // { x: 10, y: 0, w: 2, h: 7, i: '5' },
            // second row
            // { x: 1, y: 2, w: 4, h: 2, i: '6' },
            { x: 0, y: 2, w: 6, h: 16, i: 'chart', immobile: true }
            // { x: 0, y: 4, w: 6, h: 20, i: '8' }
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
  mounted: function () {
    debug('mounted %o', this.data)

    // debug('All callback', this.data, this.$options.grid_template)
    // let grid = { layouts: {} }
    // let grid_template = Object.clone(this.$options.grid_template)
    //
    // let last_component_row = 0
    // // Object.each(this.data, function (data, rt_tb) {
    // debug('All %s', this.table)
    // Object.each(grid_template.layouts, function (layout, layout_name) {
    //   debug('All layout_name %s', layout_name)
    //   Array.each(layout, function (component, index) {
    //     let cloned_component = Object.clone(component)
    //     cloned_component.i = cloned_component.i + '.' + this.table
    //     cloned_component.y = cloned_component.y + last_component_row
    //
    //
    //     if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
    //     if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
    //     grid.layouts[layout_name].push(cloned_component)
    //   }.bind(this))
    //   last_component_row++
    // }.bind(this))
    // // })

    // let components = JSON.parse(JSON.stringify(this.components))
    let components = {}
    let components_template = Object.clone(this.$options.components_template)
    // Object.each(this.data, function (data, rt_tb) {
    debug('All table %s', this.table, components_template)
    Object.each(components_template, function (component, id) {
      let cloned_component = Array.clone(component)

      debug('All component %s %o', id, cloned_component)
      // id += '.' + this.table
      Array.each(cloned_component, function (widget, index) {
        // widget.props.table = rt_tb
        // widget.props.data = data
        if (widget.props.id) widget.props.id += '.' + this.table

        widget.source.requests.once[0].params.path = this.id
        widget.source.requests.once[0].params.query.from = this.table
      }.bind(this))

      components[id] = cloned_component
    }.bind(this))
    // })

    // this.grid = grid
    debug('All grid / components %o', components)

    // for (const key in grid) {
    //   this.$set(this.grid, key, grid[key])
    // }
    // this.components = components
    for (const key in components) {
      this.$set(this.components, key, components[key])
    }

    this.destroy_pipelines()
    this.__bind_components_to_sources(this.components)
    this.create_pipelines()

    // this.props.inner.text = val[0][0].count
  },
  // watch: {
  //   components: {
  //     // immediate: true,
  //     // deep: true,
  //     handler: function (components) {
  //       debug('watch components', components)
  //       // Object.each(this.$options.pipelines, function (pipe, id) {
  //       //   debug('watch components pipe %s %o', id, pipe)
  //       //   Array.each(pipe.inputs, function (input, index) {
  //       //     debug('watch components pipe input %o', input)
  //       //     let options = Object.clone(input.options)
  //       //
  //       //   })
  //       // })
  //       // components = JSON.parse(JSON.stringify(components))
  //       // // for (const index in components) {
  //       // //   for (const i in components[index]) {
  //       // //     this.resolveComponent(components[index][i])
  //       // //   }
  //       // // }
  //       // components.id = this.id
  //       // this.viewComponents = components
  //       this.destroy_pipelines()
  //       this.create_pipelines()
  //     }
  //   }
  // },
  methods: {
    // setHeight: function (height) {
    //   debug('setHeight', height)
    //   // this.height = height + 700 + 'px'
    //   this.height = height + 20 + 'px'
    // },
    hide: function (el) {
      debug('hide', el)
      this.$emit('hide', this.table)
      // this.grid_container_height = '0px'
      // this.height = height + 700 + 'px'
      // this.height = height + 20 + 'px'
    },
    show: function (el) {
      debug('show', el)
      this.$emit('show', this.table)
      // this.grid_container_height = '0px'
      // this.height = height + 700 + 'px'
      // this.height = height + 20 + 'px'
    },
    create_pipelines: function (next) {
      let pipeline = require('@apps/' + this.pipeline).default
      debug('create_pipelines %o', pipeline)
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

      if (pipeline) {
        let template = pipeline

        let pipeline_id = template.input[0].poll.id
        // debug('RootPipeline ', template.input[0].poll.conn[0])

        // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))
        template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
        // template.input[0].poll.conn[0].queries = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))

        // debug('RootPipeline ', template.input[0].poll.conn[0].requests)

        // if (!this.$options.pipelines[pipeline_id]) {
        let pipe = new Pipeline(template)

        this.$options.__pipelines_cfg[pipeline_id] = {
          ids: [],
          connected: [],
          suspended: pipe.inputs.every(function (input) { return input.options.suspended }, this)
        }

        this.__after_connect_inputs(
          pipe,
          this.$options.__pipelines_cfg[pipeline_id],
          this.__resume_pipeline.pass([pipe, this.$options.__pipelines_cfg[pipeline_id], this.ID, function () {
            debug('__resume_pipeline CALLBACK')
            pipe.fireEvent('onOnce')
          }], this)
        )

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
    }
  }

}

</script>
