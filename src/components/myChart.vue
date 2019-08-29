<template>
  <!-- <div>
<q-toolbar class="bg-primary text-white shadow-2 absolute " >
<q-space />
<q-separator dark vertical />
<q-btn stretch flat label="Link" />
</q-toolbar> -->
    <div
      :ref="id"
      :id="id"
    >
      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
  <!-- </div> -->

</template>
<script>

import * as Debug from 'debug'
const debug = Debug('components:MyChart')

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import { dom } from 'quasar'
const { ready } = dom

export default {
  name: 'MyChart',

  chart: undefined,
  props: {
    // EventBus: undefined,
    id: {
      type: [String],
      default: 'myFrappeChart'
    },
    max: {
      type: [Number],
      default: 5
    },
    data: {
      type: [Object],
      default: function () {
        return {
          labels: [],

          datasets: [
            // {
            //   name: 'Some Data',
            //   chartType: 'bar',
            //   values: [25, 40, 30, 35, 8, 52, 17, -4]
            // },
          ]

          // yMarkers: [{ label: 'Marker',
          //   value: 70,
          //   options: { labelPos: 'left' } }],
          // yRegions: [{ label: 'Region',
          //   start: -10,
          //   end: 50,
          //   options: { labelPos: 'right' } }]
        }
      }
    }
  },
  // components: { WrappersFrappeCharts },
  mounted: function () {
    ready(this.create_chart())
  },
  watch: {
    'data': {
      handler: function (val) {
        // this.update(val)

        // this.create_chart()

        if (!this.$options.chart) { this.create_chart() }

        this.update()
        // if (this.$options.chart) { this.$options.chart.update(JSON.parse(JSON.stringify(_val))) }
      },
      // inmediate: true,
      deep: true
    }
  },
  computed: {
    normalized_data: function () {
      let _val = JSON.parse(JSON.stringify(this.data))

      if (_val && _val.labels.length > this.max) {
        _val.labels = _val.labels.slice(Math.max(_val.labels.length - this.max, 1))

        // for (let i = this.max - 1; i >= 0; i--) {
        //   _val.labels[i] = this.data.labels[i]
        // }
        // _val.labels = _val.labels.clean()

        Array.each(_val.datasets, function (dataset, index) {
          if (dataset.values.length > this.max) { dataset.values = dataset.values.slice(Math.max(dataset.values.length - this.max, 1)) }

          // _val.datasets[index] = Object.clone(dataset)
          // _val.datasets[index].values = []
          // for (let i = this.max - 1; i >= 0; i--) {
          //   _val.datasets[index].values[i] = dataset.values[i]
          // }
          //
          // _val.datasets[index].values = _val.datasets[index].values.clean()
        }.bind(this))
      }
      // else {
      //   _val = this.data
      // }

      debug('normalized_data', _val)
      return _val
    }
  },
  data () {
    return {
      visible: true, // QInnerLoading

      // chart: undefined,
      // normalized_data: {},
      options: {
        // data: {
        //   labels: ['12am-3am', '3am-6am', '6am-9am', '9am-12pm',
        //     '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'],
        //
        //   datasets: [
        //     {
        //       name: 'Some Data',
        //       chartType: 'bar',
        //       values: [25, 40, 30, 35, 8, 52, 17, -4]
        //     },
        //     {
        //       name: 'Another Set',
        //       chartType: 'bar',
        //       values: [25, 50, -10, 15, 18, 32, 27, 14]
        //     },
        //     {
        //       name: 'Yet Another',
        //       chartType: 'bar',
        //       values: [15, 20, -3, -15, 58, 12, -17, 37]
        //     }
        //   ],
        //
        //   yMarkers: [{ label: 'Marker',
        //     value: 70,
        //     options: { labelPos: 'left' } }],
        //   yRegions: [{ label: 'Region',
        //     start: -10,
        //     end: 50,
        //     options: { labelPos: 'right' } }]
        // },

        // title: 'My Awesome Chart',
        // type: 'axis-mixed', // or 'bar', 'line', 'pie', 'percentage'
        type: 'bar', // or 'bar', 'line', 'pie', 'percentage'
        height: 300,
        // colors: ['purple', '#ffa3ef', 'light-blue'],

        tooltipOptions: {
          formatTooltipX: d => (d + '').toUpperCase(),
          formatTooltipY: d => d + ' pts'
        }
      }
    }
  },
  methods: {
    create_chart: function () {
      if (
        document.getElementById(this.id) &&
        this.data &&
        this.data.labels && this.data.labels.length > 0 &&
        this.data.datasets && this.data.datasets.length > 0) {
        this.visible = false
        this.$options.chart = new Chart(
          document.getElementById(this.id), // containing div
          Object.merge(Object.clone(this.options), { data: JSON.parse(JSON.stringify(this.normalized_data)) })
        )
      }
    },
    update: function () {
      if (this.$options.chart) {
        this.$options.chart.update(this.normalized_data)
        this.$emit('updated', this.normalized_data)
        // if (this.EventBus) this.EventBus.$emit('updated', [this.id, this.normalized_data])
      }
    }
  }
}

</script>
