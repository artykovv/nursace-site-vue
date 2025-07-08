<template>
  <!-- Desktop Header -->
  <div class="container fixed-top d-none d-md-block" id="main-header" style="background-color: white;">
    <div class="header-container">
      <div class="header py-3">
        <div class="logo">
          <a href="/">
            <img src="https://static.ticimax.cloud/5448/uploads/editorUploads/nurasce-web-logo-02.png" alt="Logo" class="img-fluid" style="max-height: 60px;">
          </a>
        </div>
        <div class="catalog">
          <a href="/categories">
            <button type="button" class="btn d-flex align-items-center justify-content-center gap-2" style="background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%); color: #fff;">
              <i class="bi bi-list" style="font-size: 1.5rem;"></i>
              <span>Каталог</span>
            </button>
          </a>
        </div>
        <div class="search flex-grow-1 mx-3">
          <div class="input-group">
            <input v-model="searchQuery" @keyup.enter="doSearch" type="text" class="form-control" placeholder="Поиск" aria-label="Поиск" aria-describedby="button-search">
            <button class="btn" type="button" @click="doSearch" style="background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%); color: #fff;">Найти</button>
          </div>
        </div>
        <div class="actions d-flex gap-2">
          <a :href="isAuthenticated ? '/profile' : '/login'" class="btn d-flex flex-column align-items-center justify-content-center">
            <i class="bi bi-person-circle" style="font-size: 1.5rem;"></i>
            <span class="small">{{ isAuthenticated ? 'Профиль' : 'Войти' }}</span>
          </a>
          <a href="/cart" class="btn d-flex flex-column align-items-center justify-content-center">
            <div class="position-relative d-inline-block cart-icon-wrapper">
              <i class="bi bi-basket3" style="font-size: 1.5rem;"></i>
              <span v-if="cartCount > 0" class="cart-count-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-badge">
                <span class="number">{{ cartCount > 99 ? '99+' : cartCount }}</span>
                <span class="visually-hidden">items in cart</span>
              </span>
            </div>
            <span class="small">Корзина</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Header -->
  <div class="container d-block d-md-none">
    <div class="mobile-header" id="mobile-header">
      <button class="btn btn-primary me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileOffcanvasMenu" aria-controls="mobileOffcanvasMenu" style="background: linear-gradient(90deg,#cdb5a7 0,#b89b7a 100%); color: #fff;">
        <i class="bi bi-list" style="font-size: 1.5rem;"></i>
      </button>
      <div class="mobile-search flex-grow-1 mx-3">
        <div class="input-group w-100">
          <input v-model="searchQuery" @keyup.enter="doSearch" type="text" class="form-control" placeholder="Поиск" aria-label="Поиск" style="height: 45px;">
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Offcanvas Menu -->
  <div class="offcanvas-mobile offcanvas offcanvas-bottom" tabindex="-1" id="mobileOffcanvasMenu" aria-labelledby="mobileOffcanvasMenuLabel" style="--bs-offcanvas-height: 80vh;">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="mobileOffcanvasMenuLabel">
        <img src="https://static.ticimax.cloud/5448/uploads/editorUploads/nurasce-web-logo-02.png" alt="Logo" class="img-fluid" style="max-height: 60px;">
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"></button>
    </div>
    <div class="offcanvas-body small">
      <div class="card mobile-menu-card">
        <h5 class="fs4">Меню</h5>
        <a href="/categories/" class="mobile-menu-btn">
          <i class="bi bi-grid"></i>
          <span>Каталог</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/cart/" class="mobile-menu-btn">
          <i class="bi bi-basket3"></i>
          <span>Корзина</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/profile/" class="mobile-menu-btn">
          <i class="bi bi-person-circle"></i>
          <span>Личный кабинет</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/support/" class="mobile-menu-btn">
          <i class="bi bi-question-circle"></i>
          <span>Поддержка</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/support/" class="mobile-menu-btn">
          <i class="bi bi-arrow-counterclockwise"></i>
          <span>Возврат товара</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
      <div class="card mobile-menu-card">
        <h5 class="fs4">Мы в социальных сетях</h5>
        <a href="/" class="mobile-menu-btn">
          <i class="bi bi-instagram"></i>
          <span>Instagram</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
      <div class="card mobile-menu-card">
        <a href="/docs/userAgreement" class="mobile-menu-btn">
          <i class="bi bi-file-earmark-text"></i>
          <span>Пользовательское соглашение</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/privacyPolicy" class="mobile-menu-btn">
          <i class="bi bi-shield-lock"></i>
          <span>Политика конфиденциальности</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
      <div class="card mobile-menu-card">
        <h5 class="fs4">Информация</h5>
        <a href="/docs/sposoby-oplaty" class="mobile-menu-btn">
          <i class="bi bi-credit-card"></i>
          <span>Способы оплаты</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/o-nas" class="mobile-menu-btn">
          <i class="bi bi-info-circle"></i>
          <span>О нас</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/politika-vozvrata-tovarov" class="mobile-menu-btn">
          <i class="bi bi-arrow-counterclockwise"></i>
          <span>Политика возврата товаров</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/pravila-vozvrata-denezhnyh-sredstv" class="mobile-menu-btn">
          <i class="bi bi-cash-coin"></i>
          <span>Правила возврата денежных средств</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
        <a href="/docs/kontakty" class="mobile-menu-btn">
          <i class="bi bi-telephone"></i>
          <span>Контакты</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </div>

  <!-- Mobile Footer -->
  <div class="mobile-footer d-block d-md-none d-flex">
    <a href="/" class="mobile-footer-btn">
      <i class="bi bi-house"></i><span class="small">Главная </span>
    </a>
    <a href="/categories" class="mobile-footer-btn">
      <i class="bi bi-grid"></i><span class="small">Каталог</span>
    </a>
    <a href="/cart" class="mobile-footer-btn">
      <div class="position-relative d-inline-block cart-icon-wrapper">
        <i class="bi bi-basket3"></i>
        <span v-if="cartCount > 0" class="cart-count-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-badge">
          <span class="number">{{ cartCount > 99 ? '99+' : cartCount }}</span>
          <span class="visually-hidden">items in cart</span>
        </span>
      </div>
      <span class="small">Корзина</span>
    </a>
    <a :href="isAuthenticated ? '/profile' : '/login'" class="mobile-footer-btn">
      <i class="bi bi-person-circle"></i><span class="small">{{ isAuthenticated ? 'Профиль' : 'Войти' }}</span>
    </a>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../utils/auth_utils'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const cartCount = ref(0)
const { isAuthenticated, checkAuth } = useAuth()
const router = useRouter()

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { query: searchQuery.value.trim() } })
  }
}

async function fetchCartCount() {
  try {
    const param = window.getAuthParam ? await window.getAuthParam() : null
    if (!param) return
    const url = `${window.AppConfig.siteUrl}/cart/count?${param}`
    const res = await fetch(url)
    if (!res.ok) return
    const data = await res.json()
    cartCount.value = data.count || 0
  } catch (e) {
    cartCount.value = 0
  }
}

onMounted(async () => {
  await checkAuth()
  await fetchCartCount()
  // Подписка на глобальное обновление корзины
  window.updateCartCount = async () => {
    await fetchCartCount()
  }
})
</script>

<style scoped>
.header-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

:global(body) {
  padding-top: 90px;
}

.header {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  width: 200px;
}
.logo img {
  transition: transform 0.3s ease;
  height: 45px;
}
.logo img:hover {
  transform: scale(1.05);
}
.catalog button {
  width: 120px;
  height: 45px;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}
.search .form-control {
  border-radius: 0.25rem 0 0 0.25rem;
  height: 45px;
}
.search .btn {
  border-radius: 0 0.25rem 0.25rem 0;
}
.actions a {
  width: 70px;
  height: 45px;
  transition: background-color 0.3s ease;
  color: #40474f;
}
.actions .small {
  font-size: 0.8rem;
}
@media (max-width: 768px) {
  .header {
    display: none;
  }
}
@media (max-width: 576px) {
  .header {
    display: none;
  }
  .mobile-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* background-color: #fff; */
    /* border-top: 1px solid #ddd; */
    padding: 10px;
    z-index: 1000;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .mobile-footer i {
    color: #40474f;
  }
  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    padding: 10px;
    z-index: 1000;
  }
  .mobile-header .mobile-search {
    width: 100%;
    margin-left: 10px;
    margin-right: 10px;
  }
  .mobile-header .mobile-search .input-group {
    height: 45px;
  }
  :global(body) {
    padding-bottom: 70px;
  }
}
.cart-count-badge {
  transition: transform 0.3s ease;
}
.cart-count-badge .number {
  display: inline-block;
}
.mobile-menu-card {
  border: none;
  box-shadow: none;
  margin-bottom: 18px;
  background: transparent;
}
.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  margin-bottom: 10px;
  background: #f8f8f8;
  border-radius: 16px;
  font-size: 1.13rem;
  font-weight: 500;
  color: #40474f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #ececec;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
}
.mobile-menu-btn i {
  font-size: 1.35rem;
  margin-right: 8px;
  color: #b89b7a;
}
.mobile-menu-btn svg {
  margin-left: auto;
  color: #b89b7a;
}
.mobile-menu-btn:hover, .mobile-menu-btn:active {
  background: #ece6df;
  color: #b89b7a;
  box-shadow: 0 4px 16px rgba(200,180,140,0.08);
}
.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px 0 6px 0;
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.mobile-footer-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  font-size: 1.13rem;
  font-weight: 500;
  background-color: #fff;
  color: #40474f;
  border: 1px solid #ececec;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
  padding: 10px 14px 6px 14px;
  min-width: 100px;
  width: 100px;
  min-height: 62px;
  margin: 0 2px;
}
.mobile-footer-btn i {
  font-size: 1.5rem;
  margin-bottom: 2px;
  color: #b89b7a;
}
.mobile-footer-btn .small {
  font-size: 0.82rem;
  margin-top: 2px;
  display: block;
  width: 100%;
  text-align: center;
  min-height: 18px;
  white-space: nowrap;
}
.mobile-footer-btn:hover, .mobile-footer-btn:active {
  background: #ece6df;
  color: #b89b7a;
  box-shadow: 0 4px 16px rgba(200,180,140,0.08);
}
</style> 