<script setup lang="ts">
import Point from '@/domain/point';
import Circle from './Circle.vue';

interface Props {
  p: Point;
  size?: number;
  fill?: string
}

withDefaults(defineProps<Props>(), {
  size: 1,
  fill: 'black'
});
</script>

<template>
  <Circle :center="p" :radius="size" :fill="fill" />
</template>