
uniform sampler2D uParticle;

varying float vRandomParticle;
varying vec3 vColors;


void main (){
    float multiplier = vRandomParticle;
    float particleRatio = 1.0/8.0;
    
    vec2 uv = vec2(mix(particleRatio*multiplier, (multiplier*particleRatio)+particleRatio, gl_PointCoord.x), gl_PointCoord.y);
    

    vec4 texture = texture2D(uParticle, uv);

    // Final color 

    vec4 color = vec4(texture.x*vColors.r, texture.y*vColors.g, texture.z*vColors.b, texture.w);

    gl_FragColor = vec4(color);

    // vec4 colorMuestreado = texture2D(uParticle, vUv)
    // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x,1.0);
}