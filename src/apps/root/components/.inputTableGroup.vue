<template>
  <Widget
  :title="'<h6>'+group.path+': <span class=\'text-success text-nowrap\'>'+group.count+'</span></h6>'"
  customHeader
  >
    <!-- <q-card class="my-card">
      <q-card-section> -->
       <div class="q-pa-md">
        <div class="row">
          <!-- <div class="col-12 col-md-3">
            <stats-card title="Count"
                        type="gradient-green"
                        sub-title="350,897"
                        icon="glyphicon glyphicon-plus"
                        class="mb-4 mb-xl-0"
            >
              <template slot="footer">
                  <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap">Since last month</span>
              </template>
          </stats-card>
          </div> -->
          <div class="col-12 col-md-3">
            <stats-card title="Hosts"
                        type="gradient-green"
                        :sub-title="''+group.hosts.length"
                        icon="glyphicon glyphicon-hdd"
            >
            <!-- class="mb-4 mb-xl-0" -->
              <template slot="footer">
                  <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap">{{moment(group.range[1]).fromNow()}}</span>
              </template>
          </stats-card>
          </div>
          <div class="col-12 col-md-3">
            <stats-card title="Range"
                        type="gradient-green"
                        icon="glyphicon glyphicon-glyph-calendar"
            >
            <!-- :sub-title="''+moment(group.range[1]).fromNow()" -->
            <!-- class="mb-4 mb-xl-0" -->
              <template slot="footer">
                  <!-- <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span> -->
                  <!-- <span class="text-nowrap">Since last month</span> -->
                  <span class="text-nowrap">First: {{moment(group.range[0]).fromNow()}}</span>
                  <span class="text-blue text-nowrap">Last: {{moment(group.range[1]).fromNow()}}</span>
              </template>
          </stats-card>
          </div>

          <div class="col-12 col-md-3">
            <stats-card title="Tags"
                        type="gradient-green"
                        :sub-title="''+group.tags.length"
                        icon="glyphicon glyphicon-tags"
            >
            <!-- class="mb-4 mb-xl-0" -->
              <template slot="footer">
                  <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap">Since last month</span>
              </template>
          </stats-card>
            <!-- <h6 class="name"><i class="glyphicon glyphicon-tags" /> Tags</h6>
            <p class="value">3.38%</p> -->
          </div>
          <div class="col-12 col-md-3">
            <stats-card title="Types"
                        type="gradient-green"
                        :sub-title="''+group.types.length"
                        icon="glyphicon glyphicon-filter"
            >
            <!-- class="mb-4 mb-xl-0" -->
              <template slot="footer">
                  <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap">Since last month</span>
              </template>
          </stats-card>
            <!-- <h6 class="name"><i class="glyphicon glyphicon-filter" />Types</h6>
            <p class="value">3.38%</p> -->
          </div>
          <!-- <q-list bordered class="rounded-borders col-12">
          <q-expansion-item
            expand-separator
            icon="add_circle_outlined"
            label="Docs"
            caption="live data"
          >
            <q-card>
              <q-card-section>
                <q-table
                  flat
                  dense
                  hide-bottom
                  hide-header
                  :data="data"
                  :columns="columns"
                  row-key="name"

                />
              </q-card-section>
            </q-card>
          </q-expansion-item>
          </q-list> -->
          <!-- <div class="col-12 col-md-9">
            <q-table
              flat
              dense
              hide-bottom
              hide-header
              :data="data"
              :columns="columns"
              row-key="name"

            />
          </div> -->
        </div>
      </div>
      <!-- </q-card-section>
    </q-card> -->
  </Widget>
</template>

<script>
let moment = require('moment')

// import { dom } from 'quasar'
// const { height, width } = dom
//
// import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('apps:root:components:Group')

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
// let moment = require('moment')

import Widget from '@skins/flatlogic/lightblue/components/Widget/Widget'
import StatsCard from '@apps/root/components/creativetim/argon/StatsCard'

export default {
  // mixins: [DataSourcesMixin],

  name: 'InputTableGroup',
  // components: { GridView, Widget, StatsCard },
  components: { Widget, StatsCard },

  // pipelines: {},
  props: {
    group: {
      type: Object,
      default: function () { return {} }
    }
  },

  // grid: {
  //   layouts: {
  //     'lg': [
  //       { x: 0, y: 0, w: 3, h: 7, i: 'count' },
  //       { x: 3, y: 0, w: 3, h: 7, i: 'range' },
  //       { x: 6, y: 0, w: 3, h: 7, i: 'tags' },
  //       { x: 9, y: 0, w: 3, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
  //       // second row
  //       { x: 1, y: 1, w: 10, h: 2, i: 'range_selector' },
  //       { x: 0, y: 2, w: 12, h: 16, i: 'chart' },
  //       { x: 0, y: 3, w: 12, h: 30, i: 'table' }
  //       // { x: 0, y: 4, w: 12, h: 2, i: '9' }
  //     ],
  //     'md': [
  //       { x: 0, y: 0, w: 2, h: 7, i: 'count' },
  //       { x: 2, y: 0, w: 2, h: 7, i: 'range' },
  //       { x: 4, y: 0, w: 2, h: 7, i: 'tags' },
  //       { x: 6, y: 0, w: 2, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
  //       // second row
  //       { x: 1, y: 1, w: 6, h: 2, i: 'range_selector' },
  //       { x: 0, y: 2, w: 8, h: 16, i: 'chart' },
  //       { x: 0, y: 3, w: 8, h: 20, i: 'table' }
  //       // { x: 0, y: 4, w: 8, h: 2, i: '9' }
  //
  //     ],
  //     'sm': [
  //       { x: 0, y: 0, w: 3, h: 7, i: 'count' },
  //       { x: 3, y: 0, w: 3, h: 7, i: 'range' },
  //       { x: 0, y: 1, w: 3, h: 7, i: 'tags' },
  //       { x: 3, y: 1, w: 3, h: 7, i: 'hosts' },
  //       // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
  //       // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
  //       // second row
  //       { x: 1, y: 2, w: 4, h: 2, i: 'range_selector' },
  //       { x: 0, y: 3, w: 6, h: 16, i: 'chart' },
  //       { x: 0, y: 4, w: 6, h: 20, i: 'table' }
  //       // { x: 0, y: 5, w: 6, h: 2, i: '9' }
  //     ]
  //
  //   },
  //   breakpoint: 'lg',
  //   // slots: [
  //   //   '<q-btn round />'
  //   // ],
  //
  //   cols: 12,
  //   // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
  //   colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
  //   // rowHeight: 400,
  //   isDraggable: false,
  //   isResizable: false,
  //   preview: true
  // },

  data () {
    return {
      moment: moment
      // height: '0px',
      //
      // /**
      // * dataSources
      // **/
      // store: false,
      //
      // // logs: {
      // //   count: undefined
      // // },
      // // range: [0, 1],
      // // counter: {
      // //   inner: {
      // //     header: 'Count',
      // //     text: ''
      // //   }
      // // },
      //
      // // height: '0px',
      // id: 'all',
      // path: 'all',
      //
      // grid: {},
      // components: {}
    }
  },

  mounted: function () {
    debug('mounted group', this.group)
  }

}
</script>
