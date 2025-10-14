<template>
  <div>
  <PanelHead :route="route" />
    <div class="card">
      <div class="user">
        <el-card class="user-card">
          <template #header>
            <div class="card-header">
              <el-image :src="user.user_img" />
              <span>{{ user.user_name }}</span>
            </div>
          </template>
          <div class="user-info">
            <div>当前权限：{{ user.permission }}</div>
            <div>登录的ip：{{ user.ip }}</div>
          </div>
        </el-card>
      </div>
      <el-card class="serive-list">
        <div class="serive-item" v-for="(item, index) in types" :key="index">
          <div class="img-box" :style="{ 'background-color': color[index] }">
            <img :src="imgs[index]" alt="" />
          </div>
          <div class="text">
            <div class="num">{{ item.num }}</div>
            <div class="name">{{ item.state }}</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 图表容器 -->
    <div class="chart-container">
      <div ref="echart" class="echart"></div>
    </div>
    <!-- 引入公共表格组件，并监听事件 -->
    <OrderTableCommon
      @order-updated="refreshChart"
      @table-data-loaded="handleTableDataLoaded"
    />
  </div>
</template>

<script  setup>
import { useRoute } from "vue-router" ;
import { ref,onMounted, watch, reactive } from "vue";
import * as echarts from "echarts";
import { getControlData } from "../../api";

import OrderTableCommon from "../../components/OrderTableCommon.vue"; 

const route = useRoute();
const echart = ref(null);
const types = ref([]);
let myChart = null;
const user = ref({
  user_img: "",
  user_name: "", //用户名
  timer: "", //登录时间
  ip: "", //登录ip
});
const imgs = ["dzf.png", "dfw.png", "ywc.png", "yqx.png"];
const color = ["#F05050", "#7266BA", "#23B7E5", "#27C24C"];
// 图表数据
const chartData = reactive({
  dates: [],
  orderCounts: [],
  growthRates: [],
});

// 表格数据加载完成时触发（如需用表格数据更新图表）
const handleTableDataLoaded = (tableData) => {
  console.log("表格数据已加载：", tableData);
  // 如需基于表格数据处理图表，可在此处添加逻辑
};

// 刷新图表数据
const refreshChart = async () => {
  try {
    let res = await getControlData();
    let data = res?.data?.data;
    if (data && data.typeList) {
      user.value = data.user;
      types.value = [{state: "待支付", num: 6}, {state: "待服务", num: 2}, {state: "已完成", num: 11}, {state: "已取消", num: 3}]
      processChartData(data.typeList);
      initEchart();
    }
  } catch (error) {
    console.error("获取图表数据失败:", error);
  }
};

// 处理图表数据（复用原有逻辑）
const processChartData = (typeList) => {
  const sortedData = [...typeList].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  chartData.dates = sortedData.map((item) => item.date);
  chartData.orderCounts = sortedData.map((item) => item.order_sum);
  chartData.growthRates = sortedData.map((item, index) => {
    if (index === 0) return 0;
    const prev = sortedData[index - 1].order_sum;
    const current = item.order_sum;
    return prev === 0 ? 0 : (((current - prev) / prev) * 100).toFixed(2) - 0;
  });
};

// 初始化图表（复用原有逻辑）
const initEchart = () => {
  if (!echart.value) return;
  if (myChart) myChart.dispose();
  myChart = echarts.init(echart.value);
  myChart.setOption({
    grid: { left: 40, bottom: 30, right: 80, top: 30, containLabel: true },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { data: ["已接订单数", "订单增长率(%)"], top: 0 },
    xAxis: { type: "category", data: chartData.dates, boundaryGap: false },
    yAxis: [
      { type: "value", name: "订单数", nameTextStyle: { color: "#67CEBC" } },
      {
        type: "value",
        name: "增长率(%)",
        position: "right",
        nameTextStyle: { color: "#F05050" },
      },
    ],
    series: [
      {
        name: "已接订单数",
        type: "bar",
        data: chartData.orderCounts,
        itemStyle: { color: "#67CEBC" },
      },
      {
        name: "订单增长率(%)",
        type: "line",
        data: chartData.growthRates,
        itemStyle: { color: "#F05050" },
      },
    ],
  });
};

// 监听图表数据变化
watch([() => chartData.dates, () => chartData.orderCounts], () => {
  if (myChart) {
    myChart.setOption({
      xAxis: { data: chartData.dates },
      series: [
        { data: chartData.orderCounts },
        { data: chartData.growthRates },
      ],
    });
  }
});

// 初始化
onMounted(() => {
  refreshChart();
  // 定时刷新图表
  setInterval(refreshChart, 30000);
});
</script>

<style lang="less" scoped>
.card {
  display: flex;
}
.user {
  margin: 20px 0;
  width: 45%;
  .user-card {
    .card-header {
      display: flex;
      .el-image {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 5px;
      }
      span {
        line-height: 120px;
        font-size: 28px;
        font-weight: bold;
      }
    }
    .user-info {
      color: #666;
      line-height: 30px;
    }
  }
}
.serive-list {
  background-color: #fff;
  margin: 20px;
  height: 269px;
  width: 50%;
  margin-bottom: 40px;
  ::v-deep(.el-card__body) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: center;

    height: 95%;
    .serive-item {
      width: 50%;
      height: 50%;
      display: flex;
      justify-content: center;
      .img-box {
        width: 70px;
        height: 70px;
        text-align: center;
        margin-right: 10px;
        border-radius: 5px;
        img {
          margin: 5px;
          width: 60px;
          height: 60px;
          border-radius: 5px;
        }
      }

      .num {
        font-size: 25px;
        line-height: 40px;
        font-weight: bold;
      }
      .name {
        font-size: 14px;
      }
    }
  }
}
.chart-container {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  .echart {
    width: 100%;
    height: 400px;
  }
}
</style>