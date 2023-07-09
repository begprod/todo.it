<template>
  <main class="font-body">
    <div class="flex">
      <div class="flex flex-col basis-3/12 p-5">
        <slot name="sidebar"></slot>
      </div>
      <div class="flex flex-col grow p-5">
        <div class="grid gap-5">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </main>
</template>
