<script setup lang="ts"></script>

<template>
  <div class="projects-list">
    <div v-for="i in 3" :key="i" class="projects-list__item">
      <div class="projects-list__item-title">budget.it</div>
      <div class="projects-list__item-description">
        <span>tasks: </span>
        <span>10/100</span>
      </div>
    </div>
    <div v-for="i in 10" :key="i" class="projects-list__item">
      <div class="projects-list__item-title">Todo.it</div>
      <div class="projects-list__item-description">
        <span>tasks: </span>
        <span>10/100</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: stretch;
  flex-wrap: wrap;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
}

.projects-list__item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-height: 120px;
  border-radius: var(--rounded-lg);
  background-color: var(--color-bg-surface-secondary);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 10px 10px 0px;
}

.projects-list__item-title {
  margin-bottom: 0.75rem;
  font-weight: bold;
}

.projects-list__item-description {
  font-size: 0.875rem;
  color: var(--color-typo-trinary);
}
</style>
