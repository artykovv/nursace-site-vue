<template>
  <div class="container">
    <div class="mt-5 d-flex justify-content-between align-items-center gap-2 flex-wrap">
      <router-link to="/categories" class="category-all-btn">
        <i class="bi bi-grid"></i>
        <span>Популярные категории</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </router-link>
      <!-- <router-link to="/category?discounts=true" class="discounts-all-btn">
        <i class="bi bi-fire"></i>
        <span>Все скидки</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </router-link> -->
    </div>

    <!-- Discounts section -->
    <div class="mt-4">
      <div class="d-flex align-items-center gap-2 mb-2">
        <!-- <i class="bi bi-fire" style="color:#ff5722; font-size:1.3rem;"></i> -->
        <!-- <h3 class="m-0 discounts-title">Горящие скидки</h3> -->
      </div>
      <div v-if="discountsLoading" class="text-center py-4">
        <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
      </div>
      <div v-else-if="!discounts.length" class="alert alert-light border text-center">Скидок сейчас нет</div>
      <div v-else class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <div v-for="d in discounts" :key="d.id" class="col mt-3">
          <router-link
            :to="{ path: '/category', query: { discounts: 'true', discount_id: d.id } }"
            class="category-card discount-card"
          >
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
    </div>

    <div v-if="loading" class="text-center py-5 mt-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>
    <div v-else class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])
const loading = ref(true)

const discounts = ref([])
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
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/categories/`)
    categories.value = await res.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }

  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/discounts/?is_active=true`)
    discounts.value = await res.json()
  } catch (e) {
    discounts.value = []
  } finally {
    discountsLoading.value = false
  }
})
</script>

<style scoped>
.discounts-title { font-size: 1.4rem; font-weight: 700; color: #40474f; }
.discounts-all-btn {
  display: inline-flex; align-items: center; gap: 8px;
  border-radius: 16px; font-size: 1rem; font-weight: 600;
  color: #ff5722; background: #fff7f3; border: 1px solid #ffd9cc;
  padding: 8px 14px; text-decoration: none;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s, transform 0.12s;
}
.discounts-all-btn:hover, .discounts-all-btn:focus {
  background: #ffe7df; color: #ff3d00; box-shadow: 0 4px 16px rgba(255,87,34,0.15);
  transform: translateY(-1px);
}

/* Discount cards with distinct UI */
.discount-card { background: linear-gradient(135deg, #fff8f4 0%, #ffe7df 100%); border-color: #ffd9cc; }
.discount-card:hover { box-shadow: 0 8px 26px rgba(255,87,34,0.16); transform: translateY(-2px) scale(1.02); }
.discount-card-inner { gap: 4px; }
.discount-icon { color: #ff7043; font-size: 2rem; transition: color 0.18s; }
.discount-card:hover .discount-icon { color: #ff3d00; }
.discount-badge { position: absolute; right: 0; top: 0; transform: translate(15%, -15%); background: #ff5722; color: #fff; font-weight: 800; padding: 1px 10px; border-radius: 999px; font-size: 0.95rem; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(255,87,34,0.25); }
.discount-time-left { font-size: 0.95rem; font-weight: 600; color: #6b7280; }
.discount-time-left.urgent { color: #e11d48; }
.discount-card-head { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.discount-card-head .discount-badge { position: static; transform: none; margin-right: auto; }
.discount-card-title { font-size: 1.08rem; font-weight: 800; color: #3f3f3f; text-align: center; }
.discount-card-meta { display: flex; justify-content: center; margin-top: 2px; }
.time-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #fff1ea; color: #8b5b4a; font-weight: 600; font-size: 0.92rem; }
.time-chip.urgent { background: #ffe2e8; color: #e11d48; }

@media (max-width: 576px) { .discounts-all-btn { font-size: 0.95rem; padding: 6px 12px; } }
</style>

<!-- existing styles below -->
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
.category-title-main {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #40474f;
}
.category-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 16px;
  font-size: 1.13rem;
  font-weight: 500;
  color: #40474f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #ececec;
  transition: background 0.18s, box-shadow 0.18s, color 0.18s;
  text-decoration: none;
  padding: 10px 18px;
  margin-left: 10px;
}
.category-all-btn i {
  font-size: 1.35rem;
  color: #b89b7a;
}
.category-all-btn svg {
  margin-left: 4px;
  color: #b89b7a;
}
.category-all-btn:hover, .category-all-btn:active {
  background: #ece6df;
  color: #b89b7a;
  box-shadow: 0 4px 16px rgba(200,180,140,0.08);
}
@media (max-width: 576px) {
  .category-card {
    padding: 16px 4px 14px 4px;
    min-height: 120px;
  }
  .category-img {
    width: 48px;
    height: 48px;
  }
  .category-title {
    font-size: 1rem;
  }
  .category-title-main {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    text-align: left;
  }
  .category-all-btn {
    font-size: 1rem;
    padding: 8px 12px;
    margin-left: 4px;
  }
  .category-all-btn i {
    font-size: 1.1rem;
  }
  .category-all-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style> 