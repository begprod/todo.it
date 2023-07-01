<template>
  <main>
    <div class="flex border-8 border-red-400">
      <div class="flex flex-col basis-3/12 border-8 border-blue-400">
        <slot name="sidebar"></slot>
      </div>
      <div class="flex flex-col grow border-8 border-purple-400">
        <slot name="content"></slot>
      </div>
    </div>
  </main>
</template>
