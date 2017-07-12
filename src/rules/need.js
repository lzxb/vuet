/* @flow */

export default {
  rule ({ path }: RuleOptions) {
    return {
      beforeCreate () {
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}
