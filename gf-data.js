/* Garnish Farms shared data layer — canonical Supabase client and read API. */
(() => {
  'use strict';
  if (window.GFData) return;
  const URL = 'https://odtalucpwmxcydxbypke.supabase.co';
  const KEY = 'sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
  let clientPromise;
  const cache = new Map();
  async function client() {
    if (window.supabase?.createClient) return window.__GF_SUPABASE__ ||= window.supabase.createClient(URL, KEY);
    if (!clientPromise) clientPromise = new Promise((resolve,reject)=>{
      const script=document.createElement('script'); script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload=()=>resolve(window.__GF_SUPABASE__ ||= window.supabase.createClient(URL,KEY));
      script.onerror=()=>reject(new Error('Supabase library failed to load')); document.head.appendChild(script);
    });
    return clientPromise;
  }
  async function read(table, configure, options={}) {
    const key=table+':'+(options.cacheKey||'default');
    if (!options.fresh && cache.has(key)) return cache.get(key);
    const promise=(async()=>{const db=await client();let q=db.from(table).select('*');if(configure)q=configure(q);const {data,error}=await q;if(error)throw error;return Array.isArray(data)?data:[];})();
    if (!options.fresh) cache.set(key,promise);
    try{return await promise}catch(e){cache.delete(key);throw e;}
  }
  const norm=v=>String(v??'').trim().toLowerCase().replace(/[’']/g,"'").replace(/[_-]+/g,' ').replace(/\s+/g,' ');
  // Database rows have historically used a mix of display names, short strain
  // codes, and scientific names. Resolve all of them to one canonical key.
  const STRAINS={
    BO:['blue oyster','pearl oyster','pleurotus ostreatus','bo','bl'],
    LM:["lion's mane",'lions mane','hericium erinaceus','lm','li'],
    SH:['shiitake','lentinula edodes','sh'],
    MA:['maitake','hen of the woods','grifola frondosa','ma'],
    PO:['pink oyster','pleurotus djamor','po'],
    CH:['chestnut','pholiota adiposa','ch'],
    GT:['golden teacher','psilocybe cubensis','gt'],
    RE:['reishi','ganoderma lingzhi','re']
  };
  function strainKey(value){
    const v=norm(value); if(!v)return '';
    // Canonical ID prefixes are the strongest identity signal for legacy rows.
    // This prevents a stale display-name field from putting a GT batch on the CH page.
    const idCode=String(value).trim().match(/^(BO|BL|LM|LI|SH|MA|PO|CH|GT|RE)(?:[-_ ]|$)/i);
    if(idCode)return (['LI'].includes(idCode[1].toUpperCase())?'LM':['BL'].includes(idCode[1].toUpperCase())?'BO':idCode[1].toUpperCase());
    for(const [code,aliases] of Object.entries(STRAINS)) if(aliases.some(a=>v===norm(a))) return code;
    return v;
  }
  function isActive(row){return !['inactive','harvested','contaminated','archived','discarded','deleted'].includes(norm(row.status));}
  function stage(row){const s=norm(row.stage),c=norm(row.container);if(s.includes('fruit')||c.includes('fruit'))return 'Fruiting';if(s.includes('bulk')||s.includes('substrate')||s==='bag'||c.includes('bag')||c.includes('substrate'))return 'Bulk Substrate';return 'Grain Spawn';}
  async function inventory(strainName, options={}){
    const [parents,children]=await Promise.all([
      read('batches',q=>q.order('created_at',{ascending:false}),options),
      read('batch_items',null,options).catch(e=>{if(options.allowMissingChildren)return [];throw e;})
    ]);
    const wanted=strainKey(strainName);
    // The explicit parent strain field is authoritative. Use the canonical
    // batch ID only as a fallback for older rows with no strain value.
    const parentStrain=b=>strainKey(b.strain || b.batch_id || b.container_id || '');
    const parentRows=strainName?parents.filter(b=>parentStrain(b)===wanted):parents;
    const parentById=new Map(parentRows.map(x=>[String(x.id),x]));
    const allParentIds=new Set(parents.map(x=>String(x.id)));
    const belongsToStrain=row=>strainKey(row.strain || row.container_id || row.item_id || '')===wanted;
    const childRows=children.filter(x=>{
      const parentId=String(x.batch_id||'');
      if(parentById.has(parentId)) return true;
      // A child attached to any known parent is never eligible for fallback:
      // it belongs exclusively to that parent's strain, even if child fields
      // or its display ID are stale. Only truly orphaned children may fallback.
      if(allParentIds.has(parentId)) return false;
      return !!(strainName && belongsToStrain(x));
    });
    const grouped=new Map();for(const row of childRows){const k=String(row.batch_id||'');if(!k)continue;if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(row);}
    const expanded=childRows.map(row=>{const parent=parentById.get(String(row.batch_id))||{};const siblings=grouped.get(String(row.batch_id))||[];const idx=siblings.findIndex(x=>String(x.id)===String(row.id))+1;return {...parent,...row,id:row.id,parentId:row.batch_id||parent.id,quantity:1,unitIndex:idx||1,unitTotal:siblings.length||1,container_id:row.container_id||row.item_id||null,strain:parent.strain||row.strain,stage:row.stage||parent.stage,status:row.status||parent.status,container:row.container||parent.container,date:row.date||parent.date,notes:row.notes||parent.notes};});
    const expandedParentIds=new Set(grouped.keys());
    const remaining=parentRows.filter(p=>!expandedParentIds.has(String(p.id))).map(p=>({...p,parentId:p.id}));
    return {parents:parentRows,children:childRows,rows:[...expanded,...remaining],allParents:parents};
  }
  window.GFData={client,read,inventory,norm,isActive,stage,invalidate(table){if(table){for(const k of cache.keys())if(k.startsWith(table+':'))cache.delete(k);}else cache.clear();}};
})();
