<template>
  <main class="font-body">
    <div class="flex border-8 border-red-400">
      <div class="flex flex-col basis-3/12 p-5 border-8 border-blue-400">
        <slot name="sidebar"></slot>
      </div>
      <div class="flex flex-col grow p-5 border-8 border-purple-400">
        <div class="grid gap-5">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
