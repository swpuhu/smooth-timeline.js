class Timeline {
    constructor(timeline) {
        let maxEnd = 0;
        this.timeline = timeline;
        this.tracks = timeline.map(item => {
            let track = new Track(item);
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
        let canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 360;
        document.body.appendChild(canvas);
        this._visualizeTimeline(document.body);
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
        if (!this.prevDate) {
            this.prevDate = date;
        }
        this.currentTime += (date - this.prevDate) / 1000;
        let videos = [];
        this.tracks.forEach(track => {
            track._play(this.currentTime)
            videos.push(...track.currentMedias);
        });
        this.renderer.render(videos[0])
        this.prevDate = date;
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
        cancelAnimationFrame(this.playTimer);
        this.tracks.forEach(track => track.pause());
    }

    seek(time) {
        this.currentTime = time;
        this.tracks.forEach(track => track.seek(time));
    }

    _visualizeTimeline (container) {
        let wrapper = document.createElement('div');
        wrapper.classList.add('timeline-container');
        this.pointer = document.createElement('div');
        this.pointer.classList.add('timeline-pointer');
        wrapper.appendChild(this.pointer);
        this.timeline.forEach(track => {
            let trackDom = document.createElement('div');
            trackDom.classList.add('timeline-track');
            wrapper.appendChild(trackDom);
            track.forEach(clip => {
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

