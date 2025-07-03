<template>
  <div class="filter-group mb-3">
    <h4>{{ label }}</h4>
    <div>
      <div v-for="option in options" :key="option.id || option.value" class="form-check filter-check" @click="toggle(option.id || option.value)">
        <input type="checkbox" class="form-check-input" :id="`${label}_${option.id || option.value}`" :value="option.id || option.value" v-model="modelValueLocal" @click.stop>
        <label class="form-check-label" :for="`${label}_${option.id || option.value}`">{{ option.name || option.value }}</label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ label: String, options: Array, modelValue: Array })
const emit = defineEmits(['update:modelValue'])
const modelValueLocal = ref(props.modelValue ? [...props.modelValue] : [])
watch(() => props.modelValue, v => { modelValueLocal.value = v ? [...v] : [] })
watch(modelValueLocal, v => emit('update:modelValue', v))

function toggle(val) {
  const idx = modelValueLocal.value.indexOf(val)
  if (idx === -1) modelValueLocal.value.push(val)
  else modelValueLocal.value.splice(idx, 1)
}
</script>
<style scoped>
.filter-check {
  cursor: pointer;
  padding: 7px 0 7px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.filter-check:hover {
  background: #f8f5f1;
}
.form-check-input {
  cursor: pointer;
}
.form-check-label {
  font-size: 1rem;
  color: #40474f;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
}
@media (max-width: 600px) {
  .filter-group h4 {
    font-size: 1.18rem;
    font-weight: 700;
    margin-bottom: 12px;
    margin-top: 0;
    color: #b89b7a;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .filter-check {
    padding: 16px 0 16px 10px;
    gap: 12px;
    min-height: 48px;
  }
  .filter-icon, .filter-icon-option {
    font-size: 1.35em;
    margin-right: 10px;
  }
  .form-check-label {
    font-size: 1.13rem;
    font-weight: 600;
    gap: 10px;
    padding-left: 12px;
  }
  .form-check-input {
    width: 1.35em;
    height: 1.35em;
    margin-top: 0;
    margin-bottom: 0;
  }
  .filter-group {
    margin-bottom: 18px;
  }
}
</style> 