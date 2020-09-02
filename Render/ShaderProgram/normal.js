

class NormalProgram {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLBuffer} pointsBuffer
     * @param {WebGLBuffer} texCoordBuffer
     */
    constructor(gl, pointsBuffer, texCoordBuffer) {
        const vertexShader = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    uniform int u_disableY;
    uniform mat4 u_projection;
    void main () {
        if (u_disableY == 1) {
            gl_Position = u_projection * a_position;    
        } else {
            gl_Position = u_projection * a_position * vec4(1.0, -1.0, 1.0, 1.0);
        }
        v_texCoord = a_texCoord;
    }
`

        const fragmentShader = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    uniform mat4 m;
    void main () {
        float l, r, t, b;
        l = 0.1;
        r = 0.8;
        t = 0.1;
        b = 0.8;
        vec2 pos = v_texCoord;
        float angle = 0.2;
        float cos = cos(angle);
        float sin = sin(angle);
        float x = v_texCoord.x;
        float y = v_texCoord.y;
        // pos.x = x * cos - y * sin;
        // pos.y = x * sin + y * cos;
        pos = (m * gl_FragCoord).xy / vec2(640., 360.);
        if (pos.x < l || pos.x > 1. || pos.y < 0. || pos.y > 1.) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            // gl_FragColor = texture2D(u_texture, pos);
        } else {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
        
        
    }
`
        this.gl = gl;
        this.program = util.initWebGL(gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
        this.attribSetter = util.createAttributeSetters(this.gl, this.program);
        this.uniformSetter = util.createUniformSetters(this.gl, this.program);
        this.attributes = {
            a_position: {
                buffer: pointsBuffer,
                numComponents: 2,
                stride: 2 * Float32Array.BYTES_PER_ELEMENT,
                offset: 0
            },
            a_texCoord: {
                buffer: texCoordBuffer,
                numComponents: 2,
                stride: 2 * Float32Array.BYTES_PER_ELEMENT,
                offset: 0
            }
        }
        let angle = 30 / 180 * Math.PI;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        this.uniforms = {
            u_disableY: 0,
            u_projection: util.createProjection(this.gl.canvas.width, this.gl.canvas.height, 1),
            m: util.createRotateMatrix({x: 320, y: 180}, 10, 'z')
        }
        util.setAttributes(this.attribSetter, this.attributes);
        util.setUniforms(this.uniformSetter, this.uniforms);

        
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    enableFlipY () {
        this.uniforms.u_disableY = 1;
        util.setUniforms(this.uniformSetter, this.uniforms);
    }

    disableFlipY () {
        this.uniforms.u_disableY = 0;
        util.setUniforms(this.uniformSetter, this.uniforms);
    }
}