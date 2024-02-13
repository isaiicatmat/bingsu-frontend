<template>
  <div class="d-flex flex-column">
    <div style="letter-spacing: 0 !important; color: black !important;" class="text-subtitle-1">{{value}}</div>
    <div class="mr-3 text-subtitle-2" style="color: #ADADAD; letter-spacing: 0 !important;" >{{label}}</div>
  </div>
</template>

<script>
export default {
  name: "InformationText",
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    }
  }
}
</script>

<style scoped>

</style>