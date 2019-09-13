<template>
<!-- <div class="bg-primary"> -->
<!-- <section class="content"> -->

    <!-- <grid-view :swap_components="true" :id="'grid.'+id" :components="components" :grid="grid" v-on:height="setHeight"/> -->
    <grid-view v-if="grid.layouts && Object.getLength(components) > 1" :swap_components="true" :id="id" :components="components" :grid="grid" v-on:height="setHeight"/>

  <!-- <table-page v-else :table="$route.params.table"/> -->
</template>
<script>
/* global EventBus */
// import { EventBus } from '@libs/eventbus'

import { dom } from 'quasar'
const { height, width } = dom

import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root:components:AllPage')

import AdminLteMixin from '@components/mixins/adminlte'
import DataSourcesMixin from '@components/mixins/dataSources'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import RootPipeline from '../pipelines/root'

// import { dom } from 'quasar'
// const { height, width } = dom

// import upperFirst from 'lodash/upperFirst'
// import camelCase from 'lodash/camelCase'

export default {
  mixins: [AdminLteMixin, DataSourcesMixin],

  components: { GridView },
  name: 'allPage',
  // components: { GridView },

  // pipelines: {},
  grid_template: {

    layouts: {
      'lg': [
        { x: 0, y: 0, w: 12, h: 27, i: 'rethinkdb_table' }
        // { x: 0, y: 1, w: 12, h: 2, i: 'separator' }
      ],
      'md': [
        { x: 0, y: 0, w: 8, h: 27, i: 'rethinkdb_table' }
        // { x: 0, y: 1, w: 8, h: 2, i: 'separator' }
      ],
      'sm': [
        { x: 0, y: 0, w: 6, h: 27, i: 'rethinkdb_table' }
        // { x: 0, y: 1, w: 6, h: 2, i: 'separator' }
      ]

    }

  },

  components_template: {
    rethinkdb_table: [{
      component: 'TableBox',
      props: {
        table: undefined,
        data: undefined
      },
      events: {
        hide: 'hide',
        show: 'show'
      }
    }]
  },

  // default_components: {
  //   'all': [{
  //     source: {
  //       requests: {
  //         once: [{
  //           params: {
  //             path: 'all'
  //           },
  //           callback: function (tables, metadata, key, vm) {
  //             debug('All callback', tables, vm.$options.grid_template)
  //             // let grid = JSON.parse(JSON.stringify(vm.grid))
  //             let grid_template = Object.clone(vm.$options.grid_template)
  //
  //             let last_component_row = 0
  //             Object.each(tables, function (data, rt_tb) {
  //               debug('All %s', rt_tb)
  //               Object.each(grid_template.layouts, function (layout, layout_name) {
  //                 debug('All layout_name %s', layout_name)
  //                 Array.each(layout, function (component, index) {
  //                   let cloned_component = Object.clone(component)
  //                   cloned_component.i = cloned_component.i + '_' + rt_tb
  //                   cloned_component.y = cloned_component.y + last_component_row
  //
  //                   // if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
  //                   if (!vm.grid.layouts[layout_name]) vm.$set(vm.grid.layouts, layout_name, [])
  //
  //                   if (vm.grid.layouts[layout_name].every(function (item) { return item.i !== cloned_component.i })) {
  //                     vm.grid.layouts[layout_name].push(cloned_component)
  //                   }
  //                 })
  //                 last_component_row++
  //               })
  //             })
  //
  //             // let components = JSON.parse(JSON.stringify(vm.components))
  //             // let components = {}
  //             let components_template = Object.clone(vm.$options.components_template)
  //             Object.each(tables, function (data, rt_tb) {
  //               debug('All table %s', rt_tb, components_template)
  //               Object.each(components_template, function (component, id) {
  //                 let cloned_component = Array.clone(component)
  //
  //                 debug('All component %s %o', id, cloned_component)
  //                 id += '_' + rt_tb
  //                 Array.each(cloned_component, function (widget, index) {
  //                   widget.props.table = rt_tb
  //                   widget.props.data = data
  //                   widget.props.pipeline = 'root/pipelines/root'
  //                   // if (widget.props.id) widget.props.id += '.' + rt_tb
  //
  //                   // widget.source.requests.once[0].params.query.from = rt_tb
  //                 })
  //
  //                 // components[id] = cloned_component
  //                 // vm.$set(vm.components, id, cloned_component)
  //                 if (!vm.components[key]) { vm.$set(vm.components, id, cloned_component) }
  //               })
  //             })
  //
  //             // vm.grid = grid
  //             // debug('All grid / components %o', grid, components)
  //
  //             // for (const key in grid) {
  //             //   vm.$set(vm.grid, key, grid[key])
  //             // }
  //
  //             // for (const key in components) {
  //             //   if (!vm.components[key]) {
  //             //     vm.$set(vm.components, key, components[key])
  //             //   }
  //             // }
  //
  //             // vm.__bind_components_to_sources(vm.components)
  //             // vm.destroy_pipelines()
  //             // vm.create_pipelines()
  //             // this.props.inner.text = val[0][0].count
  //           }
  //         }]
  //       }
  //     }
  //   }]
  // },

  data () {
    return {
      height: '0px',

      /**
      * dataSources
      **/
      store: false,

      root: {
        count: undefined
      },
      range: [0, 1],

      id: 'all',
      path: 'all',

      grid: {
        // layouts: {
        //   'lg': [
        //   ],
        //   'md': [
        //   ],
        //   'sm': [
        //
        //   ]
        //
        // },
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

      components: {
        'all': [{
          source: {
            requests: {
              periodical: [{
                params: {
                  path: 'all'
                },
                callback: function (tables, metadata, key, vm) {
                  debug('All callback', tables, vm.$options.grid_template)
                  // let grid = JSON.parse(JSON.stringify(vm.grid))
                  let grid_template = Object.clone(vm.$options.grid_template)

                  let last_component_row = 0
                  Object.each(tables, function (data, rt_tb) {
                    debug('All %s', rt_tb)
                    Object.each(grid_template.layouts, function (layout, layout_name) {
                      debug('All layout_name %s', layout_name)
                      Array.each(layout, function (component, index) {
                        let cloned_component = Object.clone(component)
                        cloned_component.i = cloned_component.i + '_' + rt_tb
                        cloned_component.y = cloned_component.y + last_component_row

                        // if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
                        if (!vm.grid.layouts) vm.$set(vm.grid, 'layouts', {})
                        if (!vm.grid.layouts[layout_name]) vm.$set(vm.grid.layouts, layout_name, [])

                        if (vm.grid.layouts[layout_name].every(function (item) { return item.i !== cloned_component.i })) {
                          vm.grid.layouts[layout_name].push(cloned_component)
                        }
                      })
                      last_component_row++
                    })
                  })

                  // let components = JSON.parse(JSON.stringify(vm.components))
                  // let components = {}
                  let components_template = Object.clone(vm.$options.components_template)
                  let modified = false
                  Object.each(tables, function (data, rt_tb) {
                    debug('All table %s', rt_tb, components_template)
                    Object.each(components_template, function (component, id) {
                      let cloned_component = Array.clone(component)

                      debug('All component %s %o', id, cloned_component)
                      id += '_' + rt_tb
                      Array.each(cloned_component, function (widget, index) {
                        widget.props.table = rt_tb
                        widget.props.data = data
                        widget.props.pipeline = 'root/pipelines/root'
                        widget.props.path = vm.path
                        // if (widget.props.id) widget.props.id += '.' + rt_tb

                        // widget.source.requests.once[0].params.query.from = rt_tb
                      })

                      // components[id] = cloned_component
                      // vm.$set(vm.components, id, cloned_component)
                      if (!vm.components[key]) {
                        vm.$set(vm.components, id, cloned_component)
                        modified = true
                      }
                    })
                  })

                  // vm.grid = grid
                  // debug('All grid / components %o', grid, components)

                  // for (const key in grid) {
                  //   vm.$set(vm.grid, key, grid[key])
                  // }

                  // for (const key in components) {
                  //   if (!vm.components[key]) {
                  //     vm.$set(vm.components, key, components[key])
                  //   }
                  // }

                  // vm.__bind_components_to_sources(vm.components)
                  // if (modified === true) {
                  //   vm.destroy_pipelines()
                  //   vm.create_pipelines()
                  // }
                  // this.props.inner.text = val[0][0].count
                }
              }]
            }
          }
        }]
      }
    }
  },

  watch: {
    '$route': function (val) {
      debug('ROUTE %o', val)
    }
  },
  // watch: {
  //   components: {
  //     // immediate: true,
  //     deep: true,
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
  //       // this.$nextTick(function () {
  //       // this.destroy_pipelines()
  //       // this.create_pipelines()
  //       // }.bind(this))
  //     }
  //   }
  // },

  created: function () {
    // debug('created ', this.$route.params)

    // this.$on('grid.' + this.id + ':height', this.setHeight.bind(this))

    // try {
    //   let components = Object.clone(this.$store.getters['components/getComponents'](this.id))
    //   // let default_components = this.$options.default_components
    //
    //   for (const key in components) {
    //     // let component = (components[key]) ? Object.merge(components[key], default_components[key]) : default_components[key]
    //     this.$set(this.components, key, Object.merge(components[key], this.components[key]))
    //   }
    // } catch (e) {
    //   debug('Err %o', e)
    // }

    // try {
    //   let grid = Object.clone(this.$store.getters['grids/getGrid'](this.id))
    //   for (const key in grid) {
    //     this.$set(this.grid, key, Object.merge(grid[key], this.grid[key]))
    //   }
    // } catch (e) {
    //   debug('Err %o', e)
    // }

    // debug('created', components)
    // if (!components || Object.keys(components).length === 0) {
    // components = {
    //   'all': [{
    //     source: {
    //       requests: {
    //         once: [{
    //           params: {
    //             path: 'all'
    //           },
    //           callback: function (tables, metadata, key, vm) {
    //             debug('All callback', tables, vm.$options.grid_template)
    //             let grid = JSON.parse(JSON.stringify(vm.grid))
    //             let grid_template = Object.clone(vm.$options.grid_template)
    //
    //             let last_component_row = 0
    //             Object.each(tables, function (data, rt_tb) {
    //               debug('All %s', rt_tb)
    //               Object.each(grid_template.layouts, function (layout, layout_name) {
    //                 debug('All layout_name %s', layout_name)
    //                 Array.each(layout, function (component, index) {
    //                   let cloned_component = Object.clone(component)
    //                   cloned_component.i = cloned_component.i + '_' + rt_tb
    //                   cloned_component.y = cloned_component.y + last_component_row
    //
    //                   if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
    //                   grid.layouts[layout_name].push(cloned_component)
    //                 })
    //                 last_component_row++
    //               })
    //             })
    //
    //             let components = JSON.parse(JSON.stringify(vm.components))
    //             let components_template = Object.clone(vm.$options.components_template)
    //             Object.each(tables, function (data, rt_tb) {
    //               debug('All table %s', rt_tb, components_template)
    //               Object.each(components_template, function (component, id) {
    //                 let cloned_component = Array.clone(component)
    //
    //                 debug('All component %s %o', id, cloned_component)
    //                 id += '_' + rt_tb
    //                 Array.each(cloned_component, function (widget, index) {
    //                   widget.props.table = rt_tb
    //                   widget.props.data = data
    //                   widget.props.pipeline = 'root/pipelines/root'
    //                   // if (widget.props.id) widget.props.id += '.' + rt_tb
    //
    //                   // widget.source.requests.once[0].params.query.from = rt_tb
    //                 })
    //
    //                 components[id] = cloned_component
    //               })
    //             })
    //
    //             // vm.grid = grid
    //             debug('All grid / components %o', grid, components)
    //
    //             for (const key in grid) {
    //               vm.$set(vm.grid, key, grid[key])
    //             }
    //             // vm.components = components
    //             for (const key in components) {
    //               vm.$set(vm.components, key, components[key])
    //             }
    //
    //             // this.props.inner.text = val[0][0].count
    //           }
    //         }]
    //       }
    //     }
    //   }]
    // }
    // }

    // for (const key in components) {
    //   this.$set(this.components, key, components[key])
    // }

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
  // updated: function () {
  //   this.destroy_pipelines()
  //   this.create_pipelines()
  // },
  methods: {
    hide: function (table, event, vnode) {
      debug('hide', table, this.grid)
      for (const layout in this.grid.layouts) {
        for (let i = 0; i < this.grid.layouts[layout].length; i++) {
          let row = this.grid.layouts[layout][i]
          if (row.i === 'rethinkdb_table_' + table) {
            this.$set(this.grid.layouts[layout][i], 'h', 2)
          }
        }
      }

      debug('hiden', table, this.grid)
    },
    show: function (table, event, vnode) {
      debug('show', table, this.grid)
      for (const layout in this.grid.layouts) {
        for (let i = 0; i < this.grid.layouts[layout].length; i++) {
          let row = this.grid.layouts[layout][i]
          if (row.i === 'rethinkdb_table_' + table) {
            this.$set(this.grid.layouts[layout][i], 'h', 27)
          }
        }
      }

      debug('shown', table, this.grid)
    },
    setHeight: function (height) {
      debug('setHeight', height)
      // this.height = height + 700 + 'px'
      this.height = height + 200 + 'px'
    },
    // getGridHeight: function () {
    //   debug('getGridHeight', height(document.getElementById(this.id)))
    //   // return height(document.getElementById(this.id)) + 700
    //   return height(document.getElementById('grid.' + this.id))
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

  }
  // mounted: function () {
  //   debug('mounted refs', this.$refs)
  // //   // console.log('height:', height(document.getElementById('logs')))
  // //   this.height = this.getGridHeight() + 700 + 'px'
  // }

}
</script>
