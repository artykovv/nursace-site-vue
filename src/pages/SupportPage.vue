<template>
  <div class="container">
    <h1 id="title" class="mt-5">Служба поддержки</h1>
    <div class="content mt-5">
      <p id="content">Работаем ежедневно с 09:00 до 20:00.</p>
      <div class="card p-3">
        <h5 class="fs4 btn text-start">Способы связи</h5>
        <a href="" class="mobile-menu-btn mb-2">
          <i class="bi bi-telegram"></i>
          <span>Поддержка в Telegram</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </a>
        <a href="" class="mobile-menu-btn mb-2">
          <i class="bi bi-whatsapp"></i>
          <span>Поддержка в WhatsApp</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </a>
        <a href="" class="mobile-menu-btn">
          <i class="bi bi-telephone"></i>
          <span>Позвонить в поддержку</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => { document.title = 'Служба поддержки | Nursace' })

// Нет логики, только разметка
</script>

<style scoped>
.card {
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-top: 2rem;
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
</style> 