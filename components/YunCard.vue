<script lang="ts" setup>
defineProps<{ cover?: string }>()
</script>

<template>
  <div class="yun-card flex-center" flex="col" min-h="100px" bg="$va-c-bg-light" style="border-radius: 10px;opacity: 0.9;">
    <img
      v-if="cover"
      width="640" height="360"
      class="object-cover select-none" h="64 md:sm" w="full" :src="cover"
    >

    <div v-if="$slots.header" class="yun-card-header">
      <header>
        <slot name="header" />
      </header>
    </div>
    <slot />
    <div v-if="$slots.content" class="yun-card-content" w="full">
      <slot name="content" />
    </div>
  </div>
</template>
