/* ========== 1) 導覽平滑滾動（考量固定 header） ========== */
(function(){
  const header = document.querySelector('header');
  function headerHeight(){ return header.getBoundingClientRect().height; }
  document.querySelectorAll('a.nav-link, .btn').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if(!target) return;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight() - 12;
      window.scrollTo({top, behavior:'smooth'});
    });
  });
})();

/* ========== 2) Accordion ========== */
(function(){
  const items = Array.from(document.querySelectorAll('.acc-item'));
  items.forEach(item=>{
    const toggle = item.querySelector('.toggle');
    toggle.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      // 單一開啟模式：關閉全部
      items.forEach(i => i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });
})();

/* ========== 3) Portfolio thumbs & lightbox ========== */
(function(){
  const thumbs = Array.from(document.querySelectorAll('#thumbs .thumb'));
  const mainImg = document.getElementById('mainImg');
  const mainPreview = document.getElementById('mainPreview');

  // 建立資料陣列（讀取 data 屬性）
  const gallery = thumbs.map(t => ({
    src: t.dataset.src,
    title: t.dataset.title || '專案',
    desc: t.dataset.desc || ''
  }));

  // 預設載入第一張（若 mainImg 未與第一張一致則切換）
  if(gallery[0] && mainImg.src.indexOf(gallery[0].src) === -1){
    mainImg.src = gallery[0].src;
    mainPreview.querySelector('.meta-title').innerText = gallery[0].title;
    mainPreview.querySelector('.meta-desc').innerText = gallery[0].desc;
  }

  // 當點擊縮圖：切換主圖
  thumbs.forEach((t, i)=>{
    t.addEventListener('click', ()=>{
      const src = t.dataset.src;
      const title = t.dataset.title;
      const desc = t.dataset.desc;
      mainImg.src = src;
      mainPreview.querySelector('.meta-title').innerText = title;
      mainPreview.querySelector('.meta-desc').innerText = desc;
    });
  });

  // Lightbox 行為：點 mainPreview 開啟 lightbox（包含所有 gallery 圖片）
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbTitle = document.getElementById('lbTitle');
  const lbDesc = document.getElementById('lbDesc');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');

  let currentIndex = 0;

  // 開啟 lightbox 並定位到目前 mainImg 在 gallery 中的 index
  mainPreview.addEventListener('click', ()=>{
    const src = mainImg.src;
    currentIndex = gallery.findIndex(g => g.src === src);
    if(currentIndex === -1) currentIndex = 0;
    openLB(currentIndex);
  });

  // 也可直接點縮圖開 lightbox（optional）
  thumbs.forEach((t,i)=>{
    t.addEventListener('dblclick', ()=>{ openLB(i); });
  });

  function openLB(idx){
    const g = gallery[idx];
    lbImg.src = g.src;
    lbTitle.innerText = g.title;
    lbDesc.innerText = g.desc;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden','false');
  }
  function closeLB(){ lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); }

  lbClose.addEventListener('click', closeLB);
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLB(); });

  lbPrev.addEventListener('click', ()=>{
    currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    openLB(currentIndex);
  });
  lbNext.addEventListener('click', ()=>{
    currentIndex = (currentIndex + 1) % gallery.length;
    openLB(currentIndex);
  });
})();

/* ========== 4) Projects carousel ========== */
(function(){
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((c)=>{
    const slides = c.querySelector('.slides');
    const slideCount = slides.children.length;
    let idx = 0;
    const left = c.querySelector('.arrow.left');
    const right = c.querySelector('.arrow.right');
    function update(){ slides.style.transform = `translateX(-${idx*100}%)`; }
    left.addEventListener('click', ()=>{ idx = (idx - 1 + slideCount) % slideCount; update(); });
    right.addEventListener('click', ()=>{ idx = (idx + 1) % slideCount; update(); });
  });
})();
