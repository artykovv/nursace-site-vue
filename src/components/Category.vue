<template>
  <div class="container">
    <div class="mt-5 d-flex justify-content-between align-items-center">
      <!-- <h2 class="category-title-main">Популярные категории</h2> -->
      <router-link to="/categories" class="category-all-btn">
        <i class="bi bi-grid"></i>
        <span>Популярные категории</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </router-link>
    </div>
    <div v-if="loading" class="text-center py-5 mt-5">
      <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
    </div>
    <div v-else class="mt-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
      <div v-for="item in categories" :key="item.category_id" class="col mt-3">
        <router-link :to="{ path: '/category', query: { category: item.category_id } }" class="category-card">
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

onMounted(async () => {
  try {
    const res = await fetch(`${window.AppConfig.siteUrl}/categories/`)
    categories.value = await res.json()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

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