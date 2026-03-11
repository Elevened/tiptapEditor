<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  icon: string
  size?: number | string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 20,
})

const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
</script>

<template>
  <Icon 
    :icon="icon" 
    :width="sizeValue" 
    :height="sizeValue"
    :color="color"
  />
</template>
