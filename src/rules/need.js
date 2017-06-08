export default {
  rule ({ path }) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}
