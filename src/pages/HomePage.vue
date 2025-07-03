<template>
  <div v-if="loading" class="container text-center">
    <div class="spinner-border" role="status"><span class="visually-hidden">Загрузка...</span></div>
  </div>
  <div v-else>
    <Carousel />
    <Category />
    <ProductsCarousel />
  </div>
</template>
<script setup>
import Carousel from '../components/Carousel.vue'
import Category from '../components/Category.vue'
import ProductsCarousel from '../components/ProductsCarousel.vue'
import { onMounted, ref } from 'vue'
const loading = ref(true)
onMounted(() => {
  document.title = 'Главная | Nursace'
  setTimeout(() => { loading.value = false }, 400) // имитация быстрой загрузки
})
</script> 