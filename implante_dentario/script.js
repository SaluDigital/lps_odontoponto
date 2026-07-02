/* Odonto Ponto — LP interactions */
(function(){
  "use strict";

  /* Sticky header shadow */
  var header = document.querySelector('.header');
  if (header){
    var onScroll = function(){
      if(window.scrollY > 12){ header.classList.add('scrolled'); }
      else{ header.classList.remove('scrolled'); }
    };
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  function revealAll(){ reveals.forEach(function(el){ el.classList.add('in'); }); }
  if (window.IntersectionObserver && (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:.10, rootMargin:'0px 0px -6% 0px' });
    reveals.forEach(function(el){ io.observe(el); });
    /* Failsafe: if the observer never fires (offscreen iframe, odd viewports),
       make sure nothing stays invisible. */
    setTimeout(function(){
      reveals.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.top < window.innerHeight * 1.2){ el.classList.add('in'); }
      });
    }, 1400);
    window.addEventListener('load', function(){
      setTimeout(revealAll, 2500);
    });
  } else {
    revealAll();
  }

  /* Video play (hero + stories): click poster overlay -> load & play */
  document.querySelectorAll('[data-video]').forEach(function(holder){
    var overlay = holder.querySelector('.play');
    if(!overlay) return;
    overlay.addEventListener('click', function(){
      var v = holder.querySelector('video');
      if(!v) return;
      // The hero uses a preview frame at 2s; swap back to the real file before playing.
      if(v.dataset.playSrc && v.getAttribute('src') !== v.dataset.playSrc){
        v.setAttribute('src', v.dataset.playSrc);
        v.load();
      } else if(!v.getAttribute('src') && v.dataset.src){
        v.setAttribute('src', v.dataset.src);
      }
      v.setAttribute('controls','');
      overlay.style.display = 'none';
      var p = v.play();
      if(p && p.catch){ p.catch(function(){}); }
    });
  });

  document.addEventListener('click', function(event){
    var trigger = event.target.closest('.sellbot-wpp-open');
    if(!trigger) return;

    var sellbotButton = document.querySelector('#sellbot-wpp-btn');
    if(!sellbotButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    sellbotButton.click();
  }, true);

  /* Carousel arrows (reviews) */
  document.querySelectorAll('[data-rail-nav]').forEach(function(nav){
    var railSel = nav.getAttribute('data-rail-nav');
    var rail = document.querySelector(railSel);
    if(!rail) return;
    var step = function(){ var c = rail.querySelector(':scope > *'); return c ? c.getBoundingClientRect().width + 20 : 360; };
    var autoplayId = null;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var goToNext = function(){
      var maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
      var nextLeft = rail.scrollLeft + step();
      rail.scrollTo({ left: nextLeft >= maxLeft - 4 ? 0 : nextLeft, behavior:'smooth' });
    };
    var stopAutoplay = function(){
      if(autoplayId){
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };
    var startAutoplay = function(){
      if(prefersReduced || autoplayId) return;
      autoplayId = window.setInterval(goToNext, 4500);
    };
    nav.querySelectorAll('[data-dir]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var dir = btn.getAttribute('data-dir') === 'next' ? 1 : -1;
        rail.scrollBy({ left: dir * step(), behavior:'smooth' });
        stopAutoplay();
        startAutoplay();
      });
    });
    rail.addEventListener('mouseenter', stopAutoplay);
    rail.addEventListener('mouseleave', startAutoplay);
    rail.addEventListener('focusin', stopAutoplay);
    rail.addEventListener('focusout', startAutoplay);
    rail.addEventListener('touchstart', stopAutoplay, { passive:true });
    rail.addEventListener('touchend', startAutoplay, { passive:true });
    startAutoplay();
  });

  /* Small fixed popup notice */
  var popupAviso = document.querySelector('[data-popup-aviso]');
  var popupAvisoClose = document.querySelector('[data-popup-aviso-close]');
  if(popupAviso && popupAvisoClose){
    document.body.classList.add('popup-open');
    popupAvisoClose.addEventListener('click', function(){
      popupAviso.style.display = 'none';
      document.body.classList.remove('popup-open');
    });
  }

})();
