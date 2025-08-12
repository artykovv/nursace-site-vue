<template>
  <div class="container carousel_container">
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner rounded" id="carouselInner">
        <div
          v-for="(item, index) in carouselData"
          :key="index"
          :class="['carousel-item', { active: index === 0 }]"
        >
          <a :href="item.href">
            <img :src="item.src" class="d-block w-100" :alt="`Slide ${index + 1}`" />
          </a>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const carouselData = ref([])

onMounted(async () => {
  try {
    const response = await fetch(`${window.AppConfig.siteUrl}/carousel/`)
    const data = await response.json()
    if (Array.isArray(data) && data.length > 0) {
      carouselData.value = data
    } else {
      carouselData.value = [
        { href: '/', src: 'https://placehold.co/3000x1500' },
        { href: '/', src: 'https://placehold.co/3000x1500' }
      ]
    }
  } catch (error) {
    console.error('Ошибка загрузки карусели:', error)
    carouselData.value = [
      { href: '/', src: 'https://placehold.co/3000x1500' },
      { href: '/', src: 'https://placehold.co/3000x1500' }
    ]
  }
})
</script>

<style scoped>
.carousel_container {
  margin-top: 2rem;
}
</style> 