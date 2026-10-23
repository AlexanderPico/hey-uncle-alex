(function(){
  var stage=document.getElementById('stage'),now=document.getElementById('now'),btns=[].slice.call(document.querySelectorAll('.vbtn'));
  function play(b){
    var f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+b.dataset.id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0';
    f.title=b.dataset.title;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
    f.referrerPolicy='strict-origin-when-cross-origin';
    stage.replaceChildren(f);now.textContent=b.dataset.title;
    btns.forEach(function(x){x.setAttribute('aria-current',x===b?'true':'false')});
    stage.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  btns.forEach(function(b){b.addEventListener('click',function(){play(b)})});
})();
