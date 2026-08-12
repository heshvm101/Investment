// ============================================
// دفتر البورصة — تفاعلات الماوس المشتركة
// (ظهور تدريجي مع السكرول، مؤشر السايدبار، شريط التقدم، رفعة عند الهوفر)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1) ظهور تدريجي للمحتوى مع السكرول (بيشمل الفقرات والقوائم كمان دلوقتي) ----
  const revealTargets = document.querySelectorAll(
    '.content h2, .content h3, .content .lede, .content p, .content ul, .content ol, .content table, ' +
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

  // ---- 2) شريط تقدم القراءة أعلى الصفحة ----
  const progressFill = document.getElementById('progress-fill');
  function updateProgress(){
    if(!progressFill) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    progressFill.style.width = pct + '%';
  }

  // ---- 3) مؤشر متحرك بجانب فهرس السايدبار (بيتبع الرابط النشط) ----
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
