<template>
  <footer class="footer">
    <div>
      Crafted with <Heart class="footer__heart icon icon_base" /> by
      <br />
      <a href="https://github.com/begprod" class="link link_underline">Andrej Aratov</a>
    </div>

    <a
      class="link link_underline"
      href="https://github.com/begprod/todo.it#install-application-on-your-device"
      target="_blank"
      rel="noreferrer"
    >
      Install app on device instruction <ExternalLink class="icon icon_base" />
    </a>
  </footer>
</template>

<script setup lang="ts">
import { Heart, ExternalLink } from 'lucide-vue-next';
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  text-align: center;
  font-size: var(--typo-size-sm);

  svg {
    display: inline;
  }
}

.footer__heart {
  color: var(--color-typo-alert);
}
</style>
