var vertexShader =`
attribute vec3 vertexPos;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main(void)
{
    gl_Position = worldMatrix * vec4(vertexPos, 1.0);
    gl_Position = viewMatrix * gl_Position;
    gl_Position = projectionMatrix * gl_Position;

    
    // = projectionMatrix * viewMatrix * worldMatrix * vec4(vertexPos, 1.0);
}
`

var fragmentShader =`
precision mediump float;

void main(void)
{
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`

var vs1 =`
attribute vec2 coordinates;
void main(void) {
    gl_Position = vec4(coordinates,0.0, 1.0);
}
`

var fs1=`
void main(void) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
}
`