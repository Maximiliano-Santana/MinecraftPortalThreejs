attribute float aRandomParticle;
attribute vec3 aColors;

uniform float uPixelRatio;
uniform float uTime;
uniform float uSize;
uniform sampler2D uParticle;

varying float vRandomParticle;
varying vec3 vColors;

void main (){
    vec3 vertexPosition = position;

    float t = uTime*0.1;
    t += distance(vertexPosition.z, 0.0);

    //Animation
    vertexPosition.z = -(t - floor((t+1.0)))*3.0;

    //Cone shape
    vertexPosition.x += (vertexPosition.x*pow(vertexPosition.z, 2.0)*0.1);
    vertexPosition.y += pow(vertexPosition.z*0.5, 1.5);

    //Size 
    float particleSize = 2.0/clamp(distance(vertexPosition, vec3(0.0)), 1.5, 100.0);


    vec4 modelPosition = modelMatrix * vec4(vertexPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;
 
    gl_Position = projectedPosition;

    //PointSizes
    gl_PointSize = uSize*particleSize;

    
    //perspective
    gl_PointSize *= (1.0/ -viewPosition.z);
    gl_PointSize *= uPixelRatio;

    //varyings
    vRandomParticle = aRandomParticle;
    vColors = aColors;
}