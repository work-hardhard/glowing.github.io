<template>
  <div>
    <PanelHead :route="route" />
    <!-- 引入公共表格组件 -->
    <OrderTableCommon />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

import OrderTableCommon from "../../../components/OrderTableCommon.vue"; // 引入公共组件

const route = useRoute();
</script>

<style lang="less" scoped>

</style>