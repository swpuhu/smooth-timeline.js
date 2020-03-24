

class BlendProgram {
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
    uniform sampler2D u_texture1;
    uniform sampler2D u_texture2;
    void main () {
        vec4 color1 = texture2D(u_texture1, v_texCoord);
        vec4 color2 = texture2D(u_texture2, v_texCoord);
        if (v_texCoord.x < 0.5) {
            gl_FragColor = color1;
        } else {
            gl_FragColor = color2;
        }
        // gl_FragColor = vec4(color2.rgb * color2.a + color1.rgb * (1.0 - color2.a), color1.a + color2.a);
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

        this.uniforms = {
            u_disableY: 1,
            u_projection: util.createProjection(this.gl.canvas.width, this.gl.canvas.height, 1),
        }
        let u_texture1 = this.gl.getUniformLocation(this.program, 'u_texture1');
        let u_texture2 = this.gl.getUniformLocation(this.program, 'u_texture2');

        gl.uniform1i(u_texture1, 0);
        gl.uniform1i(u_texture1, 1);
        util.setAttributes(this.attribSetter, this.attributes);
        util.setUniforms(this.uniformSetter, this.uniforms);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

}