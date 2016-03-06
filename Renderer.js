function Position(){
    Position.prototype.x;
    Position.prototype.y;
    Position.prototype.z;
}

function Renderable(){
    Renderable.prototype.program;
    Renderable.prototype.vertexBuffer;
    Renderable.prototype.numfaces;
    Renderable.prototype.position;
    
    Renderable.prototype.GetPosition = function(){
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
    
    Camera.prototype.SetPosition = function(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.Update();
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
        this.camera = new Camera();
        this.camera.Init(this.canvas.width, this.canvas.height);
        this.camera.SetPosition(0,0,-5);
        
        this.renderables.push(this.CreateRenderable([1, 0, 0], vertices, vertexShader, fragmentShader));
        //this.renderables.push(this.CreateRenderable([0, 0, 0], t2, vs1, fs1));
    }
    
    Renderer.prototype.CreateRenderable = function(position, verts, vertexShaderCode, fragmentShaderCode) {
        r = new Renderable();
        
        r.vertexBuffer = this.CreateBuffer(verts);
        r.program = this.CreateShaderProgram(vertexShaderCode, fragmentShaderCode);
        r.numFaces = 3;
        
        p = new Position();
        p.x = position[0];
        p.y = position[1];
        p.z = position[2];
        
        r.position = p;
        
        return r;
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
                str += k.tsetMatrixUniformsextContent;
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
    
    Renderer.prototype.SetClearColor = function(color){
        this.clearColor = color;
    }
    
    Renderer.prototype.SetMatricies = function(camera, shader){
        var gl = this.glContext;
        
        gl.uniformMatrix4fv(shader.mMatrixUniform, false, camera.world);
        gl.uniformMatrix4fv(shader.pMatrixUniform, false, camera.projection);
        
    }

    Renderer.prototype.Render = function (camera, renderables) {
        var gl = this.glContext;

        this.Begin();
        
        for (var i = 0; i < renderables.length; i++)
        {
            this.Draw(camera, renderables[i]);
        }
        

        this.End();
    }
    
    Renderer.prototype.Draw = function(camera, object){
        var gl = this.glContext;
        // Use the combined shader program object
        gl.useProgram(object.program);

        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
        
        var pos = gl.getAttribLocation(object.program, "vertexPos");
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(pos);
        
        console.log(object.GetPosition());
        
        console.log(camera.projection);
        console.log(camera.world);
        
        var pos = gl.getUniformLocation(object.program, "worldMatrix");
        gl.uniformMatrix4fv(pos, false, object.GetPosition());
        
        var proj = gl.getUniformLocation(object.program, "projectionMatrix");
        gl.uniformMatrix4fv(proj, false, camera.projection);
        
        var world = gl.getUniformLocation(object.program, "viewMatrix");
        gl.uniformMatrix4fv(world, false, camera.world);

        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, object.numFaces);
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
        this.camera.SetPosition(0,0,-5);
        
        this.renderables.push(this.renderer.CreateRenderable([1, 0, 0], vertices, vertexShader, fragmentShader));
    }

    RenderApp.prototype.Run = function(){
        this.renderer.Render(this.camera, this.renderables);
        console.log(this.renderables);
    }
}

function RunGL() {
    app = new RenderApp();
    app.Init();
    app.Run();
}

