<template>
  <!-- <q-page class="flex flex-center"> -->
  <q-page :style="{height: height}">
    <!-- :style-fn="myStyle" -->
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <grid-view :id="id" :components="components" :grid="grid"/>
  </q-page>
</template>

<style>
</style>

<script>
import * as Debug from 'debug'
const debug = Debug('pages:Logs')

import admin_lte_mixin from '@components/mixins/adminlte'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import LogsPipeline from '@libs/pipelines/logs'

import { dom } from 'quasar'
const { height, width } = dom

import { EventBus } from '@libs/eventbus'

export default {
  mixins: [admin_lte_mixin],

  name: 'Logs',
  components: { GridView },

  pipelines: {},

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

    if (components) { this.components = components }

    if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)

    EventBus.$on('logs', this.__process_dashboard_logs.bind(this))
    this.create_pipelines()
  },

  data () {
    return {
      logs: {
        // range: []
      },
      range: [],

      height: '0px',
      id: 'logs',
      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 3, h: 7, i: '0' },
            { x: 3, y: 0, w: 3, h: 7, i: '1' },
            { x: 6, y: 0, w: 3, h: 7, i: '2' },
            { x: 9, y: 0, w: 3, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 10, h: 2, i: '6' },
            { x: 0, y: 2, w: 12, h: 16, i: '7' },
            { x: 0, y: 3, w: 12, h: 30, i: '8' }
            // { x: 0, y: 4, w: 12, h: 2, i: '9' }
          ],
          'md': [
            { x: 0, y: 0, w: 2, h: 7, i: '0' },
            { x: 2, y: 0, w: 2, h: 7, i: '1' },
            { x: 4, y: 0, w: 2, h: 7, i: '2' },
            { x: 6, y: 0, w: 2, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 6, h: 2, i: '6' },
            { x: 0, y: 2, w: 8, h: 16, i: '7' },
            { x: 0, y: 3, w: 8, h: 20, i: '8' }
            // { x: 0, y: 4, w: 8, h: 2, i: '9' }

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 7, i: '0' },
            { x: 3, y: 0, w: 3, h: 7, i: '1' },
            { x: 0, y: 1, w: 3, h: 7, i: '2' },
            { x: 3, y: 1, w: 3, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 2, w: 4, h: 2, i: '6' },
            { x: 0, y: 3, w: 6, h: 16, i: '7' },
            { x: 0, y: 4, w: 6, h: 20, i: '8' }
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
      components: {
        '0': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-positive',
            inner: {
              header: 'Count',
              text: '#'
            },
            icon: 'fa fa-chart-bar'
          }
        }],
        '1': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Range',
              text: '26/07/2019 - 27/07/2019'
            },
            icon: 'fa fa-calendar'
          }
        }],
        '2': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Tags',
              text: 'nginx - web - apache - stdin'
            },
            icon: 'fa fa-tags'
          }
        }],
        '3': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Hosts',
              text: 'colo'
            },
            icon: 'fa fa-server'
          }
        }],
        '6': [{
          component: 'MyRange',
          options: {
            // range: this.range
            ref: 'MyRange'
          }
        }],
        '7': [{
          component: 'MyChart'
        }],

        '8': [{
          component: 'MyTable'
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
        //   options: {
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
        //     // options: {
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
        //     options: {
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
        //     options: {
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
  },
  methods: {
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
    getGridHeight: function () {
      debug('getGridHeight', height(document.getElementById('logs')))
      return height(document.getElementById('logs')) + 700
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (logs, next) {
      debug('create_pipelines', logs)

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

      let template = Object.clone(LogsPipeline)

      let pipeline_id = template.input[0].poll.id

      if (!this.$options.pipelines[pipeline_id]) {
        let pipe = new Pipeline(template)

        this.$options.pipelines[pipeline_id] = pipe
      } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
        debug('LogsPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
        this.$options.pipelines[pipeline_id].fireEvent('onResume')
      }

      if (next) { next() }
    },
    destroy_pipelines: function () {
      debug('destroy_pipelines')

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        pipe.fireEvent('onSuspend')
        pipe.fireEvent('onExit')
        pipe.removeEvents()

        delete this.$options.pipelines[id]
      }.bind(this))

      debug('destroy_pipelines', this.$options.pipelines)
    },
    /**
    * @end pipelines
    **/
    __process_dashboard_logs: function (payload) {
      debug('__process_dashboard_logs', payload)

      // if (Array.isArray(payload.logs) && payload.logs.length > 0) {
      //   let _menu = {}
      //   Array.each(payload.logs, function (log) {
      //     _menu[log] = {
      //       label: log, icon: 'desktop_windows', route: { name: 'log', params: { log: log } }
      //     }
      //   })
      //
      //   this.$set(this.panels.charts.menu.logs, 'menu', _menu)
      //
      //   this.$store.commit('logs/clear')
      //   this.$store.commit('logs/set', payload.logs)
      //   this.create_pipelines(payload.logs)
      // }
      this.logs = payload.logs

      this.$set(this.range, 0, payload.logs.range[0])
      this.$set(this.range, 1, payload.logs.range[1])

      // debug(this.$refs)
    }
  },
  mounted: function () {
    // console.log('height:', height(document.getElementById('logs')))
    this.height = this.getGridHeight() + 'px'
  }
  // updated: function () {
  //   // console.log('height:', height(document.getElementById('logs')))
  //   this.height = this.getGridHeight() + 'px'
  // }
}
</script>
