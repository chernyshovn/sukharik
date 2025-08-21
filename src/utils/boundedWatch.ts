import { watch, type Ref } from 'vue';
import { round } from './math'

interface WatchOptions {
  min: number;
  max: number;
  precision?: number;
  round?: boolean;
}

export function useBoundedWatch(
  refValue: Ref<number>,
  options: WatchOptions
) {
  const { min, max, precision = 0 } = options;
  
  watch(() => refValue.value, (newValue) => {
    let processedValue = newValue;

    if (processedValue < min) {
      processedValue = min;
    } else if (processedValue > max) {
      processedValue = max;
    }

    refValue.value = round(processedValue, precision);
  });
}