/**
 * @author Vinit Shahdeo <vinitshahdeo@gmail.com>
 */
(function ($) {
    "use strict";
      // Sakura plugin not loaded, skipping this animation
      // $('.sakura-falling').sakura();
})(jQuery);

/**
 *
 * Despite so many new Bollywood and English song options, I prefered to use two-decade-old song, Din Shagna Da!
 *
 * Ever attended a North Indian Wedding? As soon as the DJ plays Din Shagna Da song, it means that the much-awaited moment is here
 * and the bride is all set to put her first foot forward to the wedding venue under a breathtaking phoolon ki chaadar.
 * Let's keep the sky-high status of this song untouched!
 *
 * When the website is backed up with a soul-stirring track, the feeling becomes absolutely surreal. 
 * Choose a heart-touching track! 🎵 ❤️
 *
 * Listen here: https://youtu.be/X0MDALpV25s
 *
 */

// Welcome overlay logic

// Function to close initial popup and show welcome overlay
function closeInitialPopup() {
    var initialPopup = document.getElementById('initial-welcome-popup');
    var welcomeOverlay = document.getElementById('welcome-overlay');
    
    if (initialPopup) {
        initialPopup.style.display = 'none';
    }
    
    if (welcomeOverlay) {
        welcomeOverlay.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var overlay = document.getElementById('welcome-overlay');
    var enterBtn = document.getElementById('enter-btn');
    var guestNameInput = document.getElementById('guest-name');
    var welcomeForm = document.getElementById('welcome-form');
    var guestWelcomeMsg = document.getElementById('guest-welcome-message');
    var programsOverlay = document.getElementById('programs-overlay');
    var storyOverlay = document.getElementById('story-overlay');
    var proceedToProgramsBtn = document.getElementById('proceed-to-programs');
    
    // Welcome -> Story flow
    if (overlay && enterBtn && guestNameInput && welcomeForm && guestWelcomeMsg && storyOverlay) {
        enterBtn.addEventListener('click', function() {
            var name = guestNameInput.value.trim();
            if (name) {
                // Show personalized welcome message
                welcomeForm.style.display = 'none';
                guestWelcomeMsg.style.display = 'block';
                guestWelcomeMsg.classList.add('guest-welcome-animate');
                guestWelcomeMsg.innerHTML = '<h3>Welcome, <span style="color:#b48a78">' + name + '</span>!</h3><p>We are delighted to have you join us for the celebration.</p>';
                
                // Save guest name to localStorage for other pages
                localStorage.setItem('guestName', name);
                
                // Show story overlay after welcome
                setTimeout(function() {
                    overlay.style.display = 'none';
                    storyOverlay.style.display = 'flex';
                }, 2500);
            } else {
                guestNameInput.classList.add('input-error');
                guestNameInput.focus();
            }
        });
        guestNameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                enterBtn.click();
            }
        });
        // Prevent scrolling when overlay is visible
        document.body.classList.add('no-scroll');
    }
    
    // Story -> Programs flow
    if (proceedToProgramsBtn && storyOverlay && programsOverlay) {
        proceedToProgramsBtn.addEventListener('click', function() {
            storyOverlay.style.display = 'none';
            programsOverlay.style.display = 'flex';
        });
    }
});

$(document).on('click', function(){
    var audioElement = document.getElementById("my_audio");
    if (audioElement) {
        audioElement.play();
        console.log('Shaadi me zaroor aana');
    }
});

// Set the date we're counting down to
var countDownDate = new Date("April 25, 2026 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {
    // Check if time element exists
    var timeElement = document.getElementById("time");
    if (!timeElement) {
        clearInterval(x);
        return;
    }

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    timeElement.innerHTML = "<div class='container'><div class='days block'>"+ days + "<br>Days</div>" + "<div class='hours block'>" + hours + "<br>Hours</div>" + "<div class='minutes block'>" + minutes + "<br>Minutes</div>" + "<div class='seconds block'>" + seconds + "<br>Seconds</div></div>";
    
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        timeElement.innerHTML = "Bless the married couple for happy life!";
    }
}, 1000);

// being a bit cool :p  
var styles = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 4px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 2px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles1 = [
    'color: #FF6C37'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 40px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles2 = [
    'color: teal'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 40px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

console.log('\n\n%c SAVE THE DATE: 25th April, 2020!', styles);

console.log('%cYour presence is requested!%c\n\nRegards: Vinit Shahdeo', styles1, styles2);

console.log(
    `%cShaadi me zaroor aana!\n\n`,
    'color: yellow; background:tomato; font-size: 24pt; font-weight: bold',
)

// Gallery Slider Functionality
var currentSlide = 0;
var totalSlides = 6;

function updateGallery() {
    var slider = document.getElementById('gallerySlider');
    var dots = document.querySelectorAll('.gallery-dot');
    if (slider) {
        slider.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';
    }
    dots.forEach(function(dot, index) {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function moveGallery(direction) {
    currentSlide += direction;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    updateGallery();
}

function goToSlide(index) {
    currentSlide = index;
    updateGallery();
}

// Auto-advance gallery every 5 seconds
setInterval(function() {
    moveGallery(1);
}, 5000);

// Guest Book Wish Form
function addWish() {
    var nameInput = document.getElementById('wishName');
    var messageInput = document.getElementById('wishMessage');
    var name = nameInput ? nameInput.value.trim() : '';
    var message = messageInput ? messageInput.value.trim() : '';
    
    if (name && message) {
        alert('Thank you ' + name + ' for your lovely wishes! They mean the world to us.\n\nNote: This is a display-only feature. Your wishes will not be permanently saved on this page.');
        if (nameInput) nameInput.value = '';
        if (messageInput) messageInput.value = '';
    } else {
        alert('Please enter both your name and your wishes!');
    }
}
