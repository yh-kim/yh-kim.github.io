import {styles,styleById} from './style-tokens.js?v=20261019-library7';
import {componentIds,styleIdFor} from './component-model.js?v=20261019-library7';
// Compatibility exports for existing imports and stable legacy anchors.
export const concepts=styles.map(style=>({...style,label:style.summary,tags:style.contexts,componentIds:Object.keys(componentIds),count:Object.keys(componentIds).length}));
export const conceptById=id=>concepts.find(style=>style.id===id)||null;
export const conceptForItem=item=>conceptById(styleIdFor(item))||conceptById('paper');
export {styles,styleById};
