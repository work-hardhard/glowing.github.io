<template>
  <div>
    <PanelHead :route="route" />
    <div class="btns">
      <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
        >新增</el-button>
    </div>

    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="permissionName" label="菜单权限" width="500px" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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

    <el-dialog
      v-model="dialogFormVisable"
      :before-close="beforeClose"
      title="添加权限"
      width="500px"
    >
      <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
      >
        <el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称" />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-tree
            ref="treeRef"
            style="max-width: 600px"
            :data="permissionData"
            node-key="id"
            show-checkbox
            :default-checked-keys="defaultKeys"
            :default-expanded-keys="[2]"
          />
        
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api";
import { useRoute } from "vue-router";
//如果图标是非组件形式，需要引入
import { Plus } from "@element-plus/icons-vue";

const route = useRoute();

onMounted(() => {
  //菜单数据（在生命周期请求接口）
  userGetMenu().then(({ data }) => {
    console.log(data, "树形菜单权限数据");
    permissionData.value = data.data;
  });
  getListData();
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

//编辑时打开弹窗
const open = (rowData = {}) => {
  dialogFormVisable.value = true;
  //form弹窗打开form生成是异步的，保证在生成之后
  nextTick(() => {
    if (rowData) {
      //浅拷贝
      Object.assign(form, { id: rowData.id, name: rowData.name });
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  });
};

//分页数据 请求列表接口
const paginationData = reactive({
  //当前页码
  pageNum: 1,
  //每页多少条
  pageSize: 10,
});


const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  //调用列表数据,调用接口
  getListData();
};

const handleCurrentChange = (val) => {
  //获取当前页码
  paginationData.pageNum = val;
  //调用列表数据,调用接口
  getListData();
};

//请求列表数据
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    // console.log(data, "请求列表的数据");
    const { list, total } = data.data;
    tableData.list = list;
    tableData.total = total;
  });
};


//表单校验传入实例  创建一下
const formRef = ref();

//form的数据
const form = reactive({
  id: "",
  name: "",
  permissions: "",
});

//树形菜单权限数据
const permissionData = ref([]);

//控制弹窗显示隐藏
const dialogFormVisable = ref(false);




//关闭弹窗的回调
const beforeClose = () => {
  dialogFormVisable.value = false;
  //重置表单的数据,(resetFields是form的重置方法)
  formRef.value.resetFields();
  //tree勾选选择重置
  treeRef.value.setCheckedKeys(defaultKeys);
};

//选中权限
const defaultKeys = [4, 5];

//拿到树形结构的数据 实例
const treeRef = ref();

const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});


//表单提交(校验)
const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      //获取到选择的checkbox数据 getCheckedKeys返回当前选中节点key的数组
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({
        name: form.name,
        permissions,
        id: form.id,
      }).then(({ data }) => {
        //关闭弹窗
        beforeClose();
        //请求列表 更新修改过的权限勾选
        getListData();
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
</style>