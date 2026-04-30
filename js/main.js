window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').classList.add('hidden');
    }, 250);
});

/* ===== PAGE NAVIGATION ===== */
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var page = document.getElementById('page-' + pageId);
    if (page) {
        page.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (pageId === 'destinations') {
            setTimeout(function() { renderDestinations(); }, 100);
        }
        if (pageId === 'gallery') {
            setTimeout(function() { initGallerySlider(); }, 200);
        }
    }
    var mobileToggle = document.getElementById('mobileToggle');
    var navLinks = document.getElementById('navLinks');
    mobileToggle.classList.remove('active');
    navLinks.classList.remove('active');
}

/* ===== NAVBAR ===== */
var navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

var mobileToggle = document.getElementById('mobileToggle');
var navLinks = document.getElementById('navLinks');
mobileToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

var backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
});
backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== SCROLL REVEAL ===== */
function revealOnScroll() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals.forEach(function(el) {
        var windowHeight = window.innerHeight;
        var elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 120) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-count'));
        var windowHeight = window.innerHeight;
        var elementTop = counter.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100 && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            var current = 0;
            var increment = target / 80;
            var timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString() + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 25);
        }
    });
}
window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

/* ===== PARTICLES ===== */
function createParticles() {
    var pc = document.getElementById('particles');
    for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        var size = (Math.random() * 4 + 2) + 'px';
        particle.style.width = size;
        particle.style.height = size;
        pc.appendChild(particle);
    }
}
createParticles();

/* ===== TESTIMONIALS SLIDER ===== */
var testTrack = document.getElementById('testimonialsTrack');
var testIndex = 0;
var testPerView = 3;
var testCardWidth = 0;
var testGap = 25;

function getTestCardWidth() {
    if (!testTrack) return 0;
    var firstCard = testTrack.querySelector('.testimonial-card');
    if (firstCard) {
        return firstCard.offsetWidth;
    }
    return 0;
}

function updateTestPerView() {
    if (window.innerWidth <= 768) testPerView = 1;
    else if (window.innerWidth <= 992) testPerView = 2;
    else testPerView = 3;
}

function getTestTotalCards() {
    return testTrack ? testTrack.children.length : 0;
}

function updateTestSlider() {
    if (!testTrack) return;
    testCardWidth = getTestCardWidth();
    var totalCards = getTestTotalCards();
    var maxIndex = Math.max(0, totalCards - testPerView);
    if (testIndex > maxIndex) testIndex = maxIndex;
    var translateX = testIndex * (testCardWidth + testGap);
    testTrack.style.transform = 'translateX(' + translateX + 'px)';
    updateTestDots();
}

function slideTestimonials(dir) {
    var totalCards = getTestTotalCards();
    var maxIndex = Math.max(0, totalCards - testPerView);
    testIndex += dir;
    if (testIndex < 0) testIndex = maxIndex;
    if (testIndex > maxIndex) testIndex = 0;
    updateTestSlider();
}

function buildTestDots() {
    var dotsContainer = document.getElementById('testimonialDots');
    if (!dotsContainer || !testTrack) return;
    dotsContainer.innerHTML = '';
    var totalCards = getTestTotalCards();
    var maxIndex = Math.max(0, totalCards - testPerView);
    for (var i = 0; i <= maxIndex; i++) {
        var dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === testIndex ? ' active' : '');
        dot.addEventListener('click', (function(idx) { 
            return function() { 
                testIndex = idx; 
                updateTestSlider(); 
            }; 
        })(i));
        dotsContainer.appendChild(dot);
    }
}

function updateTestDots() {
    var dots = document.getElementById('testimonialDots')?.querySelectorAll('.testimonial-dot');
    if (dots) {
        dots.forEach(function(d, i) { d.classList.toggle('active', i === testIndex); });
    }
}

updateTestPerView();
if (testTrack) {
    // Wait for layout then initialize
    setTimeout(function() {
        updateTestSlider();
        buildTestDots();
    }, 500);
}

window.addEventListener('resize', function() {
    updateTestPerView();
    testCardWidth = getTestCardWidth();
    updateTestSlider();
    buildTestDots();
});

var testAuto = setInterval(function() { slideTestimonials(1); }, 4000);
if (testTrack?.parentElement) {
    testTrack.parentElement.addEventListener('mouseenter', function() { clearInterval(testAuto); });
    testTrack.parentElement.addEventListener('mouseleave', function() { 
        testAuto = setInterval(function() { slideTestimonials(1); }, 4000); 
    });
}

/* ===== HAJJ TOGGLE ===== */
function toggleHajjDetails(id) {
    var details = document.getElementById('hajjDetails' + id);
    var btn = details?.parentElement?.querySelector('.hajj-toggle-btn');
    if (details) details.classList.toggle('active');
    if (btn) btn.classList.toggle('active');
}

/* ===== GALLERY IMAGES ARRAY ===== */
var galleryImages = [
    './img/photo_10_2026-04-28_23-52-20.jpg',
    './img/photo_11_2026-04-28_23-52-20.jpg',
    './img/photo_12_2026-04-28_23-52-20.jpg',
    './img/photo_14_2026-04-28_23-52-20.jpg',
    './img/photo_15_2026-04-28_23-52-20.jpg',
    './img/photo_16_2026-04-28_23-52-20.jpg',
    './img/photo_17_2026-04-28_23-52-20.jpg',
    './img/photo_18_2026-04-28_23-52-20.jpg',
    './img/photo_19_2026-04-28_23-52-20.jpg',
    './img/photo_20_2026-04-28_23-52-20.jpg',
    './img/photo_21_2026-04-28_23-52-20.jpg',
    './img/photo_22_2026-04-28_23-52-20.jpg',
    './img/photo_23_2026-04-28_23-52-20.jpg',
    './img/photo_24_2026-04-28_23-52-20.jpg',
    './img/photo_25_2026-04-28_23-52-20.jpg',
    './img/photo_26_2026-04-28_23-52-20.jpg',
    './img/photo_27_2026-04-28_23-52-20.jpg',
    './img/photo_28_2026-04-28_23-52-20.jpg',
    './img/photo_29_2026-04-28_23-52-20.jpg',
    './img/photo_30_2026-04-28_23-52-20.jpg',
];

/* ===== LIGHTBOX ===== */
var lightboxIndex = 0;

function openLightbox(index) {
    lightboxIndex = index;
    var lightboxImg = document.getElementById('lightboxImg');
    if (lightboxImg) {
        lightboxImg.src = galleryImages[index];
    }
    document.getElementById('lightbox')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox')?.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    lightboxIndex += dir;
    if (lightboxIndex < 0) lightboxIndex = galleryImages.length - 1;
    if (lightboxIndex >= galleryImages.length) lightboxIndex = 0;
    var lightboxImg = document.getElementById('lightboxImg');
    if (lightboxImg) {
        lightboxImg.src = galleryImages[lightboxIndex];
    }
}

var lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
    lightboxEl.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });
}

document.addEventListener('keydown', function(e) {
    var lightboxActive = document.getElementById('lightbox')?.classList.contains('active');
    if (lightboxActive) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    }
});

/* ===== ALL PHOTOS MODAL ===== */
function openAllPhotos() {
    var grid = document.getElementById('allPhotosGrid');
    if (!grid) return;
    grid.innerHTML = '';
    galleryImages.forEach(function(img, idx) {
        var item = document.createElement('div');
        item.className = 'all-photo-item';
        item.onclick = function() {
            closeAllPhotos();
            openLightbox(idx);
        };
        item.innerHTML = '<img src="' + img + '" alt="Gallery Image ' + (idx + 1) + '">';
        grid.appendChild(item);
    });
    document.getElementById('allPhotosModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAllPhotos() {
    document.getElementById('allPhotosModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

var allPhotosModal = document.getElementById('allPhotosModal');
if (allPhotosModal) {
    allPhotosModal.addEventListener('click', function(e) {
        if (e.target === this) closeAllPhotos();
    });
}

/* ===== GALLERY INFINITE CIRCULAR SCROLL ===== */
// Gallery slides are pre-built in HTML with CSS animation for infinite scroll
// This function only adds navigation arrows
function initGallerySlider() {
    var wrapper = document.querySelector('.gallery-slider-wrapper');
    if (!wrapper) return;
    
    // Remove old arrows
    var oldArrows = wrapper.querySelectorAll('.gallery-nav-arrow');
    oldArrows.forEach(function(a) { a.remove(); });

    // Add prev arrow
    var prevArrow = document.createElement('button');
    prevArrow.className = 'gallery-nav-arrow gallery-nav-prev';
    prevArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevArrow.onclick = function(e) { 
        e.stopPropagation(); 
    };

    // Add next arrow
    var nextArrow = document.createElement('button');
    nextArrow.className = 'gallery-nav-arrow gallery-nav-next';
    nextArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextArrow.onclick = function(e) { 
        e.stopPropagation(); 
    };

    wrapper.appendChild(prevArrow);
    wrapper.appendChild(nextArrow);
}

/* ===== TRIP MODAL ===== */
function openTripModal(card) {
    var data = JSON.parse(card.getAttribute('data-trip'));
    var modalImg = document.getElementById('modalImg');
    var modalTitle = document.getElementById('modalTitle');
    var modalLocation = document.getElementById('modalLocation');
    var modalDesc = document.getElementById('modalDesc');
    var modalFeatures = document.getElementById('modalFeatures');
    var modalPrice = document.getElementById('modalPrice');
    
    if (modalImg) modalImg.src = data.img;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalLocation) modalLocation.textContent = data.location;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalPrice) modalPrice.style.display = 'none';
    
    if (modalFeatures) {
        modalFeatures.innerHTML = '';
        data.features.forEach(function(feat) {
            var item = document.createElement('div');
            item.className = 'modal-feature-item';
            item.innerHTML = '<i class="fas fa-check-circle"></i><span>' + feat + '</span>';
            modalFeatures.appendChild(item);
        });
    }
    
    document.getElementById('tripModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('tripModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

var tripModal = document.getElementById('tripModal');
if (tripModal) {
    tripModal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

/* ===== DESTINATIONS DATA ===== */
var allDestinations = [
    { name: "باريس", country: "فرنسا", continent: "europe", type: "cultural", price: 1299, badge: "الأكثر شعبية", badgeIcon: "fa-fire", desc: "مدينة الأنوار والرومانسية، استكشف برج إيفل ومتحف اللوفر وشانز إليزيه وحديقة لوكسمبورغ.", img: "https://picsum.photos/seed/paris/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 5 نجوم","جولة في برج إيفل ومتحف اللوفر","ترانسفيرات خاصة من وإلى المطار","وجبة إفطار يومية","مرشد سياحي عربي"] },
    { name: "إسطنبول", country: "تركيا", continent: "asia", type: "cultural", price: 899, badge: "موصى به", badgeIcon: "fa-star", desc: "حيث يلتقي الشرق بالغرب، استمتع بجمال مسجد آيا صوفيا والبازار الكبير ومضيق البوسفور.", img: "https://picsum.photos/seed/istanbul/600/800", features: ["طيران ذهاب وعودة","إقامة 4 ليالي فندق 4 نجوم","جولة في آيا صوفيا والبازار","رحلة بحرية في البوسفور","وجبة إفطار يومية","ترانسفيرات من المطار"] },
    { name: "دبي", country: "الإمارات", continent: "asia", type: "cultural", price: 1499, badge: "فاخر", badgeIcon: "fa-gem", desc: "مدينة الأحلام والطموحات، تسوق في دبي مول وصعد برج خليفة واستمتع بالسفاري الصحراوية.", img: "https://picsum.photos/seed/dubai/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 5 نجوم","زيارة برج خليفة ودبي مول","رحلة سفاري صحراوية","وجبة إفطار يومية","ترانسفيرات VIP"] },
    { name: "سانتوريني", country: "اليونان", continent: "europe", type: "romantic", price: 1799, badge: "للعسل", badgeIcon: "fa-heart", desc: "جزيرة الأحلام بغناها بالأزرق والأبيض، مثالية لشهر العسل والاستجمام الرومانسي.", img: "https://picsum.photos/seed/santorini/600/800", features: ["طيران ذهاب وعودة","إقامة 6 ليالي فيلا خاصة","جولة بحرية بالقارب","عشاء رومانسي على الشاطئ","وجبة إفطار يومية","ترانسفيرات من المطار"] },
    { name: "الأهرامات", country: "مصر", continent: "africa", type: "historical", price: 699, badge: "تاريخي", badgeIcon: "fa-landmark", desc: "اكتشف عجائب العالم القديم، استكشف الأهرامات وأبو الهول ورحلة النيل الساحرة.", img: "https://picsum.photos/seed/pyramids/600/800", features: ["طيران داخلي","إقامة 4 ليالي فندق 5 نجوم","جولة الأهرامات وأبو الهول","رحلة نيلية بالقوارب الشراعية","وجبة إفطار يومية","مرشد سياحي متخصص"] },
    { name: "جبال الألب", country: "سويسرا", continent: "europe", type: "adventure", price: 2199, badge: "مغامرة", badgeIcon: "fa-mountain", desc: "طبيعة خلابة وسماء صافية، استمتع بمناظر جبال الألب وبحيراتها الكريستالية.", img: "https://picsum.photos/seed/alps/600/800", features: ["طيران ذهاب وعودة","إقامة 6 ليالي شاليه","قطار الجليد السريع","رحلة بحرية في بحيرة ثون","وجبة إفطار يومية","ترانسفيرات بالقطار"] },
    { name: "لندن", country: "إنجلترا", continent: "europe", type: "cultural", price: 1599, badge: "ملكي", badgeIcon: "fa-crown", desc: "عاصمة الضباب والأناقة، زر قصر باكنغهام وساعة بيج بن ومتاحف عالمية.", img: "https://picsum.photos/seed/london/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة في لندن آي","زيارة برج لندن","وجبة إفطار يومية","ترانسفيرات خاصة"] },
    { name: "روما", country: "إيطاليا", continent: "europe", type: "historical", price: 1399, badge: "كلاسيكي", badgeIcon: "fa-monument", desc: "المدينة الخالدة، الكولوسيوم والفاتيكان والبيتزا الإيطالية الأصيلة.", img: "https://picsum.photos/seed/rome/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة في الكولوسيوم","زيارة الفاتيكان","وجبة إفطار يومية","مرشد سياحي"] },
    { name: "جزر المالديف", country: "المالديف", continent: "asia", type: "beach", price: 2499, badge: "استوائي", badgeIcon: "fa-water", desc: "جنة استوائية على الأرض، شواطئ بيضاء ومياه كريستالية وفيلات فاخرة.", img: "https://picsum.photos/seed/maldives/600/800", features: ["طيران ذهاب وعودة","إقامة 7 ليالي فيلا على الماء","أنشطة بحرية متنوعة","غوص مع السلاحف","وجبات كاملة","ترانسفيرات بالقارب"] },
    { name: "طوكيو", country: "اليابان", continent: "asia", type: "cultural", price: 2299, badge: "عصري", badgeIcon: "fa-torii-gate", desc: "مدينة المستقبل والتقاليد، استكشف معابد الشنتو وتكنولوجيا المستقبل وثقافة الأنيمي.", img: "https://picsum.photos/seed/tokyo/600/800", features: ["طيران ذهاب وعودة","إقامة 6 ليالي فندق 4 نجوم","جولة في هاراجوكو وشيبويا","زيارة معبد سينسوجي","وجبة إفطار يومية","تذكرة قطار فائق السرعة"] },
    { name: "بالي", country: "إندونيسيا", continent: "asia", type: "beach", price: 1899, badge: "روحي", badgeIcon: "fa-om", desc: "جزيرة الآلهة، شواطئ ساحرة ومعابد تاريخية وحقول أرز خضراء لا تنتهي.", img: "https://picsum.photos/seed/bali/600/800", features: ["طيران ذهاب وعودة","إقامة 7 ليالي منتجع فاخر","جولة المعابد","رحلة حقول الأرز","وجبة إفطار يومية","جلسة سبا بالي"] },
    { name: "نيويورك", country: "أمريكا", continent: "americas", type: "cultural", price: 1999, badge: "لا تنام", badgeIcon: "fa-building", desc: "المدينة التي لا تنام، تايمز سكوير وتمثال الحرية ومتحف الميتروبوليتان.", img: "https://picsum.photos/seed/newyork/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة تايمز سكوير","رحلة بحرية لحرية","وجبة إفطار يومية","تذكرة عرض برودواي"] },
    { name: "مراكش", country: "المغرب", continent: "africa", type: "cultural", price: 799, badge: "ساحر", badgeIcon: "fa-mosque", desc: "المدينة الحمراء، ساحات جيمع الفناء والأسواق العريقة والحدائق الساحرة.", img: "https://picsum.photos/seed/marrakech/600/800", features: ["طيران ذهاب وعودة","إقامة 4 ليالي رياض تقليدي","جولة في جيمع الفناء","رحلة في وادي أوريكا","وجبة إفطار يومية","حمام مغربي تقليدي"] },
    { name: "سيدني", country: "أستراليا", continent: "oceania", type: "adventure", price: 2799, badge: "بعيدة", badgeIcon: "fa-globe", desc: "دار الأوبرا الشهيرة وشاطئ بونداي الرائع وحديقة حيوانات تارونجا.", img: "https://picsum.photos/seed/sydney/600/800", features: ["طيران ذهاب وعودة","إقامة 7 ليالي فندق 4 نجوم","جولة دار الأوبرا","رحلة جسر الميناء","وجبة إفطار يومية","زيارة حديقة التارونجا"] },
    { name: "ريو دي جانيرو", country: "البرازيل", continent: "americas", type: "beach", price: 1699, badge: "كرنفال", badgeIcon: "fa-music", desc: "شواطئ كوباكابانا وتمثال المسيح الفادي وجبل سوجار لوف الشهير.", img: "https://picsum.photos/seed/rio/600/800", features: ["طيران ذهاب وعودة","إقامة 6 ليالي فندق 4 نجوم","جولة تمثال المسيح","رحلة بحرية في خليج غوانابارا","وجبة إفطار يومية","عرض سامبا"] },
    { name: "كيب تاون", country: "جنوب أفريقيا", continent: "africa", type: "adventure", price: 1899, badge: "طبيعي", badgeIcon: "fa-leaf", desc: "جبل الطاولة المذهل وجزيرة روبن وشواطئ الكيب تاون الساحرة.", img: "https://picsum.photos/seed/capetown/600/800", features: ["طيران ذهاب وعودة","إقامة 6 ليالي فندق 4 نجوم","رحلة جبل الطاولة","زيارة جزيرة روبن","وجبة إفطار يومية","جولة في كيب بوينت"] },
    { name: "بانكوك", country: "تايلاند", continent: "asia", type: "cultural", price: 1199, badge: "حيوية", badgeIcon: "fa-smile", desc: "معابد ذهبية وأسواق عائمة وطعام شوارع لا مثيل له.", img: "https://picsum.photos/seed/bangkok/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة القصر الكبير","رحلة الأسواق العائمة","وجبة إفطار يومية","تدليك تايلاندي"] },
    { name: "برشلونة", country: "إسبانيا", continent: "europe", type: "cultural", price: 1449, badge: "فني", badgeIcon: "fa-palette", desc: "إبداع غاودي ومعبد ساغرادا فاميليا وشاطئ برشلونيتا.", img: "https://picsum.photos/seed/barcelona/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة ساغرادا فاميليا","زيارة بارك غويل","وجبة إفطار يومية","جولة في لا رامبلا"] },
    { name: "فينيسيا", country: "إيطاليا", continent: "europe", type: "romantic", price: 1649, badge: "رومانسي", badgeIcon: "fa-heart", desc: "مدينة القنوات والجسور، رحلات الجندول وساحة سان ماركو الساحرة.", img: "https://picsum.photos/seed/venice/600/800", features: ["طيران ذهاب وعودة","إقامة 4 ليالي فندق 4 نجوم","رحلة جندول","جولة ساحة سان ماركو","وجبة إفطار يومية","زيارة جزيرة مورانو"] },
    { name: "بكين", country: "الصين", continent: "asia", type: "historical", price: 1599, badge: "عظيم", badgeIcon: "fa-dragon", desc: "سور الصين العظيم والمدينة المحرمة والقصر الصيفي الإمبراطوري.", img: "https://picsum.photos/seed/beijing/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة سور الصين العظيم","زيارة المدينة المحرمة","وجبة إفطار يومية","عرض الأوبرا الصينية"] },
    { name: "سيول", country: "كوريا الجنوبية", continent: "asia", type: "cultural", price: 1899, badge: "عصري", badgeIcon: "fa-mobile-alt", desc: "قصور تاريخية وتكنولوجيا متطورة وطعام كوري لذيذ وثقافة الكيبوب.", img: "https://picsum.photos/seed/seoul/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة قصر غيونغ بوك","زيارة حي هونغداي","وجبة إفطار يومية","تجربة كيبوب"] },
    { name: "لشبونة", country: "البرتغال", continent: "europe", type: "cultural", price: 1249, badge: "مشرقة", badgeIcon: "fa-sun", desc: "شوارع مرصوفة بالحجارة والترام الأصفر وباستيل ناتا اللذيذ.", img: "https://picsum.photos/seed/lisbon/600/800", features: ["طيران ذهاب وعودة","إقامة 4 ليالي فندق 4 نجوم","رحلة ترام 28","جولة في بيليم","وجبة إفطار يومية","تذوق باستيل ناتا"] },
    { name: "أثينا", country: "اليونان", continent: "europe", type: "historical", price: 1349, badge: "تاريخي", badgeIcon: "fa-columns", desc: "مهد الحضارة الغربية، الأكروبولس والأغورا والمعابد القديمة.", img: "https://picsum.photos/seed/athens/600/800", features: ["طيران ذهاب وعودة","إقامة 5 ليالي فندق 4 نجوم","جولة الأكروبولس","زيارة المتحف الأثري","وجبة إفطار يومية","عشاء يوناني تقليدي"] },
    { name: "أمستردام", country: "هولندا", continent: "europe", type: "cultural", price: 1399, badge: "قنوات", badgeIcon: "fa-bicycle", desc: "قنوات مائية ساحرة ومتحف ريجكس وبستلات الزنبق الملونة.", img: "https://picsum.photos/seed/amsterdam/600/800", features: ["طيران ذهاب وعودة","إقامة 4 ليالي فندق 4 نجوم","جولة بالقارب في القنوات","زيارة متحف ريجكس","وجبة إفطار يومية","جولة حدائق كوكينهوف"] }
];

var filteredDestinations = allDestinations.slice();

function renderDestinations() {
    var grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (filteredDestinations.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);font-size:1.2rem;"><i class="fas fa-search" style="font-size:3rem;color:var(--gold-primary);display:block;margin-bottom:20px;"></i>لا توجد نتائج مطابقة لمعايير البحث</div>';
        return;
    }
    filteredDestinations.forEach(function(dest, idx) {
        var tripData = {
            title: dest.name + ' - ' + dest.country,
            location: dest.name + '، ' + dest.country,
            desc: dest.desc,
            price: '$' + dest.price.toLocaleString(),
            img: dest.img,
            features: dest.features
        };
        var card = document.createElement('div');
        card.className = 'destination-card reveal';
        card.setAttribute('data-trip', JSON.stringify(tripData));
        card.style.animationDelay = (idx * 0.1) + 's';
        card.innerHTML = '<div class="destination-card-image"><img src="' + dest.img + '" alt="' + dest.name + '"></div><div class="destination-card-content"><div class="destination-card-badge"><i class="fas ' + dest.badgeIcon + '"></i> ' + dest.badge + '</div><h3>' + dest.name + ' - ' + dest.country + '</h3><p>' + dest.desc + '</p><div class="destination-card-footer"><div class="destination-link" onclick="openTripModal(this.parentElement.parentElement.parentElement)"><i class="fas fa-arrow-left"></i></div></div></div>';
        grid.appendChild(card);
    });
    revealOnScroll();
}

function filterDestinations() {
    var nameFilter = document.getElementById('filterName')?.value.trim().toLowerCase() || '';
    var continentFilter = document.getElementById('filterContinent')?.value || '';
    var typeFilter = document.getElementById('filterType')?.value || '';
    var sortFilter = document.getElementById('filterSort')?.value || '';

    filteredDestinations = allDestinations.filter(function(d) {
        var matchName = !nameFilter || d.name.toLowerCase().indexOf(nameFilter) !== -1 || d.country.toLowerCase().indexOf(nameFilter) !== -1;
        var matchContinent = !continentFilter || d.continent === continentFilter;
        var matchType = !typeFilter || d.type === typeFilter;
        return matchName && matchContinent && matchType;
    });

    if (sortFilter === 'price-low') {
        filteredDestinations.sort(function(a, b) { return a.price - b.price; });
    } else if (sortFilter === 'price-high') {
        filteredDestinations.sort(function(a, b) { return b.price - a.price; });
    } else if (sortFilter === 'name') {
        filteredDestinations.sort(function(a, b) { return a.name.localeCompare(b.name, 'ar'); });
    }

    renderDestinations();
}

function resetFilter() {
    var filterName = document.getElementById('filterName');
    var filterContinent = document.getElementById('filterContinent');
    var filterType = document.getElementById('filterType');
    var filterSort = document.getElementById('filterSort');
    
    if (filterName) filterName.value = '';
    if (filterContinent) filterContinent.value = '';
    if (filterType) filterType.value = '';
    if (filterSort) filterSort.value = 'default';
    
    filteredDestinations = allDestinations.slice();
    renderDestinations();
}

/* ===== GLOBAL ESCAPE KEY HANDLER ===== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeLightbox();
        closeAllPhotos();
    }
});

/* ===== INITIALIZATION ON LOAD ===== */
if (document.getElementById('page-gallery')?.classList.contains('active')) {
    setTimeout(function() { initGallerySlider(); }, 300);
}

// ===== DEVELOPER MODAL TOGGLE =====
const devModal = document.getElementById('devModal');
const devCreditLink = document.getElementById('devCreditLink');
const closeDevModal = document.getElementById('closeDevModal');

if (devCreditLink && devModal && closeDevModal) {
    // فتح المودال
    devCreditLink.addEventListener('click', (e) => {
        e.preventDefault();
        devModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // إغلاق المودال
    closeDevModal.addEventListener('click', () => {
        devModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // إغلاق عند الضغط خارج المودال
    devModal.addEventListener('click', (e) => {
        if (e.target === devModal) {
            devModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // إغلاق بالضغط على ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && devModal.classList.contains('active')) {
            devModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}