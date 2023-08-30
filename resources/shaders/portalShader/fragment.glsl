#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))
#define pmod(p,x) (mod(p,x)-0.5*(x))

varying vec2 vUv;

uniform float uTime;
uniform float uResolution;

float rand(float a){
    return fract(sin(a*3.0)*944.33)-0.5;
}

vec4 render(){

    //Se obtienen las uv normalizadas en 0, 0 y el tiempo
    vec2 uv = (vUv.xy-0.5);
    float t = floor(uTime*30.0)/30.0;

    //uv se modifica a floor para que sea pixeleado
    uv = floor(uv*60.0)/60.0;
    //Se agrega un offset 
    uv.y+=1.0;

    //Se define un color base
    vec3 purple = vec3(0.271,0.004,0.710);
    vec3 col = purple; 
    
    //col+=sin(th*3.0)*0.5+0.5;
    //col*=purple;
    vec2 uv2 = uv + 1.0;
    vec2 uv3 = uv;
    
    uv*=10.0;
    uv = pmod(uv,4.0);
    uv*=rot(t*3.5);
    uv*=rot(-length(uv*5.0));
    
    col+=purple*smoothstep(uv.y-0.1,uv.y+0.4,0.1)*0.5 * step(length(uv),5.5) 
    * pow(clamp((2.5-length(uv)),0.0,1.0),6.0) ;

    col+=0.45*smoothstep(uv.y-0.1,uv.y+0.1,-0.5)*0.9 * step(length(uv),5.5) 
    * max(0.0,(1.4-length(uv))) ;
    uv = uv2;
    
    uv*=10.0;
    uv = pmod(uv,4.0);
    uv*=rot(-t*3.5);
    uv*=rot(length(uv*5.0));
    
    col+=purple*smoothstep(uv.y-0.1,uv.y+0.4,0.1)*0.5 * step(length(uv),5.5) 
    * pow(clamp((2.5-length(uv)),0.0,1.0),6.0) ;
    
    
    col+=0.45*smoothstep(uv.y-0.1,uv.y+0.1,-0.5)*0.9 * step(length(uv),5.5) 
    * max(0.0,(1.4-length(uv))) ;
    
    
    col*=step(abs(uv3.x),0.365);
    col*=1.0+rand(col.x)*0.1+rand(col.y)*0.05;
    
    return vec4(col, 1.0);
}
void main ( ){
vec4 col = vec4(0);

float scale = 1.0/5.0;

col =render()*scale;
col+=render()*scale;
col+=render()*scale;
col+=render()*scale;
col+=render()*scale;

//Controlo el alpha del shader
col.w = 0.5;

gl_FragColor = vec4(col);
}



// uniform float uTime;

// varying vec2 vUv;

// void main (){
    

//     float strength = length(vUv.xy-0.5);
//     //strength = pow(strength, 1.5);

//     gl_FragColor = vec4(strength, strength, strength, 1.0);
// }