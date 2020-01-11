<template lang="html">
  <div :class="styleClass">
    <vue-mathjax :formula="formula"></vue-mathjax>
  </div>
</template>

<script>

export default {
  /*
    this component render diffrent mathjax formulas of 'variance of discrete random variable'
  */
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    formulaTemplate: {
      type: String,
      validator(value) {
        return ['formulaA', 'formulaB'].includes(value);
      },
    },
    a: {
      type: [Number, String],
      default: '',
    },
    b: {
      type: [Number, String],
      default: '',
    },
    c: {
      type: [Number, String],
      default: '',
    },
  },
  computed: {
    styleClass() {
      if (this.hasBorder) {
        return 'mathjax-formula mathjax-formula--bordered';
      }
      return 'mathjax-formula';
    },
    formula() {
      if (this.a !== '' || this.b !== '' || this.c !== '') {
        return `$$ {D}_B = \\frac{1}{${this.a}} ${this.b} = ${this.c} $$`;
      } if (this.formulaTemplate === 'formulaA') {
        return '$$ {D}_B = \\overline{((x - \\bar{x}_B)^2)} = \\frac{1}{n} \\sum_{i=1}^{k} (x_i - \\bar{x}_B)^2 n_i $$';
      } if (this.formulaTemplate === 'formulaB') {
        return '$$ {D}_B = \\overline{(x^2)} - (\\bar{x}_B)^2 = \\frac{1}{n} \\sum_{i=1}^{k} {x_i}^2 n_i - (\\bar{x}_B)^2 $$';
      }
      return '';
    },
  },
};

</script>
