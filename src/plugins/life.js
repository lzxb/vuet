const name = 'life'

export default {
  name,
  mixin (path) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      },
      destroyed () {
        this.$vuet.reset(path, { current: this })
      }
    }
  }
}
