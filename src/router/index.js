import Vue from 'vue'
import VueRouter from 'vue-router'
import accesspoint_overview from '../views/accesspoint.vue'
import raspberrypi_overview from '../views/raspberrypi.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/accesspoint',
    name: 'accesspoint',
    component: accesspoint_overview
  },
  {
    path: '/raspberrypi',
    name: 'raspberrypi',
    component: raspberrypi_overview
  }
]

const router = new VueRouter({
  routes
})

export default router
