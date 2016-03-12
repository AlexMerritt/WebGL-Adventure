function Buffer(){
    Renderable.prototype.data;
    Renderable.prototype.numElements;
    Renderable.prototype.elementSize;
}

function Renderable(){
    Renderable.prototype.program;
    Renderable.prototype.vertexBuffer;
    Renderable.prototype.colorBuffer;
    Renderable.prototype.uvBuffer;
    Renderable.prototype.indexBuffer;
    Renderable.prototype.numfaces;
    Renderable.prototype.position;
    Renderable.prototype.texture;
    
    Renderable.prototype.GetWorldMatrix = function(){
        var mat = mat4.create();
        
        mat4.identity(mat);
        
        mat4.translate(mat, [this.position.x, this.position.y, this.position.z]);
        
        return mat;
    }
}

function Camera(){
    Camera.prototype.projection;
    Camera.prototype.world;
    Camera.prototype.x;
    Camera.prototype.y;
    Camera.prototype.z;
    Camera.prototype.position;
    Camera.prototype.rotation;
    
    Camera.prototype.Init = function (width, height) {
        this.position = new Position();
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;

        this.rotation = new Position();
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;

        this.world = mat4.create();
        
        this.projection = mat4.create();
        mat4.perspective(45, width / height, 0.1, 100.0, this.projection);
    }
    
    Camera.prototype.GetPosition = function(){
        return this.position;
    }
    
    Camera.prototype.SetPosition = function(x, y, z){
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        
        this.Update();
    }
    
    Camera.prototype.Move = function(x,y,z){
        this.position.x += x;
        this.position.y += y;
        this.position.z += z;
    }

    Camera.prototype.GetRotation = function () {
        return this.rotation;
    }

    Camera.prototype.Rotate = function (x, y, z) {
        this.rotation.x += x;
        this.rotation.y += y;
        this.rotation.z += z;
    }
    
    Camera.prototype.Update = function(){
        mat4.identity(this.world);

        mat4.rotate(this.world, this.rotation.y, [0, 1, 0]);
        mat4.translate(this.world, [this.position.x, this.position.y, this.position.z]);
    }
}

function CheckErr(gl) {
    var error = gl.getError();

    if (error != gl.NO_ERROR && error != gl.CONTEXT_LOST_WEBGL) {
        console.log(error);
    }
}

function Renderer() {
    // You will see a lot of var gl = this.glContext
    // This is because I don't want to type this.glContext all over the place
    // also gl should only be treated as read only. If you want to modify the 
    // gl context use this.glContext

    Renderer.prototype.glContext;
    Renderer.prototype.canvas;
    Renderer.prototype.clearColor;

    Renderer.prototype.Init = function () {
        this.canvas = document.getElementById("window");

        // Different brwosers use different web gl contexts so I need to check several
        this.glContext = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl") || this.canvas.getContext("moz-webgl") || this.canvas.getContext("webkit-3d");
        
        this.SetClearColor([0.0, 0.0, 0.0, 1.0]);    

        // Initialize the WebGl context if we got the context from the browser
        if (this.glContext) {
            this.InitWebGL();
        }
        else {
            alert("Your Browser does not support web gl");
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
    
    Renderer.prototype.CreateRenderable = function(position, v, c, uv, i, vertexShaderCode, fragmentShaderCode) {
        
        log(position)
        log(v)
        log(c)
        log(uv)
        log(i)
        log("vertex shader: " + vertexShaderCode);
        log("fragment shader: " + fragmentShaderCode);
        
        var numElements = v.length / 3;
        
        r = new Renderable();
        
        // Create the vertex buffer and set it's attributes
        vb = new Buffer();
        vb.data = this.CreateVB(v);
        vb.numElements = numElements;
        vb.elementSize = 3;
        
        r.vertexBuffer = vb;
        
        // Create the color buffer and set it's attributes
        cb = new Buffer();
        cb.data = this.CreateVB(c);
        cb.numElements = numElements;
        cb.elementSize = 4;
        
        r.colorBuffer = cb;
        
        uvB = new Buffer();
        uvB.data = this.CreateVB(uv);
        uvB.numElements = numElements;
        uvB.elementSize = 2;
        
        r.uvBuffer = uvB;
        
        ib = new Buffer();
        ib.data = this.CreateIB(i);
        ib.numElements = i.length;
        ib.elementSize = 1;
        
        r.indexBuffer = ib;
        
        // Create a shader program from a vertex and fragment shader code
        r.program = this.CreateShaderProgram(vertexShaderCode, fragmentShaderCode);
        
        // Create a point and set it's position
        p = new Position();
        p.x = position[0];
        p.y = position[1];
        p.z = position[2];
        
        r.position = p;
        
        return r;
    }

    Renderer.prototype.CreateVB = function(data) {
        var gl = this.glContext;

        var vb = gl.createBuffer();

        // Bind the buffer so we can write to it
        gl.bindBuffer(gl.ARRAY_BUFFER, vb);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        // Unbind the buffer since we are finished
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vb;
    }
    
    Renderer.prototype.CreateIB = function(data) {
        var gl = this.glContext;

        var ib = gl.createBuffer();

        // Bind the buffer so we can write to it
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

        // Unbind the buffer since we are finished
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return ib;
        
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
        
        // Set and shader code and compile it
        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        // Output a message if we had any problems creating the shader
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
        }

        return shader;
    }
    
    Renderer.prototype.CreateTexture = function(textureFile) {
        var gl = this.glContext;
        
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));
        
        // Asynchronously load an image
        var image = new Image();
        image.src = textureFile;
        image.addEventListener('load', function() {
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        });
        
       return texture;
    }
    
    Renderer.prototype.SetClearColor = function(color){
        this.clearColor = color;
    }

    Renderer.prototype.Render = function (deltaTime, camera, renderables) {
        var gl = this.glContext;

        this.Begin();
        
        // For each renderable draw it
        for (var i = 0; i < renderables.length; i++)
        {
            this.Draw(camera, renderables[i]);
        }
        

        this.End();
    }
    
    Renderer.prototype.Draw = function(camera, object){
        var gl = this.glContext;
        
        // Set the shader program we are going to use
        gl.useProgram(object.program);

        this.SetVertexAttributes(object);
        this.SetUniforms(object);
        
        this.SetCameraMats(object.program, camera);
        
        // Lastly bind the index buffer and draw the object
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer.data);
        gl.drawElements(gl.TRIANGLES, object.indexBuffer.numElements, gl.UNSIGNED_SHORT, 0);
    }
    
    Renderer.prototype.SetVertexAttributes = function (object) {
        var gl = this.glContext;
        //Bind vertex buffer object and set the vertex on the shader
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer.data);
        
        var pos = gl.getAttribLocation(object.program, "vertexPos");
        if(pos != -1){
            gl.vertexAttribPointer(pos, object.vertexBuffer.elementSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(pos);
        }
        
        // Bind and declare the color vertex on the shader
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer.data);
        
        var color = gl.getAttribLocation(object.program, "inColor");
        if(color != -1){
            gl.vertexAttribPointer(color, object.colorBuffer.elementSize, gl.FLOAT, false, 0, 0);
            
            gl.enableVertexAttribArray(color);
        }
        
        // Bind the uv buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, object.uvBuffer.data);
        
        var uvs = gl.getAttribLocation(object.program, "inUV");
        if (uvs != -1){
            gl.vertexAttribPointer(uvs, object.uvBuffer.elementSize, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(uvs);
        }       
    }
    
    Renderer.prototype.SetUniforms = function(object){
        var gl = this.glContext;
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, object.texture);
        var t = gl.getUniformLocation(object.program, "tex0");
        if(t != -1){
            gl.uniform1i(t, 0);
        }
        
        // Set the object's position on the shader
        var pos = gl.getUniformLocation(object.program, "worldMatrix");
        gl.uniformMatrix4fv(pos, false, object.GetWorldMatrix());
        
    }
    
    Renderer.prototype.SetCameraMats = function (program, camera) {
        var gl = this.glContext;
        // Set the camera's view on the shader
        var proj = gl.getUniformLocation(program, "projectionMatrix");
        gl.uniformMatrix4fv(proj, false, camera.projection);
        
        // Set the camera's project on the shader
        var world = gl.getUniformLocation(program, "viewMatrix");
        gl.uniformMatrix4fv(world, false, camera.world);
    }

    Renderer.prototype.Begin = function(){
        // Clear the canvas
        this.glContext.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);

        // Clear the color buffer bit
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
    }

    Renderer.prototype.End = function () {

    }
    
    
}

