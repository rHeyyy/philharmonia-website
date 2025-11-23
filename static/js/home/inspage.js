// INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS
// INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS

// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS// INSTRUMENT JS
// INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS // INSTRUMENT JS



// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS
am4core.ready(function () {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("chartdiv", am4maps.MapChart);
    chart.geodata = am4geodata_philippinesLow;
    chart.projection = new am4maps.projections.Miller();

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#d3d3d3");
    polygonTemplate.stroke = am4core.color("#000000");
    polygonTemplate.strokeWidth = 0.5;

    polygonTemplate.events.on("over", function (ev) {
        ev.target.originalFill = ev.target.fill;
        ev.target.fill = am4core.color("#f2d974");
    });

    polygonTemplate.events.on("out", function (ev) {
        const hasInstrument = ev.target.dataItem.dataContext.has_instrument;
        ev.target.fill = hasInstrument ? am4core.color("#1E90FF") : am4core.color("#d3d3d3");
    });

    function updateInstrumentPanel(provinceName, data) {
        const instrumentList = document.getElementById("instrument-list");
        const provinceNameElement = document.getElementById("province-name");
        const provinceDescription = document.getElementById("province-description");
        const noInstruments = document.querySelector(".no-instruments");
        const culturalGroupTag = document.getElementById("cultural-group").querySelector("span");

        provinceNameElement.innerText = `Instruments from ${provinceName}`;
        provinceDescription.innerText = `This region is known for the following instruments:`;

        culturalGroupTag.textContent = data.length > 0 && data[0].region ? data[0].region : "---";

        instrumentList.innerHTML = '';
        instrumentList.style.display = 'grid';
        noInstruments.style.display = 'none';

        if (data.length === 0) {
            instrumentList.style.display = 'none';
            noInstruments.style.display = 'block';
        } else {
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'instrument-card';
                card.innerHTML = `
                    <a href="${DETAIL_URL_BASE}${item.id}" class="instrument-link">
                        <img src="${item.image || 'https://via.placeholder.com/150'}" 
                             alt="${item.name}" loading="lazy">
                        <p>${item.name}</p>
                    </a>
                `;
                instrumentList.appendChild(card);
            });
        }
    }

    function loadProvinceData(provinceName) {
        fetch(`/api/instruments/province/?province_name=${provinceName}`)
            .then(response => response.json())
            .then(data => updateInstrumentPanel(provinceName, data));
    }

    fetch('/api/instruments/provinces-with-instruments/')
        .then(response => response.json())
        .then(provincesWithInstruments => {
            polygonSeries.data = polygonSeries.geodata.features.map(feature => {
                const provinceName = feature.properties.name;
                const hasInstrument = provincesWithInstruments.includes(provinceName);
                return {
                    id: feature.id,
                    name: provinceName,
                    has_instrument: hasInstrument,
                    fill: hasInstrument ? am4core.color("#1E90FF") : am4core.color("#d3d3d3")
                };
            });

            if (provincesWithInstruments.length > 0) {
                loadProvinceData(provincesWithInstruments[0]);
            }
        });

    polygonTemplate.events.on("hit", function (ev) {
        const provinceName = ev.target.dataItem.dataContext.name;
        loadProvinceData(provinceName);
    });

    chart.chartContainer.wheelable = false;
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.maxZoomLevel = 1;
    chart.minZoomLevel = 1;
    chart.zoomControl = null;

    chart.homeZoomLevel = 1;
    chart.homeGeoPoint = { latitude: 12.8797, longitude: 121.7740 };
    chart.goHome();

    // Make map responsive
    window.addEventListener("resize", () => {
        chart.invalidateSize();
    });
});


  // MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS
  // MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS// MAP JS




//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS
//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const iconTools = document.querySelectorAll('.icon-tooltip'); // Get all instrument icons
    let currentIndex = 0;
    let autoSlideInterval;
    const slideCount = slides.length;
    
    // Initialize dots
    function initDots() {
        const dotsContainer = document.querySelector('.slider-dots');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update slider position
    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        document.querySelectorAll('.slider-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Add active class to current slide for animations
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        // Update active icon
        iconTools.forEach((icon, index) => {
            icon.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        resetAutoSlide();
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
        resetAutoSlide();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
        resetAutoSlide();
    }
    
    // Auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset auto slide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Connect instrument icons to slides
    function connectIconsToSlides() {
        iconTools.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                goToSlide(index);
            });

            // Add hover effect
            icon.addEventListener('mouseenter', () => {
                slides[index].classList.add('highlight');
            });

            icon.addEventListener('mouseleave', () => {
                slides[index].classList.remove('highlight');
            });
        });
    }
    
    // Initialize
    initDots();
    connectIconsToSlides(); // Connect the icons
    startAutoSlide();
    
    // Button controls
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });
    
    // Pause on hover
    const slider = document.querySelector('.image-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    }, {passive: true});
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }
});
//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS
//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS//HOME PAGE JS


// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS
// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS
document.addEventListener('DOMContentLoaded', function() {
    // Get all video elements and their corresponding play buttons and posters
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const poster = wrapper.querySelector('.video-poster');
        const playButton = wrapper.querySelector('.play-button');
        const fullscreenButton = wrapper.querySelector('.fullscreen-button');
        
        // Play button click handler
        playButton.addEventListener('click', function() {
            poster.style.display = 'none';
            video.style.display = 'block';
            video.play();
        });
        
        // Video click handler to pause/play
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
        
        // Fullscreen button click handler
        fullscreenButton.addEventListener('click', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE11 */
                video.msRequestFullscreen();
            }
        });
        
        // When video ends, show the poster again
        video.addEventListener('ended', function() {
            poster.style.display = 'block';
            video.style.display = 'none';
        });
    });
});
// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS
// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS// 3 VIDEO JS

// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS
// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS

document.addEventListener('DOMContentLoaded', function() {
    const scrollElements = document.querySelectorAll('[data-scroll]');
    
    const elementInView = (el) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= (window.innerHeight * 0.8)
      );
    };
    
    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el)) {
          el.classList.add('is-visible');
        }
      });
    };
    
    // Initialize
    window.addEventListener('load', handleScrollAnimation);
    window.addEventListener('scroll', handleScrollAnimation);
  });
// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS
// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS// MISSION VISSION JS


// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS
// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS

document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation
    const section = document.querySelector('.popular-instruments-section2');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    if (section) {
      observer.observe(section);
    }
  
    // Carousel functionality
    const carousel = document.querySelector('.popular-instruments2');
    const prevBtn = document.querySelector('.prev-btn2');
    const nextBtn = document.querySelector('.next-btn2');
    const card = document.querySelector('.instrument-card2');
    
    if (!card) return;
    
    const cardWidth = card.offsetWidth + 24; // card width + gap
    let currentPosition = 0;
    let maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    function updateButtons() {
        prevBtn.disabled = currentPosition <= 10; // small buffer
        nextBtn.disabled = currentPosition >= maxScroll - 10;
    }
    
    function scrollCarousel(direction) {
        const scrollAmount = Math.min(cardWidth * 3, direction === 'prev' ? currentPosition : maxScroll - currentPosition);
        currentPosition = direction === 'prev' 
            ? Math.max(currentPosition - scrollAmount, 0)
            : Math.min(currentPosition + scrollAmount, maxScroll);
        
        carousel.scrollTo({
            left: currentPosition,
            behavior: 'smooth'
        });
        
        setTimeout(updateButtons, 300);
    }
    
    prevBtn.addEventListener('click', () => scrollCarousel('prev'));
    nextBtn.addEventListener('click', () => scrollCarousel('next'));
    
    // Handle window resize
    function handleResize() {
        maxScroll = carousel.scrollWidth - carousel.clientWidth;
        updateButtons();
    }
    
    // Initialize
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(carousel);
    updateButtons();
  });

// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS
// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS// POPULAR INSTRUMENT JS


// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN
// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN

  // Carousel functionality
  let currentInstrumentIndex = 0;
  let instruments = Array.from(document.querySelectorAll('.instrument-card1'));
  let totalInstruments = instruments.length;
  let autoRotateInterval;
  
  // Initialize carousel
  function initCarousel() {
    if (totalInstruments === 0) return;
    
    // Reset current index if out of bounds
    if (currentInstrumentIndex >= totalInstruments) {
      currentInstrumentIndex = 0;
    } else if (currentInstrumentIndex < 0) {
      currentInstrumentIndex = totalInstruments - 1;
    }
    
    // Position all cards
    updateCarousel();
    
    // Set active card
    instruments.forEach((card, index) => {
      card.classList.remove('active', 'left-1', 'left-2', 'left-3', 'right-1', 'right-2', 'right-3');
      
      if (index === currentInstrumentIndex) {
        card.classList.add('active');
      } else {
        // Calculate the shortest path difference (considering infinite loop)
        let diff = index - currentInstrumentIndex;
        
        // Handle wrapping for infinite effect
        if (Math.abs(diff) > totalInstruments / 2) {
          diff = diff > 0 ? diff - totalInstruments : diff + totalInstruments;
        }
        
        if (diff < 0) {
          // Left side cards
          const position = Math.min(Math.abs(diff), 3);
          card.classList.add(`left-${position}`);
        } else {
          // Right side cards
          const position = Math.min(diff, 3);
          card.classList.add(`right-${position}`);
        }
      }
    });
  }
  
  // Update carousel position
  function updateCarousel() {
    const container = document.querySelector('.instrument-cards-container1');
    const activeCard = instruments[currentInstrumentIndex];
    
    if (!activeCard) return;
    
    // Center the active card visually
    const cardWidth = activeCard.offsetWidth;
    const containerWidth = container.offsetWidth;
    const offset = (containerWidth / 2) - (activeCard.offsetLeft + (cardWidth / 2));
    container.style.transform = `translateX(${offset}px)`;
  }
  
  // Next instrument
  function nextInstrument() {
    if (totalInstruments === 0) return;
    
    currentInstrumentIndex = (currentInstrumentIndex + 1) % totalInstruments;
    initCarousel();
  }
  
  // Previous instrument
  function prevInstrument() {
    if (totalInstruments === 0) return;
    
    currentInstrumentIndex = (currentInstrumentIndex - 1 + totalInstruments) % totalInstruments;
    initCarousel();
  }
  
  // Filter instruments by category
  function filterInstruments(category) {
    const allCards = document.querySelectorAll('.instrument-card1');
    let hasVisible = false;
    
    allCards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        hasVisible = true;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update instruments array with only visible cards
    instruments = Array.from(document.querySelectorAll('.instrument-card1[style*="display: block"]'));
    totalInstruments = instruments.length;
    currentInstrumentIndex = totalInstruments > 0 ? 0 : -1;
    
    // Show/hide no results
    document.querySelector('.no-results1').classList.toggle('show', !hasVisible);
    
    if (hasVisible) {
      initCarousel();
    }
    
    // Reset auto-rotate
    resetAutoRotate();
  }
  
  // Set up category button click handlers
  document.querySelectorAll('.category-btn1').forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove .active from all and set on clicked
      document.querySelectorAll('.category-btn1').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const category = this.dataset.category;
      filterInstruments(category);
    });
  });
  
  // View Details button
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId;
      // You can implement your view details logic here
      console.log(`View details for product ${productId}`);
      // window.location.href = `/product/${productId}`;
    });
  });
  
  // Auto-rotate functionality
  function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(nextInstrument, 5000);
  }
  
  function resetAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    startAutoRotate();
  }
  
  // Initialize carousel on page load
  document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    startAutoRotate();
    
    // Pause auto-rotate on hover
    document.querySelector('.cards-container-wrapper').addEventListener('mouseenter', () => {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
    });
    
    document.querySelector('.cards-container-wrapper').addEventListener('mouseleave', () => {
      startAutoRotate();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
      initCarousel();
    });
  });
  
  // Optional: Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
      nextInstrument();
    } else if (e.key === 'ArrowLeft') {
      prevInstrument();
    }
  });

  

// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN
// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN// INSTRUMENT WITH DETAILED CAROUSEL DESIGN

// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN
// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Intersection Observer with delay
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all animated elements
    const elementsToAnimate = [
      '.header', 
      '.image-description', 
      '.video-section', 
      '.learn-more'
    ];
    
    elementsToAnimate.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
      });
    });
    
    // Smooth scroll for arrow click
    document.querySelector('.arrow-down').addEventListener('click', () => {
      const ctaSection = document.querySelector('.cta-section');
      ctaSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    });
  });

// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN
// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN// INSTRUCTOR SECTION DESIGN


// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN
// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.instrument-carousel');
    const cards = document.querySelectorAll('.instrument-card4:not(.cloned)');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    let currentIndex = 0;
    let autoSlideInterval;
    let isAnimating = false;
    const cardWidth = cards[0].offsetWidth + 15; // width + gap
    const visibleCards = Math.floor(carousel.parentElement.offsetWidth / cardWidth);
    
    // Initialize carousel position
    carousel.style.transform = `translateX(0)`;
    
    function updateCarousel(instant = false) {
      if (instant) {
        carousel.style.transition = 'none';
      } else {
        carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
        isAnimating = true;
        setTimeout(() => { isAnimating = false; }, 600);
      }
      carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }
    
    function nextSlide() {
      if (isAnimating) return;
      
      currentIndex++;
      updateCarousel();
      
      // When reaching the cloned items, instantly reset to beginning
      if (currentIndex >= cards.length) {
        setTimeout(() => {
          currentIndex = 0;
          updateCarousel(true);
          // Force reflow to make the transition none take effect
          void carousel.offsetWidth;
        }, 600); // Matches the transition duration
      }
    }
    
    function prevSlide() {
      if (isAnimating) return;
      
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      } else {
        // Jump to the end (visual only)
        currentIndex = cards.length;
        updateCarousel(true);
        void carousel.offsetWidth;
        
        setTimeout(() => {
          currentIndex = cards.length - 1;
          updateCarousel();
        }, 10);
      }
    }
    
    // Auto-slide every 3 seconds
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        if (!document.hidden) { // Only slide if tab is active
          nextSlide();
        }
      }, 3000);
    }
    
    // Pause auto-slide on hover
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    // Resume auto-slide when mouse leaves
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Pause when tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(autoSlideInterval);
      } else {
        startAutoSlide();
      }
    });
    
    // Manual navigation
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoSlideInterval);
      nextSlide();
      startAutoSlide();
    });
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearInterval(autoSlideInterval);
      prevSlide();
      startAutoSlide();
    });
    
    // Start the auto-slide
    startAutoSlide();
    
    // Handle responsive adjustments
    window.addEventListener('resize', function() {
      updateCarousel(true);
      void carousel.offsetWidth; // Force reflow
    });
  });

// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN
// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN// SLIDING CAROUSEL DESIGN


// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL
// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.testimonials-container');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');
  
  // Only initialize if we have testimonials and navigation
  if (cards.length > 0 && prevBtn && nextBtn && dotsContainer) {
    // Create dots
    const totalSlides = Math.ceil(cards.length / getVisibleCards());
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.slider-dot');
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + 30;
    let visibleCards = getVisibleCards();

    function getVisibleCards() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function updateSlider() {
      visibleCards = getVisibleCards();
      cardWidth = cards[0].offsetWidth + 30;
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex >= Math.ceil(cards.length / visibleCards) - 1;
      updateDots();
    }

    function goToSlide(index) {
      currentIndex = index;
      container.scrollTo({
        left: index * (cardWidth * visibleCards + 30), // Added gap calculation
        behavior: 'smooth'
      });
      updateSlider();
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function nextSlide() {
      if (currentIndex < Math.ceil(cards.length / visibleCards) - 1) {
        currentIndex++;
        goToSlide(currentIndex);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        goToSlide(currentIndex);
      }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    window.addEventListener('resize', function() {
      updateSlider();
      goToSlide(currentIndex);
    });

    updateSlider();
  }
});

  // create Testimonial
document.addEventListener("DOMContentLoaded", () => {
    const addTestimonialmodal = document.getElementById("Create-Testimonial-Modal");
    const closeBtn = addTestimonialmodal.querySelector(".close-btn1");
    const addTestimonialmodalFormContainer = document.getElementById("Create-Testimonial-modal-form-container");
    const addTestimonialLinks = document.querySelectorAll(".create-Testimonial");

    // Handle clicking on the edit link
    addTestimonialLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Load the form dynamically via fetch
            fetch(`/admin_testimonial/create/`)
                .then((response) => response.text())
                .then((data) => {
                    addTestimonialmodalFormContainer.innerHTML = data;
                    addTestimonialmodal.classList.add("show"); // Show the modal
                })
                .catch((error) => {
                    addTestimonialmodalFormContainer.innerHTML = "<h2>Error loading form</h2>";
                    console.error("Error:", error);
                });
        });
    });

    // Close modal using the close button
    closeBtn.addEventListener("click", () => {
        addTestimonialmodal.classList.remove("show"); // Close the modal
    });
});
// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL
// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL// TESTIMONIAL