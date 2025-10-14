<template>
  <div>
    <PanelHead :route="route" />
    <div class="btns">
      <el-button :icon="Plus" type="primary" @click="open(null)" size="small"
        >新增</el-button
      >
      <el-popconfirm
        confirm-button-text="是"
        cancel-button-text="否"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否确认删除？"
        @confirm="confirmEvent"
      >
        <template #reference>
          <el-button :icon="Delete" type="danger" size="small">删除</el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData.list"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="id" />

      <el-table-column prop="name" label="昵称" />

      <el-table-column label="头像">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px" :src="scope.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column prop="name" label="性别">
        <template #default="scope">
          {{ scope.row.sex === "1" ? "男" : "女" }}
        </template>
      </el-table-column>

      <el-table-column prop="active" label="状态">
        <template #default="scope">
          <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
            scope.row.active ? "正常" : "失效"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="create_time" label="创建时间">
        <template #default="scope">
          <div class="flex-box">
            <el-icon><Clock /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogFormVisable"
      :before-close="beforeClose"
      title="陪护师添加"
      width="500px"
    >
      <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
        ><el-form-item v-show="false" prop="id">
          <el-input v-model="form.id" />
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="form.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-button
            v-if="!form.avatar"
            type="primary"
            @click="dialogImgVisable = true"
            >点击上传</el-button
          >
          <el-image
            v-else
            :src="form.avatar"
            style="width: 100px; height: 100px"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="form.age"
            :min="18"
            :max="50"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="是否生效" prop="active">
          <el-radio-group v-model="form.active">
            <el-radio :value="0">失效</el-radio>
            <el-radio :value="1">生效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogImgVisable"
      :before-close="beforeClose"
      title="选择图片"
      width="680px"
    >
      <div class="image-list">
        <div
          v-for="(item, index) in fileList"
          :key="item.name"
          class="img-box"
          @click="selectIndex = index"
        >
          <div v-if="selectIndex === index" class="select">
            <el-icon color="#fff"><Check /></el-icon>
          </div>
          <el-image style="width: 148px; height: 148px" :src="item.url" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogImgVisable = false">取消</el-button>
          <el-button type="primary" @click="confirmImage">确认</el-button>
        </div>
      </template>
    </el-dialog>
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
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  photoList,
  companion,
  companionList,
  deleteCompanion,
} from "../../../api";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { InfoFilled, Delete } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(() => {
  photoList().then(({ data }) => {
    fileList.value = data.data; //拿到了陪护师头像的相关数据
  });
  getListData();
});

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getListData();
};

const handleCurrentChange = (val) => {
  //获取当前页码
  paginationData.pageNum = val;
  //调用列表数据,调用接口
  getListData();
};

//分页数据
const paginationData = reactive({
  //当前页码
  pageNum: 1,
  //每页多少条
  pageSize: 10,
});

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
});

const getListData = () => {
  companionList(paginationData).then(({ data }) => {
    const { list, total } = data.data;

    list.forEach((item) => {
      item.create_time = dayjs(item.create_time).format("YYYY-MM-DD");
    });
    tableData.list = list;
    tableData.total = total;
  });
};

const dialogFormVisable = ref(false);
const beforeClose = () => {
  dialogFormVisable.value = false;
  //重置对话框(设置的内容)
  formRef.value.resetFields();
};
const formRef = ref();
const form = reactive({
  id: "",
  mobile: "",
  active: 1,
  age: 28,
  avatar: "",
  name: "",
  sex: "",
});
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请填写昵称" }],
  avatar: [{ required: true, message: "请选择头像" }],
  sex: [{ required: true, trigger: "change", message: "请选择性别" }],
  mobile: [{ required: true, trigger: "blur", message: "请填写手机号" }],
});
const confirm = async (formEl) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success("成功");
          //关闭弹窗
          beforeClose();
          //更新列表
          getListData();
        } else {
          ElMessage.error(data.message);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const open = (rowData = {}) => {
  dialogFormVisable.value = true;
  nextTick(() => {
    //如果是编辑
    if (rowData) {
      Object.assign(form, rowData);
    }
  });
};

//选择头像弹窗
const dialogImgVisable = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);


const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url;
  dialogImgVisable.value = false;
};

//定义一个字段拿到选中的数据
const selectTableData = ref([]);
//点击checkbox的时候会触发的一个回调函数，所以在这里可以拿到勾选的数据
const handleSelectionChange = (val) => {
  // console.log(val,'checkboxData')
  selectTableData.value = val.map((item) => ({ id: item.id }));
};

//点击删除确认时的事件
const confirmEvent = () => {
  //没有选择数据的情况下
  if (!selectTableData.value.length) {
    return ElMessage.warning("请选择至少一个删除项");
  }
  //如果有选择，调一下删除的接口(这个接口要传需要删除数组的id)
  deleteCompanion({ id: selectTableData.value }).then(({ data }) => {
    if (data.code === 10000) {
      //更新列表数据
      getListData();
    }
  });
};
</script>

<style lang="less" scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>