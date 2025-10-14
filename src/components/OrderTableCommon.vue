<template>
  <div>
  <div>
    <div class="form">
      <el-form inline="true" :model="searchForm">
        <el-form-item prop="out_trade_no">
          <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData.list">
      <el-table-column
        prop="out_trade_no"
        label="订单号"
        width="150"
        fixed="left"
      ></el-table-column>
      <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
      <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
      <!-- <el-table-column  label="陪护师头像">
        <template #default="scope">
            <el-image style="width:40px;height:40px" :src="scope.row.companion.avatar"/>
        </template>
      </el-table-column> -->
      <el-table-column label="陪护师手机号" width="120">
        <template #default="scope">
          {{
            scope.row && scope.row.companion && scope.row.companion.mobile
              ? scope.row.companion.mobile
              : "暂无手机号"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="总价"></el-table-column>
      <el-table-column prop="paidPrice" label="已付"></el-table-column>
      <el-table-column label="下单时间" width="120">
        <template #default="scope">
          {{
            scope.row.order_start_time
              ? dayjs(scope.row.order_start_time).format("YYYY - MM - DD")
              : "时间格式异常"
          }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template #default="scope">
          <el-tag :type="statusMap(scope.row.trade_state)">
            {{ scope.row.trade_state }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service_state" label="接单状态"></el-table-column>
      <el-table-column
        prop="tel"
        label="联系人手机号"
        width="120"
      ></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-popconfirm
            v-if="scope.row.trade_state === '待服务'"
            confirm-button-text="是"
            cancel-button-text="否"
            :icon="InfoFilled"
            icon-color="#626AEF"
            title="是否确认完成？"
            @confirm="handleConfirmComplete(scope.row.out_trade_no)"
          >
            <template #reference>
              <el-button link type="primary">服务完成</el-button>
            </template>
          </el-popconfirm>
          <el-button v-else type="primary" link disabled>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>

    
    <div class="pagination-info">
      <el-pagination
        :current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        size="small"
        layout="total,prev,pager,next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  </div>
</template>

<script setup>
import { adminOrder, updateOrder } from "../api"; // 注意路径适配项目实际结构
import { onMounted, reactive } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";

// 定义组件内部状态
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});
const tableData = reactive({
  list: [],
  total: 0,
});
const searchForm = reactive({
  out_trade_no: "",
});

// 定义事件（向外部传递数据/通知）
const emit = defineEmits([
  "order-updated", // 订单状态更新时触发（供图表页面刷新）
  "table-data-loaded", // 表格数据加载完成时触发（可选，供外部获取数据）
]);

// 初始化数据
onMounted(() => {
  fetchTableData();
});

// 公共方法：获取表格数据
const fetchTableData = (params = {}) => {
  adminOrder({ ...paginationData, ...params }).then(({ data }) => {
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
    emit("table-data-loaded", tableData); // 通知外部数据已加载
  });
};

// 搜索事件
const handleSearch = () => {
  fetchTableData(searchForm);
};

// 分页相关方法
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  fetchTableData();
};
const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  fetchTableData();
};

// 订单状态映射
const statusMap = (key) => {
  const obj = {
    已取消: "info",
    待支付: "warning",
    已完成: "success",
  };
  return obj[key] || "";
};

// 确认完成订单
const handleConfirmComplete = (id) => {
  updateOrder({ id }).then(({ data }) => {
    if (data.code === 10000) {
      fetchTableData(); // 刷新表格
      emit("order-updated"); // 通知外部订单已更新（如图表页面需刷新）
    }
  });
};

// 暴露组件内部数据（可选，供外部直接访问）
defineExpose({
  tableData,
  paginationData,
  fetchTableData, // 允许外部主动触发数据刷新
});
</script>

<style lang="less" scoped>
.form {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.pagination-info {
  margin-top: 10px;
  text-align: right;
}
</style>