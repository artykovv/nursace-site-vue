<template>
  <div v-if="loading" class="container text-center py-5">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <div class="container">
      <div class="d-flex align-items-center justify-content-between mb-2 mt-3">
        <div class="d-flex align-items-center gap-2">
          <h2 class="mt-3">Горящие скидки</h2>
          <!-- <i class="bi bi-fire" style="color:#ff5722;"></i> -->
        </div>
        <router-link to="/category?discounts=true" class="discounts-all-btn">
          <i class="bi bi-fire"></i>
          <span>Все скидки</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </router-link>
      </div>
      <div v-if="discountsLoading" class="text-center py-3">
        <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
      </div>
      <div v-else-if="!discounts.length" class="alert alert-light border">Скидок сейчас нет</div>
      <div v-else class="mt-2 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="d in discounts" :key="d.id" class="col mt-3">
          <router-link :to="{ path: '/category', query: { discounts: 'true', discount_id: d.id } }" class="category-card discount-card">
            <div class="category-card-inner discount-card-inner">
              <div class="category-img mb-2 position-relative discount-card-head">
                <div class="discount-badge">-{{ d.discount_percent }}%</div>
                <i class="bi bi-fire discount-icon"></i>
              </div>
              <div class="discount-card-title">{{ d.name }}</div>
              <div class="discount-card-meta">
                <span class="time-chip" :class="{ urgent: isUrgent(d.end_date) }">
                  <i class="bi bi-clock"></i>
                  Осталось: {{ formatTimeLeft(d.end_date) }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <h2 class="mt-3">Категории</h2>
      <div class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="item in categories" :key="item.category_id" class="col mt-3">
          <router-link :to="{ path: '/category', query: { category_id: item.category_id } }" class="category-card">
            <div class="category-card-inner">
              <div class="category-img mb-2">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.category_name" />
                <i v-else class="bi bi-grid category-placeholder"></i>
              </div>
              <div class="category-title">{{ item.category_name }}</div>
            </div>
          </router-link>
        </div>
      </div>
      <h2 class="mt-3">Бренды</h2>
      <div class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="item in brands" :key="item.manufacturer_id" class="col mt-3">
          <router-link :to="{ path: '/category', query: { manufacturer_id: item.manufacturer_id } }" class="category-card">
            <div class="category-card-inner">
              <div class="category-img mb-2">
                <i class="bi bi-award category-placeholder"></i>
              </div>
              <div class="category-title">{{ item.manufacturer_name }}</div>
            </div>
          </router-link>
        </div>
      </div>
      <h2 class="mt-3">Коллекции</h2>
      <div class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="item in collections" :key="item.collection_id" class="col mt-3">
          <router-link :to="{ path: '/category', query: { collection_id: item.collection_id } }" class="category-card">
            <div class="category-card-inner">
              <div class="category-img mb-2">
                <i class="bi bi-collection category-placeholder"></i>
              </div>
              <div class="category-title">{{ item.collection_name }}</div>
            </div>
          </router-link>
        </div>
      </div>
      <h2 class="mt-3">Сезоны</h2>
      <div class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="item in seasons" :key="item.season_id" class="col mt-3">
          <router-link :to="{ path: '/category', query: { season_id: item.season_id } }" class="category-card">
            <div class="category-card-inner">
              <div class="category-img mb-2">
                <i class="bi bi-calendar2-week category-placeholder"></i>
              </div>
              <div class="category-title">{{ item.season_name }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const categories = ref([])
const brands = ref([])
const collections = ref([])
const seasons = ref([])
const discounts = ref([])
const loading = ref(true)
const discountsLoading = ref(true)

function formatTimeLeft(end) {
  try {
    const endDate = new Date(end)
    const now = new Date()
    const diffMs = endDate - now
    if (isNaN(endDate.getTime())) return '—'
    if (diffMs <= 0) return 'завершено'
    const dayMs = 24 * 60 * 60 * 1000
    const hourMs = 60 * 60 * 1000
    const minMs = 60 * 1000
    const days = Math.floor(diffMs / dayMs)
    const hours = Math.floor((diffMs % dayMs) / hourMs)
    const mins = Math.floor((diffMs % hourMs) / minMs)
    if (days > 0) return `${days}д ${hours}ч`
    if (hours > 0) return `${hours}ч ${mins}м`
    return `${mins}м`
  } catch {
    return '—'
  }
}
function isUrgent(end) {
  const endDate = new Date(end)
  const diffMs = endDate - new Date()
  return diffMs > 0 && diffMs < 48 * 60 * 60 * 1000
}

onMounted(async () => {
  document.title = 'Категории | Nursace'
  try {
    categories.value = await (await fetch(`${window.AppConfig.siteUrl}/categories/v3/`)).json()
    brands.value = await (await fetch(`${window.AppConfig.siteUrl}/manufacturers/v3/`)).json()
    collections.value = await (await fetch(`${window.AppConfig.siteUrl}/collections/v3/`)).json()
    seasons.value = await (await fetch(`${window.AppConfig.siteUrl}/seasons/v3/`)).json()
  } catch (e) {}
  loading.value = false

  try {
    discounts.value = await (await fetch(`${window.AppConfig.siteUrl}/discounts/?is_active=true`)).json()
  } catch (e) {
    discounts.value = []
  }
  discountsLoading.value = false
})
</script>
<style scoped>
.discounts-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #40474f;
}
.discounts-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #ff5722;
  background: #fff7f3;
  border: 1px solid #ffd9cc;
  padding: 8px 14px;
  text-decoration: none;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s, transform 0.12s;
}
.discounts-all-btn:hover, .discounts-all-btn:focus {
  background: #ffe7df;
  color: #ff3d00;
  box-shadow: 0 4px 16px rgba(255,87,34,0.15);
  transform: translateY(-1px);
}
.discount-icon {
  color: #ff7043;
  font-size: 2rem;
  transition: color 0.18s;
}
.discount-card:hover .discount-icon {
  color: #ff3d00;
}
.discount-badge {
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(15%, -15%);
  background: #ff5722;
  color: #fff;
  font-weight: 800;
  padding: 1px 10px;
  border-radius: 999px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(255,87,34,0.25);
}
.discount-time-left {
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
}
.discount-time-left.urgent { color: #e11d48; }
</style>
<style scoped>
.category-card {
  display: block;
  text-decoration: none;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: box-shadow 0.22s, transform 0.22s, background 0.18s;
  padding: 22px 10px 18px 10px;
  height: 100%;
  min-height: 160px;
  cursor: pointer;
  border: 1px solid #f2f2f2;
}
.category-card:hover, .category-card:focus {
  box-shadow: 0 6px 24px rgba(180,155,120,0.13);
  background: #f8f5f1;
  transform: translateY(-2px) scale(1.03);
}
.category-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.category-img {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.category-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  background: #f4f4f4;
}
.category-placeholder {
  font-size: 2.5rem;
  color: #b89b7a;
  opacity: 0.7;
}
.category-title {
  text-align: center;
  font-size: 1.13rem;
  font-weight: 600;
  color: #40474f;
  margin-top: 2px;
}
.discount-card-inner { gap: 4px; }
.discount-card-head { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.discount-card-head .discount-badge { position: static; transform: none; margin-right: auto; }
.discount-card-title { font-size: 1.08rem; font-weight: 800; color: #3f3f3f; text-align: center; }
.discount-card-meta { display: flex; justify-content: center; margin-top: 2px; }
.time-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #fff1ea; color: #8b5b4a; font-weight: 600; font-size: 0.92rem; }
.time-chip.urgent { background: #ffe2e8; color: #e11d48; }
</style> 