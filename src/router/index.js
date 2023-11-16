import { createRouter, createWebHistory } from "vue-router";
import UserView from "../views/UserView.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "User",
    component: UserView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
