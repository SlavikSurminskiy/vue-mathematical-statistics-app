import Vue from 'vue';
import Vuex from 'vuex';

import lab1 from './modules/lab1';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    lab1,
  },
});
