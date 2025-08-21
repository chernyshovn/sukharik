<script setup lang="ts">
import Point from '@/domain/point';


interface Props {
  p1: Point;
  p2: Point;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

withDefaults(defineProps<Props>(), {
  stroke: 'black',
  strokeWidth: 1
});
</script>

<template>
  <line :x1="p1.x" :y1="p1.y" :x2="p2.x" :y2="p2.y" :stroke="stroke" :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray" />
</template>