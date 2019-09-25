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
        <input-table-groups-chart :id="table" :data="groups_chart_data"/>
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

const MAX_FEED_DATA = 10

export default {
  // mixins: [DataSourcesMixin],

  name: 'InputTable',
  // components: { GridView, Widget, StatsCard },
  components: { Widget, StatsCard },

  // pipelines: {},
  props: {
    feed: {
      type: Array,
      default: function () { return {} }
    },
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
          label: 'Insertion time',
          align: 'left',
          field: row => moment(row.timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
          // format: val => new Date(`${val}`)
          // sortable: true
        },
        { name: 'id', align: 'center', label: 'doc id', field: 'id' },
        { name: 'host', label: 'Host', field: 'host' },
        { name: 'path', label: 'Path', field: 'path' },
        { name: 'tag', label: 'Tags', field: 'tag' },
        { name: 'type', label: 'Type', field: 'type' }
        // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
        // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
      ]
      // data: [
      //   {
      //     name: 'Frozen Yogurt',
      //     calories: 159,
      //     fat: 6.0,
      //     carbs: 24,
      //     protein: 4.0
      //     // sodium: 87,
      //     // calcium: '14%',
      //     // iron: '1%'
      //   },
      //   {
      //     name: 'Ice cream sandwich',
      //     calories: 237,
      //     fat: 9.0,
      //     carbs: 37,
      //     protein: 4.3,
      //     sodium: 129,
      //     calcium: '8%',
      //     iron: '1%'
      //   },
      //   {
      //     name: 'Eclair',
      //     calories: 262,
      //     fat: 16.0,
      //     carbs: 23,
      //     protein: 6.0,
      //     sodium: 337,
      //     calcium: '6%',
      //     iron: '7%'
      //   },
      //   {
      //     name: 'Cupcake',
      //     calories: 305,
      //     fat: 3.7,
      //     carbs: 67,
      //     protein: 4.3,
      //     sodium: 413,
      //     calcium: '3%',
      //     iron: '8%'
      //   },
      //   {
      //     name: 'Gingerbread',
      //     calories: 356,
      //     fat: 16.0,
      //     carbs: 49,
      //     protein: 3.9,
      //     sodium: 327,
      //     calcium: '7%',
      //     iron: '16%'
      //   }
      //
      // ]

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
    },
    feed: function (val) {
      debug('watch feed', val, this.feed_data.length)
      let feed = JSON.parse(JSON.stringify(this.feed_data))
      Array.each(val, function (doc) {
        feed.push(doc)
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
        debug('watch feed2', val, this.feed_data.length)
        // let feed_data = JSON.parse(JSON.stringify(this.feed_data)).slice(Math.max(JSON.parse(JSON.stringify(this.feed_data)).length - MAX_FEED_DATA, 1))
        feed = feed.slice(0, MAX_FEED_DATA)
      }
      this.$set(this, 'feed_data', feed)
    }
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
