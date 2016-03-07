var debug = false;

function log(o){
    if (debug){
        console.log(o);
    }
}

function Position(){
    Position.prototype.x;
    Position.prototype.y;
    Position.prototype.z;
}

var KeyCode = {
    _0: 48,
    _1: 49,
    _2: 50,
    _3: 51,
    _4: 52,
    _5: 53,
    _6: 54,
    _7: 55,
    _8: 56,
    _9: 57,
    A : 65,
    B : 66,
    C : 67,
    D : 68,
    E : 69,
    F : 70,
    G : 71,
    H : 72,
    I : 73,
    J : 74,
    K : 75,
    L : 76,
    M : 77,
    N : 78,
    O : 79,
    P : 80,
    Q : 81,
    R : 82,
    S : 83,
    T : 84,
    U : 85,
    V : 86,
    W : 87,
    X : 88,
    Y : 89,
    Z : 90,
}

function Input(){
    // We are using a buffered keyboard so we need 2 keyboards
    Input.prototype.currentKeyboard;
    Input.prototype.lastKeyboard;
    
    Input.prototype.Init = function(){
        this.currentKeyboard = this.CreateKeyboard();
        this.lastKeyboard = this.CreateKeyboard();
        
        this.keyboardState = this.CreateKeyboard();
        
        document.addEventListener('keydown', this.KeyDown.bind(this));
        document.addEventListener('keyup', this.KeyUp.bind(this));
    }
    
    Input.prototype.CreateKeyboard = function(){
        var keyboard = {};
        
        // Create a keyboard with all values set to 0
        // We have an 8 byte address space for the keyboard
        for(var i = 0; i < 256; i++){
            keyboard[i] = false;
        }
        
        return keyboard;
    }
    
    // This return what the current state of the keybard is
    Input.prototype.GetKeyboardState = function() {
        return this.keyboardState;
    }
    
    Input.prototype.KeyDown = function(event){
        this.keyboardState[event.keyCode] = true;
    }
    
    Input.prototype.KeyUp = function(event){
        this.keyboardState[event.keyCode] = false;
    }
    
    Input.prototype.Update = function(){
        // To have the ability to check if a key has just been pressed
        // or released we need to keep track of past keyboard state
        this.lastKeyboard = this.currentKeyboard;
        this.currentKeyboard = this.GetKeyboardState();
    }
    
    // This should fire as long as the user is holding the key
    Input.prototype.IsKeyDown = function(key){
        return this.currentKeyboard[key];
    }
    
    // This should only fire once untill the user releases the key
    // and presses it again
    Input.prototype.IsKeyPressed = function(key){
        return (this.currentKeyboard[key] && ~this.lastKeyboard[key]);
    }
    
    // This shoudl only fire once until the user pressed the key again
    // and releases it
    Input.prototype.IsKeyReleased = function(key){
        return (~this.currentKeyboard[key] && this.lastKeyboard[key]);
    }
}

function Behavior(){
    Behavior.prototype.OnCreate = function(){
    }
    
    Behavior.prototype.Update = function(){
    }
}

function Entity(){
    
}

