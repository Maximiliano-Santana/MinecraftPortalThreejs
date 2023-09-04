attribute float aRandomParticle;
attribute vec3 aColors;

uniform float uPixelRatio;
uniform float uTime;
uniform float uSize;
uniform sampler2D uParticle;

varying float vRandomParticle;
varying vec3 vColors;

void main (){
    vec4 vertexPosition = modelMatrix * vec4(position, 1.0);
    float t = uTime*0.25;
    t += distance(vertexPosition.z, 0.0);

    //Animation
    vertexPosition.z = -(t - floor((t+1.0)))*2.0;

    //Cone shape
    vertexPosition.x += (vertexPosition.x*pow(vertexPosition.z, 2.0)*0.05);
    vertexPosition.y += pow(vertexPosition.z*0.5, 2.0);

    // vertexPosition.z += vertexPosition.z;

    vec4 viewPosition = viewMatrix * vertexPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;
 

    gl_Position = projectedPosition;

    //PointSizes
    float maxSize = 5.0;
    float minSize = 0.01;
    gl_PointSize = uSize/pow(distance(vertexPosition.z+0.9, 0.0), 1.5);
    // gl_PointSize = uSize/distance(vertexPosition.z+0.9, 0.0);
    // gl_PointSize = uSize/clamp(distance(vertexPosition.z+0.5, 0.0), 0.5, 1000.0);
    
    //perspective
    gl_PointSize *= (1.0/ -viewPosition.z);

    gl_PointSize *= uPixelRatio;

    //varyings
    vRandomParticle = aRandomParticle;
    vColors = aColors;
}

