<template>
  <admin-lte-box>
    <grid-view :id="id+'.'+table+'.grid'" :components="components" :grid="grid"/>
  </admin-lte-box>
</template>
<script>
export default {
  name: 'TableBox',

  props: {
    grid: {
      type: [Object],
      default: function () { return undefined }
    },
    components: {
      type: [Object],
      default: function () { return undefined }
    },
    data: {
      type: [Array],
      default: function () {
        return []
      }
    }
  },
  data () {
    return {

    }
  }
}

</script>
