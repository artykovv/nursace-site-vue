<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card p-4">
          <h2 class="mb-4 text-center">Регистрация</h2>
          <RegistrationStepper />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RegistrationStepper from '../components/RegistrationStepper.vue'
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.btn-primary {
  background: #cdb5a7;
  border: none;
}
.btn-primary:hover, .btn-primary:focus {
  background: #b89b7a;
}
</style> 