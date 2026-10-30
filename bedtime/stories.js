globalThis.HUA_STORIES = [{"date":"2026-10-30","title":"Eight Arms and One Small Peep","alt":"A young purple octopus and a small green frog sit together on a cushioned window seat, a glowing snow globe beside them and soft fog outside.","topic":"biology/frog-chorus","setting":"snowy-window","image":"art/2026-10-30.jpg","thumb":"art/2026-10-30-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-29","title":"The Gold Leaf Wanders","alt":"A single golden aspen leaf rests in tall pale prairie grass at dusk under a deep blue sky with the first stars.","topic":"astronomy/moon-tides","setting":"prairie-grassland","image":"art/2026-10-29.jpg","thumb":"art/2026-10-29-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-28","title":"A Song for Every Leaf","alt":"An orange and black monarch butterfly rests on a golden cottonwood leaf beside a quiet park pond at dusk, with a lily pad and a sleepy duck nearby.","topic":"marine/coral-animals","setting":"city-park-pond","image":"art/2026-10-28.jpg","thumb":"art/2026-10-28-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-27","title":"Where the Mountains Hide","alt":"A small pond at dusk with ducks settling on the water, a muskrat swimming, soft fog, and a sidewalk with a glowing porch light nearby.","topic":"earth/mountains-rise","setting":"sidewalk-walk","image":"art/2026-10-27.jpg","thumb":"art/2026-10-27-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-26","title":"Two Small Trades","alt":"A child in yellow boots and a dog share a blanket and lantern under a red rock ledge in soft rain at dusk.","topic":"weather/dew-frost","setting":"red-rocks","image":"art/2026-10-26.jpg","thumb":"art/2026-10-26-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-25","title":"Tick-Tock on the Mountain Road","alt":"A small black-capped chickadee perches on a bare branch above a quiet mountain road at dusk, with a car's glowing lights and a full moon rising.","topic":"astronomy/earth-tilt","setting":"car-ride-home","image":"art/2026-10-25.jpg","thumb":"art/2026-10-25-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-24","title":"The Cushion Hotel","theme":"sibling-game","alt":"Two sisters in pajamas sit by a cushion fort on a living room floor while a magpie rests on the window sill at dusk.","topic":"ornithology/magpie-clever","setting":"living-room","image":"art/2026-10-24.jpg","thumb":"art/2026-10-24-thumb.jpg","painter":"gpt-image-2-high"},{"date":"2026-10-23","title":"The First Snowbird","theme":"bird","alt":"Two sisters and their uncle share a blanket on a porch at dusk while three small gray juncos hop below.","topic":"ornithology/junco-migration","setting":"back-porch","image":"art/2026-10-23.jpg","thumb":"art/2026-10-23-thumb.jpg","painter":"gpt-image-2-high"}];
(function(){
  "use strict";
  var PINS_KEY="hua:bedtime:v1:pins", FS_KEY="hua:bedtime:v1:fontsize", MAXPINS=20;
  var site=(globalThis.HUA_STORIES||[]).slice();
  var library=location.pathname.indexOf("/library")>=0, base=library?"../":"", query="", order="newest", filter="all";
  site.forEach(function(s){if(s.image)s.image=base+s.image;if(s.thumb)s.thumb=base+s.thumb;});
  var root=document.getElementById("app");
  function load(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}}
  function pins(){var p=load(PINS_KEY,{});return p&&typeof p==="object"&&!Array.isArray(p)?p:{};}
  function validStory(s){return s&&typeof s.date==="string"&&typeof s.title==="string"&&Array.isArray(s.paras);}
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;}
  function setSize(v){v=Math.max(1,Math.min(2,v));document.documentElement.style.setProperty("--fs",String(v));save(FS_KEY,v);}
  setSize(load(FS_KEY,1.25));
  function prettyDate(d){var p=d.split("-");var dt=new Date(Number(p[0]),Number(p[1])-1,Number(p[2]));return isNaN(dt)?d:dt.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});}
  function findStory(date){
    for(var i=0;i<site.length;i++)if(site[i].date===date)return site[i];
    var p=pins()[date];return validStory(p)?p:null;
  }
  function card(s,newest,kept){
    var b=el("button","story-card");b.type="button";
    var m=el("span","");m.appendChild(el("span","t",s.title));
    if(newest){m.firstChild.appendChild(el("span","badge","Tonight"));}
    var d=el("span","d",prettyDate(s.date)+(kept?"  ·  kept":""));m.appendChild(d);
    var th=s.imageData||s.thumb;
    if(th&&(s.thumb||s.imageData)){var im=el("img");im.alt="";im.src=s.thumb&&!s.imageData?s.thumb:s.imageData;im.width=72;im.height=72;im.onerror=function(){im.remove();};b.appendChild(im);}
    else b.appendChild(el("span","moon",kept?"📌":"🌙")).style.fontSize="1.6rem";
    b.appendChild(m);
    b.onclick=function(){location.hash="#/"+s.date;};return b;
  }
  function list(){
    root.textContent="";
    var w=el("div","wrap");
    var a=el("a","back","← Hey Uncle Alex");a.href=library?"../../":"../";w.appendChild(a);
    w.appendChild(el("div","moon","🌙"));w.appendChild(el("h1","","Bedtime Stories"));
    if(library)w.querySelector('h1').textContent="Library";
    w.appendChild(el("p","sub",library?"Every bedtime story, ready to read again.":"A new story every day. Up to seven stories here, with your kept stories first."));
    if(library){var home=el("a","back","← Bedtime Stories");home.href="../";w.appendChild(home);}
    var keptMap=pins(), combined=site.slice();
    Object.keys(keptMap).forEach(function(k){if(validStory(keptMap[k])&&!combined.some(function(s){return s.date===k;}))combined.push(keptMap[k]);});
    var ul=el("ul","list"),count=el("p","sub");count.setAttribute("role","status");
    function draw(){ul.textContent="";var rows=combined.slice();
      if(library){rows=rows.filter(function(s){return (s.title+" "+s.date+" "+(s.topic||"")+" "+(s.setting||"")).toLowerCase().includes(query.toLowerCase())&&(filter==="all"||(filter==="pinned"?!!keptMap[s.date]:s.topic===filter));});
        rows.sort(function(a,b){return order==="title"?a.title.localeCompare(b.title)||b.date.localeCompare(a.date):order==="oldest"?a.date.localeCompare(b.date):b.date.localeCompare(a.date);});
      }else{rows.sort(function(a,b){return Number(!!keptMap[b.date])-Number(!!keptMap[a.date])||b.date.localeCompare(a.date);});rows=rows.slice(0,7);}
      rows.forEach(function(s){var li=el("li");li.appendChild(card(s,site[0]&&s.date===site[0].date,!!keptMap[s.date]));ul.appendChild(li);});
      if(!rows.length)ul.appendChild(el("li","empty",library?"No stories match. Try another search or filter.":"No stories yet. Check back tonight."));
      count.textContent=rows.length+" "+(rows.length===1?"story":"stories");
    }
    if(library){var controls=el("div","controls");
      var label=el("label","","Search stories");var input=el("input");input.type="search";input.value=query;input.placeholder="Title, date, topic or setting";input.oninput=function(){query=input.value;draw();};label.appendChild(input);controls.appendChild(label);
      function select(name,options,value,change){var l=el("label","",name),sel=el("select");sel.setAttribute("aria-label",name);options.forEach(function(o){var opt=el("option","",o[1]);opt.value=o[0];sel.appendChild(opt);});sel.value=value;sel.onchange=function(){change(sel.value);draw();};l.appendChild(sel);controls.appendChild(l);}
      select("Sort",[["newest","Newest first"],["oldest","Oldest first"],["title","Title A–Z"]],order,function(v){order=v;});
      var topics=Array.from(new Set(combined.map(function(s){return s.topic;}).filter(Boolean))).sort();
      select("Filter",[["all","All stories"],["pinned","Pinned on this device"]].concat(topics.map(function(t){return [t,t.replace(/[-/]/g," ")];})),filter,function(v){filter=v;});w.appendChild(controls);
    }
    w.appendChild(count);w.appendChild(ul);draw();
    w.appendChild(el("p","fine","Kept stories are saved on this device only. All your kept stories remain in the Library, even when more than seven are kept."));
    if(!library){var note=el("p","fine"),link=el("a","back","Visit the library for old stories");link.href="library/";note.appendChild(link);w.appendChild(note);}
    root.appendChild(w);document.title=(library?"Library":"Bedtime Stories")+" · Hey Uncle Alex";
  }
  function paragraph(segs){
    var p=el("p");
    segs.forEach(function(g){
      if(!Array.isArray(g)||typeof g[0]!=="string")return;
      if(g[1]==="i"){p.appendChild(el("em","",g[0]));}
      else if(g[1]==="p"){p.appendChild(el("span","pause","pause"));}
      else p.appendChild(document.createTextNode(g[0]));
    });
    return p;
  }
  async function story(date){
    var s=findStory(date);
    if(s&&!s.paras){try{var response=await fetch(base+"story-data/"+date+".js");if(!response.ok)throw Error();var body=await response.json();s=Object.assign(s,body); }catch(e){var saved=pins()[date];if(validStory(saved))s=saved;else{root.textContent="";var message=el("div","wrap");message.appendChild(el("p","empty","Story could not load. Please try again."));var retryBack=el("button","back",library?"← Library":"← Bedtime Stories");retryBack.onclick=function(){location.hash="";};message.appendChild(retryBack);root.appendChild(message);return;}}if(location.hash!=="#/"+date)return;}
    if(!s){location.hash="";return;}
    root.textContent="";
    var w=el("div","wrap");
    var back=el("button","back",library?"← Library":"← Bedtime Stories");back.type="button";back.onclick=function(){location.hash="";};w.appendChild(back);
    var other=el("a","back",library?"Bedtime Stories":"Library");other.href=library?"../":"library/";w.appendChild(other);
    var bar=el("div","bar");
    var pin=el("button","","");pin.type="button";
    function drawPin(){var on=!!pins()[date];pin.setAttribute("aria-pressed",on?"true":"false");pin.textContent=on?"📌 Kept":"📌 Keep this story";}
    pin.onclick=function(){var p=pins(),on=!!p[date];
      if(on){delete p[date];if(!save(PINS_KEY,p))alert("This device would not save that.");drawPin();return;}
      if(Object.keys(p).length>=MAXPINS){alert("You have kept a lot of stories. Un-keep one first.");return;}
      var copy=JSON.parse(JSON.stringify(s));delete copy.image;delete copy.thumb;
      function store(){var q=pins();q[date]=copy;if(!save(PINS_KEY,q)){delete copy.imageData;q[date]=copy;if(!save(PINS_KEY,q))alert("This device would not save the story.");}drawPin();}
      if(s.image&&!s.imageData){
        // Keep a small copy of the picture (about 60 KB) so the story still has its picture after it leaves the site.
        var im=new Image();im.onload=function(){try{var w=Math.min(560,im.naturalWidth),h=Math.round(im.naturalHeight*w/im.naturalWidth);
          var c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(im,0,0,w,h);
          var u=c.toDataURL("image/jpeg",0.7);if(u.indexOf("data:image/jpeg")===0)copy.imageData=u;}catch(e){}store();};
        im.onerror=store;im.src=s.image;
      }else{if(s.imageData)copy.imageData=s.imageData;store();}};
    drawPin();bar.appendChild(pin);
    var sm=el("button","","A−");sm.type="button";sm.setAttribute("aria-label","Smaller text");sm.onclick=function(){setSize(load(FS_KEY,1.25)-0.15);};
    var lg=el("button","","A+");lg.type="button";lg.setAttribute("aria-label","Bigger text");lg.onclick=function(){setSize(load(FS_KEY,1.25)+0.15);};
    bar.appendChild(sm);bar.appendChild(lg);w.appendChild(bar);
    var art=el("article");art.appendChild(el("h1","",s.title));
    var src=(site.indexOf(s)>=0&&s.image)?s.image:(s.imageData||"");
    if(src){var hi=el("img","hero");hi.src=src;hi.alt=s.alt||"";hi.onerror=function(){hi.remove();};art.appendChild(hi);
      if(s.painter&&site.indexOf(s)>=0)art.appendChild(el("p","credit","Picture by "+s.painter));}
    s.paras.forEach(function(segs){if(Array.isArray(segs))art.appendChild(paragraph(segs));});
    art.appendChild(el("p","end","The End"));
    if(s.note)art.appendChild(el("p","note","🔭 Did you know? "+s.note));
    w.appendChild(art);
    var done=el("button","back",library?"← Library":"← Bedtime Stories");done.type="button";done.onclick=function(){location.hash="";};w.appendChild(done);
    root.appendChild(w);document.title=s.title+" · Bedtime Stories";window.scrollTo(0,0);
  }
  function route(){var m=/^#\/(\d{4}-\d{2}-\d{2})$/.exec(location.hash);if(m)story(m[1]);else list();}
  window.addEventListener("hashchange",route);route();
})();
