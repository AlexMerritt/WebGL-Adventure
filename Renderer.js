﻿function Position(){
    Position.prototype.x;
    Position.prototype.y;
    Position.prototype.z;
}

function Buffer(){
    Renderable.prototype.data;
    Renderable.prototype.numElements;
    Renderable.prototype.elementSize;
}

function Renderable(){
    Renderable.prototype.program;
    Renderable.prototype.vertexBuffer;
    Renderable.prototype.colorBuffer;
    Renderable.prototype.numfaces;
    Renderable.prototype.position;
    
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
    
    Camera.prototype.Init = function(width, height){
        this.world = mat4.create();
        
        this.projection = mat4.create();
        mat4.perspective(45, width / height, 0.1, 100.0, this.projection);
    }
    
    Camera.prototype.GetPosition = function(){
        return [this.x, this.y, this.z];
    }
    
    Camera.prototype.SetPosition = function(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.Update();
    }
    
    Camera.prototype.Move = function(x,y,z){
        this.x += x;
        this.y += y;
        this.z += z;
    }
    
    Camera.prototype.Update = function(){
        mat4.identity(this.world);
        mat4.translate(this.world, [this.x, this.y, this.z]);
    }
}

function Renderer() {
    // You will see a lot of var gl = this.glContext
    // This is because I don't want to type this.glContext all over the place
    // also gl should only be treated as read only. If you want to modify the 
    // gl context use this.glContext

    Renderer.prototype.glContext = null;
    Renderer.prototype.canvas = null;
    Renderer.prototype.vertexBuffer = null;
    Renderer.prototype.shaderProgram = null;
    Renderer.prototype.clearColor = null;
    Renderer.prototype.renderables = null;
    Renderer.prototype.camera = null;

    Renderer.prototype.Init = function () {
        this.canvas = document.getElementById("window");

        // Different brwosers use different web gl contexts so I need to check several
        this.glContext = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl") || this.canvas.getContext("moz-webgl") || this.canvas.getContext("webkit-3d");
        
        this.SetClearColor([0.0, 0.0, 0.0, 1.0]);
        this.renderables = [];

        // Initialize the WebGl context if we got the context from the browser
        if (this.glContext) {
            this.InitWebGL();
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
    
    Renderer.prototype.CreateRenderable = function(position, verts, vertexShaderCode, fragmentShaderCode) {
        r = new Renderable();
        
        // Create the vertex buffer and set it's attributes
        vb = new Buffer();
        vb.data = this.CreateBuffer(verts);
        vb.numElements = 3;
        vb.elementSize = 2;
        
        r.vertexBuffer = vb;
        
        // Create the color buffer and set it's attributes
        cb = new Buffer();
        cb.data = this.CreateBuffer(colors);
        cb.numElements = 3;
        cb.elementSize = 4;
        
        r.colorBuffer = cb;
        
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

    Renderer.prototype.CreateBuffer = function(data) {
        var gl = this.glContext;

        var buffer = gl.createBuffer();

        // Bind the buffer so we can write to it
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        // Unbind the buffer since we are finished
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return buffer;
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

        //Bind vertex buffer object and set the vertex on the shader
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer.data);
        
        var pos = gl.getAttribLocation(object.program, "vertexPos");
        gl.vertexAttribPointer(pos, object.vertexBuffer.elementSize, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(pos);
        
        // Bind and declare the color vertex on the shader
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer.data);
        
        var color = gl.getAttribLocation(object.program, "inColor");
        gl.vertexAttribPointer(color, object.colorBuffer.elementSize, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(color);
        
        // Set the object's position on the shader
        var pos = gl.getUniformLocation(object.program, "worldMatrix");
        gl.uniformMatrix4fv(pos, false, object.GetWorldMatrix());
        
        // Set the camera's view on the shader
        var proj = gl.getUniformLocation(object.program, "projectionMatrix");
        gl.uniformMatrix4fv(proj, false, camera.projection);
        
        // Set the camera's project on the shader
        var world = gl.getUniformLocation(object.program, "viewMatrix");
        gl.uniformMatrix4fv(world, false, camera.world);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, object.vertexBuffer.numElements);
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

function empty(){}

function RenderApp() {
    RenderApp.prototype.renderables = null;
    RenderApp.prototype.renderer = null;
    RenderApp.prototype.camera = null;

    RenderApp.prototype.Init = function(){
        this.renderer = new Renderer();
        this.renderer.Init();
        
        this.LoadApp();
    }

    RenderApp.prototype.LoadApp = function(){
        canvas = document.getElementById("window");
        this.renderables = [];
        
        this.camera = new Camera();
        this.camera.Init(canvas.width, canvas.height);
        this.camera.SetPosition(0.0,0.0,-5.0);
        
        this.renderables.push(this.renderer.CreateRenderable([-2, 0, 0], vertices, vertexShader, fragmentShader));
    }

    RenderApp.prototype.Run = function(){
        // Start this crazy update loop
        this.Frame(performance.now());
    }
    
    
    
    RenderApp.prototype.Frame = function(deltaTime){
        var now = performance.now();
        
        // Calculate the delta time since last frame
        var deltaTime = now - last;
        
        // The first couple frams have large deltas.
        // so I just skip them
        // I need to figure out a better way to do this
        if (deltaTime > 10.0){
            deltaTime = 0;
        }
        
        this.Update(deltaTime);
        this.Render(deltaTime);
        
        // This makes this loop continusly 
        requestAnimationFrame(this.Frame.bind(this));
    }
    
    RenderApp.prototype.Update = function(deltaTime){
        // Just scrolling the camera
        this.camera.Move(0.01 * deltaTime, 0.0, 0.0);
        this.camera.Update();
    }
    
    RenderApp.prototype.Render = function(deltaTime){
        this.renderer.Render(deltaTime, this.camera, this.renderables);
    }
}

function RunGL() {
    app = new RenderApp();
    app.Init();
    app.Run();
}

