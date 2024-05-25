<template>
  <footer
    class="container flex flex-col items-center justify-center mx-auto p-5 text-sm text-center text-gray-700"
    data-testid="footer"
  >
    <p data-testid="author-link">
      made with <span class="text-red-600 text-md">❤</span> by
      <a href="https://github.com/begprod" class="underline">begprod</a>
    </p>
    <p>
      <a
        class="underline"
        href="https://github.com/begprod/todo.it#install-application-on-your-device"
        target="_blank"
        rel="noreferrer"
        data-testid="installation-link"
      >
        Install app on device instruction
        <span class="inline-block ml-2 -rotate-12 origin-center">→</span>
      </a>
    </p>
  </footer>
</template>
