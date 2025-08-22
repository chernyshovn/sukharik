<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useBoundedWatch } from '@/utils/boundedWatch';
import { radToDeg, roundAndFormat, floor, ceil } from '@/utils/math';
import Point from '@/domain/point';
import Angel from '@/domain/angle';
import SvgPoint from '@/components/svg/Point.vue';
import SvgLine from '@/components/svg/Line.vue';
import SvgCircularArc from '@/components/svg/CircularArc.vue';


// input

const defaultInput = {
  r: 19.5,
  h: 5.5,
  d: 17,
  phiDeg: 95,
  alphaDeg: 25
};

const input = reactive({ ...defaultInput });

// settings

const validateInput = ref(true);
const width = ref(550);
const scale = ref(3.0);
const resultDecimalPlaces = ref(2);
const useDefaultParameters = ref(true);
const reflectY = ref(false);

// calculation

const r = computed(() => scale.value * input.r);
const h = computed(() => scale.value * input.h);
const d = computed(() => scale.value * input.d);
const alpha = computed(() => Angel.fromDeg(input.alphaDeg));
const phi2 = computed(() => Angel.fromDeg(input.phiDeg / 2));

const A = computed(() => r.value / Math.tan(Math.PI / 4 + alpha.value.rad / 2) + h.value / alpha.value.cos + (r.value - d.value) * alpha.value.tan);
const B = computed(() => r.value / Math.tan(Math.PI / 4 + alpha.value.rad / 2) - (r.value - d.value) / alpha.value.cos);
const C = computed(() => r.value / Math.tan(Math.PI / 4 - alpha.value.rad / 2) - (r.value - d.value) / alpha.value.cos);
const E = computed(() => r.value / Math.tan(Math.PI / 4 - alpha.value.rad / 2) + h.value / alpha.value.cos - (r.value - d.value) * alpha.value.tan);

const renderedA = computed(() => roundAndFormat(A.value / scale.value, resultDecimalPlaces.value));
const renderedB = computed(() => roundAndFormat(B.value / scale.value, resultDecimalPlaces.value));
const renderedC = computed(() => roundAndFormat(C.value / scale.value, resultDecimalPlaces.value));

const alphaBorderColor = 'rgba(332, 54, 43)';
const alphaFillColor = 'rgba(332, 54, 43, 0.2)';
const AColor = 'blue';
const BColor = 'red';
const CColor = 'green';

const createColorStyle = (color: string) => ({
  'color': color
});

const rh = computed(() => r.value + h.value);

const L = computed(() => B.value + r.value - h.value * alpha.value.tan + (alpha.value.rad > 0 ? Math.max(1.5 * r.value, A.value) : 1.5 * r.value));
const H = computed(() => 1.5 * rh.value / alpha.value.cos);

const O = new Point(0, 0);

const LH = computed(() => L.value + H.value);

const T1 = computed(() => O.addY(LH.value * alpha.value.sin));

const T2 = computed(() => O.addX(LH.value * alpha.value.cos));

const T4 = computed(() => new Point(
  H.value * alpha.value.cos,
  T1.value.y - H.value * alpha.value.sin
));

const T5 = computed(() => T4.value.addY(h.value / alpha.value.cos));

const T3 = computed(() => new Point(
  T2.value.x + h.value * alpha.value.sin,
  h.value * alpha.value.cos
));

const T13 = computed(() => T4.value.addY(A.value));

const T16 = computed(() => T13.value.addX(d.value));

const T7 = computed(() => T13.value.addY(E.value));

const T8 = computed(() => T7.value.addY(-h.value / alpha.value.cos));

const T9 = computed(() => new Point(
  T2.value.x + (2 * r.value + h.value) * alpha.value.sin,
  (2 * r.value + h.value) * alpha.value.cos
));

const T10 = computed(() => new Point(
  T2.value.x + 2 * rh.value * alpha.value.sin,
  2 * rh.value * alpha.value.cos
));

const P = computed(() => 2 * rh.value);

const T11 = computed(() => new Point(
  T1.value.x,
  T7.value.y + P.value
));

const T12 = computed(() => new Point(
  T7.value.x,
  T11.value.y
));

const T14 = computed(() => T5.value.addXY(
  B.value * alpha.value.cos,
  -B.value * alpha.value.sin
));

const T15 = computed(() => T8.value.addXY(
  C.value * alpha.value.cos,
  -C.value * alpha.value.sin
));

const S = computed(() => new Point(
  r.value * phi2.value.sin,
  -r.value * phi2.value.cos
));

const T17 = computed(() => T16.value.addPoint(S.value));

const T18 = computed(() => new Point(
  T16.value.x - S.value.x,
  T17.value.y
));

const T19 = computed(() => new Point(
  T17.value.x,
  T16.value.y - S.value.y
));

const T20 = computed(() => new Point(
  T18.value.x,
  T19.value.y
));

const alphaCenter = computed(() => alpha.value.rad > 0 ? T7.value : T1.value);

const alphaAxisEnd = computed(() => new Point(
  Math.max(T10.value.x, T2.value.x),
  alphaCenter.value.y
));

const alphaDirection = computed(() => alpha.value.rad > 0 ? 1 : 0);

const k = computed(() => alphaCenter.value.distTo(alphaAxisEnd.value) / 6);

const T21 = computed(() => alphaCenter.value.addXY(
  k.value * alpha.value.cos,
  -k.value * alpha.value.sin
));

const T22 = computed(() => alphaCenter.value.addX(k.value));

const suharStrokeWidth = 1;
const suharColor = 'gray';

const srIn = computed(() => Math.max(0.85 * r.value, r.value - h.value));
const srOut = computed(() => 2 * r.value - srIn.value);
const sr = computed(() => r.value - srIn.value);
const b = computed(() => d.value - 1.8 * sr.value);

const T26 = computed(() => T16.value.addXY(
  srIn.value * phi2.value.sin,
  -srIn.value * phi2.value.cos
));

const T25 = computed(() => T16.value.addXY(
   srOut.value * phi2.value.sin,
  -srOut.value * phi2.value.cos
));

const T23 = computed(() => T13.value.addY(-Math.sqrt(srOut.value ** 2 - d.value ** 2)));

const T29 = computed(() => T13.value.addXY(
  d.value - b.value,
  -Math.sqrt(srIn.value ** 2 - b.value ** 2)
));

const T24 = computed(() => T23.value.reflectOX(T16.value.y));
const T30 = computed(() => T29.value.reflectOX(T16.value.y));
const T27 = computed(() => T25.value.reflectOX(T16.value.y));
const T28 = computed(() => T26.value.reflectOX(T16.value.y));

const textX = computed(() => T11.value.x + Math.abs(T12.value.x - T11.value.x) / 15);
const textY = computed(() => T11.value.y);
const textSize = computed(() => Math.abs(T12.value.x - T11.value.x) / 10 + 'px');

const points = [T1, T2, T3, T4, T5, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T24, T25, T26, T27, T28, T29, T30, alphaCenter, alphaAxisEnd];
const pointValues = computed(() => points.map(p => p.value));

const bounds = computed(() => {
  const xs = pointValues.value.map(p => p.x);
  const ys = pointValues.value.map(p => p.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
});

const viewBox = computed(() => {
  const padding = 5;
  const width = bounds.value.maxX - bounds.value.minX + 2 * padding;
  const height = bounds.value.maxY - bounds.value.minY + 2 * padding;
  const x = bounds.value.minX - padding;
  const y = bounds.value.minY - padding;
  return `${x} ${y} ${width} ${height}`;
});

const height = computed(() => {
  const w = Math.abs(bounds.value.maxX - bounds.value.minX);
  const h = Math.abs(bounds.value.maxY - bounds.value.minY);
  return width.value * h / w;
});

const figureCol = ref<HTMLElement | null>(null);
useResizeObserver(figureCol, (entries: readonly ResizeObserverEntry[]) => {
  const { width: colWidth } = entries[0].contentRect;
  width.value = Math.min(width.value, colWidth);
});

// input restrictions

const rInputMin = computed(() => 0);
const rInputMinRounded = computed(() => ceil(rInputMin.value, 2));

const hInputMin = computed(() => 0);
const hInputMinRounded = computed(() => ceil(hInputMin.value, 2));

const dInputMin = computed(() => 0);
const dInputMinRounded = computed(() => ceil(dInputMin.value, 2));

const dInputMax = computed(() => input.r);
const dInputEnteredMaxRounded = computed(() => floor(dInputMax.value, 2));

const phiDegInputMin = computed(() => 0);
const phiDegInputMinRounded = computed(() => ceil(phiDegInputMin.value, 2));

const phiDegInputMax = computed(() => radToDeg(2 * Math.asin(d.value / r.value)));
const phiDegInputMaxRounded = computed(() => floor(phiDegInputMax.value, 2));

const alphaDegInputMin = computed(() => -input.phiDeg / 2);
const alphaDegInputMinRounded = computed(() => ceil(alphaDegInputMin.value, 2));

const alphaDegInputMax = computed(() => -alphaDegInputMin.value);
const alphaDegInputMaxRounded = computed(() => floor(alphaDegInputMax.value, 2));

watchEffect(() => {
  if (!validateInput.value) {
    return;
  }

  if (input.r < rInputMin.value) {
    input.r = rInputMinRounded.value;
  }

  if (input.h < hInputMin.value) {
    input.h = hInputMinRounded.value;
  }

  if (input.d < dInputMin.value) {
    input.d = dInputMinRounded.value;
  } else if (input.d > dInputMax.value) {
    input.d = dInputEnteredMaxRounded.value;
  }

  if (input.phiDeg < phiDegInputMin.value) {
    input.phiDeg = phiDegInputMinRounded.value;
  } else if (input.phiDeg > phiDegInputMax.value) {
    input.phiDeg = phiDegInputMaxRounded.value;
  }
  
  if (input.alphaDeg < alphaDegInputMin.value) {
    input.alphaDeg = alphaDegInputMinRounded.value;
  } else if (input.alphaDeg > alphaDegInputMax.value) {
    input.alphaDeg = alphaDegInputMaxRounded.value;
  }
});

// settings validation

useBoundedWatch(width, { min: 50, max: 5000, precision: 0 });
useBoundedWatch(scale, { min: 0.1, max: 20.0, precision: 1 });
useBoundedWatch(resultDecimalPlaces, { min: 0, max: 4, precision: 0 });

watch(() => useDefaultParameters.value, (newValue) => {
  if (newValue) {
    Object.assign(input, defaultInput);
    validateInput.value = true;
  }
});

</script>

<template>
  <div class="container my-2">
    <h4 class="text-center">
      Т&#8209;соединение
      <br>
      Определение позиций крепежа при наклонном ригеле
    </h4>
    <p class="text-center text-muted fst-italic mb-5">
      Определение позиции крепежа для наклонного Т&#8209;соединения стойки с ригелем
      светопрозрачных конструкций системы Alutech F50. Сухарный элемент из профиля F50.0415.
    </p>
    <div class="row">
      <div class="col-xl-2 col-lg-3 col-md-3 col-12">
        <h6>ПАРАМЕТРЫ</h6>

        <template v-if="!useDefaultParameters">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="inputValidation" checked v-model="validateInput">
            <label class="form-check-label" for="inputValidation">Ограничения</label>
          </div>

          <div class="input-group mt-2">
            <span class="input-group-text fw-bold" id="inputR">r</span>
            <input type="number" step="0.5" class="form-control" aria-describedby="inputR" v-model="input.r">
          </div>
          <div class="text-center" v-if="validateInput">
            <small class="text-muted">{{ rInputMinRounded }} ≤ r < ∞</small>
          </div>
          
          <div class="input-group mt-2">
            <span class="input-group-text fw-bold" id="inputH">h</span>
            <input type="number" step="0.5" class="form-control" aria-describedby="inputH" v-model="input.h">
          </div>
          <div class="text-center" v-if="validateInput">
            <small class="text-muted">{{ hInputMinRounded }} ≤ h < ∞</small>
          </div>

          <div class="input-group mt-2">
            <span class="input-group-text fw-bold" id="inputD">d</span>
            <input type="number" step="0.5" class="form-control" aria-describedby="inputD" v-model="input.d">
          </div>
          <div class="text-center" v-if="validateInput">
            <small class="text-muted">{{ dInputMinRounded }} ≤ d ≤ {{ dInputEnteredMaxRounded }}</small>
          </div>

          <div class="input-group  mt-2">
            <span class="input-group-text fw-bold" id="inputPhiDeg">&phi;</span>
            <input type="number" class="form-control" aria-describedby="inputPhiDeg" v-model="input.phiDeg">
          </div>
          <div class="text-center" v-if="validateInput">
            <small class="text-muted">{{ phiDegInputMinRounded }} ≤ &phi; ≤ {{ phiDegInputMaxRounded }}</small>
          </div>
        </template>

        <div class="input-group mt-2">
          <span class="input-group-text fw-bold" :style="createColorStyle(alphaBorderColor)" id="inputAlphaDeg">&alpha;</span>
          <input type="number" class="form-control" step="0.5" aria-describedby="inputAlphaDeg" v-model="input.alphaDeg">
        </div>
        <div class="text-center" v-if="validateInput">
          <small class="text-muted">{{ alphaDegInputMinRounded }} ≤ &alpha; ≤ {{ alphaDegInputMaxRounded }}</small>
        </div>

        <h6 class="mt-5">РЕЗУЛЬТАТ</h6>

        <div class="input-group mb-2">
          <span class="input-group-text fw-bold" :style="createColorStyle(AColor)" id="A">A</span>
          <input type="number" class="form-control" readonly aria-describedby="A" v-model="renderedA">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text fw-bold" :style="createColorStyle(BColor)" id="B">B</span>
          <input type="number" class="form-control" readonly aria-describedby="B" v-model="renderedB">
        </div>
        <div class="input-group mb-2">
          <span class="input-group-text fw-bold" :style="createColorStyle(CColor)" id="C">C</span>
          <input type="number" class="form-control" readonly aria-describedby="C" v-model="renderedC">
        </div>
         <div class="switch-input mb-5">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="reflectY" checked v-model="reflectY">
            <label class="form-check-label lh-1" for="reflectY">Отразить</label>
          </div>
        </div>

        <h6>НАСТРОЙКИ</h6>

        <div class="form-floating mb-2">
          <input type="number" class="form-control" id="width" step="10" v-model="width">
          <label for="width">Ширина, px</label>
        </div>
        <div class="form-floating mb-2">
          <input type="number" class="form-control" id="scale" step="0.1" v-model="scale">
          <label for="scale">Масштаб</label>
        </div>
        <div class="form-floating mb-2">
          <input type="number" class="form-control" id="resultDecimalPlaces" step="1" v-model="resultDecimalPlaces">
          <label for="resultDecimalPlaces">Точность результата</label>
        </div>
        <div class="switch-input">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="useExtendedParameters" checked v-model="useDefaultParameters">
            <label class="form-check-label lh-1" for="useExtendedParameters">Размеры по умолчанию</label>
          </div>
        </div>
      </div>
      <div class="col-xl-10 col-lg-9 col-md-9 col-12 my-3 my-md-0 text-center" ref="figureCol">
        <svg :width="width" :height="height" :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
          <g :transform="reflectY ? `scale(-1,1) translate(-${bounds.maxX + bounds.minX},0)` : ''">
            <!-- Alpha -->
            <svg-line :p1="alphaCenter" :p2="alphaAxisEnd" :stroke-width="0.5" stroke-dasharray="2,2" />
            <svg-circular-arc :p1="T21" :p2="T22" :center="alphaCenter" :radius="k" :direction="alphaDirection" :fill="alphaFillColor" :stroke-width="0.5" />
            <svg-circular-arc :p1="T21" :p2="T22" :radius="k" :direction="alphaDirection" :stroke="alphaBorderColor" :stroke-width="0.5" />

            <!-- Suhar -->
            <svg-line :p1="T29" :p2="T30" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T26" :p2="T25" :radius="sr" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T25" :p2="T23" :radius="srOut" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T26" :p2="T29" :radius="srIn" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T27" :p2="T28" :radius="sr" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T30" :p2="T28" :radius="srIn" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />
            <svg-circular-arc :p1="T24" :p2="T27" :radius="srOut" :direction="0" :stroke="suharColor" :stroke-width="suharStrokeWidth" />

            <!-- Other -->
            <svg-line :p1="T1" :p2="T2" />
            <svg-line :p1="T5" :p2="T3" />
            <svg-line :p1="T8" :p2="T9" />
            <svg-line :p1="T7" :p2="T10" />
            <svg-line :p1="T2" :p2="T10" stroke-dasharray="3,3" />
            <svg-line :p1="T1" :p2="T11" />
            <svg-line :p1="T4" :p2="T12" />
            <svg-line :p1="T11" :p2="T12" stroke-dasharray="3,3" />
            <svg-circular-arc :p1="T17" :p2="T18" :radius="r" :direction="0" stroke="maroon" :stroke-width="1"/>
            <svg-circular-arc :p1="T19" :p2="T20" :radius="r" :direction="1" stroke="maroon" :stroke-width="1"/>
            <svg-line :p1="T17" :p2="T20" stroke="maroon" :stroke-width="0.5" stroke-dasharray="3,3" />
            <svg-line :p1="T18" :p2="T19" stroke="maroon" :stroke-width="0.5" stroke-dasharray="3,3" />
            <svg-line :p1="T14" :p2="T15" stroke="lightgray" stroke-dasharray="3,3" />
            <svg-line :p1="T13" :p2="T16" stroke="lightgray" stroke-dasharray="3,3" />
            <svg-point :p="T16" :size="2" fill="maroon" />

            <!-- B -->
            <svg-line :p1="T5" :p2="T14" stroke="red" :stroke-width="2" />
            <svg-point :p="T14" :size="2" fill="red" />

            <!-- A -->
            <svg-line :p1="T4" :p2="T13" stroke="blue" :stroke-width="2" />
            <svg-point :p="T13" :size="2" fill="blue" />

            <!-- C -->
            <svg-line :p1="T8" :p2="T15" stroke="green" :stroke-width="2" />
            <svg-point :p="T15" :size="2" fill="green" />

            <!-- Text -->
            <g :transform="reflectY ? `scale(-1,1) translate(-${T12.x + T11.x},0)` : ''">
              <text :x="textX" :y="textY" font-family="Arial" :font-size="textSize" fill="black">
                <tspan :x="textX" dy="-4.2em"><tspan :fill="alphaBorderColor">&alpha;</tspan> = {{ input.alphaDeg }}&deg;</tspan>
                <tspan :x="textX" dy="1.2em"><tspan :fill="AColor">A</tspan> = {{ renderedA }}</tspan>
                <tspan :x="textX" dy="1.2em"><tspan :fill="BColor">B</tspan> = {{ renderedB }}</tspan>
                <tspan :x="textX" dy="1.2em"><tspan :fill="CColor">C</tspan> = {{ renderedC }}</tspan>
              </text>
            </g>
          </g>
        </svg>
      </div>
   </div>
  </div>
</template>

<style scoped>
.input-group-text {
  width: 35px;
}

.switch-input {
  border: var(--bs-border-width) solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  padding: 8px 10px;
}
</style>
