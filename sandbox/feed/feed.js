globalThis.HUA_FEED = [{"id":"j1kTkyf9rKE","title":"The Weekend Bluey Book Read Aloud by Wunmi Mosaku 🍃 | Bluey Book Reads 💙 | Bluey"},{"id":"EkLmLTCbuM4","title":"Rubble & Crew: The Crew Builds a Mini Golf Course | Full Episode | PAW Patrol"},{"id":"p6vaGEiQMyg","title":"Elmo Helps Peppa Pig & George Pig EXPLORE the SOUNDS of Sesame Street! 🐽 | Peppa Pig x Sesame Street"},{"id":"9qHqG6FgkI8","title":"Bananaphone | CoComelon Nursery Rhymes & Kids Songs"},{"id":"CGjRPy31uZE","title":"See You Later, Alligator 🐊 | I Love You Mommy ❤️, I Love You Daddy ❤️ | Kids Songs"},{"id":"cJpPDoTvTwo","title":"BBQ Bluey Book Read Aloud by Julia Stiles | Bluey Book Reads 💙"},{"id":"VC7ODeRhk5o","title":"Rubble & Crew: The Crew Builds a Train Station | Full Episode | PAW Patrol"},{"id":"tRMGlo9LXZI","title":"Elmo and Peppa’s Muddy Puddles (Dance Remix) Official Video @PeppaPigOfficial x  ⁨@SesameStreet ⁩"},{"id":"KnbwAF0Egfo","title":"The Ultimate Kids Yoga Routine for Focus, Confidence & Strength | Jojo Strength Yoga"},{"id":"zhDenYaFSp8","title":"Let's Play…Stickbird 🏝️ | Bluey and Bingo Playtime | Bluey"},{"id":"ncqlW6CGwqM","title":"Rubble & Crew: The Crew Fixes a Squeak | Full Episode | PAW Patrol"},{"id":"oVm0kXS_gtk","title":"George LOVES Dancing to Squashpuff Shake! 🕺🎶 Peppa Pig Tales | 20 Minutes"},{"id":"n70Ev0pPI1I","title":"🐸 kids books read aloud 🎀 This Book is MINE ! -Finn the Frog stories Ron Keres"},{"id":"0O2RM4u8sPQ","title":"Let's Play…Dirt💙😆 | Bluey and Bingo Playtime | Bluey"},{"id":"DRdT2nDwcJ8","title":"GUESS THE CHARACTER BY THE EMOJIS 🐶🦴🚜 (Part 2) | PAW Patrol | Fun Interactive Quiz for Kids"}];
(function feedFullscreen(win, doc, root, button) {
  var request = root.requestFullscreen || root.webkitRequestFullscreen;
  var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
  var supported = !!(request && exit) && doc.fullscreenEnabled !== false && doc.webkitFullscreenEnabled !== false;
  var pending = false, generation = 0, landscape;
  function current() { return doc.fullscreenElement || doc.webkitFullscreenElement; }
  function orientation() {
    var type = win.screen && win.screen.orientation && win.screen.orientation.type;
    if (type) return type.indexOf('landscape') === 0;
    if (typeof win.orientation === 'number') return Math.abs(win.orientation) === 90;
    return win.matchMedia ? win.matchMedia('(orientation: landscape)').matches : false;
  }
  function sync() {
    button.hidden = !supported || (!landscape && current() !== root);
    button.textContent = current() === root ? 'Exit full screen' : 'Full screen';
    button.setAttribute('aria-label', button.textContent);
    button.disabled = pending;
  }
  function leave() {
    if (current() !== root) return;
    try { Promise.resolve(exit.call(doc)).catch(function() { sync(); }); } catch (_) { sync(); }
  }
  function enter() {
    if (!supported || pending || !landscape || current()) return;
    var token = generation;
    pending = true; sync();
    try {
      Promise.resolve(request.call(root)).then(function() {
        pending = false;
        if (token !== generation || !landscape) leave();
        sync();
      }, function() { pending = false; sync(); });
    } catch (_) { pending = false; sync(); }
  }
  function rotate() {
    var next = orientation();
    if (next === landscape) return;
    landscape = next; generation++;
    if (landscape) enter(); else leave();
    sync();
  }
  function changed() { if (!landscape && current() === root) leave(); sync(); }
  doc.addEventListener('fullscreenchange', changed);
  doc.addEventListener('webkitfullscreenchange', changed);
  button.addEventListener('click', function() { if (current() === root) leave(); else enter(); });
  // No resize listener: keyboards and collapsing browser chrome aren't rotations.
  var screenOrientation = win.screen && win.screen.orientation;
  if (screenOrientation && screenOrientation.addEventListener) screenOrientation.addEventListener('change', rotate);
  win.addEventListener('orientationchange', rotate);
  rotate(); sync();
})(window,document,document.documentElement,document.getElementById("fullscreen"));
(function(){
  "use strict";
  var VIDEOS=(globalThis.HUA_FEED||[]).filter(function(v){return v&&/^[\w-]{11}$/.test(v.id);});
  var SEEN_KEY="hua:feed:v1:seen";
  var $=function(id){return document.getElementById(id);};
  var shield=$("shield"),startBtn=$("start"),playBtn=$("play"),nextBtn=$("next"),prevBtn=$("prev"),hint=$("hint"),msg=$("msg"),titleEl=$("title");
  var player=null,ready=false,idx=0,playing=false,started=false,errors=0,seenTimer=null,watchdog=null,pendingStart=false;
  function load(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function showMsg(t){msg.textContent=t;msg.hidden=false;}
  if(!VIDEOS.length){startBtn.hidden=true;showMsg("No videos yet. Check back soon!");return;}
  // Start at the first video she has not watched yet; when she has seen them all, start over.
  function firstUnseen(){var seen=load(SEEN_KEY,[]);for(var i=0;i<VIDEOS.length;i++)if(seen.indexOf(VIDEOS[i].id)<0)return i;save(SEEN_KEY,[]);return 0;}
  function markSeen(id){var s=load(SEEN_KEY,[]);if(s.indexOf(id)<0){s.push(id);if(s.length>300)s=s.slice(-300);save(SEEN_KEY,s);}}
  idx=firstUnseen();
  function setPlayIcon(){playBtn.textContent=playing?"⏸":"▶";playBtn.setAttribute("aria-label",playing?"Pause":"Play");}
  function show(){titleEl.textContent=VIDEOS[idx].title||"";}
  function go(i,auto){
    idx=(i+VIDEOS.length)%VIDEOS.length;show();errors=auto?errors:0;
    if(ready){player.loadVideoById(VIDEOS[idx].id);}
  }
  function next(){go(idx+1,false);}
  function prev(){go(idx-1,false);}
  function toggle(){if(!ready||!started)return;if(playing)player.pauseVideo();else player.playVideo();}
  function onState(e){
    var S=globalThis.YT.PlayerState;
    clearTimeout(seenTimer);
    if(e.data===S.PLAYING){
      playing=true;started=true;errors=0;clearTimeout(watchdog);shield.classList.remove("off","partial");hint.textContent="Swipe up for the next video";
      var id=VIDEOS[idx].id;seenTimer=setTimeout(function(){markSeen(id);},5000);
    }else if(e.data===S.PAUSED){playing=false;}
    else if(e.data===S.ENDED){playing=false;next();} // jump straight on: YouTube's end screen suggestions are never shown
    setPlayIcon();
  }
  function onError(){
    errors++;
    if(errors>=VIDEOS.length){showMsg("These videos can't play right now. Ask a grown-up to check later.");return;}
    go(idx+1,true);
  }
  function build(){
    player=new globalThis.YT.Player("yt",{
      host:"https://www.youtube-nocookie.com",
      width:"100%",height:"100%",videoId:VIDEOS[idx].id,
      playerVars:{autoplay:0,controls:0,disablekb:1,fs:0,modestbranding:1,rel:0,playsinline:1,iv_load_policy:3,cc_load_policy:0,origin:location.origin},
      events:{onReady:function(){ready=true;if(pendingStart)begin();},onStateChange:onState,onError:onError}
    });
  }
  function begin(){
    pendingStart=false;startBtn.hidden=true;show();
    player.playVideo();
    // If the browser refused to start playback without a tap on the video itself, let the tap through to the player.
    clearTimeout(watchdog);
    watchdog=setTimeout(function(){if(!playing){shield.classList.remove("off");shield.classList.add("partial");hint.textContent="Tap the ▶ in the middle of the video";}},3000);
  }
  startBtn.addEventListener("click",function(){
    if(ready)begin();else{pendingStart=true;startBtn.querySelector(".label").textContent="Getting ready…";}
  });
  // Swipe / tap on the shield that covers the player (so the child can never tap through to YouTube).
  var sx=0,sy=0,st=0,tracking=false;
  shield.addEventListener("pointerdown",function(e){tracking=true;sx=e.clientX;sy=e.clientY;st=Date.now();try{shield.setPointerCapture(e.pointerId);}catch(x){}});
  shield.addEventListener("pointerup",function(e){
    if(!tracking)return;tracking=false;
    var dx=e.clientX-sx,dy=e.clientY-sy,ax=Math.abs(dx),ay=Math.abs(dy);
    if(Math.max(ax,ay)<12&&Date.now()-st<600){toggle();return;}
    if(Math.max(ax,ay)<45)return;
    if(ay>=ax){if(dy<0)next();else prev();}else{if(dx<0)next();else prev();}
  });
  shield.addEventListener("pointercancel",function(){tracking=false;});
  playBtn.addEventListener("click",toggle);nextBtn.addEventListener("click",next);prevBtn.addEventListener("click",prev);
  document.addEventListener("keydown",function(e){
    if(e.key==="ArrowRight"||e.key==="ArrowUp")next();else if(e.key==="ArrowLeft"||e.key==="ArrowDown")prev();
    else if(e.key===" "){e.preventDefault();toggle();}else if(e.key==="Escape")location.href="../";
  });
  window.addEventListener("pagehide",function(){try{if(player&&player.stopVideo)player.stopVideo();}catch(e){}});
  show();setPlayIcon();
  // Load the YouTube player code when the page opens, so the first tap can start the video.
  var loadTimer=setTimeout(function(){if(!ready){showMsg("The videos can't load right now. Ask a grown-up to check the internet.");}},12000);
  function api(){clearTimeout(loadTimer);build();}
  if(globalThis.YT&&globalThis.YT.Player){api();}
  else{
    globalThis.onYouTubeIframeAPIReady=api;
    var s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";s.async=true;
    s.onerror=function(){showMsg("The videos can't load right now. Ask a grown-up to check the internet.");};
    document.head.appendChild(s);
  }
})();
