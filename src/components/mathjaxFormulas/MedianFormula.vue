<template lang="html">
  <div :class="styleClass">
    <vue-mathjax :formula="formula"></vue-mathjax>
  </div>
</template>

<script>

export default {
  /*
    this component render mathjax formula which looks like templates below
    Me(x) = a + ((a-b)/c) * (d/2 - f)
    Me(x) = a + ((a-b)/c) * (d/2 - f) = g
  */
  props: {
    hasBorder: {
      type: Boolean,
      default: true,
    },
    a: {
      type: [Number, String],
      default: 'z_{M-1}',
    },
    b: {
      type: [Number, String],
      default: 'z_M',
    },
    c: {
      type: [Number, String],
      default: 'n_M',
    },
    d: {
      type: [Number, String],
      default: 'n',
    },
    f: {
      type: [Number, String],
      default: 'm_{M-1}',
    },
    g: {
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
      if (this.g !== '') {
        return `$$ \\Large M_e(x) = { ${this.a} + \\frac{${this.b} - ${this.a}}{${this.c}} \\bigg(\\frac{${this.d}}{2} - ${this.f}\\bigg) } = ${this.g}$$`;
      }
      return `$$ \\Large M_e(x) = { ${this.a} + \\frac{${this.b} - ${this.a}}{${this.c}} \\bigg(\\frac{${this.d}}{2} - ${this.f}\\bigg) }$$`;
    },
  },
};

</script>
