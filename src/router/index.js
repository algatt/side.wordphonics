import { createRouter, createWebHistory } from "vue-router";
import AdminView from "../views/AdminView.vue";
import UserView from "../views/UserView.vue";

const routes = [
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
  },
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
