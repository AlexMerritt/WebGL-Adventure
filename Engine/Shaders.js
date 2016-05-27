var vertexShader =`
attribute vec3 vertexPos;
attribute vec4 inColor;
attribute vec2 inUV;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vTexCoords;
varying vec4 vColor;

void main(void)
{
    gl_Position = worldMatrix * vec4(vertexPos.x, -vertexPos.y, vertexPos.z, 1.0);
    gl_Position = viewMatrix * gl_Position;
    gl_Position = projectionMatrix * gl_Position;
    
    vTexCoords = inUV;
    vColor = inColor;
}
`

var fragmentShader =`
precision mediump float;

varying vec2 vTexCoords;
varying vec4 vColor;

uniform sampler2D tex0;

void main(void)
{
    gl_FragColor = texture2D(tex0, vec2(vTexCoords.x, vTexCoords.y));
    //gl_FragColor = vec4(vTexCoords.x, vTexCoords.y, 0.0, 1.0) + vColor;
    //gl_FragColor = vColor;// vec4(1.0, 1.0, 1.0, 1.0);
}
`