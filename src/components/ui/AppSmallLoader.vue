<template>
  <span class="SmallLoader"></span>
</template>

<style scoped>
.SmallLoader {
  margin: 0;
  padding: 0;
  width: 17px;
  height: 17px;
  border: 2px dotted #b9b8b8;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
