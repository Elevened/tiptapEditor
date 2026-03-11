<template>
  <div class="tooltip-wrapper"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    ref="wrapperRef"
  >
    <slot />
  </div>
  
  <Teleport to="body">
    <Transition name="tooltip">
      <div 
        v-if="visible" 
        class="custom-tooltip"
        :class="[`tooltip-${position}`]"
        :style="tooltipStyle"
      >
        <div class="tooltip-content">
          <span class="tooltip-text">{{ content }}</span>
          <span v-if="shortcut" class="tooltip-shortcut">{{ shortcut }}</span>
        </div>
        <div class="tooltip-arrow" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  content: string
  shortcut?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 300
})

const visible = ref(false)
const wrapperRef = ref<HTMLElement>()
const tooltipPosition = ref({ x: 0, y: 0 })
let timeoutId: ReturnType<typeof setTimeout> | null = null

const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`,
  position: 'fixed' as const,
  zIndex: 9999
}))

const updatePosition = async () => {
  await nextTick()
  if (!wrapperRef.value) return
  
  const rect = wrapperRef.value.getBoundingClientRect()
  const tooltipWidth = 120
  const tooltipHeight = 40
  const offset = 8
  
  let x = 0
  let y = 0
  
  switch (props.position) {
    case 'top':
      x = rect.left + rect.width / 2
      y = rect.top - offset
      break
    case 'bottom':
      x = rect.left + rect.width / 2
      y = rect.bottom + offset
      break
    case 'left':
      x = rect.left - offset
      y = rect.top + rect.height / 2
      break
    case 'right':
      x = rect.right + offset
      y = rect.top + rect.height / 2
      break
  }
  
  tooltipPosition.value = { x, y }
}

const showTooltip = async () => {
  await updatePosition()
  timeoutId = setTimeout(() => {
    visible.value = true
  }, props.delay)
}

const hideTooltip = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  visible.value = false
}
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.custom-tooltip {
  pointer-events: none;
  animation: tooltip-in 0.2s ease;
}

.tooltip-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}

.tooltip-text {
  font-weight: 500;
}

.tooltip-shortcut {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.8);
}

.tooltip-arrow {
  position: fixed;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.9);
  transform: rotate(45deg);
  z-index: 9999;
}

/* 位置调整 */
.tooltip-top {
  transform: translate(-50%, -100%);
  margin-top: -8px;
}

.tooltip-top .tooltip-arrow {
  left: 50%;
  top: 100%;
  margin-left: -4px;
  margin-top: -4px;
}

.tooltip-bottom {
  transform: translate(-50%, 0);
  margin-top: 8px;
}

.tooltip-bottom .tooltip-arrow {
  left: 50%;
  top: -4px;
  margin-left: -4px;
}

.tooltip-left {
  transform: translate(-100%, -50%);
  margin-left: -8px;
}

.tooltip-left .tooltip-arrow {
  left: 100%;
  top: 50%;
  margin-left: -4px;
  margin-top: -4px;
}

.tooltip-right {
  transform: translate(0, -50%);
  margin-left: 8px;
}

.tooltip-right .tooltip-arrow {
  left: -4px;
  top: 50%;
  margin-top: -4px;
}

/* 动画 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}

@keyframes tooltip-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 暗色模式适配 */
:global(.dark-mode) .tooltip-content {
  background: rgba(30, 30, 30, 0.95);
}

:global(.dark-mode) .tooltip-arrow {
  background: rgba(30, 30, 30, 0.95);
}

/* 修复被父容器裁剪 */
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}
</style>
