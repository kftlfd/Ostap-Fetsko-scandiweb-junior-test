import { createWebHistory, createRouter } from "vue-router";

import ProductsList from "./features/list/ProductsList.vue";
import ProductAdd from "./features/add/ProductAdd.vue";
import NotFound from "./layout/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  end: true,
  routes: [
    { path: "/", component: ProductsList },
    { path: "/add", component: ProductAdd },
    { path: "/index.html", redirect: "/" },
    { path: "/:pathMatch(.*)", component: NotFound },
  ],
});

export default router;
