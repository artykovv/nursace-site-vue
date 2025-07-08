<template>
    <div class="container">
        <h1>{{ title }}</h1>

        <div class="content mt-5">
            <div v-if="loading"><p>Пожалуйста, подождите...</p></div>
            <div v-else v-html="content"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = ref('Загрузка...')
const content = ref('Пожалуйста, подождите...')
const loading = ref(true)

async function fetchDocument() {
  loading.value = true
  try {
    const siteUrl = window.AppConfig.siteUrl
    const slug = route.params.slug
    const response = await fetch(`${siteUrl}/documents/slug/${slug}`)
    if (!response.ok) throw new Error('Ошибка при загрузке данных')
    const data = await response.json()
    document.title = data.title
    title.value = data.title
    // Форматируем переносы строк
    const formattedContent = data.content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
    content.value = `<p>${formattedContent}</p>`
  } catch (error) {
    title.value = 'Ошибка'
    content.value = 'Не удалось загрузить документ. Попробуйте позже.'
    document.title = 'Ошибка'
    console.error('Ошибка при загрузке документа:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDocument)
</script>