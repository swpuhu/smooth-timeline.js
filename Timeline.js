class Timeline {
    constructor({ Video, Audio, CG }) {
        this.currentClips = [];
        this.videoTracks = [];
        this.audioTracks = [];
        this.cgTracks = [];
        this.perFrameWidth = 20;
        this.zoom = 1;
        this.allTime = 0;
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
                ...this.cgTracks.map(item => { return { component: item } }),
                ...this.videoTracks.map(item => { return { component: item } }),
                ...this.audioTracks.map(item => { return { component: item } }),
            ]
        });
        return root;
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
        console.log(timeline);
        this.clips = [];
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
    addClip (clip) {
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
                this.video.onloadedmetadata = function (e) {
                    URL.revokeObjectURL(url);
                    let time = e.timeStamp;
                    let clip = new Clip(0, 0, );
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
    constructor(left = 0, start = 0, end, duration, totalDuration) {
        this.left = left;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.totalDuration = totalDuration;
    }

    
}

class VideoClip extends Clip {
    constructor (left, start, end, duration, totalDuration, isMute) {
        super(...arguments);
        this.isMute = isMute;
    }
    get playbackRate () {
        return (this.end - this.start) / this.duration;
    }
}

class AudioClip extends Clip {
    constructor (left, start, end, duration, totalDuration, isMute, channel) {
        super(...arguments);
        this.channel = channel;
        this.isMute = isMute;
    }
}

class CGClip extends Clip {
    constructor (left, start, end, duration, totalDuration) {
        super(...arguments)
    }
}


