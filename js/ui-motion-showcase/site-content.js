// Compatibility API. Source-of-truth controllers live in the component definitions.
import {componentIdFor} from './component-model.js?v=20261020-expression9';
import {componentDefinitions} from './library-components.js?v=20261020-expression9';
import {legacyDefinitions} from './legacy-components.js?v=20261020-expression9';
const keys=['chart','accordion','table','calendar','drawer','dialog'];
const definition=item=>{const key=componentIdFor(item);return keys.includes(key)?componentDefinitions[key]||legacyDefinitions[key]:null;};
export const contentMarkup=item=>definition(item)?.markup(item)||'';
export const contentCSS=item=>item?definition(item)?.css||'':keys.map(key=>(componentDefinitions[key]||legacyDefinitions[key]).css).join('\n');
export function contentWire(root,item,helpers){return definition(item)?.wire(root,item,helpers);}
