var vertexShader =`
attribute vec3 vertexPos;
attribute vec4 inColor;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vColor;

void main(void)
{
    gl_Position = worldMatrix * vec4(vertexPos, 1.0);
    gl_Position = viewMatrix * gl_Position;
    gl_Position = projectionMatrix * gl_Position;
    
    vColor = inColor;
}
`

var fragmentShader =`
precision mediump float;

varying vec4 vColor;

void main(void)
{
    gl_FragColor = vColor;// vec4(1.0, 1.0, 1.0, 1.0);
}
`