class Timeline {
    constructor({ Video, Audio, CG }) {
        this.currentClips = [];
        this.videoTracks = [];
        this.audioTracks = [];
        this.cgTracks = [];
        this.initPerFrameWidth = 20;
        this.zoom = 20;
        this.perFrameWidth = this.initPerFrameWidth / this.zoom;
        this.allTime = 0;
        this.frameRate = 25;
        for (let i = 0; i < Video; i++) {
            this.videoTracks.push(new VideoTrack(this));
        }
        for (let i = 0; i < Audio; i++) {
            this.audioTracks.push(new AudioTrack(this));
        }
        for (let i = 0; i < CG; i++) {
            this.cgTracks.push(new CGTrack(this));
        }
        this.ref = this._render();
    }

    _render() {
        let { root } = util.generateDOM({

            tagName: 'div',
            classList: ['timeline-container'],
            children: [
                {
                    tagName: 'div',
                    classList: ['container'],
                    children: [
                        ...this.cgTracks.map(item => { return { component: item } }),
                        ...this.videoTracks.map(item => { return { component: item } }),
                        ...this.audioTracks.map(item => { return { component: item } }),

                    ]
                },
                {
                    tagName: 'button',
                    classList: ['zoom-add'],
                    text: '+',
                    events: {
                        'click': () => {
                            this.zoom += 5;
                            this.changeZoom();
                        }
                    }
                },
                {
                    tagName: 'button',
                    classList: ['zoom-minus'],
                    text: '-',
                    events: {
                        'click': () => {
                            this.zoom -= 5;
                            this.changeZoom();
                        }
                    }
                }
            ]
        });
        return root;
    }

    get allTracks() {
        return [...this.videoTracks, ...this.audioTracks, ...this.cgTracks];
    }

    changeZoom () {
        this.perFrameWidth = this.initPerFrameWidth / this.zoom;
        this.allTracks.forEach(track => {
            track.clips.forEach(clip => {
                clip.update();
            })
        });
    }

    addTrack(type) {

    }

    removeTrack(index) {

    }

    groupClips(clips) {

    }

    ungroupClips(clips) {

    }
}

class Track {
    constructor(timeline) {
        this.timeline = timeline;
        this.clips = [];
        this.ref;
    }

    addClip(clip) {
        this.clips.push(clip);
    }

    removeClip(index) {

    }
}

class VideoTrack extends Track {
    constructor() {
        super(...arguments);
        this.ref = this._render();
        this.video = document.createElement('video');
    }

    /**
     * 
     * @param {VideoClip} clip 
     */
    addClip(clip) {
        super.addClip(clip);
        this.ref.appendChild(clip.ref);
    }

    _render() {
        let { root } = util.generateDOM({
            tagName: 'div',
            classList: ['video-track', 'timeline-track'],
            children: []
        });

        root.ondragover = (e) => {
            return false;
        };
        root.ondrop = (e) => {
            e.preventDefault();
            console.log(e.dataTransfer.files);
            let file = e.dataTransfer.files[0];
            if (file) {
                let url = URL.createObjectURL(file);
                this.video.onloadedmetadata = (e) => {
                    URL.revokeObjectURL(url);
                    let time = this.video.duration;
                    let frame = this.video.duration * this.timeline.frameRate;
                    let clip = new VideoClip({
                        left: 0,
                        start: 0,
                        duration: frame,
                        end: frame,
                        totalDuration: frame,
                        track: this
                    });
                    this.addClip(clip);
                }
                this.video.src = url;

            }
        }
        return root;
    }
}

class AudioTrack extends Track {
    constructor() {
        super(...arguments);
        this.ref = this._render();
    }

    _render() {
        let { root } = util.generateDOM({
            tagName: 'div',
            classList: ['audio-track', 'timeline-track'],
            children: []
        });
        return root;
    }
}

class CGTrack extends Track {
    constructor() {
        super(...arguments);
        this.ref = this._render();
    }

    _render() {
        let { root } = util.generateDOM({
            tagName: 'div',
            classList: ['cg-track', 'timeline-track'],
            children: []
        });
        return root;
    }
}

class Clip {
    constructor({ left = 0, start = 0, end, duration, totalDuration, track }) {
        this.left = left;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.totalDuration = totalDuration;
        this.track = track;
        this.ref;
    }

    update() {
        this.ref.style.left = this.left * this.track.timeline.perFrameWidth + 'px';
        this.ref.style.width = this.duration * this.track.timeline.perFrameWidth + 'px';
    }

}

class VideoClip extends Clip {
    constructor({ left, start, end, duration, totalDuration, isMute, track }) {
        super({ left, start, end, duration, totalDuration, track });
        this.isMute = isMute;
        this.ref = this._render();
    }
    get playbackRate() {
        return (this.end - this.start) / this.duration;
    }

    _render() {
        let { root } = util.generateDOM({
            tagName: 'div',
            classList: ['clip'],
            styles: {
                left: this.left * this.track.timeline.perFrameWidth + 'px',
                width: this.duration * this.track.timeline.perFrameWidth + 'px'
            }
        });
        return root;
    }
}

class AudioClip extends Clip {
    constructor(left, start, end, duration, totalDuration, isMute, channel) {
        super(...arguments);
        this.channel = channel;
        this.isMute = isMute;
    }
}

class CGClip extends Clip {
    constructor(left, start, end, duration, totalDuration) {
        super(...arguments)
    }
}


