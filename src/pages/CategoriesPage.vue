<template>
  <div v-if="loading" class="container text-center py-5">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <div class="container">
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
const loading = ref(true)
onMounted(async () => {
  document.title = 'Категории | Nursace'
  try {
    categories.value = await (await fetch(`${window.AppConfig.siteUrl}/categories/`)).json()
    brands.value = await (await fetch(`${window.AppConfig.siteUrl}/manufacturers/`)).json()
    collections.value = await (await fetch(`${window.AppConfig.siteUrl}/collections/`)).json()
    seasons.value = await (await fetch(`${window.AppConfig.siteUrl}/seasons/`)).json()
  } catch (e) {}
  loading.value = false
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
}
</style> 