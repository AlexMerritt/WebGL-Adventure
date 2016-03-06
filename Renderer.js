


function Renderer() {
    // You will see a lot of var gl = this.glContext
    // This is because I don't want to type this.glContext all over the place
    // also gl should only be treated as read only. If you want to modify the 
    // gl context use this.glContext

    Renderer.prototype.glContext = null;
    Renderer.prototype.canvas = null;
    Renderer.prototype.vertexBuffer = null;
    Renderer.prototype.shaderProgram = null;

    Renderer.prototype.Init = function () {
        this.canvas = document.getElementById("window");

        // Different brwosers use different web gl contexts so I need to check several
        this.glContext = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl") || this.canvas.getContext("moz-webgl") || this.canvas.getContext("webkit-3d");

        if (this.glContext) {
            this.InitWebGL();
            this.LoadScene();
        }
        else {
            console.log("Your Browser does not support web gl");
        }
    }

    Renderer.prototype.InitWebGL = function() {
        var gl = this.glContext;

        // For fun output the supported extensions
        var extensions = gl.getSupportedExtensions();

        // Set the viewport
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);
    }

    Renderer.prototype.LoadScene = function () {
        this.vertexBuffer = this.CreateBuffer(verts);
        this.shaderProgram = this.CreateShaderProgram(vs1, fs1);

        //this.GetShaderCode("vertexShader");
    }

    Renderer.prototype.CreateBuffer = function(verts) {
        var gl = this.glContext;

        var vertexBuffer = gl.createBuffer();

        // Bind the buffer so we can write to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

        // Unbind the buffer since we are finished
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vertexBuffer;
    }

    Renderer.prototype.GetShaderCode = function(id) {
        var shaderScript = document.getElementById(id);

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        console.log(str);

        return str;
    }

    Renderer.prototype.CreateShaderProgram = function(vertexCode, fragmentCode){
        var gl = this.glContext;

        // First create the vertex and fragment shaders
        var vertShader = this.CreateVertexShader(vertexCode);
        var fragShader = this.CreateFragmentShader(fragmentCode);

        // Create the program
        var shaderProgram = gl.createProgram();

        // Attach and link the vertex and fragment shaders
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);

        gl.linkProgram(shaderProgram);

        return shaderProgram;
    }

    Renderer.prototype.CreateVertexShader = function(shaderCode) {
        return this.CreateShader(shaderCode, this.glContext.VERTEX_SHADER);
    }

    Renderer.prototype.CreateFragmentShader = function (shaderCode) {
        return this.CreateShader(shaderCode, this.glContext.FRAGMENT_SHADER);
    }

    Renderer.prototype.CreateShader = function (code, type) {
        var gl = this.glContext;

        // Type is either going to be a vertex shader or a fragment shader
        var shader = gl.createShader(type);

        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    Renderer.prototype.Render = function () {
        var gl = this.glContext;

        this.Begin();

        // Use the combined shader program object
        gl.useProgram(this.shaderProgram);

        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        //Get the attribute location
        var coord = gl.getAttribLocation(this.shaderProgram, "coordinates");

        //point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

        //Enable the attribute
        gl.enableVertexAttribArray(coord);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        this.End();
    }

    Renderer.prototype.Begin = function(){
        // Clear the canvas
        this.glContext.clearColor(0.5, 0.5, 0.5, 0.9);

        // Clear the color buffer bit
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    }

    Renderer.prototype.End = function () {

    }
}



function RunGL() {
    renderer = new Renderer();
    
    renderer.Init();
    renderer.Render();
}