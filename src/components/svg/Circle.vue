<script setup lang="ts">
import Point from '@/domain/point';


interface Props {
  center: Point;
  radius: number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  fill?: string
}

withDefaults(defineProps<Props>(), {
  fill: 'none'
});
</script>

<template>
  <circle :r="radius" :cx="center.x" :cy="center.y" :stroke="stroke" :stroke-width="strokeWidth" :stroke-dasharray="strokeDasharray" :fill="fill" />
</template>