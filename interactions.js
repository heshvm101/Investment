// ============================================
// دفتر البورصة — تفاعلات الماوس المشتركة
// (ظهور تدريجي مع السكرول، مؤشر السايدبار، شريط التقدم، رفعة عند الهوفر)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1) إمالة 3D خفيفة جدًا (زاوية صغيرة + throttling) عشان تتحرك من غير ما تزغلل النص ----
  const tiltEls = document.querySelectorAll('.session-card, .flow-panel, .box');
  const MAX_TILT_DEG = 2.5; // زاوية صغيرة عمدًا: كل ما الزاوية أكبر كل ما الـ blur وقت الحركة أوضح
  tiltEls.forEach(el => {
    let ticking = false;
    let lastEvent = null;

    el.addEventListener('mouseenter', () => {
      el.classList.add('is-tilting'); // بيوقف انتقال الـ transform وقت الحركة عشان تفضل الاستجابة فورية ونظيفة
    });

    el.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const cx = (lastEvent.clientX - r.left) - r.width / 2;
        const cy = (lastEvent.clientY - r.top) - r.height / 2;
        const rotateX = (-cy / r.height) * MAX_TILT_DEG;
        const rotateY = (cx / r.width) * MAX_TILT_DEG;
        el.style.transform =
          `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) translateZ(0)`;
        ticking = false;
      });
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('is-tilting'); // برجع الانتقال السلس عشان يرجع لوضعه الطبيعي بنعومة
      el.style.transform = '';
    });
  });

  // ---- 2) ظهور تدريجي للمحتوى مع السكرول ----
  // ملاحظة: بنستخدم ">" عشان الفقرات والقوائم اللي جوه صندوق (.box) أو كارت
  // تتحرك مع المربع بتاعها كوحدة واحدة، مش كل سطر لوحده
  const revealTargets = document.querySelectorAll(
    '.content > h2, .content > h3, .content > .lede, .content > p, .content > ul, .content > ol, .content > table, ' +
    '.box, .flow-panel, .session-card, .gterm, .hero-stats .stat, .flow-news'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  // ---- 3) شريط تقدم القراءة أعلى الصفحة ----
  const progressFill = document.getElementById('progress-fill');
  function updateProgress(){
    if(!progressFill) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressFill.style.width = pct + '%';
  }

  // ---- 4) مؤشر متحرك بجانب فهرس السايدبار (بيتبع الرابط النشط) ----
  const sideList = document.querySelector('.side-list');
  let sideIndicator = null;
  if (sideList) {
    sideIndicator = document.createElement('div');
    sideIndicator.className = 'side-indicator';
    sideList.appendChild(sideIndicator);
  }
  function updateSideIndicator(){
    if (!sideList || !sideIndicator) return;
    const active = sideList.querySelector('a.active');
    if (active) {
      sideIndicator.style.height = active.offsetHeight + 'px';
      sideIndicator.style.transform = `translateY(${active.offsetTop}px)`;
      sideIndicator.style.opacity = '1';
    } else {
      sideIndicator.style.opacity = '0';
    }
  }

  function onScroll(){
    updateProgress();
    updateSideIndicator();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateProgress();
  // تأخير بسيط عشان نستنى سكريبت تفعيل الرابط النشط (لو موجود) يشتغل الأول
  setTimeout(updateSideIndicator, 150);

});
