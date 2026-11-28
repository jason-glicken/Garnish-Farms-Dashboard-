
/* Production domain: one definition of stage, time, counts, forecast and task logic. */
(()=>{'use strict';
const stages=['Grain Spawn','Bulk Substrate','Fruiting'],keys=['grain_started_on','bulk_started_on','fruiting_started_on'];
const defaults={ 'Grain Spawn':14,'Bulk Substrate':14,'Fruiting':14 };
const inactive=new Set(['harvested','contaminated','discarded','archived','inactive','complete','completed']);
const iso=d=>{if(!d)return null;const x=String(d).slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(x)?x:null};
const date=d=>{const s=iso(d);return s?new Date(s+'T12:00:00'):null};
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const fmt=d=>{const x=date(d);return x?x.toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'2-digit'}):'—'};
const add=(d,n)=>{const x=date(d);if(!x)return null;x.setDate(x.getDate()+Number(n||0));return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`};
const diff=(a,b=today())=>{const x=date(a),y=date(b);return x&&y?Math.floor((y-x)/86400000):null};
const stage=x=>{let s=String(x?.stage||'Grain Spawn').toLowerCase();if(s.includes('harvest'))return 'Harvested';if(s.includes('fruit'))return 'Fruiting';if(s.includes('bulk')||s.includes('substrate')||s.includes('bag'))return 'Bulk Substrate';return 'Grain Spawn'};
const active=x=>!inactive.has(String(x?.status||'Active').toLowerCase())&&stage(x)!=='Harvested';
const stageStart=(x,s)=>iso(x?.[keys[stages.indexOf(s)]])||(stage(x)===s?iso(x.current_stage_started_on)||iso(x.date):null);
const start=x=>iso(x.current_stage_started_on)||stageStart(x,stage(x))||iso(x.date)||iso(x.created_at);
const originalTargets=x=>{const raw=x?.target_days||{},o={};stages.forEach(s=>o[s]=Math.max(1,Number(raw[s]??defaults[s])||defaults[s]));return o};
const targets=(x,settings)=>{let config=settings;try{if(!config&&typeof localStorage!=='undefined')config=JSON.parse(localStorage.getItem('gf-targets')||'{}')}catch{}const raw=originalTargets(x),over=config?.overrides?.[String(x?.itemId??x?.id??'')]||{},o={};stages.forEach(s=>o[s]=Math.max(1,Number(over[s]??config?.[s]??raw[s]??defaults[s])||defaults[s]));return o};
function lifecycle(x,settings){const current=stage(x),t=targets(x,settings),todayISO=today(),segments=[];for(let i=0;i<3;i++){const s=stages[i],from=stageStart(x,s);if(!from)continue;let to=null;if(i<2)to=stageStart(x,stages[i+1]);if(!to&&(current==='Harvested'||(current===s&&active(x))))to=current==='Harvested'?iso(x.harvested_on)||todayISO:todayISO;if(!to)continue;segments.push({stage:s,start:from,end:to,days:Math.max(0,diff(from,to)||0),target:t[s],complete:current==='Harvested'||stages.indexOf(current)>i})}
 const currentDate=start(x),elapsed=currentDate?Math.max(0,diff(currentDate)||0):null;
 const forecastStart=stage(x)==='Harvested'?null:(start(x)||todayISO);let cursor=forecastStart;const forecast=stages.map(s=>{const from=cursor,to=cursor?add(cursor,t[s]):null;cursor=to;return {stage:s,start:from,end:to,days:t[s]}});return {current,elapsed,segments,forecast,targets:t,originalTargets:originalTargets(x),totalTarget:Object.values(t).reduce((a,b)=>a+b,0),originalTotal:Object.values(originalTargets(x)).reduce((a,b)=>a+b,0),variance:elapsed===null?null:elapsed-Object.values(t).slice(0,Math.max(1,stages.indexOf(current)+1)).reduce((a,b)=>a+b,0)}}
function unitLabel(x){const raw=String(x.parentBatchId||x.parentLabel||x.batch_id||''),base=raw.replace(/^(.*-\d{6})(?:-\d+)+$/,'$1');const position=Math.max(1,Number(x.unitIndex)||1);return base?`${base}-${position}`:'Unassigned'}
function counts(rows){const a=rows.filter(active);const jars=a.filter(x=>/jar/i.test(x.container||'')).length;const bags=a.filter(x=>/bag|block/i.test(x.container||'')).length;const unknown=a.filter(x=>!String(x.container||'').trim());return {batches:new Set(a.map(x=>String(x.parentId??x.batch_id??x.id))).size,jars:jars+unknown.filter(x=>stage(x)==='Grain Spawn').length,bags:bags+unknown.filter(x=>stage(x)==='Bulk Substrate').length,fruiting:a.filter(x=>stage(x)==='Fruiting').length,active:a.length,total:rows.length}}
function forecast(rows,months=3){const end=add(today(),months*30);return rows.filter(active).map(x=>({item:x,lifecycle:lifecycle(x),nextStage:stage(x)==='Grain Spawn'?'Bulk Substrate':stage(x)==='Bulk Substrate'?'Fruiting':'Harvest review',due:add(start(x),targets(x)[stage(x)]||14)})).filter(x=>x.due&&x.due<=end).sort((a,b)=>a.due.localeCompare(b.due))}
function tasks(rows){return rows.filter(active).map(x=>{const s=stage(x),t=targets(x),elapsed=diff(start(x)),limit=t[s]||14;return {item:x,stage:s,elapsed,limit,due:add(start(x),limit),action:s==='Grain Spawn'?'Review colonization / move to Bulk Substrate':s==='Bulk Substrate'?'Move to Fruiting':'Check fruiting and harvest readiness',overdue:elapsed!==null&&elapsed>=limit}}).sort((a,b)=>(a.due||'').localeCompare(b.due||''))}
function groupByStrain(rows){const m=new Map();rows.forEach(x=>{const k=x.strain||'Unknown';if(!m.has(k))m.set(k,[]);m.get(k).push(x)});return [...m.entries()].sort((a,b)=>a[0].localeCompare(b[0]))}
window.GFProduction={stages,defaults,iso,date,today,fmt,add,diff,stage,active,stageStart,start,targets,lifecycle,unitLabel,counts,forecast,tasks,groupByStrain};
})();