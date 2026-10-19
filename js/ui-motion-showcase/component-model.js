// Public anchors remain stable. Functional identity and visual style are independent.
export const componentIds={
 'dark-ai--beam':'button','dark-ai--prompt':'form','dark-ai--controls':'tabs',
 'dark-ai--dialog':'drawer','dark-ai--layers':'menu','light-project--tasks':'accordion',
 'light-project--quick-add':'tags','dark-ai--process':'upload',
 'light-project--filters':'table','light-project--calendar':'calendar',
 'light-project--chart':'chart','light-project--dialog':'dialog'
};
export const legacyStyles={
 'dark-ai--beam':'object','dark-ai--prompt':'paper','dark-ai--controls':'frame',
 'dark-ai--dialog':'object','dark-ai--layers':'paper','light-project--tasks':'paper',
 'light-project--quick-add':'paper','dark-ai--process':'frame',
 'light-project--filters':'object','light-project--calendar':'object',
 'light-project--chart':'frame','light-project--dialog':'frame'
};
export const componentIdFor=item=>item?.componentId||componentIds[typeof item==='string'?item:item?.id];
export const styleIdFor=item=>item?.styleId||item?.conceptId||legacyStyles[typeof item==='string'?item:item?.id]||'paper';
export const withStyle=(item,styleId)=>({...item,componentId:componentIdFor(item),styleId,conceptId:styleId});
