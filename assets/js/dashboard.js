/*! Bright Dreamers Parent Dashboard */
(function(){
'use strict';
var BD=window.BD_DASH||{};
var IMGS=BD.imgs||{};
var KEY='bd-portfolio-v1';
var TYPES={activity:{label:'Activity / Experience',short:'Activity',chip:'chip--green',icon:'activities'},skill:{label:'Skill',short:'Skill',chip:'chip--blue',icon:'skills'},achievement:{label:'Achievement',short:'Achievement',chip:'chip--amber',icon:'achievements'},project:{label:'Project',short:'Project',chip:'chip--purple',icon:'projects'},certificate:{label:'Certificate',short:'Certificate',chip:'',icon:'achievements'},goal:{label:'Goal',short:'Goal',chip:'',icon:'goals'}};
var TYPE_SVG={
 activity:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M6 12l3-4 4 1 3 3 3-1M11 15l-1-5"/></svg>',
 skill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20v-6M10 20V9M15 20v-9M20 20V4"/></svg>',
 achievement:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/></svg>',
 project:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3z"/></svg>',
 certificate:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/></svg>',
 goal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>'};
var I={cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20.5l-1.4-1.3C5.4 14.5 2 11.4 2 7.6 2 4.5 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.5 22 7.6c0 3.8-3.4 6.9-8.6 11.6z"/></svg>',star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/></svg>',plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14C17 4 14 4.5 12 6zM12 6v14"/></svg>',doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>',addbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'};

/* ---------- Seed (demo) data ---------- */
function seed(){
 var e=function(o){o.id=o.id||uid();o.skills=o.skills||[];o.photos=o.photos||[];o.created=o.created||Date.now();return o;};
 return {
  demo:true,
  profile:{name:'Maya Thompson',age:'9',location:'London, UK',interests:'Art, Dance, Music, Animals, Reading, Helping Others',about:'I am a curious and creative person who loves to learn new things. I enjoy dancing, drawing, playing the piano and spending time with my family and friends.',dream:'To become a creative leader who helps people and makes the world a kinder, happier place.',quote:'I love exploring new ideas, trying new things and helping others.',photo:'k:maya'},
  parent:{name:'Sarah Thompson',email:'sarah@example.com',share:true,coverPhoto:true,privateEntries:true},
  shares:[],
  read:[],
  entries:[
   e({type:'activity',title:'Ballet Classes',date:'2026-04-12',org:'Star Dance Academy',location:'Star Dance Academy',description:'Maya takes ballet classes twice a week. She is learning new steps, improving her confidence and loves performing with her friends.',skills:['Dance','Confidence','Discipline','Teamwork'],photos:['k:dance'],status:'ongoing',source:'Outside Activity'}),
   e({type:'achievement',kind:'achievement',title:'Ballet Recital',date:'2026-04-20',org:'Star Dance Academy',description:'Performed a solo in the spring recital in front of family and friends.',skills:['Dance','Confidence'],photos:['k:dance'],source:'Outside Activity'}),
   e({type:'activity',title:'Piano Lessons',date:'2023-03-01',org:'Melody Music School',description:'I am learning piano and can now play several of my favorite songs. I practice every week and enjoy taking on new challenges.',skills:['Music','Patience'],photos:['k:dash-piano'],status:'ongoing',source:'Outside Activity'}),
   e({type:'activity',title:'Art Project',date:'2026-01-15',org:'Bright Dreamers',description:'Painted a colorful community poster with friends at the Creative Makers session.',skills:['Creativity','Art'],photos:['k:dash-art'],status:'completed',source:'Bright Dreamers'}),
   e({type:'project',ptype:'creative',verified:true,title:'Birdhouse Design Project',date:'2026-03-05',location:'Home',description:'I designed and painted a birdhouse to help local birds. I learned about nature, design and teamwork.',skills:['Creativity','Art','Teamwork'],photos:['k:birdhouse'],status:'done',source:'Bright Dreamers'}),
   e({type:'project',ptype:'environmental',verified:true,title:'Community Garden Project',date:'2026-02-12',location:'Local Park',description:'I helped design plant markers and planted vegetables with my friends. I learned about different plants and how to take care of them.',skills:['Kindness','Teamwork','Environmental Care'],photos:['k:garden'],status:'progress',source:'Bright Dreamers'}),
   e({type:'project',ptype:'stem',title:'Build a Mini Robot',date:'2026-04-02',location:'Home',description:'I am learning how motors and simple circuits work. I am building a small robot that can move.',skills:['Problem Solving','STEM','Patience'],photos:['k:robot'],status:'progress',source:'Personal / Family'}),
   e({type:'project',ptype:'creative',title:'Create a Children’s Book',date:'2026-01-18',location:'Home',description:'I wrote and illustrated my own storybook. It is about a kind little bird who helps others.',skills:['Creativity','Writing','Communication'],photos:['k:book'],status:'done',source:'Personal / Family'}),
   e({type:'achievement',kind:'award',verified:true,title:'Kindness in Action Award',date:'2024-02-10',org:'Bright Dreamers',description:'I was recognized for helping and supporting others in my community.',skills:['Kindness'],photos:['k:kindness','k:community','k:garden','k:dash-garden'],source:'Bright Dreamers'}),
   e({type:'achievement',kind:'achievement',title:'Dance Recital 2024',date:'2024-06-15',org:'Star Dance Academy',description:'I performed in the end of year dance show. I felt proud and more confident on stage.',skills:['Dance','Confidence'],photos:['k:dance'],source:'Outside Activity'}),
   e({type:'certificate',kind:'certificate',ctype:'course',title:'Piano Progress Certificate',date:'2023-12-08',org:'Melody Music School',description:'I completed Level 1 and learned 5 new songs.',skills:['Music'],photos:['k:piano','k:dash-piano'],source:'Outside Activity'}),
   e({type:'achievement',kind:'recognition',title:'Community Garden Volunteer',date:'2026-02-20',org:'Local Park Friends',description:'Helped plant flowers and learned about taking care of the environment.',skills:['Kindness','Environmental Care','Teamwork'],photos:['k:dash-garden','k:garden','k:community'],source:'Outside Activity'}),
   e({type:'achievement',kind:'award',title:'Art Competition Finalist',date:'2026-01-15',org:'City Library',description:'My artwork was selected as a finalist in the local children\u2019s art competition.',skills:['Creativity','Art'],photos:['k:art','k:dash-art'],source:'Outside Activity'}),
   e({type:'goal',gtype:'learning',source:'Outside Activity',title:'Learn to Play a Full Song on Piano',date:'2026-01-05',target:'2026-12-15',why:'I want to perform it for my family and feel proud of my progress.',skills:['Music'],photos:['k:piano'],status:'working'}),
   e({type:'goal',gtype:'growth',source:'Outside Activity',title:'Try a Dance Performance',date:'2026-02-01',target:'2027-06-01',why:'I want to feel more confident performing in front of others.',skills:['Dance','Confidence'],photos:['k:dance'],status:'want'}),
   e({type:'goal',gtype:'kindness',source:'Bright Dreamers',verified:true,title:'Help More in My Community',date:'2025-09-01',target:'2026-03-31',why:'I want to help make my community a better place.',skills:['Kindness','Leadership'],photos:['k:community'],status:'achieved'}),
   e({type:'goal',gtype:'learning',source:'Personal / Family',title:'Do a Science Experiment at Home',date:'2026-03-10',target:'2026-11-20',why:'I want to learn more about how things work and try fun experiments.',skills:['Science','Problem Solving'],photos:['k:robot'],status:'working'}),
   e({type:'goal',gtype:'learning',source:'Personal / Family',title:'Explore Marine Life',date:'2025-10-01',target:'2026-04-30',why:'I want to learn about ocean animals and how to protect them.',skills:['Environmental Care'],photos:['k:marine'],status:'achieved'}),
   e({type:'skill',stype:'talent',title:'Creativity',lvl:'strong',level:100,date:'2024-03-10',description:'I love drawing, designing and coming up with new ideas and colorful pictures.',photos:['k:art','k:s-creativity'],source:'Personal / Family'}),
   e({type:'skill',stype:'talent',title:'Music',lvl:'growing',level:40,date:'2024-09-02',description:'Practicing piano regularly and learning new songs.',photos:['k:dash-piano','k:s-music'],source:'Outside Activity'}),
   e({type:'skill',stype:'talent',title:'Dance',lvl:'developing',level:60,date:'2024-09-15',description:'Learning new steps and getting better at performances.',photos:['k:dance','k:s-dance'],source:'Outside Activity'}),
   e({type:'skill',stype:'skill',title:'Teamwork',lvl:'confident',level:80,date:'2025-01-20',description:'I enjoy working with others and sharing ideas in group projects.',photos:['k:community','k:s-team'],source:'Bright Dreamers',verified:true}),
   e({type:'skill',stype:'skill',title:'Communication',lvl:'exploring',level:20,date:'2025-03-05',description:'Gaining confidence speaking and listening to others.',photos:['k:s-comm'],source:'Personal / Family'}),
   e({type:'skill',stype:'skill',title:'Kindness',lvl:'strong',level:100,date:'2024-01-08',description:'I try to be kind, helpful and supportive to others.',photos:['k:kindness','k:s-kind'],source:'Personal / Family'}),
   e({type:'skill',stype:'skill',title:'Problem Solving',lvl:'developing',level:60,date:'2025-04-02',description:'I like to find creative solutions to challenges, like building my robot.',photos:['k:robot','k:s-problem'],source:'Personal / Family'}),
   e({type:'skill',stype:'skill',title:'Environmental Care',lvl:'growing',level:40,date:'2025-02-12',description:'I care about nature and love learning how to protect our planet.',photos:['k:garden','k:s-env'],source:'Outside Activity'})
  ]
 };
}
function uid(){return 'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}

var S, memoryOnly=false;
function emptyState(){var s=seed();s.entries=[];s.demo=false;s.profile={name:(BD.user&&BD.user.child)||'',age:'',location:'',interests:'',about:'',dream:'',quote:'',photo:'k:profile'};s.parent={name:'',email:'',share:true,coverPhoto:true,privateEntries:true};return s;}
function canCover(){return S.parent.coverPhoto!==false;}
/* Neutral placeholder: the child's initial in a brand-colored circle (silhouette if no name). Same as bdd_cover_avatar() on the server. */
function coverAvatar(name){var n=String(name||'').trim(),ini=n?n.charAt(0).toUpperCase():'';var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ee1d78"/><stop offset="1" stop-color="#8a4fd8"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/>'+(ini?'<text x="100" y="100" dy=".35em" text-anchor="middle" font-family="Georgia,\'Times New Roman\',serif" font-size="96" font-weight="700" fill="#ffffff">'+esc(ini)+'</text>':'<circle cx="100" cy="80" r="34" fill="#ffffff" fill-opacity=".92"/><path d="M38 176c6-36 32-56 62-56s56 20 62 56z" fill="#ffffff" fill-opacity=".92"/>')+'</svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
function coverImg(){return canCover()?src(S.profile.photo):coverAvatar(S.profile.name);}
function printBook(){
 if(!BD.bookUrl){window.print();return;}
 toast('Preparing your book…');clearTimeout(saveT);saveT=null;
 api('state',statePayload()).catch(function(){}).then(function(){
  var old=document.getElementById('bdBookFrame');if(old)old.remove();
  var f=document.createElement('iframe');f.id='bdBookFrame';f.title='Printable book';f.setAttribute('aria-hidden','true');f.tabIndex=-1;
  f.style.cssText='position:fixed;left:-10000px;top:0;width:900px;height:700px;border:0;opacity:0;pointer-events:none';
  f.onload=function(){try{f.contentWindow.focus();f.contentWindow.print();}catch(e){window.open(f.src,'_blank');}};
  f.src=BD.bookUrl+(BD.bookUrl.indexOf('?')>-1?'&':'?')+'paper='+bookPaper+'&t='+Date.now();
  document.body.appendChild(f);
 });
}
var CONSENT_TEXT='I confirm that I am this child’s parent or legal guardian, or I am authorized by the parent or legal guardian to create and manage this private portfolio.';
function consentBlock(){
 var link=BD.privacyUrl?' <a class="link" href="'+esc(BD.privacyUrl)+'" target="_blank" rel="noopener">Privacy Policy</a>':'';
 if(BD.consent){var d=BD.consent.at?new Date(BD.consent.at):null,when=d&&!isNaN(d)?d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear():'';
  return '<div class="consent"><label class="sw" for="ac-consent" style="cursor:default"><input type="checkbox" id="ac-consent" checked disabled aria-describedby="consentDone"><span>'+CONSENT_TEXT+link+'</span></label><small class="muted consent__note" id="consentDone">'+(when?'Confirmed on '+when:'Confirmed')+'</small></div>';}
 return '<div class="consent"><label class="sw" for="ac-consent"><input type="checkbox" id="ac-consent" aria-required="true" aria-describedby="consentErr"><span>'+CONSENT_TEXT+'</span></label>'+(link?'<span class="consent__link">'+link+'</span>':'')+'<span class="err consent__note" id="consentErr" role="alert" hidden>Please confirm this statement to continue.</span></div>';
}
function consentError(on){var e=document.getElementById('consentErr'),c=document.getElementById('ac-consent');if(e)e.hidden=!on;if(c){if(on){c.setAttribute('aria-invalid','true');c.focus();}else c.removeAttribute('aria-invalid');}}
var UPLOAD_HELP='<p class="upload-help">Upload only photos, certificates, or files you are authorized to provide.</p>';
function consentAsk(p){var link=BD.privacyUrl?'<a class="link" href="'+esc(BD.privacyUrl)+'" target="_blank" rel="noopener">Privacy Policy</a>':'';return '<div class="consent consent--ask"><label class="sw" for="'+p+'-consent"><input type="checkbox" id="'+p+'-consent" aria-required="true" aria-describedby="'+p+'ConsentErr"><span>'+CONSENT_TEXT+'</span></label>'+(link?'<span class="consent__link">'+link+'</span>':'')+'<span class="err consent__note" id="'+p+'ConsentErr" role="alert" hidden>Please confirm this statement to continue.</span></div>';}
function consentAskError(p,on){var e=document.getElementById(p+'ConsentErr'),c=document.getElementById(p+'-consent');if(e)e.hidden=!on;if(c){if(on){c.setAttribute('aria-invalid','true');c.focus();}else c.removeAttribute('aria-invalid');}}
function emailListValid(){var el=document.getElementById('em-to');if(!el)return false;var l=el.value.split(',').map(function(s){return s.trim();}).filter(Boolean);return l.length>0&&l.length<=5&&l.every(function(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);});}
/* Send stays disabled until a valid recipient is entered and the confirmation is ticked. */
function updateSendState(){var b=document.getElementById('emSend'),c=document.getElementById('em-confirm');if(!b||!c)return;b.disabled=!(c.checked&&emailListValid());}
function confirmError(on){var e=document.getElementById('emConfirmErr'),c=document.getElementById('em-confirm');if(e)e.hidden=!on;if(c){if(on){c.setAttribute('aria-invalid','true');c.focus();}else c.removeAttribute('aria-invalid');}}
function delConfirmError(on){var e=document.getElementById('delConfirmErr'),c=document.getElementById('del-confirm');if(e)e.hidden=!on;if(c){if(on){c.setAttribute('aria-invalid','true');c.focus();}else c.removeAttribute('aria-invalid');}}
function canShare(){return S.parent.share!==false&&!BD.actingFor;}
function syncUser(){S.parent=S.parent||{};if(typeof BD.showCoverPhoto==='boolean')S.parent.coverPhoto=BD.showCoverPhoto;else if(S.parent.coverPhoto!==false)S.parent.coverPhoto=true;if(typeof BD.allowEmailShare==='boolean')S.parent.share=BD.allowEmailShare;else if(S.parent.share!==false)S.parent.share=true;if(BD.user){S.parent.name=BD.user.name||S.parent.name||'';S.parent.email=BD.user.email||S.parent.email||'';}delete S.parent.pw;S.parent.privateEntries=true;S.portfolio_private=true;S.read=S.read||[];S.shares=S.shares||[];}
function load(){S=(BD.loggedIn&&BD.state&&Array.isArray(BD.state.entries))?BD.state:emptyState();syncUser();}
function restUrl(p,q){var u=(BD.rest||'')+p;return q?u+(u.indexOf('?')>-1?'&':'?')+q:u;}
function api(path,data,noNonce){var h={'Content-Type':'application/json'};if(!noNonce&&BD.nonce)h['X-WP-Nonce']=BD.nonce;
 return fetch(restUrl(path),{method:'POST',credentials:'same-origin',headers:h,body:JSON.stringify(data||{})}).then(function(res){return res.json().catch(function(){return {};}).then(function(j){
  if(!res.ok){var m=j&&j.message?j.message:'Something went wrong. Please try again.';if(j&&(j.code==='rest_cookie_invalid_nonce'||j.code==='bd_expired'))m='Your session has expired. Please refresh the page.';throw new Error(m);}return j;});},
  function(){throw new Error('Could not reach the website. Check your internet connection.');});}
function packState(){var c=JSON.parse(JSON.stringify(S));delete c.confirmReset;if(c.parent)delete c.parent.pw;return c;}
var saveT=null,saving=false,saveAgain=false;
function pushState(){saveT=null;if(saving){saveAgain=true;return;}saving=true;
 api('state',statePayload()).then(function(){saving=false;if(saveAgain){saveAgain=false;pushState();}},function(e){saving=false;toast(e.message||'Could not save your changes.');});}
function save(){if(!BD.loggedIn)return true;clearTimeout(saveT);saveT=setTimeout(pushState,350);return true;}
window.addEventListener('pagehide',function(){if(saveT&&navigator.sendBeacon){clearTimeout(saveT);saveT=null;try{navigator.sendBeacon(restUrl('state','_wpnonce='+encodeURIComponent(BD.nonce||'')),new Blob([JSON.stringify(statePayload())],{type:'application/json'}));}catch(e){}}});

/* ---------- Helpers ---------- */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function src(p){if(!p)return IMGS.portfolio;return p.indexOf('k:')===0?(IMGS[p.slice(2)]||IMGS.portfolio):p;}
function photo(e){return src(e.photos&&e.photos[0]?e.photos[0]:'k:'+TYPES[e.type].icon);}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fdate(d,short){if(!d)return'';var p=d.split('-');var m=MON[+p[1]-1]||'';return short?m+' '+p[0]:m+' '+(+p[2])+', '+p[0];}
function hasEnd(t){return t==='activity'||t==='project';}
function dRange(e,short){var s=fdate(e.date,short);if(e.end&&hasEnd(e.type))return s+(e.end===e.date?'':' – '+fdate(e.end,short));if(e.type==='activity'&&e.status==='ongoing')return s+' – Present';return s;}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function ageLoc(p){return (p.age?'Age '+esc(p.age):'')+(p.age&&p.location?' &nbsp;|&nbsp; ':'')+esc(p.location||'');}
function first(){return (S.profile.name||'').trim()||'Your child';}
function byType(t){return S.entries.filter(function(e){return Array.isArray(t)?t.indexOf(e.type)>-1:e.type===t;});}
function byDate(a){return a.slice().sort(function(x,y){return (y.date||'').localeCompare(x.date||'');});}
function get(id){for(var i=0;i<S.entries.length;i++)if(S.entries[i].id===id)return S.entries[i];return null;}
function statusChip(e){
 var map={project:{done:['Completed','st-done'],progress:['In Progress','st-progress']},goal:{want:['Want to Try','st-want'],working:['Working On It','st-progress'],achieved:['Achieved','st-done']},activity:{ongoing:['Ongoing','st-progress'],completed:['Completed','st-done']}};
 var m=map[e.type]&&map[e.type][e.status];if(m)return '<span class="status '+m[1]+'">'+m[0]+'</span>';
 if(isAchType(e.type))return '<span class="status st-done">'+KIND_LABEL[kindOf(e)]+'</span>';
 return '';}
function typeChip(e){var t=TYPES[e.type],a=isAchType(e.type);return '<span class="chip '+(a?ACH_META[kindOf(e)].chip:t.chip)+'">'+(a?KIND_LABEL[kindOf(e)]:e.type==='skill'&&e.stype==='talent'?'Talent':t.short)+'</span>';}
var KINDS=[['achievement','Achievement'],['award','Award'],['recognition','Recognition'],['certificate','Certificate']];
var KIND_LABEL={achievement:'Achievement',award:'Award',recognition:'Recognition',certificate:'Certificate'};
var BD_SRC='Bright Dreamers',ACH_SRC=['Outside Activity','Personal / Family',BD_SRC];
var CHECK_SM='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
function isAchType(t){return t==='achievement'||t==='certificate';}
function kindOf(e){return KIND_LABEL[e.kind]?e.kind:(e.type==='certificate'?'certificate':'achievement');}
function isVerified(e){return canVerify(e.type)&&e.source===BD_SRC&&!!e.verified;}
function srcLabel(e){if(!e.source)return '';if(canVerify(e.type)&&e.source===BD_SRC)return e.verified?'Verified by Bright Dreamers':'Bright Dreamers';return e.source;}
function verifiedChip(e){return isVerified(e)?'<span class="chip chip--green">'+CHECK_SM+'Verified by Bright Dreamers</span>':'';}
var LEVELS=[['exploring','Exploring'],['growing','Growing'],['developing','Developing'],['confident','Confident'],['strong','Strong']];
var LVL_LABEL={exploring:'Exploring',growing:'Growing',developing:'Developing',confident:'Confident',strong:'Strong'},LVL_IDX={exploring:0,growing:1,developing:2,confident:3,strong:4},LVL_PCT={exploring:20,growing:40,developing:60,confident:80,strong:100};
var SK_SRC=['Outside Activity','Personal / Family',BD_SRC];
function canVerify(t){return isAchType(t)||t==='skill'||t==='project'||t==='goal';}
var GTYPES=[['learning','Learning Goal','Learn something new.'],['growth','Personal Growth Goal','Build a habit or develop a skill.'],['creative','Creative Goal','Create something new.'],['health','Health & Wellness Goal','Be active and healthy.'],['kindness','Kindness / Service Goal','Help others and make a difference.'],['other','Other','Any other type of goal.']];
var GT_LABEL={};GTYPES.forEach(function(g){GT_LABEL[g[0]]=g[1];});
var GT_ICON={learning:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14C17 4 14 4.5 12 6zM12 6v14"/></svg>',
 growth:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-9M12 14c-4 0-7-3-7-7 4 0 7 3 7 7zM12 12c0-4.5 3-8 7.5-8.5 0 4.5-3 8-7.5 8.5z"/></svg>',
 creative:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 1.6-2.1-.5-1.3.3-2.4 1.7-2.4H18a3 3 0 0 0 3-3C21 7 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7.5" r="1.2" fill="currentColor"/></svg>',
 health:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 20.5l-1.4-1.3C5.4 14.5 2 11.4 2 7.6 2 4.5 4.4 2 7.5 2c1.7 0 3.4.8 4.5 2.1C13.1 2.8 14.8 2 16.5 2 19.6 2 22 4.5 22 7.6c0 3.8-3.4 6.9-8.6 11.6z"/></svg>',
 kindness:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 14h3l4 2h4a1.5 1.5 0 0 1 0 3H9M3 21h11l6-4a1.6 1.6 0 0 0-1.8-2.6L14 16"/><path d="M15 9.6l-.8-.7C11.6 6.6 10 5.2 10 3.5A2.4 2.4 0 0 1 12.4 1c.9 0 1.9.4 2.6 1.1C15.7 1.4 16.7 1 17.6 1A2.4 2.4 0 0 1 20 3.5c0 1.7-1.6 3.1-4.2 5.4z"/></svg>',
 other:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>'};
var GOAL_EXAMPLES=['Learn a new song on piano','Read 20 books','Run a 5K','Be more confident','Try a new sport','Help in the community','Create a painting','Learn a new language'];
function goalChips(e){var g=GT_LABEL[e.gtype];return g||isVerified(e)?'<div class="chips">'+(g?'<span class="chip chip--purple gt-chip gt--'+e.gtype+'">'+GT_ICON[e.gtype]+g+'</span>':'')+verifiedChip(e)+'</div>':'';}
function goalToAch(g,date){var src=g.source===BD_SRC?(BD.isAdmin?BD_SRC:'Outside Activity'):(g.source||'Personal / Family');
 var a={id:uid(),created:Date.now(),type:'achievement',kind:'achievement',title:g.title,date:date||today(),org:'',description:g.description||g.why||('Achieved the goal: '+g.title),skills:(g.skills||[]).slice(),photos:(g.photos||[]).slice(),source:src,verified:src===BD_SRC,fromGoal:g.id};
 S.entries.push(a);g.achId=a.id;delete g.achSkip;return a;}
var CTYPES=[['course','Course Certificate','Completed a class or course.'],['program','Program Certificate','Finished a program or training.'],['participation','Participation Certificate','Took part in an event or activity.'],['award','Award / Recognition','Received special recognition.'],['competition','Competition Certificate','Participated or placed in a competition.'],['other','Other','Any other type of certificate.']];
var CT_LABEL={};CTYPES.forEach(function(c){CT_LABEL[c[0]]=c[1];});
var CT_ICON={course:['#2f9e44','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14C17 4 14 4.5 12 6zM12 6v14"/></svg>'],
 program:['#1d6fa5','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M8 10l3 2 5-4"/></svg>'],
 participation:['#2f9e44','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7" r="3"/><circle cx="5" cy="9" r="2.3"/><circle cx="19" cy="9" r="2.3"/><path d="M6.5 20v-2a5.5 5.5 0 0 1 11 0v2M1.5 19v-1a3.5 3.5 0 0 1 4-3.5M22.5 19v-1a3.5 3.5 0 0 0-4-3.5"/></svg>'],
 award:['#e0a000','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg>'],
 competition:['#e8590c','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2l4 7 4-7M6 2h4M14 2h4"/><circle cx="12" cy="15" r="6"/><path d="M12 12v6M10.5 13.5L12 12"/></svg>'],
 other:['#8a4fd8','<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2.2"/><circle cx="12" cy="12" r="2.2"/><circle cx="19" cy="12" r="2.2"/></svg>']};
function helpAside(title,iconHtml,types,tips,examples,exNote){
 return '<aside class="goal-aside" aria-label="Help">'+
 '<section class="card ga-box"><h3><span class="ga-ic" style="color:var(--purple)">'+iconHtml+'</span>'+title+'</h3><ul class="ga-types">'+types.map(function(x){return '<li><span class="ga-ic" style="color:'+x[3]+'">'+x[2]+'</span><span><strong>'+x[0]+'</strong><small>'+x[1]+'</small></span></li>';}).join('')+'</ul></section>'+
 '<section class="card ga-box ga-tips"><h3><span class="ga-ic gt--health">'+GT_ICON.health+'</span>Tips for Parents</h3><ul>'+tips.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul></section>'+
 '<section class="card ga-box ga-ex"><h3><img '+img('bulb')+' alt="">Examples</h3><p>'+exNote+'</p><div class="ga-chips">'+examples.map(function(x){return '<button type="button" data-act="goalex" data-s="'+esc(x)+'">'+esc(x)+'</button>';}).join('')+'</div></section></aside>';}
function certAside(){return helpAside('Certificate Types',AIC.ribbon,CTYPES.map(function(c){return [c[1],c[2],CT_ICON[c[0]][1],CT_ICON[c[0]][0]];}),['Include the full name of the certificate and the organization.','Add a short description about what it was for.','Upload a photo or scan of the certificate if you have one.','Add the skills your child used or developed.'],['Piano Level 1','Art Workshop','Coding Course','Swimming Program','Science Fair Participation','Math Competition','Language Class'],'Tap an example to use it as the certificate title.');}
function achAside(){return helpAside('Achievement Types',AIC.trophy,[['Achievement','A proud moment or something special your child did.',AIC.trophy,'#e0a000'],['Award','A prize or award your child received.',AIC.star,'#1d6fa5'],['Recognition','Praise or thanks for helping or doing well.',AIC.cap,'#2f9e44'],['Certificate','Finished a class, course or program.',AIC.ribbon,'#8a4fd8']],['Celebrate big and small wins.','Say what happened and why it matters.','Add a photo of the moment or the award.','Add the skills your child used.'],['Piano Recital','Science Fair Award','Kindness Recognition','Spelling Bee Winner','Art Show Finalist','Sports Day Medal'],'Tap an example to use it as the title.');}
function sideFor(t){return t==='goal'?goalAside():t==='certificate'?certAside():t==='achievement'?achAside():'';}
function goalAside(){
 return '<aside class="goal-aside" aria-label="Help for goals"><section class="card ga-box"><h3><img '+img('goals')+' alt="">Goal Types</h3><ul class="ga-types">'+GTYPES.map(function(g){return '<li><span class="ga-ic gt--'+g[0]+'">'+GT_ICON[g[0]]+'</span><span><strong>'+g[1]+'</strong><small>'+g[2]+'</small></span></li>';}).join('')+'</ul></section>'+
 '<section class="card ga-box ga-tips"><h3><span class="ga-ic gt--health">'+GT_ICON.health+'</span>Tips for Parents</h3><ul><li>Keep goals positive and realistic.</li><li>Involve your child in setting the goal.</li><li>Break bigger goals into smaller steps.</li><li>Celebrate progress along the way.</li><li>You can always update the status later.</li></ul></section>'+
 '<section class="card ga-box ga-ex"><h3><img '+img('bulb')+' alt="">Examples</h3><p>Tap an example to use it as the goal title.</p><div class="ga-chips">'+GOAL_EXAMPLES.map(function(x){return '<button type="button" data-act="goalex" data-s="'+esc(x)+'">'+esc(x)+'</button>';}).join('')+'</div></section></aside>';
}

var PTYPES=[['creative','Creative Project'],['stem','Science / STEM Project'],['community','Community Project'],['kindness','Kindness / Service Project'],['environmental','Environmental Project'],['personal','Personal Project'],['other','Other']];
var PT_LABEL={};PTYPES.forEach(function(p){PT_LABEL[p[0]]=p[1];});
var COMMON_SKILLS=['Creativity','Teamwork','Problem Solving','Communication','Confidence','Kindness','Leadership','Patience','Perseverance','Public Speaking','Art','Music','Dance','Writing','Reading','Science','STEM','Math','Environmental Care','Empathy','Responsibility','Organization','Critical Thinking','Curiosity'];
function skillPool(){var out=[],seen={};var add=function(s){var k=String(s).toLowerCase();if(s&&!seen[k]){seen[k]=1;out.push(s);}};S.entries.forEach(function(e){(e.type==='skill'?[e.title]:(e.skills||[])).forEach(add);});COMMON_SKILLS.forEach(add);return out;}
function bestTag(q){var ql=String(q||'').trim().toLowerCase();if(!ql)return q;var have={};((DRAFT&&DRAFT.skills)||[]).forEach(function(s){have[String(s).toLowerCase()]=1;});var pool=skillPool().filter(function(s){return !have[s.toLowerCase()];});var hit=pool.filter(function(s){return s.toLowerCase()===ql;})[0]||pool.filter(function(s){var l=s.toLowerCase();return l.indexOf(ql)===0||l.indexOf(' '+ql)>-1;})[0];return hit||q;}
function tagSuggest(q){var d=DRAFT||{skills:[]},have={};(d.skills||[]).forEach(function(s){have[String(s).toLowerCase()]=1;});q=String(q||'').trim();var ql=q.toLowerCase();
 var pool=skillPool().filter(function(s){return !have[s.toLowerCase()];}),list=ql?pool.filter(function(s){return s.toLowerCase().indexOf(ql)>-1;}).sort(function(a,b){return a.toLowerCase().indexOf(ql)-b.toLowerCase().indexOf(ql);}):pool;
 var html=list.slice(0,10).map(function(s){return '<button type="button" data-act="tag" data-s="'+esc(s)+'">+ '+esc(s)+'</button>';}).join('');
 var exact=pool.some(function(s){return s.toLowerCase()===ql;})||have[ql];
 if(ql&&!exact)html+='<button type="button" class="suggest__new" data-act="tag" data-s="'+esc(q)+'">+ Add “'+esc(q)+'”</button>';
 if(!html)html='<span class="suggest__none">'+(ql?'Already added.':'No more suggestions.')+'</span>';
 return html;}

function lvlOf(e){if(LVL_LABEL[e.lvl])return e.lvl;var n=+e.level||0;return n<=20?'exploring':n<=40?'growing':n<=60?'developing':n<=80?'confident':'strong';}
function bars(n){var o='<svg class="lvl__bars" viewBox="0 0 26 20" aria-hidden="true">';for(var i=0;i<5;i++){var h=6+i*3.2;o+='<rect x="'+(i*5.2+.6)+'" y="'+(19-h)+'" width="3.6" height="'+h+'" rx="1.2" fill="currentColor"'+(i<n?'':' opacity=".25"')+'/>';}return o+'</svg>';}
function lvlBadge(e){var L=lvlOf(e);return '<span class="lvl-b lvl--'+L+'">'+bars(LVL_IDX[L]+1)+'<span class="lvl-b__chip">'+LVL_LABEL[L]+'</span></span>';}
function statePayload(){var o={state:packState()};if(BD.actingFor)o.parent=BD.actingFor.id;return o;}

var CHIPC=['','chip--purple','chip--blue','chip--green','chip--amber'];
function skillChips(e,max){return (e.skills||[]).slice(0,max||9).map(function(s,i){return '<span class="chip '+CHIPC[i%5]+'">'+esc(s)+'</span>';}).join('');}
function img(k){return 'src="'+src('k:'+k)+'"';}
var toastT;function toast(m){var t=document.getElementById('toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true;},2800);}
function stats(){return{entries:S.entries.filter(function(e){return e.type!=='skill';}).length,skills:byType('skill').length,ach:byType(['achievement','certificate']).length,proj:byType('project').length,goals:byType('goal').length};}

/* ---------- Nav ---------- */
var NAV=[['dashboard','dashboard','My Child’s Portfolio'],['profile','profile','Profile'],['add','add','Add Entry'],['journey','journey','Journey Timeline'],['skills','skills','Skills & Talents'],['activities','activities','Activities & Experiences'],['achievements','achievements','Achievements'],['projects','projects','Projects'],['goals','goals','Goals'],null,['portfolio','portfolio','View Portfolio'],['book','print','Print / PDF'],['email','email','Email Share'],['account','settings','Account Settings']];
var TITLES={dashboard:'Parent Dashboard',profile:'My Child’s Profile',add:'Add a New Entry',journey:'Journey Timeline',skills:'Skills & Talents',activities:'Activities & Experiences',achievements:'Achievements',projects:'Projects',goals:'Goals',portfolio:'Portfolio',book:'Print / PDF',email:'Email Share',account:'Account Settings',entry:'Entry Detail',success:'Entry Saved'};
function renderNav(cur){
 var parentOf={entry:null,success:'add'};var c=parentOf.hasOwnProperty(cur)?parentOf[cur]:cur;
 document.getElementById('nav').innerHTML=NAV.map(function(n){if(!n)return '<div class="nav__sep" role="separator"></div>';if(n[0]==='email'&&!canShare())return '<a class="is-off" aria-disabled="true" title="Turn on \u201cAllow me to share portfolio copies by email\u201d in Account Settings"><img '+img(n[1])+' alt="">'+n[2]+'</a>';return '<a href="#'+n[0]+'"'+(n[0]===c?' aria-current="page"':'')+'><img '+img(n[1])+' alt="">'+n[2]+'</a>';}).join('')+'<button class="nav__out" data-act="logout">'+LOGOUT_SVG+'Log Out</button>';
}

/* ---------- Router ---------- */
var VIEW='dashboard', CUR=null, EDIT=null, DRAFT=null, filters={projects:'all',goals:'all',journey:'all',ach:'all',sk:'all'}, confirmDel=false, galleryIdx=0, lastSaved=null, bookPaper='a4';
var VIEWS={dashboard:vDash,profile:vProfile,add:vAdd,journey:vJourney,skills:vSkills,activities:vActivities,achievements:vAch,projects:vProjects,goals:vGoals,portfolio:vPortfolio,book:vBook,email:vEmail,account:vAccount,entry:vEntry,success:vSuccess};
function route(){
 if(!loggedIn()){showAuth();return;}
 document.getElementById('auth').hidden=true;document.getElementById('app').hidden=false;
 var h=(location.hash||'').replace('#','')||'dashboard';
 if(!VIEWS[h])h='dashboard';
 if(h==='entry'&&!get(CUR))h='dashboard';
 if(h==='success'&&!get(lastSaved))h='dashboard';
 if(h!=='add'){EDIT=null;DRAFT=null;}
 if(h!=='entry'){confirmDel=false;galleryIdx=0;}
 VIEW=h;render();window.scrollTo(0,0);closeNav();
}
function go(h){if(location.hash==='#'+h)route();else location.hash=h;}
function render(){
 renderNav(VIEW);
 document.body.classList.toggle('bd-book',VIEW==='book');
 var ps=document.getElementById('bd-page-size');if(ps)ps.textContent='@page{size:'+(bookPaper==='letter'?'letter':'A4')+';margin:0}';
 document.getElementById('pageTitle').textContent=(VIEW==='add'&&EDIT)?'Edit Entry':TITLES[VIEW];
 renderBanner();renderTop();
 document.getElementById('view').innerHTML=VIEWS[VIEW]();
 var pfo=document.getElementById('pfoot');if(pfo&&!pfo.innerHTML)pfo.innerHTML=footHtml();
 if(VIEW==='account'&&S.confirmReset==='clear'){var dcf=document.getElementById('del-confirm');if(dcf)dcf.focus();}
 if(VIEW==='email')updateSendState();
 if(VIEW==='add')bindAdd();
}
function renderBanner(){
 var b=document.getElementById('banner'),p=S.profile;
 var show=['dashboard','projects','activities','journey'].indexOf(VIEW)>-1;
 b.hidden=!show;if(!show)return;
 var dash=VIEW==='dashboard';
 b.innerHTML='<div class="banner__photo"><img src="'+coverImg()+'" alt="'+esc(p.name)+'"><a class="banner__edit" href="#profile" aria-label="Edit profile">'+I.edit.replace('<svg','<svg width="15" height="15"')+'</a></div>'+
 '<div style="min-width:0"><h2>'+(dash?esc(first())+'’s Bright Future':esc(first())+'’s Portfolio <span aria-hidden="true" style="color:#f5c400">♥</span>')+'</h2><p>'+(dash?'A place to keep all of '+esc(first())+'\u2019s ideas, experiences, achievements and dreams.':ageLoc(p))+'</p></div>'+
 '<div class="banner__art" aria-hidden="true"><span>Dream</span><span>Create</span><span>Grow</span><span>Give</span></div>';
}
function renderTop(){
 document.getElementById('parentAvatar').src=src(S.profile.photo&&S.parent.avatarChild?S.profile.photo:'k:parent');
 document.getElementById('parentName').textContent=S.parent.name?S.parent.name.split(' ')[0]:'Parent';
 var n=notes().filter(function(x){return S.read.indexOf(x.key)<0;}).length;var bc=document.getElementById('bellCount');bc.hidden=!n;bc.textContent=n;
}

/* ---------- Notifications ---------- */
function notes(){
 var out=[],t=today();
 byType('goal').forEach(function(g){if(g.status==='achieved'||!g.target)return;var days=Math.round((new Date(g.target)-new Date(t))/864e5);
  if(days<0)out.push({key:'od-'+g.id+g.target,id:g.id,t:'Goal date has passed',s:g.title+' – target was '+fdate(g.target)});
  else if(days<=60)out.push({key:'soon-'+g.id+g.target,id:g.id,t:'Goal due in '+days+' day'+(days===1?'':'s'),s:g.title});});
 S.entries.forEach(function(e){if(e.type!=='skill'&&(!e.photos||!e.photos.length))out.push({key:'ph-'+e.id,id:e.id,t:'Add a photo',s:e.title+' has no photos yet'});});
 return out;
}
function renderBell(){
 var n=notes(),pop=document.getElementById('bellPop');
 pop.innerHTML='<h4>Notifications</h4>'+(n.length?n.map(function(x){return '<button class="pop__item" data-act="open" data-id="'+x.id+'"><span><b>'+esc(x.t)+'</b><small>'+esc(x.s)+'</small></span></button>';}).join(''):'<p class="pop__empty">You’re all caught up.</p>');
 n.forEach(function(x){if(S.read.indexOf(x.key)<0)S.read.push(x.key);});save();renderTop();
}
function renderUser(){
 document.getElementById('userPop').innerHTML='<h4>'+esc(S.parent.name||'Parent')+'</h4><a href="#profile">Edit child’s profile</a><a href="#account">Account settings</a>'+(canShare()?'<a href="#email">Share portfolio</a>':'')+'<button class="pop__item" data-act="logout" style="color:var(--red);font-weight:600">Log out</button>';
}

/* ---------- Views ---------- */
function head(icon,title,sub,btn){return '<section class="card head"><span class="head__icon"><img '+img(icon)+' alt=""></span><div style="min-width:0"><h2>'+title+'</h2><p>'+sub+'</p></div>'+(btn||'')+'</section>';}
function addBtn(type,label){return '<button class="btn" data-act="new" data-type="'+type+'">'+I.plus+label+'</button>';}

function vDash(){
 var st=stats(),rec=byDate(S.entries.filter(function(e){return e.type!=='skill';})).slice(0,4);
 var goals=byType('goal').filter(function(g){return g.status!=='achieved';}).sort(function(a,b){return (a.target||'').localeCompare(b.target||'');}).slice(0,3);
 var prog=byType('project').filter(function(p){return p.status==='progress';}).slice(0,3);
 return '<div class="actions3"><button class="bigact bigact--pink" data-act="new" data-type="activity">'+I.addbox+'Add Entry</button><a class="bigact" href="#portfolio">'+I.book+'View Portfolio</a><a class="bigact bigact--purple" href="#book">'+I.doc+'Create PDF</a></div>'+
 '<div class="stats">'+
  stat('#journey','portfolio',st.entries,'Entries')+stat('#skills','skills',st.skills,'Skills')+stat('#achievements','achievements',st.ach,'Achievements')+stat('#projects','bulb',st.proj,'Projects')+stat('#goals','goals',st.goals,'Goals')+'</div>'+
 '<section class="card panel"><div class="h-sec"><h3>Recent Entries</h3><a class="link" href="#journey">View All →</a></div>'+
 (rec.length?'<div class="recent">'+rec.map(function(e){return '<button class="rcard" data-act="open" data-id="'+e.id+'"><img class="ph" src="'+photo(e)+'" alt=""><span class="rcard__b"><strong>'+esc(e.title)+'</strong><span class="meta">'+dRange(e,true)+'</span>'+typeChip(e)+'</span></button>';}).join('')+'</div>':emptyBox('No entries yet','Add the first activity, project or achievement.'))+'</section>'+
 '<div class="split"><section class="card panel"><div class="h-sec"><h3>Projects in progress</h3><a class="link" href="#projects">All projects →</a></div><div class="mini-list">'+(prog.length?prog.map(mini).join(''):'<p class="muted">No projects in progress.</p>')+'</div></section>'+
 '<section class="card panel"><div class="h-sec"><h3>Upcoming goals</h3><a class="link" href="#goals">All goals →</a></div><div class="mini-list">'+(goals.length?goals.map(mini).join(''):(byType('goal').length?'<p class="muted">Every goal is achieved. Time to set a new one.</p>':'<p class="muted">No goals yet. Add one to get started.</p>'))+'</div></section></div>'+
 (S.demo?'<p class="demo">Showing example data for Maya. Change it in Account Settings or start adding your own entries.</p>':'');
}
function stat(h,i,n,l){return '<a class="stat" href="'+h+'"><img '+img(i)+' alt=""><b>'+n+'</b><span>'+l+'</span></a>';}
function mini(e){var sub=e.type==='goal'?(e.target?'Target: '+fdate(e.target,true):''):dRange(e,true);return '<button class="mini" data-act="open" data-id="'+e.id+'"><img src="'+photo(e)+'" alt=""><span class="mini__t"><strong>'+esc(e.title)+'</strong><span class="meta">'+sub+'</span></span>'+statusChip(e)+'</button>';}
function emptyBox(t,s,type){return '<div class="empty"><strong>'+t+'</strong><span>'+s+'</span>'+(type?addBtn(type,'Add '+TYPES[type].short):'')+'</div>';}

function vProjects(){
 var all=byType('project'),f=filters.projects;var c={all:all.length,progress:all.filter(function(p){return p.status==='progress';}).length,done:all.filter(function(p){return p.status==='done';}).length};
 var list=byDate(all.filter(function(p){return f==='all'||p.status===f;}));
 return head('projects','My Projects','Things I created, explored, helped with, or worked on.',addBtn('project','Add Project'))+
 '<div class="tabs" role="group" aria-label="Filter projects">'+ftab('projects','all','All Projects ('+c.all+')')+ftab('projects','progress','In Progress ('+c.progress+')')+ftab('projects','done','Completed ('+c.done+')')+'</div>'+
 (list.length?'<div class="grid">'+list.map(function(e){return '<article class="card pcard"><div class="pcard__ph"><img src="'+photo(e)+'" alt="">'+statusChip(e)+'</div><h3>'+esc(e.title)+'</h3>'+(PT_LABEL[e.ptype]||isVerified(e)?'<div class="chips">'+(PT_LABEL[e.ptype]?'<span class="chip chip--purple">'+PT_LABEL[e.ptype]+'</span>':'')+verifiedChip(e)+'</div>':'')+'<span class="meta">'+I.cal+dRange(e)+(e.location?' &nbsp;·&nbsp; '+I.pin+esc(e.location):'')+'</span><p>'+esc(e.description)+'</p><div class="chips">'+skillChips(e,4)+'</div><div class="pcard__act"><button class="btn btn--line btn--sm" data-act="open" data-id="'+e.id+'">View</button><button class="btn btn--line btn--sm" data-act="edit" data-id="'+e.id+'">Edit</button></div></article>';}).join('')+'</div>':emptyBox('No projects here','Try another filter or add a project.','project'));
}
function ftab(k,v,l){return '<button class="tab" data-act="filter" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+(filters[k]===v)+'">'+l+'</button>';}

function rowItem(e,lines){return '<article class="card row"><div class="row__ph"><img src="'+photo(e)+'" alt=""></div><div class="row__b"><h3>'+esc(e.title)+'</h3>'+lines+'</div><div class="row__s">'+statusChip(e)+'<div class="row__btns"><button class="btn btn--line btn--sm" data-act="open" data-id="'+e.id+'">'+(e.type==='goal'&&e.status==='working'?'View Progress':'View Details')+'</button><button class="btn btn--line btn--sm" data-act="edit" data-id="'+e.id+'">Edit</button></div></div></article>';}
var GOAL_ART='<svg class="ghero__mtn" viewBox="0 0 200 124" aria-hidden="true" stroke-linejoin="round" stroke-linecap="round">'+
 '<path d="M14 120L82 30l26 34 18-20 64 76z" fill="#d9ecfa" stroke="#1d6fa5" stroke-width="3"/>'+
 '<path d="M82 30L68 49l10-4 8 8 9-11 6 7z" fill="#fff" stroke="#1d6fa5" stroke-width="2.5"/>'+
 '<path d="M126 44l-9 10 7-2 6 6 7-6z" fill="#fff" stroke="#1d6fa5" stroke-width="2.3"/>'+
 '<path d="M82 30V5" stroke="#0f1f5c" stroke-width="3" fill="none"/><path d="M83 6h24l-6 6.5 6 6.5H83z" fill="#ee1d78"/>'+
 '<path d="M150 18l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="#f5c400"/>'+
 '<path d="M30 30l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#f5c400"/>'+
 '<path d="M178 52v10M173 57h10M44 64v8M40 68h8" stroke="#ee1d78" stroke-width="2.6" fill="none"/>'+
 '<path d="M118 14v6M115 17h6" stroke="#8a4fd8" stroke-width="2.4" fill="none"/></svg>';
var gQ='',gType='all';
function vGoals(){
 var all=byType('goal'),c=function(s){return all.filter(function(g){return g.status===s;}).length;};
 var tab=function(k,l){return '<button class="atab" data-act="filter" data-k="goals" data-v="'+k+'" aria-pressed="'+(filters.goals===k)+'">'+l+'</button>';};
 var fn=esc(first());
 return '<p class="page-sub">A look at '+fn+'’s goals and the amazing things they want to achieve.</p>'+
 '<div class="goals-layout"><div class="goals-main">'+
  '<section class="card ghero"><span class="ghero__ic">'+TYPE_SVG.goal+'</span><div class="ghero__txt"><h2>'+fn+'’s Goals</h2><p>Here are the goals '+fn+' wants to achieve. Set short-term or long-term goals and track the progress together.</p></div>'+
  '<div class="ghero__art" aria-hidden="true"><img src="'+coverImg()+'" alt="">'+GOAL_ART+'</div>'+addBtn('goal','Add a Goal')+'</section>'+
  '<div class="atoolbar"><div class="atabs" role="group" aria-label="Filter goals">'+tab('all','All Goals ('+all.length+')')+tab('want','Want to Try ('+c('want')+')')+tab('working','Working On It ('+c('working')+')')+tab('achieved','Achieved ('+c('achieved')+')')+'</div>'+
  '<div class="afilters"><label class="asearch">'+AIC.search+'<input id="gSearch" type="search" placeholder="Search goals…" value="'+esc(gQ)+'" aria-label="Search goals"></label><select class="input" id="gType" aria-label="Filter by goal type">'+[['all','All Goal Types']].concat(GTYPES.map(function(g){return [g[0],g[1]];})).map(function(o){return '<option value="'+o[0]+'"'+(o[0]===gType?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div></div>'+
  '<div id="goalGrid">'+goalGrid()+'</div>'+
 '</div><div class="goals-side"><div class="card gs-add">'+addBtn('goal','Add a Goal')+'</div>'+goalAside()+'</div></div>';
}
function goalGrid(){
 var q=gQ.trim().toLowerCase(),all=byType('goal'),ord={working:0,want:1,achieved:2};
 if(!all.length)return emptyBox('No goals yet','Add something your child wants to learn, try or achieve.','goal');
 var list=all.filter(function(e){if(filters.goals!=='all'&&e.status!==filters.goals)return false;if(gType!=='all'&&e.gtype!==gType)return false;if(q&&[e.title,e.description,e.why,(e.skills||[]).join(' '),GT_LABEL[e.gtype]].join(' ').toLowerCase().indexOf(q)<0)return false;return true;})
  .sort(function(a,b){return ((ord[a.status]||0)-(ord[b.status]||0))||String(a.target||'9').localeCompare(String(b.target||'9'));});
 if(!list.length)return '<div class="empty"><strong>No goals match</strong><span>Try another tab, goal type or search word.</span><button class="btn btn--ghost btn--sm" data-act="gclear">Clear filters</button></div>';
 return '<div class="ggrid">'+list.map(goalCard).join('')+'</div>';
}
function goalCard(e){
 var open=achMenu===e.id,g=GT_LABEL[e.gtype],lk=e.achId&&get(e.achId),late=e.status!=='achieved'&&e.target&&e.target<today(),d=e.description||e.why||'';
 return '<article class="card gcard"><button class="gcard__ph" data-act="open" data-id="'+e.id+'" aria-label="Open '+esc(e.title)+'"><img src="'+photo(e)+'" alt=""></button>'+
  '<div class="gcard__b"><div class="acard__h scard__h"><h3><button class="acard__title" data-act="open" data-id="'+e.id+'">'+esc(e.title)+'</button></h3>'+
  '<div class="amenu"><button class="amenu__btn" data-act="achmenu" data-id="'+e.id+'" aria-label="More options for '+esc(e.title)+'" aria-haspopup="menu" aria-expanded="'+open+'">'+AIC.dots+'</button>'+
  (open?'<div class="amenu__pop" role="menu"><button role="menuitem" data-act="open" data-id="'+e.id+'">View details</button><button role="menuitem" data-act="edit" data-id="'+e.id+'">Edit</button>'+(e.status==='achieved'&&!lk?'<button role="menuitem" data-act="goal2achc" data-id="'+e.id+'">Add to Achievements</button>':'')+'<button role="menuitem" class="danger" data-act="achdel" data-id="'+e.id+'">Delete</button></div>':'')+'</div></div>'+
  '<div class="chips">'+(g?'<span class="chip gt-chip gt--'+e.gtype+'">'+GT_ICON[e.gtype]+g+'</span>':'')+statusChip(e)+verifiedChip(e)+(lk?'<span class="chip chip--amber">'+AIC.trophy+'In Achievements</span>':'')+'</div>'+
  (d?'<p class="acard__d">'+esc(d)+'</p>':'')+
  '<span class="meta'+(late?' meta--late':'')+'">'+I.cal+'Target Date: '+(e.target?fdate(e.target):'Not set')+(late?' &nbsp;·&nbsp; Date has passed':'')+'</span>'+
  ((e.skills||[]).length?'<div class="chips gcard__skills">'+(e.skills||[]).slice(0,4).map(function(s){return '<span class="chip chip--purple">'+esc(s)+'</span>';}).join('')+'</div>':'')+
 '</div></article>';
}
function vActivities(){
 var list=byDate(byType('activity'));
 return head('activities','Activities & Experiences','Classes, clubs and things '+esc(first())+' takes part in.',addBtn('activity','Add Activity'))+
 (list.length?'<div class="list">'+list.map(function(e){return rowItem(e,'<span class="meta">'+I.cal+dRange(e,true)+'</span>'+(e.org?'<p><strong>'+esc(e.org)+'</strong></p>':'')+'<p>'+esc(e.description)+'</p>');}).join('')+'</div>':emptyBox('No activities yet','Add a class, club or experience.','activity'));
}
var ACH_META={achievement:{label:'Achievement',chip:'chip--amber',ic:'trophy'},certificate:{label:'Certificate',chip:'chip--purple',ic:'ribbon'},award:{label:'Award',chip:'chip--blue',ic:'star'},recognition:{label:'Recognition',chip:'chip--green',ic:'cap'}};
var AIC={trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"/></svg>',
 ribbon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><circle cx="12" cy="9" r="2.2"/><path d="M8.6 13.4L7 21l5-2.6 5 2.6-1.6-7.6"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6-4.5-4.2 6.1-.8z"/></svg>',
 cap:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9.5L12 5l10 4.5L12 14z"/><path d="M6 11.5V16c3.5 2.3 8.5 2.3 12 0v-4.5M22 9.5v5"/></svg>',
 dots:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="19" r="1.9"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'};
var HERO_ART='<svg class="ahero__art" viewBox="0 0 330 130" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="M22 118c9-20 8-42-3-62M20 84c-11-3-16-12-14-21 9 2 14 11 14 21zM21 102c10-7 19-7 24-2-6 8-15 8-24 2z" stroke="#2f9e44" stroke-width="3.5"/>'+
 '<path d="M66 22l4.2 8.5 9.4 1.3-6.8 6.6 1.6 9.3-8.4-4.4-8.4 4.4 1.6-9.3-6.8-6.6 9.4-1.3z" stroke="#f5c400" stroke-width="3.2"/>'+
 '<path d="M128 18h46v24a23 23 0 0 1-46 0zM128 25h-13v6a15 15 0 0 0 15 15M174 25h13v6a15 15 0 0 1-15 15M151 65v16M138 98h26M141 81h20v17h-20z" stroke="#f5b400" stroke-width="5"/>'+
 '<path d="M206 62l3.4 6.9 7.6 1.1-5.5 5.4 1.3 7.6-6.8-3.6-6.8 3.6 1.3-7.6-5.5-5.4 7.6-1.1z" stroke="#ee1d78" stroke-width="3"/>'+
 '<path d="M232 44c-11-7-17-13-17-20a8 8 0 0 1 17-3 8 8 0 0 1 17 3c0 7-6 13-17 20z" stroke="#ee1d78" stroke-width="3.5"/>'+
 '<path d="M240 122c4-13 10-22 19-28M248 106c-8-1-11-7-10-13 7 1 10 7 10 13zM254 99c6-6 12-6 16-3-4 6-10 7-16 3z" stroke="#2f9e44" stroke-width="3.2"/>'+
 '<path d="M262 116c10-24 22-42 38-56" stroke="#1d9be0" stroke-width="4"/><path d="M276 120c8-20 18-36 30-48" stroke="#8a4fd8" stroke-width="3.5"/><path d="M290 122c6-14 13-26 22-35" stroke="#ee1d78" stroke-width="3"/>'+
 '<path d="M312 22l4.6 9.3 10.3 1.5-7.4 7.2 1.7 10.2-9.2-4.8-9.2 4.8 1.7-10.2-7.4-7.2 10.3-1.5z" stroke="#f5c400" stroke-width="3.4"/></svg>';
var achQ='',achSrc='all',achMenu=null;
function achCounts(){var c={all:0,achievement:0,award:0,recognition:0,certificate:0};byType(['achievement','certificate']).forEach(function(e){c.all++;c[kindOf(e)]++;});return c;}
function vAch(){
 var p=S.profile,c=achCounts();
 var tile=function(k,ic,n,l){return '<button class="atile atile--'+k+'" data-act="achfilter" data-v="'+k+'" aria-pressed="'+(filters.ach===k)+'"><span class="atile__ic">'+AIC[ic]+'</span><span class="atile__t"><b>'+n+'</b><span>'+l+'</span></span></button>';};
 var tab=function(k,l){return '<button class="atab" data-act="achfilter" data-v="'+k+'" aria-pressed="'+(filters.ach===k)+'">'+l+'</button>';};
 var srcOpts=[['all','All Categories'],['Outside Activity','Outside Activity'],['Personal / Family','Personal / Family'],[BD_SRC,'Verified by Bright Dreamers']];
 return '<p class="page-sub">A celebration of '+esc(first())+'’s accomplishments, big and small.</p>'+
 '<section class="card ahero-wrap"><div class="ahero"><img class="ahero__photo" src="'+coverImg()+'" alt="'+esc(p.name)+'"><div class="ahero__txt"><h2>'+esc(p.name||'Your child')+'</h2>'+(ageLoc(p)?'<p class="ahero__meta">'+ageLoc(p)+'</p>':'')+(p.quote?'<q>'+esc(p.quote)+'</q>':'')+'</div>'+HERO_ART+'</div>'+addBtn('achievement','Add Achievement')+'</section>'+
 '<div class="atiles">'+tile('all','trophy',c.all,c.all===1?'Achievement':'Achievements')+tile('certificate','ribbon',c.certificate,c.certificate===1?'Certificate':'Certificates')+tile('award','star',c.award,c.award===1?'Award':'Awards')+tile('recognition','cap',c.recognition,'Recognition')+'</div>'+
 '<div class="atoolbar"><div class="atabs" role="group" aria-label="Filter achievements">'+tab('all','All Achievements')+tab('achievement','Achievements')+tab('certificate','Certificates')+tab('award','Awards')+tab('recognition','Recognition')+'</div>'+
 '<div class="afilters"><label class="asearch">'+AIC.search+'<input id="achSearch" type="search" placeholder="Search achievements…" value="'+esc(achQ)+'" aria-label="Search achievements"></label><select class="input" id="achSrc" aria-label="Filter by category">'+srcOpts.map(function(o){return '<option value="'+esc(o[0])+'"'+(o[0]===achSrc?' selected':'')+'>'+esc(o[1])+'</option>';}).join('')+'</select></div></div>'+
 '<div id="achGrid">'+achGrid()+'</div>';
}
function achGrid(){
 var q=achQ.trim().toLowerCase(),all=byType(['achievement','certificate']);
 if(!all.length)return emptyBox('No achievements yet','Add an award, certificate or proud moment.','achievement');
 var list=byDate(all.filter(function(e){if(filters.ach!=='all'&&kindOf(e)!==filters.ach)return false;if(achSrc!=='all'&&e.source!==achSrc)return false;
  if(q){var h=[e.title,e.description,e.org,(e.skills||[]).join(' '),KIND_LABEL[kindOf(e)]].join(' ').toLowerCase();if(h.indexOf(q)<0)return false;}return true;}));
 if(!list.length)return '<div class="empty"><strong>No achievements match</strong><span>Try another tab, category or search word.</span><button class="btn btn--ghost btn--sm" data-act="achclear">Clear filters</button></div>';
 return '<div class="agrid">'+list.map(achCard).join('')+'</div>';
}
function achCard(e){
 var k=kindOf(e),m=ACH_META[k],ph=e.photos||[],more=ph.slice(1,3),extra=ph.length-3,open=achMenu===e.id;
 return '<article class="card acard acard--'+k+'"><div class="acard__top"><button class="acard__ph" data-act="open" data-id="'+e.id+'" aria-label="Open '+esc(e.title)+'"><img src="'+photo(e)+'" alt=""></button>'+
  '<div class="acard__b"><div class="acard__h"><span class="acard__ic">'+AIC[m.ic]+'</span><h3><button class="acard__title" data-act="open" data-id="'+e.id+'">'+esc(e.title)+'</button></h3>'+
  '<div class="amenu"><button class="amenu__btn" data-act="achmenu" data-id="'+e.id+'" aria-label="More options for '+esc(e.title)+'" aria-haspopup="menu" aria-expanded="'+open+'">'+AIC.dots+'</button>'+
  (open?'<div class="amenu__pop" role="menu"><button role="menuitem" data-act="open" data-id="'+e.id+'">View details</button><button role="menuitem" data-act="edit" data-id="'+e.id+'">Edit</button><button role="menuitem" class="danger" data-act="achdel" data-id="'+e.id+'">Delete</button></div>':'')+'</div></div>'+
  '<div class="chips"><span class="chip '+m.chip+'">'+(k==='certificate'&&CT_LABEL[e.ctype]?CT_LABEL[e.ctype]:m.label)+'</span>'+verifiedChip(e)+'</div><span class="meta">'+I.cal+fdate(e.date)+(e.org?' &nbsp;·&nbsp; '+esc(e.org):'')+'</span><p class="acard__d">'+esc(e.description||'')+'</p></div></div>'+
  (more.length?'<div class="acard__thumbs">'+more.map(function(p,i){return '<button data-act="achgal" data-id="'+e.id+'" data-i="'+(i+1)+'" aria-label="Photo '+(i+2)+' of '+esc(e.title)+'"><img src="'+src(p)+'" alt=""></button>';}).join('')+(extra>0?'<button class="acard__more" data-act="achgal" data-id="'+e.id+'" data-i="3" aria-label="'+extra+' more photos">+'+extra+'</button>':'')+'</div>':'')+
 '</article>';
}
function updateAchGrid(){var g=document.getElementById('achGrid');if(g)g.innerHTML=achGrid();var k=document.getElementById('skGrid');if(k)k.innerHTML=skGrid();var gg2=document.getElementById('goalGrid');if(gg2)gg2.innerHTML=goalGrid();}
var HERO_SK='<svg class="ahero__art" viewBox="0 0 330 130" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="M12 60l11 4M16 80l10-5M30 94l-2 10" stroke="#1d9be0" stroke-width="3.2"/>'+
 '<path d="M64 30l5.2 10.5 11.6 1.7-8.4 8.2 2 11.5-10.4-5.4-10.4 5.4 2-11.5-8.4-8.2 11.6-1.7z" stroke="#f5c400" stroke-width="3.4"/>'+
 '<path d="M124 122V72M124 88c-15 0-25-10-25-25 15 0 25 10 25 25zM124 77c0-17 11-29 27-31 0 17-11 29-27 31z" stroke="#2f9e44" stroke-width="3.6"/>'+
 '<path d="M196 82c-14-9-21-17-21-25a10.5 10.5 0 0 1 21-4 10.5 10.5 0 0 1 21 4c0 8-7 16-21 25z" stroke="#ee1d78" stroke-width="3.8"/>'+
 '<path d="M234 46l9-3M233 61h10M235 76l9 3" stroke="#f5b400" stroke-width="3.2"/>'+
 '<path d="M252 128v-22h20V86h20V66h22" stroke="#1d6fa5" stroke-width="3.6"/>'+
 '<circle cx="284" cy="34" r="6.5" stroke="#1d9be0" stroke-width="3.4"/><path d="M282 43l-4 17 10 8 3 16M278 60l-11 10M283 47l13 7" stroke="#1d9be0" stroke-width="3.6"/>'+
 '<path d="M312 10l4.2 8.5 9.4 1.3-6.8 6.6 1.6 9.3-8.4-4.4-8.4 4.4 1.6-9.3-6.8-6.6 9.4-1.3z" stroke="#f5c400" stroke-width="3.2"/></svg>';
var skQ='',skType='all';
function heroBlock(art,btn,cls){var p=S.profile;return '<section class="card ahero-wrap"><div class="ahero'+(cls?' '+cls:'')+'"><img class="ahero__photo" src="'+coverImg()+'" alt="'+esc(p.name)+'"><div class="ahero__txt"><h2>'+esc(p.name||'Your child')+'</h2>'+(ageLoc(p)?'<p class="ahero__meta">'+ageLoc(p)+'</p>':'')+(p.quote?'<q>'+esc(p.quote)+'</q>':'')+'</div>'+art+'</div>'+btn+'</section>';}
function vSkills(){
 var tab=function(k,l){return '<button class="atab" data-act="skfilter" data-v="'+k+'" aria-pressed="'+(filters.sk===k)+'">'+l+'</button>';};
 return '<p class="page-sub">A look at '+esc(first())+'’s skills and talents, and how they are growing.</p>'+
 heroBlock(HERO_SK,addBtn('skill','Add a Skill'),'ahero--pink')+
 '<div class="atoolbar"><div class="atabs" role="group" aria-label="Filter by level">'+tab('all','All Skills')+LEVELS.map(function(l){return tab(l[0],l[1]);}).join('')+'</div>'+
 '<div class="afilters"><label class="asearch">'+AIC.search+'<input id="skSearch" type="search" placeholder="Search skills…" value="'+esc(skQ)+'" aria-label="Search skills"></label><select class="input" id="skType" aria-label="Skills or talents">'+[['all','All Skills'],['skill','Skills only'],['talent','Talents only']].map(function(o){return '<option value="'+o[0]+'"'+(o[0]===skType?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></div></div>'+
 '<div id="skGrid">'+skGrid()+'</div>';
}
function skGrid(){
 var q=skQ.trim().toLowerCase(),all=byType('skill');
 if(!all.length)return emptyBox('No skills yet','Add a skill or talent your child is growing in.','skill');
 var list=all.filter(function(e){if(filters.sk!=='all'&&lvlOf(e)!==filters.sk)return false;if(skType!=='all'&&(e.stype==='talent'?'talent':'skill')!==skType)return false;if(q&&[e.title,e.description].join(' ').toLowerCase().indexOf(q)<0)return false;return true;})
  .sort(function(a,b){return (LVL_IDX[lvlOf(b)]-LVL_IDX[lvlOf(a)])||String(a.title).localeCompare(String(b.title));});
 if(!list.length)return '<div class="empty"><strong>No skills match</strong><span>Try another level, type or search word.</span><button class="btn btn--ghost btn--sm" data-act="skclear">Clear filters</button></div>';
 return '<div class="sgrid">'+list.map(skCard).join('')+'</div>';
}
function skCard(e){
 var p0=(e.photos||[])[0]||'',icon=!p0||/^k:s-/.test(p0),open=achMenu===e.id,used=S.entries.filter(function(x){return x.type!=='skill'&&(x.skills||[]).indexOf(e.title)>-1;}).length;
 return '<article class="card scard"><button class="scard__ph'+(icon?' scard__ph--icon':'')+'" data-act="open" data-id="'+e.id+'" aria-label="Open '+esc(e.title)+'"><img src="'+photo(e)+'" alt=""></button>'+
  '<div class="scard__b"><div class="acard__h scard__h"><h3><button class="acard__title" data-act="open" data-id="'+e.id+'">'+esc(e.title)+'</button></h3>'+
  '<div class="amenu"><button class="amenu__btn" data-act="achmenu" data-id="'+e.id+'" aria-label="More options for '+esc(e.title)+'" aria-haspopup="menu" aria-expanded="'+open+'">'+AIC.dots+'</button>'+
  (open?'<div class="amenu__pop" role="menu"><button role="menuitem" data-act="open" data-id="'+e.id+'">View details</button><button role="menuitem" data-act="edit" data-id="'+e.id+'">Edit</button><button role="menuitem" class="danger" data-act="achdel" data-id="'+e.id+'">Delete</button></div>':'')+'</div></div>'+
  '<div class="chips">'+lvlBadge(e)+(e.stype==='talent'?'<span class="chip chip--purple">Talent</span>':'')+verifiedChip(e)+'</div>'+
  (e.description?'<p class="acard__d">'+esc(e.description)+'</p>':'')+
  '<span class="meta">'+(e.date?I.cal+'Started: '+fdate(e.date,true):'')+(e.date&&used?' &nbsp;·&nbsp; ':'')+(used?'Used in '+used+' entr'+(used===1?'y':'ies'):'')+'</span></div></article>';
}
function vJourney(){
 var f=filters.journey,list=byDate(S.entries.filter(function(e){return e.type!=='skill'&&(f==='all'||e.type===f||(f==='achievement'&&e.type==='certificate'));}));
 return head('journey','Journey Timeline',esc(first())+'’s story, one step at a time.',addBtn('activity','Add Entry'))+
 '<div class="tabs" role="group" aria-label="Filter timeline">'+ftab('journey','all','All')+ftab('journey','activity','Activities')+ftab('journey','achievement','Achievements')+ftab('journey','project','Projects')+ftab('journey','goal','Goals')+'</div>'+
 (list.length?'<ol class="tl">'+list.map(function(e){return '<li><span class="tl__date">'+fdate(e.date,true)+'</span><span class="tl__rail" aria-hidden="true"></span><button class="tl__card" data-act="open" data-id="'+e.id+'"><img src="'+photo(e)+'" alt=""><span style="min-width:0;flex:1"><strong>'+esc(e.title)+'</strong><span class="meta">'+esc(e.org||e.location||'')+'</span></span>'+typeChip(e)+'</button></li>';}).join('')+'</ol>':emptyBox('Nothing here yet','Add an entry to start the timeline.','activity'));
}

/* ---------- Add / Edit ---------- */
function blank(type){return {type:type||'activity',title:'',date:type==='skill'?'':today(),org:'',location:'',description:'',skills:[],photos:[],status:'',target:'',why:'',level:50,source:'',end:''};}
var INTRO={activity:['Add an Activity or Experience','Classes, clubs, camps and outings your child takes part in.'],skill:['Add a Skill or Talent','Record something your child is learning or is naturally good at, and how they are growing.'],achievement:['Add an Achievement','Celebrate something your child is proud of! This can be an award, recognition, certificate, or any special accomplishment.'],certificate:['Add a Certificate','A certificate shows something your child has learned, completed, or been recognized for.'],project:['Add a Project','Something your child created, built, explored or helped with.'],goal:['Add a Goal','A goal is something your child wants to achieve. It can be short-term or long-term.']};
function vAdd(){
 if(!DRAFT){DRAFT=EDIT?JSON.parse(JSON.stringify(get(EDIT))):blank(window.__newType);if(!EDIT&&window.__newTitle)DRAFT.title=window.__newTitle;window.__newType=null;window.__newTitle=null;}
 var d=DRAFT,t=d.type,isEdit=!!EDIT,ach=isAchType(t),admin=!!BD.isAdmin;
 if(ach){d.kind=kindOf(d);if(d.source===BD_SRC&&!admin&&!d.verified)d.source='';if(ACH_SRC.indexOf(d.source)<0)d.source=d.source==='Personal Project'?'Personal / Family':'Outside Activity';}
 var allSkills=[];S.entries.forEach(function(e){(e.type==='skill'?[e.title]:e.skills).forEach(function(s){if(allSkills.indexOf(s)<0&&d.skills.indexOf(s)<0)allSkills.push(s);});});
 var opt=function(list,v){return list.map(function(o){return '<option value="'+esc(o[0])+'"'+(o[0]===v?' selected':'')+'>'+esc(o[1])+'</option>';}).join('');};
 var achPh='e.g. Piano Recital, Science Fair Award, Kindness Recognition';
 var f='';
 f+='<div class="field field--full"><span>'+(t==='goal'?'Goal Title':t==='certificate'?'Certificate Title':'Title')+' <span class="req">*</span></span><input class="input" id="f-title" value="'+esc(d.title)+'" placeholder="'+({activity:'e.g. Ballet Classes',skill:'e.g. Piano, Drawing, Public Speaking',achievement:achPh,project:'e.g. Build a Mini Robot',certificate:'e.g. Piano Level 1, Coding Course, Art Workshop',goal:'e.g. Learn to play a song on the piano, Run a 5K, Read 20 books'}[t])+'" maxlength="90"><span class="err" id="e-title" hidden>Add a title so you can find this entry later.</span></div>';
 if(t==='certificate'){
  if(!CT_LABEL[d.ctype])d.ctype='';
  f+='<label class="field field--full"><span>Issuing Organization <span class="req">*</span></span><input class="input" id="f-org" value="'+esc(d.org)+'" placeholder="e.g. Star Music Academy, Khan Academy, Local Library"><span class="err" id="e-org" hidden>Add the organization that gave the certificate.</span></label>';
  f+='<label class="field"><span>Date Received <span class="req">*</span></span><input class="input" type="date" id="f-date" value="'+esc(d.date)+'" max="'+today()+'"><span class="err" id="e-date" hidden>Choose the date it was received.</span><small class="hint">When did your child receive this certificate?</small></label>';
  f+='<label class="field"><span>Certificate Type <span class="req">*</span></span><select class="input" id="f-ctype">'+(d.ctype?'':'<option value="" selected disabled>Select a certificate type</option>')+opt(CTYPES.map(function(c){return [c[0],c[1]];}),d.ctype)+'</select><span class="err" id="e-ctype" hidden>Choose a certificate type.</span><small class="hint">Choose the type that best fits this certificate.</small></label>';
 }
 if(ach&&t!=='certificate')f+='<label class="field"><span>Date Achieved <span class="req">*</span></span><input class="input" type="date" id="f-date" value="'+esc(d.date)+'" max="'+today()+'"><span class="err" id="e-date" hidden>Choose the date it was achieved.</span><small class="hint">Choose the date this achievement happened. It can be any past date or today.</small></label>';
 else if(t!=='skill'&&t!=='goal'&&t!=='certificate')f+='<label class="field"><span>Start date <span class="req">*</span></span><input class="input" type="date" id="f-date" value="'+esc(d.date)+'"><span class="err" id="e-date" hidden>Choose a start date.</span></label>';
 if(hasEnd(t))f+='<label class="field"><span>End date <small>(optional)</small></span><input class="input" type="date" id="f-end" value="'+esc(d.end||'')+'" min="'+esc(d.date)+'"><span class="err" id="e-end" hidden>The end date can’t be before the start date.</span><small class="hint">'+(t==='activity'?'Leave empty if it’s still going on.':'Leave empty if the project isn’t finished yet.')+'</small></label>';
 if(t==='activity'||(ach&&t!=='certificate'))f+='<label class="field"><span>Where / Organization <small>(optional)</small></span><input class="input" id="f-org" value="'+esc(d.org)+'" placeholder="'+(ach?'e.g. School, Dance Studio, Community Event':'e.g. Star Dance Academy')+'"></label>';
   if(t==='project'){
  if(!PT_LABEL[d.ptype])d.ptype='';
  if(d.source==='Personal Project')d.source='Personal / Family';
  if(d.source===BD_SRC&&!admin&&!d.verified)d.source='';if(SK_SRC.indexOf(d.source)<0)d.source='Outside Activity';
  f+='<label class="field"><span>Project Type <span class="req">*</span></span><select class="input" id="f-ptype">'+(d.ptype?'':'<option value="" selected disabled>Choose a project type</option>')+opt(PTYPES,d.ptype)+'</select><span class="err" id="e-ptype" hidden>Choose a project type.</span><small class="hint">What kind of project is it?</small></label>';
  f+=sel('f-status','Status <span class="req">*</span>',[['progress','In Progress'],['done','Completed']],d.status||'progress');
  if(!admin&&isVerified(d))f+='<div class="field"><span>Source</span><div class="input input--locked">'+CHECK_SM+'Verified by Bright Dreamers</div><small class="hint">Bright Dreamers verified this project, so only Bright Dreamers can change the source.</small></div>';
  else{var so3=[['Outside Activity','Outside Activity'],['Personal / Family','Personal / Family']];if(admin)so3.push([BD_SRC,'Bright Dreamers / Verified by Bright Dreamers']);
   f+='<label class="field"><span>Source <span class="req">*</span></span><select class="input" id="f-source">'+opt(so3,d.source)+'</select><small class="hint">'+(admin?'Where did this project happen? Only admins see the Bright Dreamers option.':'Where did this project happen?')+'</small></label>';}
  f+='<label class="field"><span>Location <small>(optional)</small></span><input class="input" id="f-location" value="'+esc(d.location)+'" placeholder="e.g. Home, School, Local Park"></label>';
 }
 if(t==='goal'){
  if(!GT_LABEL[d.gtype])d.gtype='';
  if(!d.description&&d.why)d.description=d.why;
  if(d.source===BD_SRC&&!admin&&!d.verified)d.source='';if(SK_SRC.indexOf(d.source)<0)d.source='Personal / Family';
  f+='<label class="field"><span>Goal Type <span class="req">*</span></span><select class="input" id="f-gtype">'+(d.gtype?'':'<option value="" selected disabled>Select a goal type</option>')+opt(GTYPES,d.gtype)+'</select><span class="err" id="e-gtype" hidden>Choose a goal type.</span><small class="hint">Choose the type that best fits this goal.</small></label>';
  f+='<label class="field"><span>Target Date <span class="req">*</span></span><input class="input" type="date" id="f-target" value="'+esc(d.target||'')+'"><span class="err" id="e-target" hidden>Choose a target date.</span><small class="hint">When does your child want to achieve this goal?</small></label>';
  f+='<label class="field"><span>Status <span class="req">*</span></span><select class="input" id="f-status">'+opt([['want','Want to Try'],['working','Working On It'],['achieved','Achieved']],d.status||'want')+'</select><small class="hint">Is this goal still a wish, in progress or achieved?</small></label>';
  if(!admin&&isVerified(d))f+='<div class="field"><span>Source</span><div class="input input--locked">'+CHECK_SM+'Verified by Bright Dreamers</div><small class="hint">Bright Dreamers verified this goal, so only Bright Dreamers can change the source.</small></div>';
  else{var so4=[['Personal / Family','Personal / Family'],['Outside Activity','Outside Activity']];if(admin)so4.push([BD_SRC,'Bright Dreamers / Verified by Bright Dreamers']);
   f+='<label class="field"><span>Source <span class="req">*</span></span><select class="input" id="f-source">'+opt(so4,d.source)+'</select><small class="hint">'+(admin?'Where did this goal come from? Only admins see the Bright Dreamers option.':'Where did this goal come from?')+'</small></label>';}
  if((d.status||'want')==='achieved'){
   var linked=d.achId&&get(d.achId);
   if(linked)f+='<div class="field field--full goal-ach goal-ach--done"><div class="goal-ach__h"><span class="goal-ach__tick">'+CHECK_SM+'</span><div><strong>Already in Achievements</strong><span>“'+esc(linked.title)+'” is on the Achievements page.</span></div></div><button type="button" class="btn btn--line btn--sm" data-act="open" data-id="'+linked.id+'">View achievement</button></div>';
   else{if(d.toAch===undefined)d.toAch=true;
    f+='<div class="field field--full goal-ach" role="group" aria-labelledby="gaTitle"><div class="goal-ach__h"><img '+img('achievements')+' alt=""><div><strong id="gaTitle">Add this to Achievements?</strong><span>Celebrate it! We’ll add this goal to '+esc(first())+'’s Achievements page too.</span></div></div>'+
    '<div class="goal-ach__row"><div class="seg" role="radiogroup" aria-labelledby="gaTitle">'+[['yes','Yes, add it'],['no','Not now']].map(function(o){return '<label class="seg__opt"><input type="radio" name="f-toach" value="'+o[0]+'"'+((d.toAch?'yes':'no')===o[0]?' checked':'')+'><span>'+o[1]+'</span></label>';}).join('')+'</div>'+
    '<label class="field goal-ach__date"'+(d.toAch?'':' hidden')+'><span>Date achieved</span><input class="input" type="date" id="f-achdate" value="'+esc(d.achDate||today())+'" max="'+today()+'"></label></div></div>';}
  }
 }
 if(t==='activity')f+=sel('f-status','Status',[['ongoing','Ongoing'],['completed','Completed']],d.status||'ongoing');
 if(ach&&t!=='certificate'){
  f+='<label class="field"><span>Type <span class="req">*</span></span><select class="input" id="f-kind">'+opt(KINDS,d.kind)+'</select><small class="hint">Choose the type: Achievement, Award, Recognition, or Certificate.</small></label>';
  if(!admin&&isVerified(d))f+='<div class="field"><span>Source</span><div class="input input--locked">'+CHECK_SM+'Verified by Bright Dreamers</div><small class="hint">Bright Dreamers verified this entry, so only Bright Dreamers can change the source.</small></div>';
  else{var so=[['Outside Activity','Outside Activity'],['Personal / Family','Personal / Family']];if(admin)so.push([BD_SRC,'Bright Dreamers / Verified by Bright Dreamers']);
   f+='<label class="field"><span>Source <span class="req">*</span></span><select class="input" id="f-source">'+opt(so,d.source)+'</select><small class="hint">'+(admin?'Where did this happen? Only admins see the Bright Dreamers option.':'Where did this happen?')+'</small></label>';}
 }
 if(t!=='skill'&&t!=='goal'&&t!=='project'&&!ach)f+=sel('f-source','Type of experience',[['Bright Dreamers','Bright Dreamers'],['Outside Activity','Outside Activity'],['Personal Project','Personal Project']],d.source||'Bright Dreamers');
 if(t==='skill'){
  d.stype=d.stype==='talent'?'talent':'skill';d.lvl=lvlOf(d);
  if(d.source===BD_SRC&&!admin&&!d.verified)d.source='';if(SK_SRC.indexOf(d.source)<0)d.source='Outside Activity';
  f+='<fieldset class="field seg-field"><legend>Type <span class="req">*</span></legend><div class="seg" role="radiogroup" aria-label="Skill or talent">'+[['skill','Skill'],['talent','Talent']].map(function(o){return '<label class="seg__opt"><input type="radio" name="f-stype" value="'+o[0]+'"'+(d.stype===o[0]?' checked':'')+'><span>'+o[1]+'</span></label>';}).join('')+'</div><small class="hint">A skill is learned with practice. A talent comes naturally.</small></fieldset>';
  f+='<label class="field"><span>Start date <small>(optional)</small></span><input class="input" type="date" id="f-date" value="'+esc(d.date||'')+'" max="'+today()+'"><span class="err" id="e-date" hidden>The start date can’t be in the future.</span><small class="hint">When did your child start? Pick a day on the calendar.</small></label>';
  f+='<label class="field"><span>Level <span class="req">*</span></span><select class="input" id="f-lvl">'+opt(LEVELS,d.lvl)+'</select><small class="hint">How is your child doing with this right now?</small></label>';
  if(!admin&&isVerified(d))f+='<div class="field"><span>Source</span><div class="input input--locked">'+CHECK_SM+'Verified by Bright Dreamers</div><small class="hint">Bright Dreamers verified this skill, so only Bright Dreamers can change the source.</small></div>';
  else{var so2=[['Outside Activity','Outside Activity'],['Personal / Family','Personal / Family']];if(admin)so2.push([BD_SRC,'Bright Dreamers / Verified by Bright Dreamers']);
   f+='<label class="field"><span>Source <span class="req">*</span></span><select class="input" id="f-source">'+opt(so2,d.source)+'</select><small class="hint">'+(admin?'Where did your child learn this? Only admins see the Bright Dreamers option.':'Where did your child learn this?')+'</small></label>';}
 }
  f+='<label class="field field--full"><span>Description '+(t==='skill'?'<small>(optional)</small>':'<span class="req">*</span>')+'</span><textarea class="input" id="f-desc" rows="4" placeholder="'+(t==='certificate'?'What was this certificate for? What did your child learn or accomplish? Why is it special?':ach?'What happened? Why does it matter? How did your child feel?':t==='skill'?'e.g. Practicing regularly and learning new songs.':'What happened, what did they learn, how did they feel?')+'">'+esc(d.description)+'</textarea><span class="err" id="e-desc" hidden>Add a short description.</span></label>';
 if(t!=='skill'){
  f+='<div class="field field--full"><span>'+(t==='certificate'?'Skills related to this certificate':ach?'Skills used or learned':t==='goal'?'Related Skills':'Skills learned or used')+' <small>(optional)</small></span><div class="tagbox" id="tagbox">'+d.skills.map(function(s,i){return '<span class="chip '+CHIPC[i%5]+'">'+esc(s)+'<button type="button" data-act="untag" data-i="'+i+'" aria-label="Remove '+esc(s)+'">×</button></span>';}).join('')+'<input id="f-tag" type="search" autocomplete="off" placeholder="'+(ach?(t==='certificate'?'Search or add a skill (e.g. Piano, Creativity, Coding, Leadership)':'Search or add a skill (e.g. Confidence, Public Speaking, Teamwork)'):t==='goal'?'Search or add a skill (e.g. Piano, Confidence, Running, Reading)':'Search skills or type a new one')+'" aria-label="Search or add a skill" aria-controls="tagSuggest"></div>'+
  '<div class="suggest" id="tagSuggest" aria-live="polite">'+tagSuggest('')+'</div><small class="hint">'+(t==='certificate'?'Which skills did your child use or develop? ':t==='goal'?'Which skills will help them achieve this goal? ':'')+'Type to search, Enter picks the first match, or use “+ Add” for a new skill.</small></div>';
 }
 if(t==='certificate'){
  if(!admin&&isVerified(d))f+='<div class="field"><span>Source</span><div class="input input--locked">'+CHECK_SM+'Verified by Bright Dreamers</div><small class="hint">Bright Dreamers verified this certificate, so only Bright Dreamers can change the source.</small></div>';
  else{var so5=[['Outside Activity','Outside Activity'],['Personal / Family','Personal / Family']];if(admin)so5.push([BD_SRC,'Bright Dreamers / Verified by Bright Dreamers']);
   f+='<label class="field"><span>Source <span class="req">*</span></span><select class="input" id="f-source">'+opt(so5,d.source)+'</select><small class="hint">'+(admin?'Where did this certificate come from? Only admins see the Bright Dreamers option.':'Where did this certificate come from?')+'</small></label>';}
 }
 f+='<div class="field field--full"><span class="flabel">'+(t==='skill'?'Photo':t==='certificate'?'Upload photos or files':ach?'Upload photos or certificate':'Upload photos')+' <small>(optional, JPG or PNG)</small></span><div class="photos">'+d.photos.map(function(p,i){return '<div class="thumb"><img src="'+src(p)+'" alt=""><button type="button" data-act="unphoto" data-i="'+i+'" aria-label="Remove photo">×</button></div>';}).join('')+
  '<label class="drop" id="drop">'+I.upload+'Add Photos<input type="file" id="f-photos" accept="image/*" multiple hidden></label></div>'+UPLOAD_HELP+'</div>';
 var it=INTRO[t]||INTRO.activity,ttl=isEdit?it[0].replace(/^Add an? /,'Edit '):it[0];
 return '<div class="backbar"><button class="back" data-act="cancel">'+I.back+'Back</button></div>'+
 (sideFor(t)?'<div class="add-layout">':'')+'<form class="card form" id="entryForm" novalidate>'+
  '<div class="types" role="group" aria-label="Entry type">'+Object.keys(TYPES).map(function(k){return '<button type="button" class="type" data-act="type" data-type="'+k+'" aria-pressed="'+(k===t)+'">'+TYPE_SVG[k]+TYPES[k].label+'</button>';}).join('')+'</div>'+
  '<div class="form-intro form-intro--'+(ach?'achievement':t)+'"><img '+img(TYPES[t].icon)+' alt=""><div><h3>'+esc(ttl)+'</h3><p>'+esc(it[1])+'</p></div></div>'+
  '<div class="fgrid">'+f+'</div>'+
  '<div class="form__foot">'+(isEdit?'<button type="button" class="btn btn--ghost" data-act="cancel">Cancel</button>':'')+'<button type="submit" class="btn">'+(isEdit?'Save Changes':'Save Entry')+'</button></div>'+
 '</form>'+(sideFor(t)?sideFor(t)+'</div>':'');
}
function sel(id,label,opts,v){return '<label class="field"><span>'+label+'</span><select class="input" id="'+id+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===v?' selected':'')+'>'+o[1]+'</option>';}).join('')+'</select></label>';}
function readForm(){
 var d=DRAFT,v=function(id){var el=document.getElementById(id);return el?el.value:undefined;};
 ['title','date','end','org','location','target','why'].forEach(function(k){var x=v('f-'+k);if(x!==undefined)d[k]=x.trim();});
 var x;if((x=v('f-kind'))!==undefined)d.kind=x;if((x=v('f-lvl'))!==undefined)d.lvl=x;if((x=v('f-ptype'))!==undefined)d.ptype=x||'';if((x=v('f-gtype'))!==undefined)d.gtype=x||'';if((x=v('f-ctype'))!==undefined)d.ctype=x||'';if((x=v('f-achdate'))!==undefined)d.achDate=x;var ta=document.querySelector('input[name="f-toach"]:checked');if(ta)d.toAch=ta.value==='yes';var sr=document.querySelector('input[name="f-stype"]:checked');if(sr)d.stype=sr.value;if((x=v('f-desc'))!==undefined)d.description=x.trim();if((x=v('f-status'))!==undefined)d.status=x;if((x=v('f-source'))!==undefined)d.source=x;if((x=v('f-level'))!==undefined)d.level=+x;
}
function bindAdd(){
 var form=document.getElementById('entryForm');
 form.addEventListener('input',function(ev){if(ev.target.id==='f-level')document.getElementById('lvlOut').textContent=ev.target.value+'%';if(ev.target.id==='f-date'){var en=document.getElementById('f-end');if(en)en.min=ev.target.value;}});
 var tag=document.getElementById('f-tag');
 if(tag)tag.addEventListener('input',function(){var box=document.getElementById('tagSuggest');if(box)box.innerHTML=tagSuggest(tag.value);});
 if(tag)tag.addEventListener('keydown',function(ev){if(ev.key==='ArrowDown'){var fb=document.querySelector('#tagSuggest button');if(fb){ev.preventDefault();fb.focus();}}});
 if(tag)tag.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===','){ev.preventDefault();addTag(ev.key==='Enter'?bestTag(tag.value):tag.value);}else if(ev.key==='Backspace'&&!tag.value&&DRAFT.skills.length){readForm();DRAFT.skills.pop();rerenderAdd('f-tag');}});
 var fi=document.getElementById('f-photos'),drop=document.getElementById('drop');
 fi.addEventListener('change',function(){addFiles(fi.files);});
 ['dragenter','dragover'].forEach(function(n){drop.addEventListener(n,function(ev){ev.preventDefault();drop.classList.add('is-over');});});
 ['dragleave','drop'].forEach(function(n){drop.addEventListener(n,function(ev){ev.preventDefault();drop.classList.remove('is-over');});});
 drop.addEventListener('drop',function(ev){if(ev.dataTransfer)addFiles(ev.dataTransfer.files);});
 form.addEventListener('change',function(ev){if(DRAFT&&DRAFT.type==='goal'&&ev.target.id==='f-status'){readForm();rerenderAdd('f-status');return;}if(ev.target.name==='f-toach'){var dd=document.querySelector('.goal-ach__date');if(dd)dd.hidden=ev.target.value!=='yes';}if(ev.target.id==='f-kind'){readForm();DRAFT.type=DRAFT.kind==='certificate'?'certificate':'achievement';rerenderAdd('f-kind');}});
 form.addEventListener('submit',function(ev){ev.preventDefault();submitEntry();});
}
function addTag(val){var s=(val||'').replace(/,/g,'').trim();if(!s)return;var sl=s.toLowerCase(),hit=skillPool().filter(function(x){return x.toLowerCase()===sl;})[0];s=hit||s.charAt(0).toUpperCase()+s.slice(1);readForm();if(DRAFT.skills.indexOf(s)<0)DRAFT.skills.push(s);rerenderAdd('f-tag');}
function rerenderAdd(focusId){var y=window.scrollY;document.getElementById('view').innerHTML=vAdd();bindAdd();window.scrollTo(0,y);if(focusId){var el=document.getElementById(focusId);if(el)el.focus();}}
function addFiles(files){
 readForm();var list=Array.prototype.slice.call(files||[]).filter(function(f){return /^image\//.test(f.type);});
 if(!list.length){toast('Choose a JPG or PNG photo.');return;}
 if(DRAFT.photos.length+list.length>6){toast('You can add up to 6 photos per entry.');list=list.slice(0,Math.max(0,6-DRAFT.photos.length));}
 toast('Uploading photo'+(list.length>1?'s':'')+'\u2026');Promise.all(list.map(function(f){return shrink(f).then(upload);})).then(function(urls){var n=0;urls.forEach(function(u){if(u){DRAFT.photos.push(u);n++;}});if(VIEW==='add')rerenderAdd();if(n)toast(n===1?'Photo added':n+' photos added');});
}
function upload(dataUrl){if(!dataUrl)return null;return api('upload',BD.actingFor?{image:dataUrl,parent:BD.actingFor.id}:{image:dataUrl}).then(function(j){return j.url;},function(e){toast(e.message);return null;});}
/* Trim empty white / transparent bands around a photo (e.g. a strip above the picture),
   so it fills round and square frames. Normal photos are left as they are. */
function blankBounds(im){var W=im.naturalWidth||im.width,H=im.naturalHeight||im.height,full={x:0,y:0,w:W,h:H};
 try{var s=Math.min(1,400/Math.max(W,H)),cw=Math.max(1,Math.round(W*s)),ch=Math.max(1,Math.round(H*s)),c=document.createElement('canvas');c.width=cw;c.height=ch;
  var x=c.getContext('2d');x.drawImage(im,0,0,cw,ch);var d=x.getImageData(0,0,cw,ch).data;
  var blank=function(i){return d[i+3]<24||(d[i]>242&&d[i+1]>242&&d[i+2]>242);};
  var rowBlank=function(y){var n=0;for(var X=0;X<cw;X++)if(blank((y*cw+X)*4))n++;return n>=cw*0.985;};
  var colBlank=function(X,y0,y1){var n=0,t=y1-y0+1;for(var y=y0;y<=y1;y++)if(blank((y*cw+X)*4))n++;return n>=t*0.985;};
  var top=0,bot=ch-1,lef=0,rig=cw-1;while(top<bot&&rowBlank(top))top++;while(bot>top&&rowBlank(bot))bot--;
  while(lef<rig&&colBlank(lef,top,bot))lef++;while(rig>lef&&colBlank(rig,top,bot))rig--;
  if(!top&&!lef&&bot===ch-1&&rig===cw-1)return full;
  var nw=(rig-lef+1)/cw,nh=(bot-top+1)/ch;if(nw<0.35||nh<0.35)return full;
  var pad=1,X0=Math.max(0,(lef+(lef?pad:0))/s),Y0=Math.max(0,(top+(top?pad:0))/s),X1=Math.min(W,(rig+1-(rig<cw-1?pad:0))/s),Y1=Math.min(H,(bot+1-(bot<ch-1?pad:0))/s);
  return {x:Math.round(X0),y:Math.round(Y0),w:Math.max(1,Math.round(X1-X0)),h:Math.max(1,Math.round(Y1-Y0))};}catch(e){return full;}}
function shrink(file){return new Promise(function(res){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var b=blankBounds(im),m=1600,w=b.w,h=b.h,k=Math.min(1,m/Math.max(w,h));var c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,b.x,b.y,b.w,b.h,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.86));};im.onerror=function(){res(null);};im.src=r.result;};r.onerror=function(){res(null);};r.readAsDataURL(file);});}
function submitEntry(){
 readForm();var d=DRAFT,ok=true;
 var show=function(id,bad){var e=document.getElementById('e-'+id),f=document.getElementById('f-'+(id==='desc'?'desc':id));if(e)e.hidden=!bad;if(f)f.classList.toggle('is-bad',bad);if(bad&&ok){f&&f.focus();ok=false;}};
 show('title',!d.title);
 if(d.type==='certificate'){show('org',!d.org);show('ctype',!CT_LABEL[d.ctype]);}
 if(d.type==='project')show('ptype',!PT_LABEL[d.ptype]);
 if(d.type==='goal'){if(!d.date)d.date=today();show('gtype',!GT_LABEL[d.gtype]);show('target',!d.target);}
 if(d.type==='skill')show('date',!!(d.date&&d.date>today()));
 if(d.type!=='skill'){var de=document.getElementById('e-date');if(isAchType(d.type)&&d.date&&d.date>today()){if(de)de.textContent=(d.type==='certificate'?'The date received can\u2019t be in the future.':'The date achieved can\u2019t be in the future.');show('date',true);}else{if(de&&isAchType(d.type))de.textContent=(d.type==='certificate'?'Choose the date it was received.':'Choose the date it was achieved.');show('date',!d.date);}}
 if(hasEnd(d.type))show('end',!!(d.end&&d.date&&d.end<d.date));
 if(d.type!=='skill')show('desc',!d.description);
 if(!ok)return;
 if(!hasEnd(d.type)||!d.end)delete d.end;
 if(d.type!=='certificate')delete d.ctype;
 if(isAchType(d.type)){d.kind=kindOf(d);d.type=d.kind==='certificate'?'certificate':'achievement';if(BD.isAdmin)d.verified=d.source===BD_SRC;else if(d.source!==BD_SRC)d.verified=false;}else if(d.type==='goal'){delete d.kind;if(d.description)delete d.why;if(BD.isAdmin)d.verified=d.source===BD_SRC;else if(d.source!==BD_SRC)d.verified=false;}else if(d.type==='project'){delete d.kind;if(BD.isAdmin)d.verified=d.source===BD_SRC;else if(d.source!==BD_SRC)d.verified=false;}else if(d.type==='skill'){delete d.kind;d.stype=d.stype==='talent'?'talent':'skill';d.lvl=lvlOf(d);d.level=LVL_PCT[d.lvl];if(BD.isAdmin)d.verified=d.source===BD_SRC;else if(d.source!==BD_SRC)d.verified=false;}else{delete d.kind;delete d.verified;}
 if(d.type==='project'&&!d.status)d.status='progress';
 var wasEdit=!!EDIT;
 if(EDIT){var i=S.entries.findIndex(function(e){return e.id===EDIT;});S.entries[i]=d;}else{d.id=uid();d.created=Date.now();S.entries.push(d);}
 var madeAch=false;if(d.type==='goal'){if(d.status==='achieved'&&d.toAch&&!(d.achId&&get(d.achId))){goalToAch(d,d.achDate||today());madeAch=true;}delete d.toAch;delete d.achDate;}
 if(madeAch)setTimeout(function(){toast('Goal saved and added to Achievements');},60);
 if(!save()&&!memoryOnly){if(!wasEdit)S.entries.pop();return;}
 lastSaved=d.id;EDIT=null;DRAFT=null;
 if(wasEdit){CUR=d.id;toast('Changes saved');go('entry');}else go('success');
}

/* ---------- Success ---------- */
function vSuccess(){
 var e=get(lastSaved);var where={activity:'activities',achievement:'achievements',certificate:'achievements',project:'projects',goal:'goals',skill:'skills'}[e.type];
 var w=[['journey','journey','Journey Timeline'],['skills','skills','Skills'],['achievements','achievements','Achievements'],[where==='activities'||where==='projects'||where==='goals'?where:'activities',where==='projects'?'projects':where==='goals'?'goals':'activities',where==='projects'?'Projects':where==='goals'?'Goals':'Activities'],['portfolio','portfolio','Portfolio']];
 return '<section class="card success"><div class="tick">'+I.check+'</div><h2>Your entry has been saved!</h2><p class="muted" style="margin:0">It has been added to '+esc(first())+'’s portfolio.</p><div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:6px"><button class="btn" data-act="new" data-type="'+e.type+'">Add Another Entry</button><a class="btn btn--line" href="#portfolio">View Portfolio</a></div></section>'+
 '<section class="card panel" style="justify-items:center"><h3>Where would you like to see this entry?</h3><div class="where">'+w.map(function(x){return '<a href="#'+x[0]+'"'+(x[0]===where?' class="hl"':'')+'><img '+img(x[1])+' alt="">'+x[2]+'</a>';}).join('')+'</div></section>'+
 '<section class="card"><div class="h-sec" style="padding:16px 20px 0"><h3>Entry Preview</h3><button class="link" data-act="edit" data-id="'+e.id+'">Edit</button></div><div class="preview"><img src="'+photo(e)+'" alt=""><div style="display:grid;gap:8px;justify-items:start;min-width:0"><h3>'+esc(e.title)+'</h3>'+(e.date&&e.type!=='skill'?'<span class="meta">'+I.cal+dRange(e)+'</span>':'')+typeChip(e)+'<p style="margin:0">'+esc(e.description||e.why||'')+'</p>'+(e.skills.length?'<div class="chips"><strong style="font-size:.86rem">Skills:</strong>'+skillChips(e)+'</div>':'')+'</div></div></section>';
}

/* ---------- Entry detail ---------- */
function vEntry(){
 var e=get(CUR),ph=e.photos.length?e.photos:['k:'+TYPES[e.type].icon];if(galleryIdx>=ph.length)galleryIdx=0;
 var rows='';
 if(e.org||e.location)rows+='<div><h3>'+(e.type==='certificate'?'Issuing organization':'Where / Organization')+'</h3><p>'+esc(e.org||e.location)+'</p></div>';
 if(e.type==='goal')rows+='<div><h3>Target date</h3><p>'+(e.target?fdate(e.target):'Not set')+'</p></div>'+(e.why&&e.why!==e.description?'<div><h3>Why it matters</h3><p>'+esc(e.why)+'</p></div>':'');
 if(e.type==='skill')rows+='<div><h3>Skill level</h3><div class="bar" style="max-width:320px"><i style="width:'+(e.level||0)+'%"></i></div><p class="muted">'+(e.level||0)+'%</p></div>';
 if(e.type==='certificate'&&CT_LABEL[e.ctype])rows+='<div><h3>Certificate type</h3><p>'+CT_LABEL[e.ctype]+'</p></div>';
 if(e.type==='goal'&&GT_LABEL[e.gtype])rows+='<div><h3>Goal type</h3><p>'+GT_LABEL[e.gtype]+'</p></div>';
 if(e.type==='goal'&&e.status==='achieved'){var lk=e.achId&&get(e.achId);if(lk)rows+='<div class="goal-ach goal-ach--done"><div class="goal-ach__h"><span class="goal-ach__tick">'+CHECK_SM+'</span><div><strong>Added to Achievements</strong><span>This goal is also on the Achievements page.</span></div></div><button class="btn btn--line btn--sm" data-act="open" data-id="'+lk.id+'">View achievement</button></div>';else if(!e.achSkip)rows+='<div class="goal-ach"><div class="goal-ach__h"><img '+img('achievements')+' alt=""><div><strong>Add this to Achievements?</strong><span>Celebrate it! This goal will also appear on the Achievements page.</span></div></div><div class="row__btns"><button class="btn btn--sm" data-act="goal2ach">Yes, add it</button><button class="btn btn--ghost btn--sm" data-act="goalskip">Not now</button></div></div>';}
 if(e.type==='project'&&PT_LABEL[e.ptype])rows+='<div><h3>Project type</h3><p>'+PT_LABEL[e.ptype]+'</p></div>';
 if(e.description)rows+='<div><h3>Description</h3><p>'+esc(e.description)+'</p></div>';
 if(e.skills.length)rows+='<div><h3>Skills learned or used</h3><div class="chips">'+skillChips(e)+'</div></div>';
 if(e.source)rows+='<div><h3>'+(canVerify(e.type)?'Source':'Type of experience')+'</h3><p>'+esc(srcLabel(e))+'</p></div>';
 var stOpts={project:[['progress','In Progress'],['done','Completed']],goal:[['want','Want to Try'],['working','Working On It'],['achieved','Achieved']],activity:[['ongoing','Ongoing'],['completed','Completed']]}[e.type];
 if(stOpts)rows+='<div><h3>Status</h3><div class="tabs">'+stOpts.map(function(o){return '<button class="tab" data-act="setstatus" data-v="'+o[0]+'" aria-pressed="'+(e.status===o[0])+'">'+o[1]+'</button>';}).join('')+'</div></div>';
 return '<div class="backbar"><button class="back" data-act="back">'+I.back+'Back</button><button class="btn btn--line btn--sm" style="margin-left:auto" data-act="edit" data-id="'+e.id+'">'+I.edit+'Edit</button></div>'+
 '<section class="card detail"><div class="gallery"><div class="gallery__main'+(e.photos.length?'':' is-ph')+'">'+(e.photos.length?'<span class="gallery__bg" aria-hidden="true" style="background-image:url(&quot;'+esc(src(ph[galleryIdx]))+'&quot;)"></span>':'')+'<img src="'+src(ph[galleryIdx])+'" alt="'+esc(e.title)+'"></div>'+(ph.length>1?'<div class="gallery__thumbs">'+ph.map(function(p,i){return '<button data-act="gal" data-i="'+i+'" aria-pressed="'+(i===galleryIdx)+'" aria-label="Photo '+(i+1)+'"><img src="'+src(p)+'" alt=""></button>';}).join('')+'</div>':'')+'</div>'+
 '<div class="dl"><div style="display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap"><div><h2 style="font-size:1.5rem">'+esc(e.title)+'</h2>'+(e.type!=='skill'?'<span class="meta" style="margin-top:4px">'+I.cal+dRange(e)+'</span>':'')+'</div><div class="chips">'+typeChip(e)+(canVerify(e.type)?verifiedChip(e):statusChip(e))+'</div></div>'+rows+
 (confirmDel?'<div class="confirm">Delete “'+esc(e.title)+'”? This cannot be undone.<button class="btn btn--sm" data-act="del-yes">Delete</button><button class="btn btn--ghost btn--sm" data-act="del-no">Keep it</button></div>':'<div><button class="btn btn--danger btn--sm" data-act="del">Delete entry</button></div>')+
 '</div></section>';
}

/* ---------- Profile ---------- */
function vProfile(){
 var p=S.profile,canAdj=canAdjustPhoto();
 return head('profile','My Child’s Profile','The basics that appear on the portfolio cover.','')+
 '<form class="card form" id="profileForm" novalidate><div class="photo-pick">'+(canAdj?'<button type="button" class="photo-pick__img" data-act="pf-adjust" aria-label="Adjust photo"><img src="'+src(p.photo)+'" alt="'+esc(p.name)+'" id="pfImg"><span class="photo-pick__hint" aria-hidden="true">'+I.edit+'</span></button>':'<img src="'+src(p.photo)+'" alt="'+esc(p.name)+'" id="pfImg">')+'<div style="display:grid;gap:8px;min-width:0"><div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn btn--line btn--sm">Change photo<input type="file" id="pf-photo" accept="image/*" hidden></label>'+(canAdj?'<button type="button" class="btn btn--ghost btn--sm" data-act="pf-adjust">Adjust photo</button>':'')+'</div><span class="muted" style="font-size:.85rem">'+(canCover()?'Shown on the dashboard and portfolio cover. You can zoom, move, center and rotate the photo.':'Not shown on the dashboard or portfolio covers (turned off in Account Settings). You can still zoom, move, center and rotate the photo.')+'</span>'+UPLOAD_HELP+'</div></div>'+
 '<div class="fgrid">'+
 '<label class="field"><span>Preferred Name / Nickname</span><input class="input" id="pf-name" value="'+esc(p.name)+'" aria-describedby="pfNameHelp"><small class="field__help" id="pfNameHelp">Use the name you would like shown on your child\u2019s private portfolio. A last name is not required.</small></label>'+pf('age','Age',p.age)+pf('location','Location',p.location)+pf('interests','Interests',p.interests)+
 '<label class="field field--full"><span>About me</span><textarea class="input" id="pf-about" rows="3">'+esc(p.about)+'</textarea></label>'+
 '<label class="field field--full"><span>My dream</span><textarea class="input" id="pf-dream" rows="2">'+esc(p.dream)+'</textarea></label>'+
 '<label class="field field--full"><span>Favorite saying <small>(shown on the cover)</small></span><input class="input" id="pf-quote" value="'+esc(p.quote)+'" placeholder="e.g. I love exploring new ideas and helping others." maxlength="140"></label>'+
 '</div>'+(!BD.consent&&!BD.actingFor?consentAsk('pf'):'')+'<div class="form__foot"><button class="btn" type="submit">Save Profile</button></div></form>';
}
function pf(k,l,v){return '<label class="field"><span>'+l+'</span><input class="input" id="pf-'+k+'" value="'+esc(v)+'"></label>';}

/* ---------- Portfolio ---------- */
function vPortfolio(){
 var p=S.profile,j=byDate(S.entries.filter(function(e){return e.type!=='skill'&&e.type!=='goal';})).slice(0,5).reverse(),st=stats();
 var skills=byType('skill').slice().sort(function(a,b){return LVL_PCT[lvlOf(b)]-LVL_PCT[lvlOf(a)];}).slice(0,6);
 return '<div class="backbar"><h2>'+esc(first())+'’s Portfolio</h2><div style="margin-left:auto;display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--line btn--sm" href="#book">'+I.doc+'Printable Book</a>'+(canShare()?'<a class="btn btn--sm" href="#email">Share by Email</a>':'<button type="button" class="btn btn--sm" disabled title="Turn on \u201cAllow me to share portfolio copies by email\u201d in Account Settings">Share by Email</button>')+'</div></div>'+
 '<p class="share-notice pf-private">'+I_LOCK+'<span>This portfolio is private and visible only through your account unless you choose to share it.</span></p>'+
 '<section class="pf-hero"><img src="'+coverImg()+'" alt="'+esc(p.name)+'"><div style="min-width:0"><h2>'+esc(p.name)+'</h2><p class="muted" style="margin:4px 0 0">Age '+esc(p.age)+' &nbsp;|&nbsp; '+esc(p.location)+'</p><q>'+esc(p.quote)+'</q></div></section>'+
 '<div class="pf-grid"><section class="card pf-box"><h3><img '+img('profile')+' alt="">About Me</h3><p>'+esc(p.about)+'</p></section><section class="card pf-box"><h3><img '+img('achievements')+' alt="">My Interests</h3><p>'+esc(p.interests)+'</p></section><section class="card pf-box"><h3><img '+img('goals')+' alt="">My Dream</h3><p>'+esc(p.dream)+'</p></section></div>'+
 '<section class="card panel"><div class="h-sec"><h3>My Journey</h3><a class="link" href="#journey">Full timeline →</a></div>'+(j.length?'<div class="journey">'+j.map(function(e){return '<button data-act="open" data-id="'+e.id+'"><img src="'+photo(e)+'" alt=""><small>'+fdate(e.date,true)+'</small><strong>'+esc(e.title)+'</strong></button>';}).join('')+'</div>':'<p class="muted">No entries yet.</p>')+'</section>'+
 '<section class="card panel"><div class="h-sec"><h3>Top Skills</h3><a class="link" href="#skills">All skills →</a></div><div class="grid">'+skills.map(function(s){return '<div style="display:grid;gap:6px"><div class="skill__h"><img src="'+photo(s)+'" alt="" style="width:30px;height:30px"><strong>'+esc(s.title)+'</strong><span class="lvl">'+LVL_LABEL[lvlOf(s)]+'</span></div><div class="bar"><i style="width:'+LVL_PCT[lvlOf(s)]+'%"></i></div></div>';}).join('')+'</div></section>'+
 '<div class="stats">'+stat('#journey','portfolio',st.entries,'Entries')+stat('#skills','skills',st.skills,'Skills')+stat('#achievements','achievements',st.ach,'Achievements')+stat('#projects','bulb',st.proj,'Projects')+stat('#goals','goals',st.goals,'Goals')+'</div>';
}

/* ---------- Printable book ---------- */
var BOOK=[['cover','Cover'],['about','About Me'],['skills','My Skills'],['activities','Activities & Experiences'],['achievements','Achievements'],['projects','Projects'],['goals','Goals'],['timeline','Timeline']];
function bookOn(k){S.book=S.book||{};return S.book[k]!==false;}
function vBook(){
 var p=S.profile,pages=[],n=0,name=esc(p.name);
 function page(k,title,icon,body){n++;pages.push('<article class="page" aria-label="Page '+n+': '+title+'"><h2>'+(icon?'<img '+img(icon)+' alt="">':'')+title+'</h2>'+body+'<div class="page__foot"><span>Bright Dreamers Portfolio | '+name+'</span><span>Page '+n+'</span></div></article>');}
 function items(list,meta){return list.slice(0,4).map(function(e){return '<div class="pg-item"><img src="'+photo(e)+'" alt=""><div><strong>'+esc(e.title)+'</strong><small class="muted">'+meta(e)+'</small><p>'+esc((e.description||e.why||'').slice(0,140))+'</p></div></div>';}).join('')||'<p class="muted">Nothing added yet.</p>';}
 if(bookOn('cover')){n++;pages.push('<article class="page page--cover" aria-label="Page 1: Cover"><img class="logo" '+img('logo')+' alt="Bright Dreamers"><h1>My Bright Future <span>Portfolio</span></h1><img class="face" src="'+coverImg()+'" alt=""><span class="name">'+name+'</span><strong>Age '+esc(p.age)+'</strong><q style="font-style:italic;color:var(--muted)">'+esc(p.quote)+'</q></article>');}
 if(bookOn('about'))page('about','About Me','profile','<div class="pg-item"><img src="'+coverImg()+'" alt="" style="width:34%"><div><p><b>Name:</b> '+name+'<br><b>Age:</b> '+esc(p.age)+'<br><b>Location:</b> '+esc(p.location)+'<br><b>My Interests:</b> '+esc(p.interests)+'</p></div></div><h3 style="font-size:1.3em">A Little Bit About Me</h3><p>'+esc(p.about)+'</p><div style="background:var(--pink-soft);border-radius:.8em;padding:1em"><strong style="color:var(--pink)">♥ My Dream</strong><p style="margin:.3em 0 0">“'+esc(p.dream)+'”</p></div>');
 if(bookOn('skills'))page('skills','My Skills','skills','<div class="pg-skills">'+byType('skill').slice(0,9).map(function(s){return '<div><img src="'+photo(s)+'" alt=""><strong>'+esc(s.title)+'</strong><small>'+esc(s.description||'')+'</small></div>';}).join('')+'</div>');
 if(bookOn('activities'))page('activities','My Activities & Experiences','activities',items(byDate(byType('activity')),function(e){return (e.org?esc(e.org)+' · ':'')+dRange(e,true);}));
 if(bookOn('achievements'))page('achievements','My Achievements','achievements',items(byDate(byType(['achievement','certificate'])),function(e){return fdate(e.date,true)+(e.source?' · '+esc(srcLabel(e)):'');}));
 if(bookOn('projects'))page('projects','My Projects','bulb',items(byDate(byType('project')),function(e){return dRange(e,true)+' · '+(e.status==='done'?'Completed':'In Progress');}));
 if(bookOn('goals'))page('goals','My Goals','goals',items(byType('goal'),function(e){return {want:'Want to Try',working:'Working On It',achieved:'Achieved'}[e.status]+(e.target?' · '+fdate(e.target,true):'');}));
 if(bookOn('timeline'))page('timeline','My Portfolio Timeline','journey','<div class="pg-tl">'+byDate(S.entries.filter(function(e){return e.type!=='skill'&&e.type!=='goal';})).slice(0,8).map(function(e){return '<div><small>'+fdate(e.date,true)+'</small><strong>'+esc(e.title)+'</strong><br><span class="muted">'+TYPES[e.type].short+'</span></div>';}).join('')+'</div>');
 return head('print','Print / PDF','Choose what goes into the printable portfolio book.','')+
 '<section class="card book-opts" aria-label="Book options"><strong>Include:</strong>'+BOOK.map(function(b){return '<label class="sw"><input type="checkbox" data-act="booksec" data-k="'+b[0]+'"'+(bookOn(b[0])?' checked':'')+'><span>'+b[1]+'</span></label>';}).join('')+
 '<label class="field" style="grid-auto-flow:column;align-items:center;gap:8px"><span>Paper</span><select class="input" id="paper" style="width:auto"><option value="a4"'+(bookPaper==='a4'?' selected':'')+'>A4</option><option value="letter"'+(bookPaper==='letter'?' selected':'')+'>US Letter</option></select></label></section>'+
 '<div class="print-bar"><button class="btn" data-act="print">'+I.doc+'Print / Save as PDF</button><p class="note" style="margin:0;flex:1;min-width:min(260px,100%)">To download the book, choose \u201cSave as PDF\u201d in the print window. Turn on \u201cBackground graphics\u201d for full color.</p></div>'+
 '<div class="book'+(bookPaper==='letter'?' letter':'')+'">'+(pages.join('')||'<p class="muted">Pick at least one section.</p>')+'</div>';
}

/* ---------- Email ---------- */
function emailText(){var hl=byDate(S.entries.filter(function(e){return e.type!=='skill';})).slice(0,4).map(function(e){return '• '+e.title+' ('+fdate(e.date,true)+')';});return 'Hi!\n\nHere is a look at some of the experiences, achievements, projects, and goals in '+first()+'\u2019s Bright Future Portfolio.\n\n'+(hl.length?'Recent highlights:\n'+hl.join('\n')+'\n\n':'')+'Shared from Bright Dreamers';}
var I_LOCK='<svg class="share-notice__icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.2" fill="currentColor"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="15.4" r="1.5" fill="#fff6e0"/></svg>';
var I_MAIL='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>';
function shareTable(){var L=(S.shares||[]).map(function(s,i){return{s:s,i:i};}).reverse();
 var h='<div class="share-table" role="table" aria-label="Share history"><div class="share-table__row share-table__head" role="row"><span role="columnheader">Date</span><span role="columnheader">Recipient(s)</span><span role="columnheader">Subject</span><span role="columnheader">Status</span><span role="columnheader">Action</span></div>';
 if(!L.length)return h+'<div class="share-table__empty" role="row"><span role="cell">'+I_MAIL+'No shared messages yet.</span></div></div>';
 return h+L.map(function(o){var s=o.s,sent=s.how==='sent';return '<div class="share-table__row" role="row"><span role="cell" data-l="Date">'+esc(s.when||'')+'</span><span role="cell" data-l="Recipient(s)" class="share-table__to">'+esc(s.to||'')+'</span><span role="cell" data-l="Subject">'+esc(s.subject||'')+'</span><span role="cell" data-l="Status"><span class="share-status share-status--'+(sent?'sent':'copied')+'">'+(sent?'Sent':'Copied')+'</span></span><span role="cell" data-l="Action"><button type="button" class="btn btn--ghost btn--sm" data-act="em-reuse" data-i="'+o.i+'" aria-label="Use these recipients and subject again">Use again</button></span></div>';}).join('')+'</div>';}
function vEmail(){
 if(BD.actingFor)return head('email','Email Share','Parents share their child\u2019s portfolio from their own account.','')+'<section class="card panel"><p class="muted" style="margin:0">Email sharing is turned off while you view '+esc(BD.actingFor.name)+'\u2019s portfolio as an admin.</p></section>';
 var d=S.emailDraft||{to:'',subject:first()+'’s Bright Future Portfolio',body:emailText()};
 if(!canShare())return head('email','Email Share','Send a copy of your child\u2019s portfolio to people you trust.','')+'<section class="card panel"><p class="muted" style="margin:0">Email sharing is turned off for your account. To send a copy of '+esc(first())+'\u2019s portfolio by email, turn on \u201cAllow me to share portfolio copies by email\u201d in Account Settings.</p><div><a class="btn btn--line btn--sm" href="#account">Open Account Settings</a></div></section>';
 return head('email','Email Share','Send a copy of your child\u2019s portfolio to people you trust.','')+
 '<form class="card form" id="emailForm" novalidate><div class="fgrid">'+
 '<label class="field field--full"><span>To <small>(separate addresses with commas)</small></span><input class="input" id="em-to" value="'+esc(d.to)+'"><span class="err" id="e-to" hidden>Enter at least one valid email address.</span></label>'+
 '<label class="field field--full"><span>Subject</span><input class="input" id="em-subject" value="'+esc(d.subject)+'"></label>'+
 '<label class="field field--full"><span>Message</span><textarea class="input" id="em-body" rows="10">'+esc(d.body)+'</textarea></label></div>'+
 '<p class="share-notice" id="shareNotice">'+I_LOCK+'<span><strong>Your child\u2019s portfolio is private by default.</strong> Sharing sends information from the portfolio outside the private Parent Portal.</span></p>'+
 (BD.canEmail?'<div class="consent share-confirm"><label class="sw" for="em-confirm"><input type="checkbox" id="em-confirm" aria-required="true" aria-describedby="shareNotice emConfirmErr"><span>I understand that this will share information from my child\u2019s private portfolio with the recipient(s) I enter, and I am authorized to share this information.</span></label><span class="err consent__note" id="emConfirmErr" role="alert" hidden>Please confirm this statement before sending.</span></div>':'<p class="muted" style="margin:0">Copy the message into your own email app.</p>')+
 '<div class="form__foot"><button type="button" class="btn btn--ghost" data-act="em-reset">Reset message</button>'+(BD.canEmail?'<button type="button" class="btn btn--line" data-act="em-copy">Copy Email</button><button type="submit" class="btn" id="emSend" disabled>Send Email</button>':'<button type="submit" class="btn">Copy Email</button>')+'</div></form>'+
 '<section class="card panel"><div><h3>Share history</h3><p class="muted" style="margin:4px 0 0">Messages you copy or send are listed here.</p></div>'+shareTable()+'</section>';
}

/* ---------- Account ---------- */
function linkUrl(k){var L=BD.footerLinks||[];for(var i=0;i<L.length;i++)if(L[i].key===k)return L[i].url;return k==='privacy'?(BD.privacyUrl||''):'';}
function footHtml(){var L=BD.footerLinks||[];if(!L.length)return '';return '<nav class="pfoot__links" aria-label="Bright Dreamers policies">'+L.map(function(l){return '<a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.label)+'</a>';}).join('<span class="pfoot__sep" aria-hidden="true">|</span>')+'</nav><span class="pfoot__copy">© '+new Date().getFullYear()+' Bright Dreamers. All rights reserved.</span>';}
var ICO={
 user:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
 shield:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z"/><path d="M12 15.5s-3.2-1.9-3.2-4.1a1.8 1.8 0 0 1 3.2-1.1 1.8 1.8 0 0 1 3.2 1.1c0 2.2-3.2 4.1-3.2 4.1z"/></svg>',
 lock:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="16" r="1.2"/></svg>',
 plane:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.5 2.5 10.6 13.4"/><path d="M21.5 2.5 14.6 21l-4-7.6-7.6-4z"/></svg>',
 image:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>',
 download:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
 trash:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
 people:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5"/></svg>',
 info:'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 11v6M12 7.5v.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
 ext:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
 chev:'<svg class="pd-opt__chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>'
};
function cardHead(icon,title,sub,id){return '<div class="card-head"><span class="card-head__icon">'+icon+'</span><div><h3'+(id?' id="'+id+'"':'')+'>'+title+'</h3><p class="muted">'+sub+'</p></div></div>';}
function toggleRow(id,icon,title,desc,on,locked,cls){return '<label class="pd-row'+(locked?' pd-row--locked':'')+'" for="'+id+'"><span class="pd-row__icon '+cls+'">'+icon+'</span><span class="pd-row__text"><strong>'+title+'</strong><small id="'+id+'-d">'+desc+'</small></span><input type="checkbox" role="switch" class="switch" id="'+id+'"'+(on?' checked':'')+(locked?' disabled':'')+' aria-describedby="'+id+'-d'+(id==='ac-private'?' privacyNote':'')+'"></label>';}
function optRow(tag,attrs,icon,title,desc,cls){return '<'+tag+' class="pd-opt'+(cls==='pink'?' pd-opt--danger':'')+'" '+attrs+'><span class="pd-row__icon '+cls+'">'+icon+'</span><span class="pd-row__text"><strong>'+title+'</strong><small>'+desc+'</small></span>'+ICO.chev+'</'+tag+'>';}
function accountCard(a){
 return '<form class="card form acc-card" id="accForm" novalidate>'+cardHead(ICO.user,'Account Information','Your details for your account.','accTitle')+
 '<div class="fgrid"><label class="field"><span>Parent name</span><input class="input" id="ac-name" autocomplete="name" value="'+esc(a.name)+'"></label><label class="field"><span>Email</span><input class="input" id="ac-email" type="email" autocomplete="email" value="'+esc(a.email)+'" data-orig="'+esc(a.email)+'"></label></div>'+
 '<div class="pw-area"><div class="pw-area__top"><span class="pw-area__label">Password</span><button type="button" class="btn btn--line btn--sm" id="pwOpen" data-act="pw-open" aria-expanded="false" aria-controls="pwFields">Change password</button></div>'+
 '<div class="fgrid" id="pwFields" hidden><label class="field"><span>New password <small>(at least 6 characters)</small></span><input class="input" id="ac-pw" type="password" autocomplete="new-password"></label><label class="field"><span>Confirm new password</span><input class="input" id="ac-pw2" type="password" autocomplete="new-password"></label><div class="field--full"><button type="button" class="link" data-act="pw-close">Cancel password change</button></div></div>'+
 '<label class="field" id="acCurWrap" hidden><span>Current password <small>(needed to change your password or email)</small></span><input class="input" id="ac-cur" type="password" autocomplete="current-password" aria-describedby="acCurErr"><span class="err" id="acCurErr" role="alert" hidden></span></label></div>'+
 consentBlock()+
 '<div class="form__foot"><button class="btn" type="submit">Save Settings</button></div></form>';
}
function privacyDataCard(a){var pp=linkUrl('privacy');
 return '<section class="card pd" id="privacyData" aria-labelledby="pdTitle"><div class="pd__head"><span class="card-head__icon pd__icon">'+ICO.shield+'</span><div><h3 id="pdTitle">Privacy &amp; Data</h3><p id="privacyNote">Your child’s portfolio is private by default. Sharing only happens when you choose to use a sharing feature.</p></div></div>'+
 '<div class="pd__grid"><div class="pd__col"><h4>Privacy Settings</h4><p class="muted">These settings help you control how your child’s portfolio is used and shared.</p>'+
 toggleRow('ac-private',ICO.lock,'My child’s portfolio is private by default','Always on. Only you can view your child’s portfolio unless you choose to use a sharing feature.',true,true,'blue')+
 toggleRow('ac-share',ICO.plane,'Allow me to share portfolio copies by email','Turns on Email Share so you can send a copy to people you trust. No public link is ever created.',a.share!==false,false,'blue')+
 toggleRow('ac-cover',ICO.image,'Show my child’s photo on the private portfolio cover','When off, a neutral placeholder is shown. The original photo stays private either way.',a.coverPhoto!==false,false,'purple')+'</div>'+
 '<div class="pd__col"><h4>Data Options</h4><p class="muted">Manage and access your data.</p>'+
 (BD.exportUrl?optRow('a','href="'+esc(BD.exportUrl)+'" download',ICO.download,'Download My Data','Get a copy of your child’s portfolio data and files.','blue'):'')+
 optRow('button','type="button" data-act="reset" data-v="clear" aria-haspopup="dialog"',ICO.trash,'Delete My Child’s Portfolio','Permanently delete your child’s portfolio data and associated private files.','pink')+
 optRow('a','href="#email"',ICO.people,'Manage Sharing Preferences','View and manage how you have shared your child’s portfolio.','purple')+
 '</div></div>'+
 '<div class="pd__notice"><span class="pd__info">'+ICO.info+'</span><p>Private portfolio uploads are used only for the child’s private portfolio. Uploading a photo or file does not give Bright Dreamers permission to publicly use or publish that content.</p>'+(pp?'<a class="btn btn--line btn--sm pd__pp" href="'+esc(pp)+'" target="_blank" rel="noopener">Privacy Policy '+ICO.ext+'</a>':'')+'</div></section>';}
function deleteDialog(){
 return '<div class="modal" id="delModal"><div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="delTitle" aria-describedby="delDesc"><h3 id="delTitle">Delete My Child’s Portfolio</h3>'+
 '<p id="delDesc">This permanently deletes your child’s portfolio: the profile, every entry, goal, project, achievement and skill, the share history and the private photos. This cannot be undone. Your parent account stays open.</p>'+
 '<div class="consent del-confirm"><label class="sw" for="del-confirm"><input type="checkbox" id="del-confirm" aria-required="true" aria-describedby="delConfirmErr"><span>I understand this will permanently delete this child’s portfolio data and associated private files, subject to any legally required retention.</span></label><span class="err consent__note" id="delConfirmErr" role="alert" hidden>Please confirm this statement before deleting.</span></div>'+
 '<label class="field"><span>Enter your current password</span><input class="input" id="del-pw" type="password" autocomplete="current-password" aria-describedby="delPwErr"><span class="err" id="delPwErr" role="alert" hidden></span></label>'+
 '<div class="form__foot"><button type="button" class="btn btn--ghost" data-act="reset-no">Cancel</button><button type="button" class="btn btn--danger-solid" data-act="reset-yes" id="delYes" disabled>Delete Portfolio Data</button></div></div></div>';}
function updCur(){var e=document.getElementById('ac-email'),f=document.getElementById('pwFields'),w=document.getElementById('acCurWrap');if(!w)return;var need=(f&&!f.hidden)||(e&&e.value.trim().toLowerCase()!==String(e.getAttribute('data-orig')||'').trim().toLowerCase());w.hidden=!need;}
function updDel(){var c=document.getElementById('del-confirm'),p=document.getElementById('del-pw'),b=document.getElementById('delYes');if(b)b.disabled=!(c&&c.checked&&p&&p.value);}
function fieldErr(id,msg){var e=document.getElementById(id);if(!e)return;e.textContent=msg||'';e.hidden=!msg;}
function vAccount(){
 if(BD.actingFor)return head('settings','Account Settings','This account belongs to '+esc(BD.actingFor.name)+'.','')+'<section class="card panel"><p class="muted" style="margin:0">You are viewing this portfolio as an admin. Parents change their own name, email, password and privacy choices. You can also edit the account in WordPress under Users.</p>'+(BD.adminUrl?'<div><a class="btn btn--line btn--sm" href="'+esc(BD.adminUrl)+'">Open parent accounts</a></div>':'')+'</section>';
 var a=S.parent;
 return head('settings','Account Settings','Manage your account, privacy settings, and data.','')+accountCard(a)+privacyDataCard(a)+(S.confirmReset==='clear'?deleteDialog():'')+
 (memoryOnly?'<p class="note">This browser is blocking storage, so changes will be lost when the page closes.</p>':'');
}

/* ---------- Login / logout ---------- */
var authMode='login';
var LOGOUT_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h11"/></svg>';
function loggedIn(){return !!BD.loggedIn;}
function pwField(id,label,ac){return '<div class="field"><span>'+label+'</span><div class="pw"><input class="input" id="'+id+'" type="password" autocomplete="'+ac+'"><button type="button" class="pw__eye" data-act="pw-toggle" data-for="'+id+'" aria-label="Show password">Show</button></div></div>';}
function vAuth(){
 if(!BD.canRegister)authMode='login';var L=authMode==='login';
 return '<div class="auth__card"><div class="auth__brand"><img '+img('logo')+' alt="Bright Dreamers" class="auth__logo" width="440" height="251"><h1>'+(L?'Welcome back!':'Join Bright Dreamers')+'</h1><p>'+(L?'Log in to see your child’s portfolio, projects and goals.':'Create a parent account to start your child’s portfolio.')+'</p><img '+img('quote')+' alt="Big ideas, brighter futures!" class="auth__quote" width="239" height="303"></div>'+
 '<div class="auth__form"><div class="tabs auth__tabs" role="group" aria-label="Account"><button class="tab" data-act="auth-mode" data-v="login" aria-pressed="'+L+'">Log In</button>'+(BD.canRegister?'<button class="tab" data-act="auth-mode" data-v="signup" aria-pressed="'+(!L)+'">Create Account</button>':'')+'</div>'+
 '<p class="auth__err" id="authErr" role="alert" hidden></p>'+
 (L?'<form id="loginForm" class="auth__fields" novalidate>'+
   '<label class="field"><span>Email</span><input class="input" id="li-email" type="email" autocomplete="username" value="'+esc(window.__lastEmail||'')+'" placeholder="you@example.com"></label>'+
   pwField('li-pw','Password','current-password')+
   '<label class="sw"><input type="checkbox" id="li-remember" checked><span>Keep me logged in</span></label>'+
   '<button class="btn" type="submit">Log In</button>'+
   (BD.lostUrl?'<a class="link" href="'+esc(BD.lostUrl)+'" style="justify-self:center">Forgot your password?</a>':'')+
  '</form>'
 :'<form id="signupForm" class="auth__fields" novalidate>'+
   '<label class="field"><span>Your name</span><input class="input" id="su-name" autocomplete="name" placeholder="e.g. Sarah Thompson"></label>'+
   '<label class="field"><span>Child’s preferred name / nickname</span><input class="input" id="su-child" placeholder="e.g. Maya" aria-describedby="suChildHelp"><small class="field__help" id="suChildHelp">A last name is not required.</small></label>'+
   '<label class="field"><span>Email</span><input class="input" id="su-email" type="email" autocomplete="email" placeholder="you@example.com"></label>'+
   pwField('su-pw','Password <small>(at least 6 characters)</small>','new-password')+
   '<p class="muted" style="margin:0;font-size:.85rem">Your child\u2019s portfolio is private to your account.</p>'+
   consentAsk('su')+
   '<button class="btn" type="submit">Create Account</button>'+
  '</form>')+
 '</div><footer class="pfoot pfoot--auth">'+footHtml()+'</footer></div>';
}
function authError(m){var e=document.getElementById('authErr');e.textContent=m;e.hidden=!m;}
function showAuth(){document.getElementById('app').hidden=true;var a=document.getElementById('auth');a.hidden=false;a.innerHTML=vAuth();closePops();window.scrollTo(0,0);}
document.addEventListener('submit',function(ev){
 var f=ev.target,EM=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if(f.id==='loginForm'){ev.preventDefault();
  var em=document.getElementById('li-email').value.trim(),pw=document.getElementById('li-pw').value;
  if(!em||!pw)return authError('Enter your email and password.');
  authBusy(f,true);
  api('login',{email:em,password:pw,remember:document.getElementById('li-remember').checked,nonce:BD.authNonce},true).then(function(){location.reload();},function(e){authBusy(f,false);authError(e.message);});
 }
 if(f.id==='signupForm'){ev.preventDefault();
  var nm=document.getElementById('su-name').value.trim(),ch=document.getElementById('su-child').value.trim(),em2=document.getElementById('su-email').value.trim(),pw2=document.getElementById('su-pw').value;
  if(!nm||!ch||!em2||!pw2)return authError('Please fill in every field.');
  if(!EM.test(em2))return authError('Enter a valid email address.');
  if(pw2.length<6)return authError('Password must be at least 6 characters.');
  var suc=document.getElementById('su-consent');if(!suc||!suc.checked){authError('');consentAskError('su',true);return;}consentAskError('su',false);
  authBusy(f,true);
  api('register',{name:nm,child:ch,email:em2,password:pw2,consent_guardian:1,nonce:BD.authNonce},true).then(function(){if(location.hash==='#profile')location.reload();else{location.hash='profile';location.reload();}},function(e){authBusy(f,false);authError(e.message);});
 }
});
function authBusy(f,on){var b=f.querySelector('button[type=submit]');if(!b)return;if(on){b.dataset.label=b.textContent;b.textContent='Please wait…';}else if(b.dataset.label){b.textContent=b.dataset.label;}b.disabled=on;}

/* ---------- Events ---------- */
document.addEventListener('click',function(ev){
 var t=ev.target.closest('[data-act]');
 if(!ev.target.closest('#bellPop,#bellBtn'))document.getElementById('bellPop').hidden=true,document.getElementById('bellBtn').setAttribute('aria-expanded','false');
 if(!ev.target.closest('#userPop,#userBtn'))document.getElementById('userPop').hidden=true,document.getElementById('userBtn').setAttribute('aria-expanded','false');
 if(ev.target.closest('.pop a'))closePops();
 if(achMenu&&!t&&!ev.target.closest('.amenu')){achMenu=null;updateAchGrid();} if(!t)return;
 var a=t.getAttribute('data-act'),id=t.getAttribute('data-id');
 if(achMenu&&a!=='achmenu'&&!t.closest('.amenu__pop')){achMenu=null;updateAchGrid();}
 switch(a){
  case 'achfilter':filters.ach=t.getAttribute('data-v');achMenu=null;render();break;
  case 'achmenu':achMenu=achMenu===id?null:id;updateAchGrid();var mb=document.querySelector('.amenu__pop button');if(mb)mb.focus();break;
  case 'achdel':achMenu=null;CUR=id;confirmDel=true;go('entry');break;
  case 'achgal':CUR=id;galleryIdx=+t.getAttribute('data-i');go('entry');break;
  case 'goal2ach':var gg=get(CUR);if(gg&&!(gg.achId&&get(gg.achId))){goalToAch(gg,today());save();render();toast('Added to Achievements');}break;
  case 'goalskip':var gs=get(CUR);if(gs){gs.achSkip=true;save();render();}break;
  case 'goalex':var ft=document.getElementById('f-title');if(!ft){EDIT=null;DRAFT=null;window.__newType='goal';window.__newTitle=t.getAttribute('data-s');go('add');break;}if(ft){ft.value=t.getAttribute('data-s');if(DRAFT)DRAFT.title=ft.value;ft.focus();ft.classList.remove('is-bad');var et=document.getElementById('e-title');if(et)et.hidden=true;}break;
  case 'skfilter':filters.sk=t.getAttribute('data-v');achMenu=null;render();break;
  case 'gclear':filters.goals='all';gQ='';gType='all';render();break;
  case 'goal2achc':var gc=get(id);achMenu=null;if(gc&&!(gc.achId&&get(gc.achId))){goalToAch(gc,today());save();updateAchGrid();toast('\u201c'+gc.title+'\u201d added to Achievements');}break;
  case 'skclear':filters.sk='all';skQ='';skType='all';render();break;
  case 'achclear':filters.ach='all';achQ='';achSrc='all';render();break;
  case 'open':CUR=id;closePops();go('entry');break;
  case 'edit':EDIT=id;DRAFT=null;if(location.hash==='#add')route();else location.hash='add';break;
  case 'new':EDIT=null;DRAFT=null;window.__newType=t.getAttribute('data-type');if(location.hash==='#add')route();else location.hash='add';break;
  case 'filter':filters[t.getAttribute('data-k')]=t.getAttribute('data-v');render();break;
  case 'type':readForm();var nt=t.getAttribute('data-type');if(isAchType(nt))DRAFT.kind=nt==='certificate'?'certificate':(isAchType(DRAFT.type)&&DRAFT.kind&&DRAFT.kind!=='certificate'?DRAFT.kind:'achievement');if(!EDIT){if(nt==='skill'&&DRAFT.date===today())DRAFT.date='';else if(nt!=='skill'&&!DRAFT.date)DRAFT.date=today();}DRAFT.type=nt;DRAFT.status='';rerenderAdd();break;
  case 'tag':addTag(t.getAttribute('data-s'));break;
  case 'untag':readForm();DRAFT.skills.splice(+t.getAttribute('data-i'),1);rerenderAdd();break;
  case 'unphoto':readForm();DRAFT.photos.splice(+t.getAttribute('data-i'),1);rerenderAdd();break;
  case 'cancel':history.length>1?history.back():go('dashboard');break;
  case 'back':history.length>1?history.back():go('dashboard');break;
  case 'gal':galleryIdx=+t.getAttribute('data-i');render();break;
  case 'setstatus':var e=get(CUR);e.status=t.getAttribute('data-v');if(e.status==='achieved')delete e.achSkip;save();render();toast('Status updated');break;
  case 'del':confirmDel=true;render();break;
  case 'del-no':confirmDel=false;render();break;
  case 'del-yes':var ttl=get(CUR).title;S.entries=S.entries.filter(function(x){return x.id!==CUR;});save();confirmDel=false;toast('“'+ttl+'” deleted');go('dashboard');break;
  case 'booksec':break;
  case 'em-copy':var ev2=emailVals();if(ev2)doCopyEmail(ev2);break;
  case 'print':printBook();break;
  case 'pf-adjust':adjustProfilePhoto();break;
  case 'em-reuse':var sh=(S.shares||[])[+t.getAttribute('data-i')];if(sh){var dd=S.emailDraft||{to:'',subject:'',body:emailText()};S.emailDraft={to:sh.to||'',subject:sh.subject||'',body:dd.body||emailText()};render();var tt=document.getElementById('em-to');if(tt){tt.focus();tt.scrollIntoView({block:'center'});}toast('Recipients and subject added. Review the message, then send or copy.');}break;
  case 'em-reset':S.emailDraft=null;save();render();break;
  case 'pw-open':var pf=document.getElementById('pwFields');if(pf){pf.hidden=false;t.hidden=true;t.setAttribute('aria-expanded','true');updCur();document.getElementById('ac-cur').focus();}break;
  case 'pw-close':var pf2=document.getElementById('pwFields'),po=document.getElementById('pwOpen');if(pf2){pf2.hidden=true;document.getElementById('ac-pw').value='';document.getElementById('ac-pw2').value='';}if(po){po.hidden=false;po.setAttribute('aria-expanded','false');po.focus();}updCur();break;
  case 'reset':S.confirmReset=t.getAttribute('data-v');render();break;
  case 'logout':closeNav();toast('Logging out\u2026');clearTimeout(saveT);(saveT===null&&!saving?Promise.resolve():api('state',statePayload()).catch(function(){})).then(function(){return api('logout',{});}).then(function(){location.hash='';location.reload();},function(){location.reload();});break;
  case 'auth-mode':authMode=t.getAttribute('data-v');showAuth();break;
  case 'auth-demo':document.getElementById('li-email').value='sarah@example.com';document.getElementById('li-pw').value='demo1234';break;
  case 'pw-toggle':var pi=document.getElementById(t.getAttribute('data-for')),sh=pi.type==='password';pi.type=sh?'text':'password';t.textContent=sh?'Hide':'Show';t.setAttribute('aria-label',sh?'Hide password':'Show password');break;
  case 'reset-no':S.confirmReset=null;render();break;
  case 'reset-yes':var mode=S.confirmReset;
   if(mode==='clear'){var dc=document.getElementById('del-confirm'),dp=document.getElementById('del-pw');if(!dc||!dc.checked){delConfirmError(true);break;}delConfirmError(false);if(!dp||!dp.value){fieldErr('delPwErr','Enter your current password to delete the portfolio.');if(dp)dp.focus();break;}fieldErr('delPwErr','');t.disabled=true;
    clearTimeout(saveT);saveT=null;var cp={confirm_delete:1,current_password:dp.value};if(BD.actingFor)cp.parent=BD.actingFor.id;
    api('clear',cp).then(function(j){if(j&&j.state&&Array.isArray(j.state.entries))S=j.state;else{var keep={profile:S.profile,parent:S.parent};S=seed();S.entries=[];S.demo=false;S.profile={name:'',age:'',location:'',interests:'',about:'',dream:'',quote:'',photo:'k:profile'};S.parent=keep.parent;}syncUser();S.confirmReset=null;toast('Portfolio data deleted');go('dashboard');},function(e){var m=e.message||'';if(/current password|Too many/i.test(m)){fieldErr('delPwErr',m);var p2=document.getElementById('del-pw');if(p2){p2.value='';p2.focus();}}else if(/confirm this statement/i.test(m))delConfirmError(true);else toast(m);updDel();});
    break;}
   break;
 }
});
document.addEventListener('input',function(ev){var t=ev.target;if(t.id==='ac-email')updCur();if(t.id==='del-pw'){fieldErr('delPwErr','');updDel();}if(t.id==='ac-cur')fieldErr('acCurErr','');});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&S&&S.confirmReset==='clear'&&VIEW==='account'){S.confirmReset=null;render();var b=document.querySelector('[data-act=reset][data-v=clear]');if(b)b.focus();}});
document.addEventListener('change',function(ev){
 var t=ev.target;
 if(t.id==='su-consent'||t.id==='pf-consent'){if(t.checked)consentAskError(t.id.slice(0,2),false);}
 if(t.id==='del-confirm'){if(t.checked)delConfirmError(false);updDel();}
 if(t.id==='ac-share'||t.id==='ac-cover'){var pk=t.id==='ac-share'?'allow_email_share':'show_photo_on_cover',pb={};pb[pk]=t.checked?1:0;t.disabled=true;api('privacy',pb).then(function(j){BD.allowEmailShare=!!j.allow_email_share;BD.showCoverPhoto=!!j.show_photo_on_cover;S.parent.share=BD.allowEmailShare;S.parent.coverPhoto=BD.showCoverPhoto;t.disabled=false;renderNav(VIEW);renderTop();toast('Saved');},function(e){t.checked=!t.checked;t.disabled=false;toast(e.message);});}
 if(t.id==='em-confirm'){if(t.checked)confirmError(false);updateSendState();}
 if(t.id==='ac-consent'&&t.checked)consentError(false);
 if(t.id==='achSrc'){achSrc=t.value;updateAchGrid();}
 if(t.id==='skType'){skType=t.value;updateAchGrid();}
 if(t.id==='gType'){gType=t.value;updateAchGrid();}
 if(t.getAttribute('data-act')==='booksec'){S.book=S.book||{};S.book[t.getAttribute('data-k')]=t.checked;save();render();}
 if(t.id==='paper'){bookPaper=t.value;render();}
 if(t.id==='pf-photo'&&t.files[0]){var pfile=t.files[0];t.value='';if(!/^image\//.test(pfile.type)){toast('Choose a JPG or PNG photo.');return;}
  fileToImage(pfile,function(im){openCrop(im,null,function(out,params){
   var orig;try{orig=toBitmap(im,0,1600).toDataURL('image/jpeg',.86);}catch(e){orig=null;}
   toast('Uploading photo\u2026');Promise.all([upload(out),orig?upload(orig):null]).then(function(r){if(!r[0])return;setProfilePhoto(r[0],r[1]||null,params);});
  });});}
});
document.addEventListener('submit',function(ev){
 var f=ev.target;
 if(f.id==='profileForm'){ev.preventDefault();var pfSave=function(){['name','age','location','interests','about','dream','quote'].forEach(function(k){S.profile[k]=document.getElementById('pf-'+k).value.trim();});if(!S.profile.name)S.profile.name='My child';S.demo=false;save();toast('Profile saved');render();};
  if(!BD.consent&&!BD.actingFor){var pfc=document.getElementById('pf-consent');if(!pfc||!pfc.checked){consentAskError('pf',true);return;}consentAskError('pf',false);api('consent',{consent_guardian:1}).then(function(j){if(j&&j.consent)BD.consent=j.consent;pfSave();},function(e){toast(e.message);});return;}
  pfSave();}
 if(f.id==='accForm'){ev.preventDefault();var an=document.getElementById('ac-name').value.trim(),aeEl=document.getElementById('ac-email'),ae=aeEl.value.trim(),pwf=document.getElementById('pwFields'),pwOn=pwf&&!pwf.hidden,np=pwOn?document.getElementById('ac-pw').value:'',np2=pwOn?document.getElementById('ac-pw2').value:'',cur=document.getElementById('ac-cur').value,emChanged=ae.toLowerCase()!==String(aeEl.getAttribute('data-orig')||'').trim().toLowerCase();
  fieldErr('acCurErr','');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ae)){toast('Enter a valid email. You use it to log in.');return;}
  if(pwOn&&!np){toast('Enter a new password, or cancel the password change.');document.getElementById('ac-pw').focus();return;}
  if(np&&np.length<6){toast('Password must be at least 6 characters.');return;}
  if(np&&np!==np2){toast('The new passwords do not match.');document.getElementById('ac-pw2').focus();return;}
  if((np||emChanged)&&!cur){updCur();fieldErr('acCurErr','Enter your current password to change your password or email.');document.getElementById('ac-cur').focus();return;}
  var needConsent=!BD.consent;if(needConsent){var cc=document.getElementById('ac-consent');if(!cc||!cc.checked){consentError(true);return;}consentError(false);}
  S.parent.privateEntries=true;S.portfolio_private=true;
  clearTimeout(saveT);saveT=null;
  var body={name:an,email:ae,password:np,allow_email_share:S.parent.share!==false?1:0,show_photo_on_cover:S.parent.coverPhoto!==false?1:0,consent_guardian:needConsent?1:0,state:packState()};if(np||emChanged){body.current_password=cur;}if(np)body.password_confirm=np2;
  api('account',body).then(function(j){if(j.consent)BD.consent=j.consent;BD.user.name=j.name;BD.user.email=j.email;if(typeof j.allow_email_share==='boolean')BD.allowEmailShare=j.allow_email_share;if(typeof j.show_photo_on_cover==='boolean')BD.showCoverPhoto=j.show_photo_on_cover;syncUser();if(np){toast('Password changed. Other devices have been signed out. Reloading…');setTimeout(function(){location.reload();},1200);}else{toast('Settings saved');render();}},function(e){var m=e.message||'';if(/confirm this statement/i.test(m)){BD.consent=null;consentError(true);}if(/current password|incorrect password/i.test(m)){updCur();fieldErr('acCurErr',m);var ci=document.getElementById('ac-cur');if(ci){ci.value='';ci.focus();}}toast(m);});
 }
 if(f.id==='emailForm'){ev.preventDefault();var v=emailVals();if(!v)return;
  if(!BD.canEmail){doCopyEmail(v);return;}
  var cf=document.getElementById('em-confirm');if(!cf||!cf.checked){confirmError(true);return;}confirmError(false);
  var btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Sending…';
  api('email',{to:v.list,subject:v.subj,body:v.body,confirm_share:1}).then(function(){logShare(v,'sent');toast('Email sent to '+v.list.join(', '));render();},function(e){btn.textContent='Send Email';updateSendState();if(/confirm this statement/i.test(e.message||''))confirmError(true);toast(e.message);});
 }
});
function emailVals(){
 var to=document.getElementById('em-to').value,subj=document.getElementById('em-subject').value,body=document.getElementById('em-body').value;
 var ok=to.split(',').map(function(s){return s.trim();}).filter(Boolean);var valid=ok.length&&ok.length<=5&&ok.every(function(s){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);});
 document.getElementById('e-to').hidden=!!valid;document.getElementById('em-to').classList.toggle('is-bad',!valid);if(!valid)return null;
 if(!canShare()){toast('Turn on \u201cAllow me to share portfolio copies by email\u201d in Account Settings first.');return null;}
 return {to:to,list:ok,subj:subj,body:body};
}
function logShare(v,how){S.emailDraft={to:v.to,subject:v.subj,body:v.body};S.shares=S.shares||[];var d=new Date();S.shares.push({to:v.list.join(', '),subject:v.subj,how:how,when:MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()});save();}
function doCopyEmail(v){logShare(v,'copied');copy('To: '+v.list.join(', ')+'\nSubject: '+v.subj+'\n\n'+v.body,document.getElementById('em-body'),'Email copied. Paste it into your email app.');setTimeout(render,50);}
function copy(text,el,msg){var done=function(){toast(msg);};try{navigator.clipboard.writeText(text).then(done,function(){el.focus();el.select&&el.select();toast('Press Ctrl+C (or Cmd+C) to copy the selected text.');});}catch(err){el.focus();el.select&&el.select();toast('Press Ctrl+C (or Cmd+C) to copy the selected text.');}}
function restore(txt){try{var d=JSON.parse(txt);if(!d||!Array.isArray(d.entries)||!d.profile)throw 0;var kp=S.parent;S=d;S.parent=Object.assign({},d.parent||{},{name:kp.name,email:kp.email});syncUser();S.confirmReset=null;save();toast('Backup restored');go('dashboard');}catch(err){toast('That backup could not be read. Paste the full backup text.');}}

/* ---------- Photo editor: zoom, move, center, rotate ---------- */
var CROP=null,CROP_MAX=4,CROP_OUT=720;
function canAdjustPhoto(){var p=S.profile;return !!(p.photoSrc||(p.photo&&p.photo!=='k:profile'&&p.photo!=='k:cover'));}
function loadImage(url,ok,fail){var im=new Image();try{if(/^https?:/i.test(url)&&new URL(url,location.href).origin!==location.origin)im.crossOrigin='anonymous';}catch(e){}im.onload=function(){ok(im);};im.onerror=fail||function(){};im.src=url;}
function fileToImage(file,ok){var r=new FileReader();r.onload=function(){loadImage(r.result,ok,function(){toast('That file is not a photo we can use. Choose a JPG or PNG photo.');});};r.onerror=function(){toast('Could not read that photo.');};r.readAsDataURL(file);}
/* Copy of the image, made smaller if very large and turned by rot degrees. */
function toBitmap(im,rot,max){var w=im.naturalWidth||im.width,h=im.naturalHeight||im.height,k=Math.min(1,(max||1800)/Math.max(w,h));w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
 var q=rot%180!==0,c=document.createElement('canvas');c.width=q?h:w;c.height=q?w:h;var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.translate(c.width/2,c.height/2);x.rotate(rot*Math.PI/180);x.drawImage(im,-w/2,-h/2,w,h);return c;}
function setProfilePhoto(url,orig,params){var p=S.profile;p.photo=url;if(orig)p.photoSrc=orig;else if(!p.photoSrc)p.photoSrc=url;p.photoCrop=params;S.demo=false;save();
 if(VIEW==='profile'){var y=window.scrollY;render();window.scrollTo(0,y);}else renderTop();toast('Photo updated');}
function adjustProfilePhoto(){var p=S.profile,from=p.photoSrc||p.photo;if(!from)return;
 var init=p.photoSrc&&p.photoCrop?p.photoCrop:null;
 loadImage(src(from),function(im){openCrop(im,init,function(out,params){toast('Saving photo…');upload(out).then(function(u){if(!u)return;if(!p.photoSrc)p.photoSrc=from;setProfilePhoto(u,null,params);});});},
  function(){toast('This photo could not be opened. Use “Change photo” to choose it again.');});}
function cropSource(){var c=CROP;c.src=toBitmap(c.im,c.rot);c.w=c.src.width;c.h=c.src.height;}
function cropBase(){var c=CROP;return Math.max(c.S/c.w,c.S/c.h);}
function cropMin(){var c=CROP;return Math.min(c.S/c.w,c.S/c.h)/cropBase();}
function cropClamp(){var c=CROP;c.z=Math.max(cropMin(),Math.min(CROP_MAX,c.z));var k=cropBase()*c.z,mx=Math.abs(c.w*k/c.S-1)/2,my=Math.abs(c.h*k/c.S-1)/2;c.ox=Math.max(-mx,Math.min(mx,c.ox));c.oy=Math.max(-my,Math.min(my,c.oy));}
function cropPaint(x,P,guide){var c=CROP,k=cropBase()*c.z*(P/c.S),w=c.w*k,h=c.h*k;
 x.setTransform(1,0,0,1,0,0);x.fillStyle='#fff';x.fillRect(0,0,P,P);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
 x.drawImage(c.src,P/2+c.ox*P-w/2,P/2+c.oy*P-h/2,w,h);
 if(!guide)return;
 x.fillStyle='rgba(15,31,92,.45)';x.beginPath();x.rect(0,0,P,P);x.arc(P/2,P/2,P/2-1,0,Math.PI*2,true);x.fill('evenodd');
 var lw=Math.max(2,P/170);x.lineWidth=lw;x.strokeStyle='#fff';x.beginPath();x.arc(P/2,P/2,P/2-lw/2-1,0,Math.PI*2);x.stroke();
 if(c.drag){x.lineWidth=Math.max(1,P/340);x.strokeStyle='rgba(255,255,255,.7)';x.beginPath();[1,2].forEach(function(i){x.moveTo(P*i/3,0);x.lineTo(P*i/3,P);x.moveTo(0,P*i/3);x.lineTo(P,P*i/3);});x.stroke();}}
function z2v(z){var m=cropMin();return m>=CROP_MAX?0:Math.round(1000*Math.log(z/m)/Math.log(CROP_MAX/m));}
function v2z(v){var m=cropMin();return m*Math.pow(CROP_MAX/m,v/1000);}
function cropDraw(){var c=CROP;if(!c||!c.S)return;var cv=c.el.querySelector('#cropCanvas');cropPaint(cv.getContext('2d'),cv.width,true);
 c.el.querySelector('#cropZoom').value=z2v(c.z);c.el.querySelector('#cropPct').textContent=Math.round(c.z*100)+'%';}
function cropZoom(z,px,py){var c=CROP;z=Math.max(cropMin(),Math.min(CROP_MAX,z));px=px||0;py=py||0;var r=z/c.z;c.ox=px-(px-c.ox)*r;c.oy=py-(py-c.oy)*r;c.z=z;cropClamp();cropDraw();}
function cropSize(){var c=CROP;if(!c)return;var st=c.el.querySelector('#cropStage'),cv=c.el.querySelector('#cropCanvas');c.S=st.clientWidth||300;var d=Math.min(3,window.devicePixelRatio||1);cv.width=Math.round(c.S*d);cv.height=cv.width;cropClamp();cropDraw();}
function cropAct(a){var c=CROP;
 if(a==='in')cropZoom(c.z*1.15);else if(a==='out')cropZoom(c.z/1.15);
 else if(a==='center'){c.ox=0;c.oy=0;cropClamp();cropDraw();}
 else if(a==='fit'){c.z=cropMin();c.ox=0;c.oy=0;cropDraw();}
 else if(a==='fill'){c.z=1;c.ox=0;c.oy=0;cropDraw();}
 else if(a==='rotate'){c.rot=(c.rot+90)%360;cropSource();c.z=1;c.ox=0;c.oy=0;cropClamp();cropDraw();}
 else if(a==='reset'){c.rot=0;cropSource();c.z=1;c.ox=0;c.oy=0;cropClamp();cropDraw();}
 else if(a==='cancel')closeCrop();
 else if(a==='save'){var out;try{var cv=document.createElement('canvas');cv.width=cv.height=CROP_OUT;cropPaint(cv.getContext('2d'),CROP_OUT,false);out=cv.toDataURL('image/jpeg',.88);}catch(e){toast('This photo cannot be edited. Use “Change photo” to choose it again.');return;}
  var params={rot:c.rot,z:+c.z.toFixed(4),ox:+c.ox.toFixed(4),oy:+c.oy.toFixed(4)},done=c.onSave;closeCrop();done(out,params);}}
function closeCrop(){var c=CROP;if(!c)return;window.removeEventListener('resize',cropSize);c.el.remove();document.body.classList.remove('crop-open');CROP=null;if(c.back&&c.back.focus&&document.contains(c.back))c.back.focus();}
function openCrop(im,init,onSave){
 if(CROP)closeCrop();
 var tb=function(a,l){return '<button type="button" class="btn btn--ghost btn--sm" data-crop="'+a+'">'+l+'</button>';};
 var el=document.createElement('div');el.className='crop';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','cropTitle');
 el.innerHTML='<div class="crop__box" tabindex="-1"><h2 id="cropTitle">Adjust photo</h2><p class="muted">Drag the photo to move it. Use the slider, the mouse wheel or two fingers to zoom. The circle shows what appears on the dashboard.</p>'+
  '<div class="crop__stage" id="cropStage" tabindex="0" aria-label="Photo position. Arrow keys move the photo, plus and minus zoom, 0 centers it."><canvas id="cropCanvas"></canvas></div>'+
  '<div class="crop__zoom"><button type="button" class="crop__icon" data-crop="out" aria-label="Zoom out">−</button><input type="range" id="cropZoom" min="0" max="1000" step="1" aria-label="Zoom"><button type="button" class="crop__icon" data-crop="in" aria-label="Zoom in">+</button><b id="cropPct" aria-live="polite"></b></div>'+
  '<div class="crop__tools">'+tb('center','Center')+tb('fit','Fit whole photo')+tb('fill','Fill circle')+tb('rotate','Rotate')+tb('reset','Reset')+'</div>'+
  '<div class="form__foot"><button type="button" class="btn btn--ghost" data-crop="cancel">Cancel</button><button type="button" class="btn" data-crop="save">Save Photo</button></div></div>';
 document.body.appendChild(el);document.body.classList.add('crop-open');
 init=init||{};
 CROP={el:el,im:im,rot:[0,90,180,270].indexOf(+init.rot)>-1?+init.rot:0,z:+init.z||1,ox:+init.ox||0,oy:+init.oy||0,S:0,ptrs:{},drag:false,onSave:onSave,back:document.activeElement};
 var c=CROP,st=el.querySelector('#cropStage');
 cropSource();cropSize();
 window.addEventListener('resize',cropSize);
 el.addEventListener('click',function(ev){var b=ev.target.closest('[data-crop]');if(b)cropAct(b.getAttribute('data-crop'));else if(ev.target===el)closeCrop();});
 el.querySelector('#cropZoom').addEventListener('input',function(){cropZoom(v2z(+this.value));});
 var pt=function(e){var r=st.getBoundingClientRect();return [(e.clientX-r.left)/c.S-.5,(e.clientY-r.top)/c.S-.5];};
 st.addEventListener('pointerdown',function(e){e.preventDefault();try{st.setPointerCapture(e.pointerId);}catch(x){}c.ptrs[e.pointerId]={x:e.clientX,y:e.clientY};c.drag=true;st.classList.add('is-drag');cropDraw();});
 st.addEventListener('pointermove',function(e){var p=c.ptrs[e.pointerId];if(!p)return;var ids=Object.keys(c.ptrs);
  if(ids.length===1){c.ox+=(e.clientX-p.x)/c.S;c.oy+=(e.clientY-p.y)/c.S;p.x=e.clientX;p.y=e.clientY;cropClamp();cropDraw();}
  else{var o=c.ptrs[ids[0]===String(e.pointerId)?ids[1]:ids[0]],d1=Math.hypot(p.x-o.x,p.y-o.y);p.x=e.clientX;p.y=e.clientY;var d2=Math.hypot(p.x-o.x,p.y-o.y),m=pt({clientX:(p.x+o.x)/2,clientY:(p.y+o.y)/2});if(d1>0)cropZoom(c.z*d2/d1,m[0],m[1]);}});
 var end=function(e){delete c.ptrs[e.pointerId];if(!Object.keys(c.ptrs).length){c.drag=false;st.classList.remove('is-drag');cropDraw();}};
 st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
 st.addEventListener('wheel',function(e){e.preventDefault();var m=pt(e);cropZoom(c.z*Math.exp(-e.deltaY*(e.deltaMode===1?.05:.0015)),m[0],m[1]);},{passive:false});
 st.addEventListener('keydown',function(e){var s=e.shiftKey?.08:.02,k=e.key;
  if(k==='ArrowLeft')c.ox-=s;else if(k==='ArrowRight')c.ox+=s;else if(k==='ArrowUp')c.oy-=s;else if(k==='ArrowDown')c.oy+=s;
  else if(k==='+'||k==='='){cropAct('in');e.preventDefault();return;}else if(k==='-'||k==='_'){cropAct('out');e.preventDefault();return;}else if(k==='0'){cropAct('center');e.preventDefault();return;}else return;
  e.preventDefault();cropClamp();cropDraw();});
 el.addEventListener('keydown',function(e){if(e.key==='Escape'){e.stopPropagation();closeCrop();return;}
  if(e.key==='Tab'){var f=[].slice.call(el.querySelectorAll('button,input,[tabindex="0"]')).filter(function(x){return !x.disabled;});var i=f.indexOf(document.activeElement);
   if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus();}}});
 el.querySelector('.crop__box').focus({preventScroll:true});
}

/* ---------- Header popovers & mobile nav ---------- */
function closePops(){['bellPop','userPop'].forEach(function(i){document.getElementById(i).hidden=true;});document.getElementById('bellBtn').setAttribute('aria-expanded','false');document.getElementById('userBtn').setAttribute('aria-expanded','false');}
document.getElementById('bellBtn').addEventListener('click',function(){var p=document.getElementById('bellPop'),open=p.hidden;closePops();if(open){renderBell();p.hidden=false;this.setAttribute('aria-expanded','true');}});
document.getElementById('userBtn').addEventListener('click',function(){var p=document.getElementById('userPop'),open=p.hidden;closePops();if(open){renderUser();p.hidden=false;this.setAttribute('aria-expanded','true');}});
function closeNav(){document.getElementById('app').classList.remove('nav-open');document.getElementById('menuBtn').setAttribute('aria-expanded','false');}
document.getElementById('menuBtn').addEventListener('click',function(){var o=document.getElementById('app').classList.toggle('nav-open');this.setAttribute('aria-expanded',o?'true':'false');});
document.getElementById('scrim').addEventListener('click',closeNav);
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'){closePops();closeNav();if(achMenu){var was=achMenu;achMenu=null;updateAchGrid();var bb=document.querySelector('.amenu__btn[data-id="'+was+'"]');if(bb)bb.focus();}}});
document.addEventListener('input',function(ev){if(ev.target.id==='em-to')updateSendState();if(ev.target.id==='achSearch'){achQ=ev.target.value;updateAchGrid();}if(ev.target.id==='skSearch'){skQ=ev.target.value;updateAchGrid();}if(ev.target.id==='gSearch'){gQ=ev.target.value;updateAchGrid();}});
window.addEventListener('hashchange',route);

/* ---------- Boot ---------- */
document.querySelectorAll('img[data-i]').forEach(function(i){i.src=IMGS[i.getAttribute('data-i')];});
load();
if(BD.actingFor){var ab=document.createElement('div');ab.className='actbar';ab.setAttribute('role','status');ab.innerHTML='<span><strong>Admin view.</strong> You are editing '+esc(BD.actingFor.name)+'\u2019s portfolio. Changes save to their account.</span>'+(BD.adminUrl?'<a class="link" href="'+esc(BD.adminUrl)+'">All parents</a>':'');var aw=document.querySelector('.main .wrap');if(aw)aw.insertBefore(ab,aw.firstChild);}
route();
})();
