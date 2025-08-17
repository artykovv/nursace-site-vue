import './assets/main.css'

import { compile, createApp } from 'vue'
import App from './App.vue'

import './utils/config.js'
import './utils/auth_utils.js'
import './utils/debounce.js'
import './utils/session_init.js'

import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import CategoriesPage from './pages/CategoriesPage.vue'
import CategoryPage from './pages/CategoryPage.vue'
import ProductPage from './pages/ProductPage.vue'
import CartPage from './pages/CartPage.vue'
import CheckoutPage from './pages/CheckoutPage.vue'
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage.vue'
import CheckoutFailurePage from '@/pages/CheckoutFailurePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LogoutPage from './pages/LogoutPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import ProfileOrdersPage from './pages/ProfileOrdersPage.vue'
import SearchPage from './pages/SearchPage.vue'
import SupportPage from './pages/SupportPage.vue'
import DocumentPage from './pages/DocumentPage.vue'
import FacebookCheckoutPage from './pages/FacebookCheckoutPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/categories', component: CategoriesPage },
  { path: '/category', component: CategoryPage },
  { path: '/product', component: ProductPage },
  { path: '/cart', component: CartPage },
  { path: '/checkout', component: CheckoutPage },
  { path: '/facebook/checkout', component: FacebookCheckoutPage },
  { path: '/checkout/success', component: CheckoutSuccessPage },
  { path: '/checkout/failure', component: CheckoutFailurePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/logout', component: LogoutPage },
  { path: '/profile', component: ProfilePage },
  { path: '/profile/orders', component: ProfileOrdersPage },
  { path: '/search', component: SearchPage },
  { path: '/docs/support', component: SupportPage },
  { path: '/docs/:slug', component: DocumentPage }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
