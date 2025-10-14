import menu from './menu'
import {createStore} from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
  //plugins可以接收多个处理函数
  plugins:[new createPersistedstate({
    key:'pz_peizhen'
  })],
  modules:{
    menu
  }
})



