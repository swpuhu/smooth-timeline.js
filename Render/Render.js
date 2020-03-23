class Renderer {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor (canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;

        this.gl = canvas.getContext('webgl');
        let points = new Float32Array([
            0.0, 0.0,
            this.width, 0.0,
            this.width, this.height,
            this.width, this.height,
            0.0, this.height,
            0.0, 0.0
        ]);

        let texCoords = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 0.0
        ]);
        let pointsBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, pointsBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);

        let texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

        this.programs = {
            normal: new NormalProgram(this.gl, pointsBuffer, texCoordBuffer)
        }

        this.originTexture = util.createTexture(this.gl);
    }

    render (video) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, video);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}