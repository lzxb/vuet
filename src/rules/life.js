/* @flow */

export default {
  rule ({ path }: RuleOptions) {
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
