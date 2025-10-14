<template>
  <el-menu
    :style="{ width: isCollapse ? '64px' : '230px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
   :collapse="isCollapse"
   :default-active="active"
  >
    <p class="logo-lg">{{ isCollapse ? "DIDI" : "DIDI陪诊" }}</p>
    <TreeMenu :menuData="menuData" :index="1"  :isCollapse="isCollapse"/>
    <!-- 由于菜单部分较为复杂，在这里抽离成一个组件 -->
    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item-group title="Group One">
        <el-menu-item index="1-1">item one</el-menu-item>
        <el-menu-item index="1-2">item two</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Group Two">
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-menu-item-group>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item> -->
  </el-menu>
</template>

<script setup>
import TreeMenue from "./treeMenu.vue";
import { useRouter } from "vue-router";
import { reactive,computed } from "vue";
import { useStore } from "vuex";

//拿到store实例
const store=useStore()

const active = computed(() => {
  return store.state.menu.menuActive
});

//拿到当前router的实例
const router=useRouter()
//创建响应式数据menu菜单，传给子组件treeMenu
const menuData=computed(()=>store.state.menu.routerList)

const isCollapse=computed(()=>store.state.menu.isCollapse)
const handleOpen=()=>{

}
const handleClose=()=>{

}
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
