function Position() {
    Position.prototype.x;
    Position.prototype.y;
    Position.prototype.z;
}

function RenderApp() {
    RenderApp.prototype.input;
    RenderApp.prototype.renderer;
    RenderApp.prototype.camera;
    
    RenderApp.prototype.renderables;

    // These are for rendering some values to a html element
    RenderApp.prototype.posElement;
    RenderApp.prototype.rotElement;

    RenderApp.prototype.Init = function(){
        this.input = new Input();
        this.input.Init();
        
        this.renderer = new Renderer();
        this.renderer.Init();

        this.posElement = document.getElementById("pos");
        this.rotElement = document.getElementById("rot");
        
        this.LoadApp();
    }

    RenderApp.prototype.LoadApp = function(){
        canvas = document.getElementById("window");

        this.renderables = [];
        
        this.camera = new Camera();
        this.camera.Init(canvas.width, canvas.height);
        this.camera.SetPosition(0.0,-2.0,-15.0);
        
        //this.CreateRenderable([0, 0, 0], triV, triC, triI, vertexShader, fragmentShader);
        //this.CreateRenderable([0,-3,0], floorV, floorC, floorI, vertexShader, fragmentShader);
        this.CreateRenderable([0, 0, 5.0], cubeV, cubeC, cudeUV, cubeI, "grad.png", vertexShader, fragmentShader);
    }
    
    RenderApp.prototype.CreateRenderable = function(position, v, c, uv, i, tex, vs, fs){
        var r = this.renderer.CreateRenderable(position, v, c, uv, i, vs, fs);
        r.texture = this.renderer.CreateTexture(tex);
        this.renderables.push(r);
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
        
        this.UpdateCamera(deltaTime);
    }
    
    RenderApp.prototype.Render = function(deltaTime){
        this.renderer.Render(deltaTime, this.camera, this.renderables);
    }

    RenderApp.prototype.UpdateCamera = function(deltaTime) {
        var movementSpeed = 0.1;
        var dir = [0, 0];
        var move = [0, 0];
        var rot = 0;
        var moveVector = [0, 0];
        
        var mv = vec3.create();

        if (this.input.IsKeyDown(KeyCode.W)) {
            dir[0] = 1;
        }
        else if (this.input.IsKeyDown(KeyCode.S)) {
            dir[0] = -1;
        }
        
        if (this.input.IsKeyDown(KeyCode.A)) {
            dir[1] = 1;
        }
        else if (this.input.IsKeyDown(KeyCode.D)) {
            dir[1] = -1;
        }
        
        var norm = dir[0] * dir[1];
        
        if (norm < 0)
            norm = -norm;
        
        if (norm != 0){
            dir[0] = dir[0] / norm;
            dir[1] = dir[1] / norm;
        }

        

        // Only try and rotate the camera if the mouse is clicked
        if (this.input.IsMouseDown()) {
            rot = this.input.GetMouseDelta()[0] / 20.0;

            if (rot > 0 || rot < 0) {
                this.camera.Rotate(0, rot * 0.1 * deltaTime, 0);
            }
        }

        //move = [movementSpeed * dir * deltaTime, movementSpeed * dir * deltaTime];

        if (dir[0] > 0.0 || dir[0] < 0.0 || dir[1] > 0.0 || dir[1] < 0.0) {
            //this.camera.Move(move[0], move[1], 0.0);
            var rotation = -this.camera.GetRotation().y;

            this.camera.Move(Math.sin(rotation) * dir[0] * deltaTime, 0, Math.cos(rotation) * dir[0] * deltaTime);
            this.camera.Move(Math.sin(rotation + Math.PI / 2.0) * dir[1] * deltaTime, 0, Math.cos(rotation + Math.PI / 2.0) * dir[1] * deltaTime);
        }



        this.camera.Update();

        var pos = this.camera.GetPosition();
        var rot = this.camera.GetRotation();

        this.posElement.innerHTML = "Position - X:" + pos.x + ", Y:" + pos.y + ", Z:" + pos.z;
        this.rotElement.innerHTML = "Rotation - X:" + rot.x + ", Y:" + rot.y + ", Z:" + rot.z;
    }
}

function RunGL() {
    app = new RenderApp();
    app.Init();
    app.Run();
}

