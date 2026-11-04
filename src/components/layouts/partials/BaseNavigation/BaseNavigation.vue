<template>
  <nav class="navigation">
    <template v-for="item in props.items" :key="item.name">
      <RouterLink
        v-if="item.to"
        :to="item.to"
        class="navigation__link"
        :class="{ navigation__link_active: item.name === props.activeName }"
        :aria-current="item.name === props.activeName ? 'page' : undefined"
        :data-test-id="`nav-link-${item.name}`"
      >
        <component v-if="item.icon" :is="item.icon" class="icon icon_md" />

        {{ item.title }}
      </RouterLink>

      <button
        v-else
        type="button"
        class="navigation__link"
        :class="{ navigation__link_active: item.name === props.activeName }"
        :aria-current="item.name === props.activeName ? 'page' : undefined"
        :data-test-id="`nav-link-${item.name}`"
        @click="emit('select', item)"
      >
        <component v-if="item.icon" :is="item.icon" class="icon icon_md" />

        {{ item.title }}
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { IMenuItem } from '@/types';
import { RouterLink } from 'vue-router';

const props = defineProps<{ items: IMenuItem[]; activeName?: string }>();
const emit = defineEmits<{ select: [item: IMenuItem] }>();
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.navigation__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: var(--color-typo-ghost);
  font-size: var(--typo-size-lg);
  text-decoration: none;
  border-radius: var(--rounded-lg);
  transition: 0.3s ease-in-out;
  transition-property: color, background-color;
}

.navigation__link_active {
  color: var(--color-typo-link);
  box-shadow: rgba(0, 0, 0, 0.06) 0px 10px 10px 0px;
  background-color: var(--color-bg-surface-trinary);
}
</style>
