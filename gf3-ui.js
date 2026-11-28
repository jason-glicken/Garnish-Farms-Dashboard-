(()=>{'use strict';
const P=window.GFProduction,esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strains=[['Blue Oyster','#2458bd','#eef4ff'],["Lion's Mane",'#59616d','#f1f3f6'],['Shiitake','#7139b8','#f5efff'],['Maitake','#286744','#edf8f1'],['Pink Oyster','#b92b68','#fff0f6'],['Chestnut','#79513b','#faf2ed'],['Golden Teacher','#916719','#fff8e7'],['Pioppino','#80603d','#f7f1e8'],['Reishi','#9a3412','#fff2e9']];
const strainMeta=Object.fromEntries(strains.map(([name,color,bg])=>[name,{color,bg}]));
const href=(page,params={})=>{const u=new URL('index.html',location.href);u.searchParams.set('page',page);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));return u.pathname.split('/').pop()+u.search};
function header(data){
 const current=new URLSearchParams(location.search);
 const page=current.get('page')||'home';
 const selected=page==='strain'?(current.get('strain')||''):(current.get('filter')||'');
 const activeStrain=page==='strain'?selected:(current.get('filter')||'');
 const activeMeta=strainMeta[activeStrain];
 if(activeMeta){
  document.documentElement.style.setProperty('--active-strain-color',activeMeta.color);
  document.documentElement.style.setProperty('--active-strain-bg',activeMeta.bg);
  document.documentElement.dataset.activeStrain=activeStrain;
 }else{
  document.documentElement.style.removeProperty('--active-strain-color');
  document.documentElement.style.removeProperty('--active-strain-bg');
  delete document.documentElement.dataset.activeStrain;
 }
 const rows=data.containers.filter(P.active),c=P.counts(rows);
 const yieldLbs=data.harvests.reduce((n,h)=>n+Number(h.weight_lbs||0),0);
 const filterHref=name=>{if(page==='strain'){if(!name)return href('home');return href('strain',{strain:name})}const q=new URLSearchParams(location.search);if(name)q.set('filter',name);else q.delete('filter');return 'index.html?'+q.toString()};
 const host=document.querySelector('#gf-header');if(!host)return;
 const kpis=[['BATCHES','',c.batches,'batches'],['JARS','🫙',c.jars,'jars'],['BAGS','🟫',c.bags,'bags'],['FRUITING','🍄',c.fruiting,'fruiting']];
 host.innerHTML=`<header class="site-header">
 <div class="brand-row"><div class="brand"><a class="brand-home-link" href="${href('home')}" aria-label="Garnish Farms home"><h1>Garnish Farms – Mushrooms</h1></a><div class="sync"><i class="dot"></i><span>Cloud Synced · ${data.parents.length} batches</span></div></div>
 <div class="head-actions"><a class="btn outline" href="${href('settings')}">Settings</a><a class="btn" href="${href('home')}">Home</a></div></div>
 <div class="kpis">${kpis.map(([n,icon,v,p])=>`<a class="kpi ${page===p?'active':''}" href="${href(p)}" aria-current="${page===p?'page':'false'}"><span>${n}</span><strong>${icon?`<i class="kpi-icon" aria-hidden="true">${icon}</i>`:''}<b>${v}</b></strong></a>`).join('')}</div>
 <div class="actions-row"><a class="btn" href="${href('new-batch')}">+ New Batch</a><a class="btn harvest-btn" href="${href('harvest')}">Harvest</a><a class="yield-pill" href="${href('yield')}">Total Farm Yield<strong>${yieldLbs.toFixed(1)} lbs</strong></a></div>
 <nav class="strain-nav" aria-label="Filter by strain"><a class="strain-filter-all ${selected?'':'active'}" href="${filterHref('')}">All strains</a>
 ${strains.map(([s,c,b])=>`<a class="${selected===s?'active':''}" data-strain-index="${strains.findIndex(x=>x[0]===s)}" style="--strain-color:${c};--strain-bg:${b}" href="${filterHref(s)}" aria-pressed="${selected===s}">${esc(s)}</a>`).join('')}</nav></header>`;
}
function title(t,sub=''){return `<div class="page-title"><div><h2>${t}</h2>${sub?`<p class="muted">${sub}</p>`:''}</div></div>`}
function timeline(x){
 const l=P.lifecycle(x),total=l.totalTarget,meta=strainMeta[x.strain]||{color:'#64748b',bg:'#f1f5f9'};
 const widths=l.forecast.map(f=>f.days/total*100),actual=l.segments;
 const actualTrack=l.forecast.map((f,i)=>{
  const seg=actual.find(a=>a.stage===f.stage),w=widths[i],fill=seg?Math.min(100,seg.days/Math.max(1,f.days)*100):0;
  return `<div class="tl-stage" style="--segment-width:${w}%;--segment-bg:${meta.bg};--fill-color:${meta.color}"><i style="--fill-width:${fill}%;--fill-color:${meta.color}"></i></div>`;
 }).join('');
 const targetTrack=l.forecast.map((f,i)=>`<div class="tl-stage" style="--segment-width:${widths[i]}%;--target-color:${meta.color}"></div>`).join('');
 return `<div class="timeline-block" style="--strain-color:${meta.color};--strain-bg:${meta.bg}">
 <div class="lane-head"><b>ACTUAL</b><span>${l.elapsed===null?'Dates not recorded':l.elapsed+'d in '+l.current}</span></div>
 <div class="timeline-track actual-strain-track">${actualTrack}</div>
 <div class="timeline-labels"><span>Grain: ${actual.find(a=>a.stage===P.stages[0])?.days??'—'}d</span><span>Substrate: ${actual.find(a=>a.stage===P.stages[1])?.days??'—'}d</span><span>Fruiting: ${actual.find(a=>a.stage===P.stages[2])?.days??'—'}d</span></div>
 <div class="lane-head targeted"><b>TARGETED</b><span>${total} days planned</span></div>
 <div class="timeline-track targeted-track target-strain-track">${targetTrack}</div>
 <div class="timeline-labels"><span>Grain ${l.targets['Grain Spawn']}d</span><span>Substrate ${l.targets['Bulk Substrate']}d</span><span>Fruiting ${l.targets.Fruiting}d</span></div>
 </div>`;
}
function card(x){const id=P.unitLabel(x),key=x.itemId||`legacy-${x.parentId}`,link=href('container',{id:key});const st=P.stage(x),meta=strainMeta[x.strain]||{color:'#64748b',bg:'#f1f5f9'};return `<article class="record" id="record-${esc(key)}" data-stage="${esc(st)}" data-strain="${esc(x.strain||'')}" style="--strain-color:${meta.color};--strain-bg:${meta.bg}"><div class="record-top"><div><h3>${esc(x.strain||'Unknown strain')}</h3><a class="record-id" href="${link}">${esc(id)}</a> ${x.unitTotal>1?`<span class="badge">${x.unitIndex} of ${x.unitTotal}</span>`:''}</div><span class="stage-pill">${esc(st)}</span></div><div class="record-controls"><span class="badge">${esc(x.container||'Container')}</span><a class="btn outline" href="${link}">Manage container</a></div><p class="record-meta">Stage start: ${P.fmt(P.start(x))} · Parent batch: ${esc(x.parentBatchId||'—')}</p>${timeline(x)}</article>`}
function cards(rows){return rows.length?`<div class="records">${rows.map(card).join('')}</div>`:`<div class="empty">No matching production records.</div>`}
function panel(t,body,sub=''){
 if(t==='Batch information')return '';
 if(t==='Individual containers')return `<div class="batch-item-cards">${body}</div>`;
 if(t==='Production at a glance'&&body.includes('stage-breakdown')){
  const tiles=[...body.matchAll(/<div>([\s\S]*?)<\/div>/g)].map(m=>m[1]);
  const q=new URLSearchParams(location.search),active=q.get('page')==='strain'?(q.get('strain')||''):(q.get('filter')||''),meta=strainMeta[active];
  const themed=meta?` strain-themed" style="--strain-color:${meta.color};--strain-bg:${meta.bg}`:'';
  if(tiles.length>=3)return `<section class="production-summary${themed}"><div class="section-title"><h3>${t}</h3>${sub?`<span class="muted">${sub}</span>`:''}</div><div class="production-summary-grid">${tiles.slice(0,3).map((tile,i)=>`<div class="production-stat production-stat-${i+1}">${tile}</div>`).join('')}</div></section>`;
 }
 return `<section class="panel"><div class="section-title"><h3>${t}</h3>${sub?`<span class="muted">${sub}</span>`:''}</div>${body}</section>`;
}
window.GFUI={esc,href,strains,header,title,timeline,card,cards,panel};
})();