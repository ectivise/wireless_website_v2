import Vue from 'vue'
import VueRouter from 'vue-router'
import accesspoint_overview from '../views/accesspoint.vue'
import raspberrypi_overview from '../views/raspberrypi.vue'

Vue.use(VueRouter)

  const routes = [
  {
    // '?' at the end of the params make it optional/ or query
    path: '/accesspoint/',
    name: 'accesspoint_main',
    component: accesspoint_overview
  },
  {
    // '?' at the end of the params make it optional/ or query
    path: '/accesspoint/manage/:raspi_id?',
    name: 'accesspoint_manage',
    component: accesspoint_overview
  },
  {
    path: '/raspberrypi',
    name: 'raspberrypi_main',
    component: raspberrypi_overview
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
