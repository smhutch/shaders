uniform float time;
uniform float modulo;
uniform vec3 color;

varying vec2 vUv;

void main() {
   vec2 center = vec2(0.5);
   vec2 pos = mod(vUv * modulo, 1.0);

   float d = distance(pos, center);
   float mask = step(1.0 * max(cos(time + vUv.x + vUv.y), 0.25), d);

   mask = 1.0 - mask;

   vec3 fragColor = mix(color, vec3(1.0), mask);

   gl_FragColor.rgba = mix(vec4(vec3(fragColor), 1.0), vec4(color, 1.0), vUv.x * vUv.y);
}
