import temp from './temp'
import need from './need'
import once from './once'

export default function install (Vuet) {
  Vuet
    .rule('temp', temp)
    .rule('need', need)
    .rule('once', once)
}
