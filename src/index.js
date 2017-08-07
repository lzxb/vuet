import rules from './rules/index'
import VuetStatic from './vuet-static'
import Vuet from './vuet'

VuetStatic(Vuet)
rules(Vuet)
export const mapRules = Vuet.mapRules.bind(Vuet)
export const mapModules = Vuet.mapModules.bind(Vuet)

export default Vuet
