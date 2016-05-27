var sphereVertSh = `
attribute float displacement;
uniform float amplitude;
varying vec3 vNormal;

void main()
{
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
    //vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * vec3(displacement * amplitude),1.0);
}
`;

var sphereFragSh = `
uniform sampler2D texture1;
        
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    vec3 color = vec3(1.0, 0.0, 1.0);
    vec3 light = normalize(vec3(0.5, 0.2, 1.0));
    
    color = color * max(0.01, dot(light, vNormal));
    
    gl_FragColor = vec4(color,1.0);
}
`;

var SphereScene = (function () {    
    function SphereScene() {
        this.name = "Basic Light Scene";
    }
    
    SphereScene.prototype.init = function(renderWindow) {
        
        this.scene = new THREE.Scene();
        this.camera = CreateCamera(renderWindow);
        
        var geometry = new THREE.SphereBufferGeometry(200, 32,32);
        
        var vertCount = geometry.attributes.position.count;        
        
        var displacement = new Float32Array(vertCount);
        
        
        for(var i = 0; i < vertCount; i++){
            displacement[i] = Math.random() * 30;
        }
        
        geometry.addAttribute('displacement', new THREE.BufferAttribute(displacement, 1));
        
        this.uniforms = {
            amplitude: {type:'f', value: 2.0}
        };
        
        this.mesh = CreateMesh(geometry, sphereVertSh, sphereFragSh, this.uniforms);
        
        this.scene.add(this.mesh);
    };
    
    SphereScene.prototype.addGUI = function(gui){
        this.gui = {
            amplitude: 2.0
        }
        
	    gui.add(this.gui, "amplitude", 0, 10).name( "amplitude" ).onChange(function(){
            this.uniforms.amplitude.value =  this.gui.amplitude;  
        }.bind(this));
    };
    
    SphereScene.prototype.destroy = function () {
    };
    
    SphereScene.prototype.update = function () {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02; 
    };
    
    SphereScene.prototype.render = function (renderer) {
        renderer.setClearColor(0x0c0c0c, 1 );
        renderer.render(this.scene, this.camera);
    };
    
    return SphereScene;
})();