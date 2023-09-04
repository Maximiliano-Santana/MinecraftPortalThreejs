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

    //Animation
    float x = uTime*0.5;
    // vertexPosition.z -= uTime*0.2;
    vertexPosition.z -= x - floor((x+vertexPosition.z)+1.0) + 1.0;


    // vertexPosition.z = 0.0y;

    //Cone shape
    vertexPosition.x += (vertexPosition.x*pow(vertexPosition.z, 2.0)*0.05);
    vertexPosition.y += pow(vertexPosition.z*0.5, 2.0);

    vec4 viewPosition = viewMatrix * vertexPosition;

    vec4 projectedPosition = projectionMatrix * viewPosition;
 

    gl_Position = projectedPosition;

    //PointSizes
    gl_PointSize = uSize/clamp(vertexPosition.z, 0.6, 5.0);
    
    //perspective
    gl_PointSize *= (1.0/ -viewPosition.z);

    gl_PointSize *= uPixelRatio;

    //varyings
    vRandomParticle = aRandomParticle;
    vColors = aColors;
}

