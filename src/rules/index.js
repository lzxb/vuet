/* @flow */

import life from './life'
import manual from './manual'
import need from './need'
import once from './once'
import route from './route'

export default function install (_Vue: Function, Vuet: Function) {
  Vuet
    .rule('life', life)
    .rule('manual', manual)
    .rule('need', need)
    .rule('once', once)
    .rule('route', route)
}
