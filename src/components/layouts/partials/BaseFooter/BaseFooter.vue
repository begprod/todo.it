<template>
  <footer class="footer">
    <a
      class="link"
      href="https://github.com/begprod/todo.it#install-application-on-your-device"
      target="_blank"
      rel="noreferrer"
      aria-label="Install app on device instruction"
    >
      install <ExternalLink class="icon icon_sm" />
    </a>

    <br />

    <a href="https://github.com/begprod" class="link" aria-label="GitHub profile of Andrej Aratov">
      crafted by Andrej Aratov
    </a>
    <Heart class="footer__heart icon icon_base" />
  </footer>
</template>

<script setup lang="ts">
import { Heart, ExternalLink } from 'lucide-vue-next';
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  text-align: center;
  font-size: var(--typo-size-sm);

  svg {
    display: inline;
  }
}

.footer__heart {
  color: var(--color-typo-alert);
  fill: var(--color-typo-alert);
}
</style>
