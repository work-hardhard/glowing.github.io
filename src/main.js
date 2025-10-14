import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import store from './store'
//全局使用
import PanelHead from './components/panelHead.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//刷新后的动态路由添加
const localData=localStorage.getItem('pz_peizhen')
if(localData){
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item=>{
    router.addRoute('main',item)
  })
}

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


//路由守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('pz_token')
  //非登录页面token还不存在
  if (!token && to.path !== '/login') {
    return '/login'
  }
  //token已经有（即已经登录过了），想要再去登录页面，就去到根目录
  else if (token && to.path === '/login') {
    return '/'
  } else {
    return true
  }
})
app.component('PanelHead',PanelHead)

app.use(router)
app.use(store)
app.mount('#app')
