/* @flow */

import debug from '../debug'

export default {
  rule ({ path }: RuleOptions) {
    return {
      beforeCreate () {
        debug.assertPath(this.$vuet, path)
        this.$vuet.fetch(path, { current: this })
      }
    }
  }
}
