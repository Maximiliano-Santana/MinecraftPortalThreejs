
uniform float uTime;
//uniform sampler2D uTexture;

varying vec2 vUv;
uniform float uResolution;


void main (){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    //projectedPosition =  vec4(position, 1.0);
    
    gl_Position = projectedPosition;

    //Varyings
    vUv = uv;
}
