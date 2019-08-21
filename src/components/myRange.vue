<template>
  <q-range
    v-model="rangeSnap"
    :min="rangeSnap.min"
    :max="rangeSnap.max"
    :step="60000"
    drag-range
    label
    markers
    snap
    color="positive"
  />

</template>
<script>
import * as Debug from 'debug'
const debug = Debug('components:myRange')

export default {
  name: 'MyRange',

  props: {
    range: {
      type: [Array],
      default: function () {
        return []
      }
    }
  },

  watch: {
    range: {
      handler: function (val) {
        debug('watch range', val)

        this.rangeSnap = { min: val[0], max: val[1] }
      },
      deep: true
    }
  },
  created: function () {
    debug('created', this.range)
  },
  data () {
    return {
      // range: [],
      rangeSnap: {
        min: 0,
        max: 0
      }
    }
  }
}

</script>
