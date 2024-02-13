<template>
<div class="d-flex flex-fill flex-column px-4 overflow-y-auto mx-4" style="max-height: 528px">
  <contract-row v-for="item in contracts"
                @onPressedDelete="$emit('onDeleteContract', item.id)"
                :contract="item"
                :key="item.id">
  </contract-row>
</div>
</template>

<script>
import ContractRow from "@/components/Contracts/ContractRow";
export default {
  name: "ContractTable",
  components: {ContractRow},
  props: {
    contracts: {
      type: Array,
      default: () => [],
    }
  }

}
</script>

<style scoped>

</style>