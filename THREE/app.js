dat.GUI.prototype.removeFolder = function(name) { this.__folders[name].close(); this.__folders[name].domElement.parentNode.parentNode.removeChild(this.__folders[name].domElement.parentNode); this.__folders[name] = undefined; this.onResize(); }

var ResolutionMode = {
    Small : 0,
    Medium : 1,
    Large : 2,
    Full: 3
}
var RenderWindow = (function () {
    function RenderWindow(resolutionMode) {
        var width = 0;
        var height = 0;
        
        if (resolutionMode === ResolutionMode.Small){
            width = 640;
            height = 480;
        }
        else if(resolutionMode === ResolutionMode.Medium){
            width = 1280;
            height = 720;
        }
        else if(resolutionMode === ResolutionMode.Large){
            width = 1920;
            height = 1080;
        }
        else if(resolutionMode == ResolutionMode.Full){
            width = window.innerWidth;
            height = window.innerHeight;
        }
        
        this.width = width;
        this.height = height;
    }
    RenderWindow.prototype.getAspectRatio = function () {
        return this.width / this.height;
    };
    return RenderWindow;
})();

var App = (function () {
    function App() {
        this.scenes = [];        
        this.gui;
        
        this.renderer = new THREE.WebGLRenderer();
        this.setRenderSize(ResolutionMode.Small);
        //document.body.appendChild(this.renderer.domElement);
        $('#renderer').append(this.renderer.domElement);
        
        this.scenes.push(new SphereScene());
        this.scenes.push(new BoxScene());
        this.scenes.push(new RenderTextureScene());
        this.scenes.push(new CubeMapScene());
        
        this.createGUI();
        
        this.activateScene(this.scenes[0]);
    }
    
    App.prototype.createGUI = function () {
        var scs = { };
        
        this.gui = new dat.GUI({autoPlace: false});
        $('#gui').append(this.gui.domElement);
        console.log(this.gui);
        
        this.sceneListCtrl = this.gui.addFolder("Scenes");
        console.log(this.scenes);
        for(i in this.scenes){
            var s = this.scenes[i];
            
            scs[s.name] = function (sceneId) {
                this.activateScene(this.scenes[sceneId]);
            }.bind(this, i);
            
            this.sceneListCtrl.add(scs, s.name);
        }
        
        // Open up the scene list so the user can see the list of available scenes
        this.sceneListCtrl.open();
        
        this.appCtrls = { 
            resolutionDropdown: "Small"
        };
        
        this.appCtrlFldr = this.gui.addFolder("App Controls");
        this.appCtrlFldr.add(this.appCtrls, "resolutionDropdown", [
           "Small",
           "Medium",
           "Large",
           "Full" 
        ]).name("resolutionDropdown").onChange(function() {
            var modeText = this.appCtrls.resolutionDropdown;
            var mode;
            if(modeText === "Small"){
               mode = ResolutionMode.Small; 
            }
            else if(modeText === "Medium"){
                mode = ResolutionMode.Medium;
            }
            else if(modeText === "Large"){
                mode = ResolutionMode.Large;
            }
            else if(modeText === "Full"){
                mode = ResolutionMode.Full;
            }
            
            this.setRenderSize(mode);
            
        }.bind(this));
        
        this.appCtrlFldr.open();
        
        this.sceneControls = this.gui.addFolder('Scene Controls');
    }
    
    App.prototype.activateScene = function (scene) {
        this.deactivateScene();
        console.log(scene);

        this.currentScene = scene;
        this.currentScene.init(this.renderWindow);
        this.currentScene.addGUI(this.sceneControls);
        
        // Open up the scene controls so the user can see what is goign on
        this.sceneControls.open();
    }
    
    App.prototype.deactivateScene = function () {
        this.gui.removeFolder('Scene Controls');
        this.sceneControls = this.gui.addFolder('Scene Controls');
        
        if(this.currentScene){
            this.currentScene.destroy();
        }
    }
    
    App.prototype.start = function () {
        this.update(performance.now());
    };
    
    App.prototype.update = function (time) {
        
        var now = performance.now();
        
        // Calculate the delta time since last frame
        var deltaTime = now - time;
        if(deltaTime > 2.0){
            deltaTime = 0.01;
        }
        
        this.currentScene.update(deltaTime);
        
        this.currentScene.render(this.renderer);
        
        requestAnimationFrame(this.update.bind(this));
    };
    
   
    App.prototype.setRenderSize = function (resolutionMode) {
        this.renderWindow = new RenderWindow(resolutionMode);
        this.renderer.setSize(this.renderWindow.width, this.renderWindow.height);
        console.log(this.renderWindow);
    };
    
    return App;
})();

window.onload = function () {
    var app = new App();
    app.start();
};
