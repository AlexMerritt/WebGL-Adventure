var vertexShader =`
attribute vec3 vertexPos;

uniform mat4 uMVMatrix;
uniform mat4 uPVMatrix;

void main(void)
{
    gl_Position = uPVMatrix * uMVMatrix * vec4(vertexPos, 1.0);
}
`

var fragmentShader =`
precision mediump float;

void main(void)
{
    gl_FragColor = vec4(1.0f, 1.0f, 1.0f, 1.0f);
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