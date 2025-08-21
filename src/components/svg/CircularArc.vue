<script setup lang="ts">
import { computed } from 'vue';
import Point from '@/domain/point';


interface Props {
  p1: Point;
  p2: Point;
  radius: number;
  direction: 0 | 1;
  center?: Point;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fill: 'none'
});

const arc = computed(() => {
  let result = `M ${props.p1.x} ${props.p1.y} A ${props.radius} ${props.radius} 0 0 ${props.direction} ${props.p2.x} ${props.p2.y}`;
  if (props.center) {
    result += `L ${props.center?.x ?? 0} ${props.center?.y ?? 0} Z`;
  }
  return result;
});
</script>

<template>
  <path :d="arc" :stroke="stroke" :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray" :fill="fill" />
</template>