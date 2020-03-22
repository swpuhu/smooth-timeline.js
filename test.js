
const test = [
    [
        {
            left: 0,
            start: 0,
            end: 2,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 5,
            start: 5,
            end: 18,
            src: 'http://localhost:9000/assets/jiangye1.mp4'
        },
        {
            left: 18,
            start: 0,
            end: 2,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 20,
            start: 5,
            end: 8,
            src: 'http://localhost:9000/assets/ad2.mp4'
        },
        {
            left: 25,
            start: 5,
            end: 7,
            src: 'http://localhost:9000/assets/ad1.mp4'
        },
        {
            left: 27,
            start: 60,
            end: 90,
            src: 'http://localhost:9000/assets/jiangye2.mp4'
        }
    ]
]

let timeline = new Timeline(test);