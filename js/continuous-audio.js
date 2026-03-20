/**
 * Continuous Audio Playback Across Pages
 * Song never stops between pages - only resets on full page refresh
 */

(function() {
    'use strict';
    
    var audio = document.getElementById('my_audio');
    var STORAGE_KEY = 'weddingAudioState';
    var SYNC_INTERVAL = 500; // Sync every 0.5 second for smooth continuity
    var isFirstVisit = !sessionStorage.getItem('weddingSessionStarted');
    
    // Mark session as started
    sessionStorage.setItem('weddingSessionStarted', 'true');
    
    // Get stored audio state
    function getStoredState() {
        var state = localStorage.getItem(STORAGE_KEY);
        return state ? JSON.parse(state) : null;
    }
    
    // Save current audio state to localStorage
    function saveState() {
        if (!audio) return;
        
        var state = {
            currentTime: audio.currentTime,
            isPlaying: !audio.paused,
            volume: audio.volume,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    
    // Force play audio - more aggressive approach
    function forcePlay() {
        if (!audio) return;
        
        // Set volume to ensure it's audible
        audio.volume = 0.5;
        
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(function(error) {
                console.log('Autoplay prevented, trying aggressive methods');
                
                // Method 1: Try immediately on any user interaction
                document.addEventListener('click', function clickHandler() {
                    audio.play().catch(function() {});
                    document.removeEventListener('click', clickHandler);
                }, { once: true });
                
                // Method 2: Try on mouse movement
                document.addEventListener('mousemove', function mouseMoveHandler() {
                    audio.play().catch(function() {});
                    document.removeEventListener('mousemove', mouseMoveHandler);
                }, { once: true });
                
                // Method 3: Try on scroll
                document.addEventListener('scroll', function scrollHandler() {
                    audio.play().catch(function() {});
                    document.removeEventListener('scroll', scrollHandler);
                }, { once: true });
                
                // Method 4: Try on key press
                document.addEventListener('keydown', function keyHandler() {
                    audio.play().catch(function() {});
                    document.removeEventListener('keydown', keyHandler);
                }, { once: true });
                
                // Method 5: Try again after a delay
                setTimeout(function() {
                    audio.play().catch(function() {});
                }, 1000);
                
                // Method 6: Try with user gesture simulation
                setTimeout(function() {
                    var event = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    document.body.dispatchEvent(event);
                }, 500);
            });
        }
    }
    
    // Restore and continue audio
    function restoreAndContinue() {
        if (!audio) return;
        
        var state = getStoredState();
        
        if (state && !isFirstVisit) {
            // Coming from another page - resume from where it left
            audio.currentTime = state.currentTime || 0;
            if (state.volume !== undefined) {
                audio.volume = state.volume;
            }
            
            // Always play when coming from another page
            forcePlay();
        } else {
            // First visit or refresh - start fresh
            audio.currentTime = 0;
            audio.volume = 0.5;
            
            // Try to autoplay immediately on first visit
            console.log('First visit - attempting immediate autoplay');
            
            // Try multiple methods for first visit
            setTimeout(function() {
                audio.play().then(function() {
                    console.log('Autoplay successful on first visit!');
                }).catch(function(error) {
                    console.log('Autoplay failed, will try on user interaction');
                    forcePlay();
                });
            }, 100);
            
            // Also try immediately
            audio.play().catch(function() {});
            
            // And try again after page loads
            setTimeout(function() {
                audio.play().catch(function() {});
            }, 500);
            
            setTimeout(function() {
                audio.play().catch(function() {});
            }, 1000);
        }
    }
    
    // Continuous tracking - save state frequently
    function startContinuousTracking() {
        setInterval(function() {
            if (audio) {
                saveState();
            }
        }, SYNC_INTERVAL);
    }
    
    // Prevent audio from pausing
    function preventPausing() {
        if (!audio) return;
        
        // If audio gets paused (not by user), resume it
        audio.addEventListener('pause', function(e) {
            // Small delay to check if it's an intentional pause
            setTimeout(function() {
                var state = getStoredState();
                // If we were playing before, resume
                if (state && state.isPlaying && audio.paused) {
                    forcePlay();
                }
            }, 100);
        });
    }
    
    // Sync with other pages/tabs
    function syncAcrossPages() {
        window.addEventListener('storage', function(event) {
            if (event.key === STORAGE_KEY && audio) {
                var state = JSON.parse(event.newValue);
                if (!state) return;
                
                // Sync time if drift is more than 1 second
                if (state.currentTime && Math.abs(audio.currentTime - state.currentTime) > 1) {
                    audio.currentTime = state.currentTime;
                }
                
                // Resume if playing elsewhere
                if (state.isPlaying && audio.paused) {
                    forcePlay();
                }
            }
        });
    }
    
    // Initialize on page load
    function init() {
        if (!audio) {
            console.log('No audio element found');
            return;
        }
        
        // Ensure audio is set to loop
        audio.loop = true;
        audio.volume = 0.5; // Default volume
        
        // Restore and continue playing
        restoreAndContinue();
        
        // Start continuous tracking
        startContinuousTracking();
        preventPausing();
        syncAcrossPages();
        
        // Save state when leaving
        window.addEventListener('beforeunload', function() {
            saveState();
        });
        
        // Also save on visibility change
        document.addEventListener('visibilitychange', function() {
            saveState();
            if (document.visibilityState === 'visible' && audio && audio.paused) {
                // Resume when tab becomes visible
                forcePlay();
            }
        });
        
        console.log('Continuous audio initialized - song will never stop between pages');
    }
    
    // Start immediately when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also try to init immediately in case DOM is already loaded
    setTimeout(init, 0);
})();
