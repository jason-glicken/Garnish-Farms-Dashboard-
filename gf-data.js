
/* Shared persistence boundary. All views consume this one normalized snapshot. */
(() => {
'use strict';
const SUPABASE_URL='https://odtalucpwmxcydxbypke.supabase.co';
const SUPABASE_KEY='sb_publishable_FjnWmIJaLHxxf0nIOB1SSQ_gOMJxbrm';
const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const q=()=>client;
async function rows(table,order,ascending=false){let r=q().from(table).select('*');if(order)r=r.order(order,{ascending});const {data,error}=await r;if(error)throw error;return data||[]}
function normalizeSnapshot(parents,items,harvests,cultures){
 const parentById=new Map(parents.map(p=>[String(p.id),p])),groups=new Map();
 for(const item of items){const k=String(item.batch_id);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(item)}
 const containers=[];
 for(const item of items){const p=parentById.get(String(item.batch_id))||{},siblings=groups.get(String(item.batch_id))||[item];
 containers.push({...p,...item,recordType:'container',itemId:item.id,parentId:p.id??item.batch_id,parentBatchId:p.batch_id||item.container_id||'',parentLabel:p.batch_id||item.container_id||'',unitIndex:siblings.findIndex(x=>x.id===item.id)+1,unitTotal:siblings.length,isLegacy:false})}
 for(const p of parents){if(!groups.has(String(p.id))){const n=Math.max(1,Number(p.quantity)||1);for(let i=1;i<=n;i++)containers.push({...p,recordType:'legacy',itemId:null,parentId:p.id,parentBatchId:p.batch_id,parentLabel:p.batch_id,container_id:n>1?`${p.batch_id}-${i}`:p.batch_id,unitIndex:i,unitTotal:n,isLegacy:true})}}
 return {parents,items,containers,harvests,cultures,loadedAt:new Date().toISOString()};
}
const auth={
 session:async()=>{const {data,error}=await client.auth.getSession();if(error)throw error;return data.session},
 signIn:(email,password)=>client.auth.signInWithPassword({email,password}),
 signOut:()=>client.auth.signOut(),
 onChange:fn=>client.auth.onAuthStateChange(fn)
};
let snapshot=null,loading=null;
const store={
 get current(){return snapshot},
 async refresh(force=false){if(snapshot&&!force)return snapshot;if(loading)return loading;loading=(async()=>{const [p,i,h,c]=await Promise.all([rows('batches','created_at'),rows('batch_items','created_at'),rows('harvests','harvest_date'),rows('cultures','created_at')]);snapshot=normalizeSnapshot(p,i,h,c);return snapshot})();try{return await loading}finally{loading=null}},
 invalidate(){snapshot=null},
 async createBatch(payload,count){
  const {data:p,error}=await q().from('batches').insert([payload]).select().single();if(error)throw error;
  const rows=Array.from({length:count},(_,i)=>({batch_id:p.id,container_id:count>1?`${payload.batch_id}-${i+1}`:payload.batch_id,strain:payload.strain,date:payload.date,stage:'Grain Spawn',status:'Active',container:payload.container||'Jar',substrate:payload.substrate||null,notes:payload.notes||null,grain_started_on:payload.date,current_stage_started_on:payload.date,target_days:payload.target_days||{'Grain Spawn':14,'Bulk Substrate':14,'Fruiting':14},stage_history:[]}));
  const ins=await q().from('batch_items').insert(rows);if(ins.error){await q().from('batches').delete().eq('id',p.id);throw ins.error}this.invalidate();return p;
 },
 async updateContainer(id,patch){const {data,error}=await q().from('batch_items').update({...patch,updated_at:new Date().toISOString()}).eq('id',id).select().single();if(error)throw error;this.invalidate();return data},
 async recordHarvest(item,{date,weight,flush,notes}){const {error}=await q().from('harvests').insert([{batch_pk:item.parentId,batch_id:item.parentBatchId||item.batch_id,strain:item.strain,harvest_date:date,flush_number:flush,weight_lbs:weight,notes}]);if(error)throw error;this.invalidate();return true},
 async addCulture(row){const {data,error}=await q().from('cultures').insert([row]).select().single();if(error)throw error;this.invalidate();return data}
};
window.GF={client,auth,store};
})();