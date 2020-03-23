class Renderer {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor (canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.canvas = canvas;

        this.gl = canvas.getContext('webgl', {
            premultipliedAlpha: false
        });
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
            normal: new NormalProgram(this.gl, pointsBuffer, texCoordBuffer),
            blend: new BlendProgram(this.gl, pointsBuffer, texCoordBuffer)
        }

        this.originTexture = util.createTexture(this.gl);
    }

    blendLayer (resultTextures) {
        if (!resultTextures.length) return;
        let count = 0;
        if (resultTextures.length === 1) {
            this.gl.useProgram(this.programs.normal.program);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, resultTextures[0]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.programs.normal.enableFlipY();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        } else if (resultTextures.length === 2) {
            this.gl.useProgram(this.programs.blend.program);;
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, resultTextures[0]);

            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, resultTextures[1]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
        } else if (resultTextures.length >= 3) {
            // gl.useProgram(filters.blendFilter.program);
            // let texturesCopy = resultTextures.slice();
            // let count = 0;
            // gl.activeTexture(gl.TEXTURE0);
            // gl.bindTexture(gl.TEXTURE_2D, resultTextures[0]);
            // gl.activeTexture(gl.TEXTURE1);
            // gl.bindTexture(gl.TEXTURE_2D, resultTextures[1]);
            // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[count]);
            // filters.blendFilter.setType(filters.blendFilter.BLENDTYPE.reallyNormal);
            // gl.clear(gl.COLOR_BUFFER_BIT);
            // gl.drawArrays(gl.TRIANGLES, 0, 6);
            // gl.activeTexture(gl.TEXTURE0);
            // gl.bindTexture(gl.TEXTURE_2D, textures[count]);
            // count++;
            // texturesCopy.shift();
            // texturesCopy.shift();

            // for (let i = 0; i < texturesCopy.length; i++) {
            //     gl.activeTexture(gl.TEXTURE1);
            //     gl.bindTexture(gl.TEXTURE_2D, texturesCopy[i]);
            //     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[count % 2]);
            //     gl.clear(gl.COLOR_BUFFER_BIT);
            //     filters.blendFilter.setType(filters.blendFilter.BLENDTYPE.reallyNormal);
            //     gl.drawArrays(gl.TRIANGLES, 0, 6);
            //     gl.activeTexture(gl.TEXTURE0);
            //     gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);
            //     count++;
            // }
        }
    }

    render (videos) {
        let textures = [];
        let framebuffers = [];
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        util.createFramebufferTexture(this.gl, videos.length, framebuffers, textures, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.useProgram(this.programs.normal.program);

        this.programs.normal.disableFlipY();
        this.gl.activeTexture(this.gl.TEXTURE0);
        for (let i = 0; i < videos.length; i++) {
            let texture = util.createTexture(this.gl);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, videos[i]);
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffers[i]);
            this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
            this.gl.deleteTexture(texture);
        }
        // textures = textures.reverse();
        this.blendLayer(textures);
        for (let i = 0; i < textures.length; i++) {
            this.gl.deleteTexture(textures[i]);
            this.gl.deleteFramebuffer(framebuffers[i]);
        }
    }
}