uniform float time;
uniform vec3 color;

varying vec2 vUv;

void main() {
   gl_FragColor.rgba = vec4(vec3(vUv.x, vUv.y, sin(time * 0.5)), 1.0);
}
