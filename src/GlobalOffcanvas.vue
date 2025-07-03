<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="offcanvas offcanvas-bottom offcanvas-mobile show"
      tabindex="-1"
      style="--bs-offcanvas-height: 80vh; display: block; z-index: 1200;"
      @click.self="close"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">{{ title }}</h5>
        <button type="button" class="btn-close" @click="close" aria-label="Закрыть"></button>
      </div>
      <div class="offcanvas-body">
        <slot v-if="!dynamicContent" />
        <component v-else :is="dynamicContent" v-bind="dynamicProps" />
      </div>
    </div>
    <div v-if="visible" class="offcanvas-backdrop fade show" style="z-index:1199;"></div>
  </Teleport>
</template>

<script setup>
import { ref, provide } from 'vue'
const visible = ref(false)
const title = ref('')
const dynamicContent = ref(null)
const dynamicProps = ref({})

function open({ title: t = '', content = null, props = {} } = {}) {
  title.value = t
  dynamicContent.value = content
  dynamicProps.value = props
  visible.value = true
}
function close() {
  visible.value = false
  title.value = ''
  dynamicContent.value = null
  dynamicProps.value = {}
}
provide('openGlobalOffcanvas', open)
provide('closeGlobalOffcanvas', close)
</script>

<style scoped>
.offcanvas-mobile {
  z-index: 1200 !important;
}
.offcanvas-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  opacity: 0.5;
}
</style> 