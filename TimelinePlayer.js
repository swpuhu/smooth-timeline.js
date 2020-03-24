class TimelinePlayer {
    constructor(timeline) {
        let maxEnd = 0;
        this.timeline = timeline;
        this.tracks = timeline.map(item => {
            let track = new Stream(item.clips, item.type);
            if (track.end > maxEnd) {
                maxEnd = track.end;
            }
            return track;
        });
        this.end = maxEnd;
        this.countTime = this.countTime.bind(this);
        this._play = this._play.bind(this);
        this.currentTime = 0;
        this._currentTime = 0;
        this.prevDate;
        this.playTimer = null;
        this.pointer;
        this.perSecondWidth = 10;
        this.isFirst = true;
        this.isPlaying = false;
        let canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        document.body.appendChild(canvas);
        // this._visualizeTimeline(document.body);
        this.renderer = new Renderer(canvas);
    }

    get currentMedias() {

    }

    get currentTime () {
        return this._currentTime;
    }

    set currentTime (value) {
        this._currentTime = value;
        if (this.pointer) {
            this.pointer.style.left = value * this.perSecondWidth + 'px';
        }
    }

    play() {
        let promises = [];
        this.tracks.forEach(track => {
            promises.push(track.playReady())
        });
        this.isPlaying = true;
        Promise.all(promises)
            .then(() => {
                this._play();
            })
    }

    _play() {
        this.playTimer = requestAnimationFrame(this._play);
        if (this.currentTime > this.end) {
            this.pause();
        }
        let date = Date.now();
        if (this.isFirst) {
            this.prevDate = date;
        }
        this.currentTime += (date - this.prevDate) / 1000;
        console.log(this.currentTime);
        
        let videos = [];
        this.tracks.forEach(track => {
            track._play(this.currentTime);
            if (track.type === 'Video') {
                videos.push(...track.currentMedias);
            }
        });
        this.renderer.render(videos)
        this.prevDate = date;
        this.isFirst = false;
    }

    countTime() {
        requestAnimationFrame(this.countTime);
        let date = Date.now();
        if (!this.prevDate) {
            this.prevDate = data;
        }
        this.currentTime += (date - this.prevDate) / 1000;
    }

    pause() {
        this.isFirst = true;
        cancelAnimationFrame(this.playTimer);
        this.tracks.forEach(track => track.pause());
        this.isPlaying = false;
    }

    seek(time) {
        this.currentTime = time;
        let seekPromises = [];
        let videos = [];
        this.tracks.forEach(track => {
            videos.push(...track.currentMedias);
            seekPromises.push(track.seek(time));
        });
        Promise.race(seekPromises).then(() => {
            this.renderer.render(videos);
        })
    }

    _visualizeTimeline (container) {
        let that = this;
        let wrapper = document.createElement('div');
        wrapper.classList.add('timeline-container');
        this.pointer = document.createElement('div');
        this.pointer.classList.add('timeline-pointer');

        this.pointer.addEventListener('mousedown', function (e) {
            let currentTime = that.currentTime;
            let scrollLeft = wrapper.scrollLeft;
            let move = function (ev) {
                let offsetX = ev.clientX - e.clientX + wrapper.scrollLeft - scrollLeft;
                let _currentTime = currentTime + offsetX / that.perSecondWidth;
                that.seek(_currentTime);
            }

            let up = function () {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        })

        wrapper.appendChild(this.pointer);
        this.timeline.forEach(track => {
            let trackDom = document.createElement('div');
            trackDom.classList.add('timeline-track');
            wrapper.appendChild(trackDom);
            track.clips.forEach(clip => {
                let clipDom = document.createElement('div');
                clipDom.style.cssText = `
                    left: ${clip.left * this.perSecondWidth}px;
                    width: ${(clip.end - clip.start) * this.perSecondWidth}px
                `
                // clipDom.style.cssText = `left: 20px`
                clipDom.classList.add('timeline-clip');
                trackDom.appendChild(clipDom);
            });
        });
        container.appendChild(wrapper);
    }
}

