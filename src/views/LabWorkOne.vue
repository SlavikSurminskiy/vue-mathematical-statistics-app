<template lang="html">
<div>
  <h2>Введіть обсяг вибірки</h2>
  <v-row>
    <v-col cols="4">
      <v-text-field
        v-model.number="inputsCount"
        label="Обсяг вибірки"
        type="number" min="1"
      ></v-text-field>
    </v-col>
    <v-col cols="8">
      <v-btn
        rounded color="indigo" class="mx-2 white--text"
        @click="createInputs()"
      >
        Старт
      </v-btn>
      <template v-if="showControls">
        <v-btn
          rounded color="indigo" class="mx-2 white--text"
          :disabled="!isDataValid"
          @click="makeCalculation()"
        >
          Виконати
        </v-btn>
        <v-btn
          fab small color="indigo" class="mx-2 white--text"
          @click="addInput()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab small color="indigo" class="mx-2 white--text"
          :disabled="inputsCount < 1"
          @click="deleteInput()"
        >
          <v-icon>mdi-minus</v-icon>
        </v-btn>
      </template>
    </v-col>
  </v-row>
  <v-row>
    <template v-for="(item, index) in inputData">
      <v-col cols="2" :key="index">
        <v-text-field
          :rules="[validData[index] || 'Заповніть поле']"
          @change="saveValue(index, $event)"
          :label="`${index + 1})`"
          :value="item"
          type="number"
        >
        </v-text-field>
      </v-col>
    </template>
  </v-row>
  <div v-if="isDataValid && showResult">
    <h2>Дискретний статистичний ряд частот та вiдносних частот</h2>
    <v-row>
      <v-col cols="12">
        <div class="frequency-table">
          <table class="table">
            <tr>
              <th>x<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.frequencySorted"
                  :key="ind">{{value}}</td>
              <th>Сума</th>
            </tr>
            <tr>
              <th>n<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.appropriateValues"
                  :key="ind">{{value}}</td>
              <th>{{numbersAmount}}</th>
            </tr>
            <tr>
              <th>w<sub>i</sub></th>
              <td v-for="(value, name, ind) in sortedFrequency.appropriateValues"
                  :key="ind">{{(value / numbersAmount).toFixed(4)}}</td>
              <th>{{relativeFrequencySum}}</th>
            </tr>
          </table>
        </div>
      </v-col>
    </v-row>
    <h2>Розмах вибірки</h2>
    <v-row>
      <v-col cols="12">
        <p>Розмах вибірки: r = {{range.rangeStr}}</p>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>

import { mapState, mapGetters } from 'vuex';

import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
  SAVE_VALUE,
  MAKE_CALCULATION,
} from '../store/mutation-types';

export default {
  data() {
    return {
      showControls: false,
      showResult: false,
    };
  },
  computed: {
    ...mapState({
      inputData: state => state.lab1.inputData,
      validData: state => state.lab1.validData,
    }),
    ...mapGetters([
      'isDataValid',
      'sortedFrequency',
      'numbersAmount',
      'relativeFrequencySum',
      'range',
    ]),
    inputsCount: {
      get() {
        return this.$store.getters.inputsCount;
      },
      set(value) {
        this.$store.commit(SET_INPUTS_COUNT, value);
      },
    },
  },
  methods: {
    createInputs() {
      this.$store.commit(CREATE_INPUTS);
      this.showControls = true;
    },
    addInput() {
      this.showResult = false;
      this.$store.commit(ADD_INPUT);
    },
    deleteInput() {
      this.showResult = false;
      this.$store.commit(DELETE_INPUT);
    },
    saveValue(index, value) {
      this.$store.commit(SAVE_VALUE, { index, value });
    },
    makeCalculation() {
      this.$store.commit(MAKE_CALCULATION);
      this.showResult = true;
    },
  },
};
</script>

<style lang="scss">
  $fs-base: 16px;
  $fs-large: 20px;

  .frequency-table {
    overflow-x: auto;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: $fs-base;
    th,td {
      text-align: center;
      border: 1px solid #dee2e6;
    }
    th {
      font-size: $fs-large;
      font-weight: bold;
    }
  }
</style>
