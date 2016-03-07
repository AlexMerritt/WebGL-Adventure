function Position(){
    Position.prototype.x;
    Position.prototype.y;
    Position.prototype.z;
}

function RenderApp() {
    RenderApp.prototype.input = null;
    RenderApp.prototype.renderer = null;
    RenderApp.prototype.camera = null;
    
    RenderApp.prototype.renderables = null;

    RenderApp.prototype.Init = function(){
        this.input = new Input();
        this.input.Init();
        
        this.renderer = new Renderer();
        this.renderer.Init();
        
        this.LoadApp();
    }

    RenderApp.prototype.LoadApp = function(){
        canvas = document.getElementById("window");
        this.renderables = [];
        
        this.camera = new Camera();
        this.camera.Init(canvas.width, canvas.height);
        this.camera.SetPosition(0.0,0.0,-15.0);
        
        this.CreateRenderable([0, 0, 0], vertices, colors, vertexShader, fragmentShader);
        this.CreateRenderable([0,-3,0], floor, fcolors, vertexShader, fragmentShader);
    }
    
    RenderApp.prototype.CreateRenderable = function(position, v, c, vs, fs){
        this.renderables.push(this.renderer.CreateRenderable(position, v, c, vs, fs));
    }

    RenderApp.prototype.Run = function(){
        // Start this crazy update loop
        this.Frame(performance.now());
    }
    
    
    
    RenderApp.prototype.Frame = function(time){
        var now = performance.now();
        
        // Calculate the delta time since last frame
        var deltaTime = now - time;
        
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
        this.input.Update();
        
        var movementSpeed = 0.1;
        var dir = [0,0];
        var move = [0,0];
        
        if (this.input.IsKeyDown(KeyCode.A)){
            dir[0] = 1;
        }
        else if(this.input.IsKeyDown(KeyCode.D)){
            dir[0] = -1;
        }
        
        if(this.input.IsKeyDown(KeyCode.W)){
            dir[1] = -1;
        }
        else if(this.input.IsKeyDown(KeyCode.S)){
            dir[1] = 1;
        }
        
        move = [movementSpeed * dir[0] * deltaTime, movementSpeed * dir[1] * deltaTime];        
        
        if (move[0] > 0.0 || move[0] < 0.0 || move[1] > 0.0 || move[1] < 0.0){
            this.camera.Move(move[0], move[1], 0.0);
            this.camera.Update();
        }
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

