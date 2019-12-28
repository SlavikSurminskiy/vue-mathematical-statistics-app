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
        rounded dark color="indigo" class="mx-2"
        @click="createInputs()"
      >
        Старт
      </v-btn>
      <template v-if="showControls">
        <v-btn rounded dark color="indigo" class="mx-2">
          Виконати
        </v-btn>
        <v-btn
          fab dark small color="indigo" class="mx-2"
          @click="addInput()"
        >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab dark small color="indigo" class="mx-2"
          :disabled="inputsCount < 1"
          @click="deleteInput()"
        >
          <v-icon dark>mdi-minus</v-icon>
        </v-btn>
      </template>
    </v-col>
  </v-row>
  <v-row>
    <template v-for="(item, index) in inputData">
      <v-col cols="3" :key="index">
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
</div>
</template>

<script>

import { mapState } from 'vuex';

import {
  SET_INPUTS_COUNT,
  CREATE_INPUTS,
  ADD_INPUT,
  DELETE_INPUT,
  SAVE_VALUE,
} from '../store/mutation-types';

export default {
  data() {
    return {
      showControls: false,
    };
  },
  computed: {
    ...mapState({
      inputData: state => state.lab1.inputData,
      validData: state => state.lab1.validData,
    }),
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
      this.$store.commit(ADD_INPUT);
    },
    deleteInput() {
      this.$store.commit(DELETE_INPUT);
    },
    saveValue(index, value) {
      this.$store.commit(SAVE_VALUE, { index, value });
    },
  },
};
</script>
