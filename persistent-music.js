(function() {
    var MUSIC_SRC = 'music.mp3';
    var MUSIC_START = 755;
    var MUSIC_VOLUME = 0.25;
    var KEY_TIME = 'bgMusicTime';
    var KEY_PLAYING = 'bgMusicPlaying';

    var audio = document.createElement('audio');
    audio.id = 'bgMusicPersistent';
    audio.src = MUSIC_SRC;
    audio.preload = 'auto';
    audio.style.display = 'none';
    document.body.appendChild(audio);

    var isPlaying = localStorage.getItem(KEY_PLAYING) === 'true';
    var savedTime = parseFloat(localStorage.getItem(KEY_TIME));

    if (isPlaying && !isNaN(savedTime)) {
        audio.currentTime = savedTime;
        audio.volume = MUSIC_VOLUME;
        audio.play().catch(function() {});
        updateToggleBtn(true);
    }

    setInterval(function() {
        if (!audio.paused) {
            localStorage.setItem(KEY_TIME, String(audio.currentTime));
        }
    }, 500);

    window.addEventListener('beforeunload', function() {
        if (!audio.paused) {
            localStorage.setItem(KEY_TIME, String(audio.currentTime));
            localStorage.setItem(KEY_PLAYING, 'true');
        }
    });

    window.startBgMusic = function() {
        if (!audio.paused) return;
        if (isNaN(savedTime) || !isPlaying) {
            audio.currentTime = MUSIC_START;
        }
        audio.volume = 0;
        audio.play().then(function() {
            localStorage.setItem(KEY_PLAYING, 'true');
            updateToggleBtn(true);
            var vol = 0;
            var fadeIn = setInterval(function() {
                vol += 0.02;
                if (vol >= MUSIC_VOLUME) { vol = MUSIC_VOLUME; clearInterval(fadeIn); }
                audio.volume = vol;
            }, 50);
        }).catch(function() {});
    };

    window.stopPersistentMusic = function() {
        var vol = audio.volume;
        var fadeOut = setInterval(function() {
            vol -= 0.03;
            if (vol <= 0) {
                vol = 0;
                clearInterval(fadeOut);
                audio.pause();
                localStorage.setItem(KEY_PLAYING, 'false');
                updateToggleBtn(false);
            }
            audio.volume = Math.max(0, vol);
        }, 30);
    };

    window.toggleBgMusic = function() {
        if (audio.paused) {
            var t = parseFloat(localStorage.getItem(KEY_TIME));
            if (!isNaN(t)) audio.currentTime = t;
            else audio.currentTime = MUSIC_START;
            audio.volume = MUSIC_VOLUME;
            audio.play().then(function() {
                localStorage.setItem(KEY_PLAYING, 'true');
                updateToggleBtn(true);
            }).catch(function() {});
        } else {
            audio.pause();
            localStorage.setItem(KEY_PLAYING, 'false');
            updateToggleBtn(false);
        }
    };

    function updateToggleBtn(playing) {
        var btn = document.getElementById('musicToggle');
        if (!btn) return;
        btn.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
        btn.title = playing ? 'Pausar música' : 'Reproducir música';
    }

    audio.addEventListener('play', function() { updateToggleBtn(true); });
    audio.addEventListener('pause', function() { updateToggleBtn(false); });
})();
