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
            this.videoTracks.push(new VideoTrack());
        }
        for (let i = 0; i < Audio; i++) {
            this.audioTracks.push(new AudioTrack());
        }
        for (let i = 0; i < CG; i++) {
            this.cgTracks.push(new CGTrack());
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
    constructor() {

    }

    addClip() {

    }

    removeClip(index) {

    }
}

class VideoTrack extends Track {
    constructor() {
        super();
        this.ref = this._render();
    }

    _render() {
        let { root } = util.generateDOM({
            tagName: 'div',
            classList: ['video-track', 'timeline-track'],
            children: []
        });
        return root;
    }
}

class AudioTrack extends Track {
    constructor() {
        super();
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
        super();
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
    constructor() {

    }
}

class VideoClip extends Clip {

}

class AudioClip extends Clip {

}

class CGClip extends Clip {

}