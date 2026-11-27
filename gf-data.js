/* Garnish Farms fresh application data layer. Existing Supabase project/schema; no migrations. */
(() => {
  'use strict';
  const URL='https://odtalucpwmxcydxbypke.supabase.co';
  const KEY='sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
  const client=window.supabase.createClient(URL,KEY);
  window.GF={client,
    async session(){const {data,error}=await client.auth.getSession();if(error)throw error;return data.session;},
    signIn:(email,password)=>client.auth.signInWithPassword({email,password}),
    signOut:()=>client.auth.signOut(),
    async snapshot(){const [b,i,h,c]=await Promise.all([client.from('batches').select('*').order('created_at',{ascending:false}),client.from('batch_items').select('*').order('created_at',{ascending:false}),client.from('harvests').select('*').order('harvest_date',{ascending:false}),client.from('cultures').select('*').order('created_at',{ascending:false})]);for(const r of [b,i,h,c])if(r.error)throw r.error;const parents=b.data||[],items=i.data||[],by=new Map(parents.map(x=>[String(x.id),x])),siblings=new Map();items.forEach(x=>{const k=String(x.batch_id);siblings.set(k,[...(siblings.get(k)||[]),x]);});const containers=items.map(x=>{const p=by.get(String(x.batch_id))||{},ss=siblings.get(String(x.batch_id))||[x];return {...p,...x,id:x.id,itemId:x.id,parentId:p.id||x.batch_id,parentBatchId:p.batch_id||x.container_id,batchId:p.batch_id||x.container_id,unitIndex:ss.findIndex(y=>y.id===x.id)+1,unitTotal:ss.length,isContainerRecord:true};});parents.filter(p=>!siblings.has(String(p.id))).forEach(p=>{const n=Math.max(1,Number(p.quantity)||1);for(let k=1;k<=n;k++)containers.push({...p,id:`legacy-${p.id}-${k}`,itemId:null,parentId:p.id,parentBatchId:p.batch_id,batchId:p.batch_id,unitIndex:k,unitTotal:n,isContainerRecord:false});});return {parents,items,containers,harvests:h.data||[],cultures:c.data||[]};},
    async createBatch(payload,count){const p=await client.from('batches').insert([payload]).select().single();if(p.error)throw p.error;const rows=Array.from({length:count},(_,i)=>({batch_id:p.data.id,container_id:count>1?`${payload.batch_id}-${i+1}`:payload.batch_id,strain:payload.strain,date:payload.date,stage:'Grain Spawn',status:'Active',container:payload.container||'Jar',substrate:payload.substrate||null,notes:payload.notes||null,grain_started_on:payload.date,current_stage_started_on:payload.date,target_days:payload.target_days||{'Grain Spawn':14,'Bulk Substrate':14,'Fruiting':14},stage_history:[]}));const ins=await client.from('batch_items').insert(rows);if(ins.error){await client.from('batches').delete().eq('id',p.data.id);throw ins.error;}return p.data;},
    async updateItem(id,patch){const {data,error}=await client.from('batch_items').update(patch).eq('id',id).select().single();if(error)throw error;return data;},
    async harvest(item,weight,date,notes,flush){const {error}=await client.from('harvests').insert([{batch_pk:item.parentId,batch_id:item.parentBatchId||item.container_id,strain:item.strain,harvest_date:date,flush_number:flush,weight_lbs:weight,notes}]);if(error)throw error;const u=await client.from('batch_items').update({stage:'Harvested',status:'Harvested'}).eq('id',item.itemId);if(u.error)throw u.error;},
    async addCulture(x){const {data,error}=await client.from('cultures').insert([x]).select().single();if(error)throw error;return data;}
  };
})();
