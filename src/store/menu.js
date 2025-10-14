const localData=localStorage.getItem('pz_peizhen')

const state= localData? localData.menu:{
isCollapse:false,
selectMenu:[],
routerList:[],
menuActive:'1-1'
}

const mutations={
  //定义菜单是否收起的函数
  collapseMenu(state){
    state.isCollapse=!state.isCollapse
  },
  //记录当前选中的菜单数据
  addMenu(state,payload){
    if(state.selectMenu.findIndex(item=>item.path===payload.path)===-1){
      state.selectMenu.push(payload)
    }
  },
  closeMenu (state,payload){
    //找到点击数据的索引
    const index=state.selectMenu.findIndex(val=> val.name === payload.name )
    //通过索引删除数组指定元素
    state.selectMenu.splice(index,1)
  },
  dynamicMenu(state,payload){
   
    //通过glob导入文件 可能会有一级目录也可能会有二级目录
    const modules=import.meta.glob('../views/**/**/*.vue')
    console.log(modules)
    function routerSet(router){
      router.forEach(route=>{
        //判断没有子菜单，拼接路由数据
      if(!route.children){
        const url=`../views${route.meta.path}/index.vue`
        //拿到获取的vue组件 将数据中的component所对应的路径转化成当前页面所对应的文件
        route.component=modules[url]
      }else{
        //有子菜单时，要进行递归
        routerSet(route.children)
      }
      })
      
    }
    routerSet(payload)
    //拿到完整的路由数据
    console.log(payload,'payload')
    state.routerList=payload
  },
  updateMenuActive(state,payload){
    state.menuActive=payload
  }
}

export default{
  state,
  mutations
}