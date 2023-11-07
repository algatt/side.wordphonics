import { createRouter, createWebHistory } from "vue-router";
import UserView from "../views/UserView.vue";

const routes = [
  {
    path: "/",
    name: "User",
    component: UserView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
