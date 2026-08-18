///////////////////////////////////////////////////////////////////////////////
// generative WebGL background
// a random shader with random tweak values is picked on every page load
// adapted from the OS13k desktop background
// click anywhere on the background to roll a new one

(() => {

'use strict';

///////////////////////////////////////////////////////////////////////////////
// shader library

const HEADER =
`
const float PI=3.141592653589793;
vec3 SmoothHSV(vec3 c) { vec3 rgb = clamp(abs(mod(c.x*6.+vec3(0,4,2),6.)-3.)-1.,0.,1.); return c.z * mix( vec3(1), rgb*rgb*(3.-2.*rgb), c.y); }
vec3 CosinePalette( float t, vec3 a, vec3 b, vec3 c, vec3 d ) { return a + b*cos( PI*2.*(c*t+d)); }
vec4 lengthA(vec4 a)      { return vec4(length(a)); }
vec4 asinA(vec4 a)        { return asin(clamp(a,-1.,1.)); }
vec4 acosA(vec4 a)        { return acos(clamp(a,-1.,1.)); }
vec4 logA(vec4 a)         { return log(abs(a)); }
vec4 log2A(vec4 a)        { return log2(abs(a)); }
vec4 sqrtA(vec4 a)        { return sqrt(abs(a)); }
vec4 inversesqrtA(vec4 a) { return inversesqrt(abs(a)); }
vec4 pow2(vec4 a)         { return a*a; }
vec4 pow3(vec4 a)         { return a*a*a; }
float audio_freq( in float f) { return .5; }
float audio_ampl( in float t) { return .5; }
`;

const SHADERS =
[
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.xyxy/iResolution.xyxy;
    a.xywz *= vec2(-9.541, 10.513).xyxy;
    a.xywz += vec2(5.112, -3.633).xyxy;
    a.xywz += vec2(5.*iTweakA.z, 5.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+.1*iTweakA.x, 1.+.5*iTweakA.y).xyxy;
    vec4 b = a;

    for (int i = 0; i < 2; ++i)
    {
    b.xzwy *= sin(b+iTime*.5).wzxz+1.*iTweakB.y;
    b.x += b.x*audio_freq(b.x*.1);
    b.yzxw *= abs(a+5.*iTweakB.w).zzwx;
    a.ywxz -= (b).xyww;
    b.zwxy -= sqrtA(b).yxwz;
    b.xwyz -= (a).wyxy;
    a.yzxw = atan(b).xxwx+1.*iTweakB.z;
    a.wxyz += log(vec4(0, 0, 0.055, 0.551)).zwxx;
    }

    a.x += 2.*PI*iTweakB.x;
    a.x = a.x * 0.077+0.135;
    a.y *= 0.526;
    a.xyz = SmoothHSV(a.xyz);
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.xyxy/iResolution.xyxy;
    a.xywz *= vec2(-10.033, -1.485).xyxy;
    a.xywz += vec2(5.0, -5.828).xyxy;
    a.xywz += vec2(10.*iTweakA.z, 10.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+.5*iTweakA.x, 1.+.1*iTweakA.y).xyxy;
    vec4 b = a;

    a.zwxy -= abs(a).xxzw;
    a.xwyz = (a).yxyw+9.*iTweakB.w;
    b.yxzw = (vec4(0, 2.754, 0, 0)).yzyx+9.*iTweakB.z;
    b.xzwy -= (vec4(2.045, 0, 0, 0)).wwxx;
    a.xywz /= asinA(vec4(-0.918, 0, 0, 5.274)).wxxx+iTweakB.y;
    b.wyxz -= ceil(a).zzzy;
    a.wyzx /= logA(b).yzyy;
    a.yxzw -= asinA(a).wzxy;
    a.wxyz += log2A(vec4(0, 0.169, 0, 0)).yyyw;
    b.xzwy = fract(a+iTime*.5).xwzz;

    a.x += 19.*iTweakB.x;
    a.x = a.x * 0.068+0.272;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.702, 0.859, 0.862),
     vec3(0.882, 0.409, 0.392),
     vec3(0.469, 0.666, 0.365),
     vec3(0.451, 0.486, 0.326));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.yxyx/iResolution.yxyx;
    a.xywz *= vec2(7.930, -8.200).xyxy;
    a.xywz += vec2(-3.740, 8.540).xyxy;
    a.xywz += vec2(10.*iTweakA.z, 10.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+.5*iTweakA.x, 1.+.05*iTweakA.y).xyxy;
    vec4 b = a;

    for (int i = 0; i < 5; ++i)
    {
    a.zxyw *= sign(b).wyzy + 0.5*iTweakB.y;
    a.wzyx -= (vec4(9.218, 0, 0.522, 1.716)).zwzx ;
    b.wyxz = abs(a).wyzw + 19.*iTweakB.w;
    b.xywz *= sin(a+iTime*.5).yzwz;
    a.yxwz += sign(b).xzyz+ 2.*iTweakB.z;
    }

    a.x += 19.*iTweakB.x;
    a.x = a.x * -0.029+0.620;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.789, 0.591, 0.048),
     vec3(0.669, 0.926, 0.073),
     vec3(0.946, 0.775, 0.998),
     vec3(0.713, 0.738, 0.481));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.yxyx/iResolution.yxyx;
    a.xywz *= vec2(6.000, 7.230).xyxy;
    a.xywz += vec2(-3.150, -4.300).xyxy;
    a.xywz += vec2(10.*iTweakA.z, 10.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.5*iTweakA.x, 1.+0.5*iTweakA.y).xyxy;
    vec4 b = a;

    b.wyzx += lengthA(b).zwxx;
    a.yxzw /= (vec4(-0.161, 0, 1, 5.723)).zwwx + .9*iTweakB.w;
    b.xwzy -= acosA(b).xywy;
    a.zwxy -= abs(b).xyxw;
    b.yzxw *= tan(iTime+a).xzyw + 2.9*iTweakB.y;
    b.wyzx /= (b).zwxx + 9.9*iTweakB.z;
    b.zxyw -= abs(b).xyww;
    b.xwzy += (vec4(0, 0, 0, 3.694)).wzxz;
    b.xwzy /= sqrtA(b).yxyz;

    a.x += 19.*iTweakB.x;
    a.x = a.x * -0.074+-0.026;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.095, 0.440, 0.578),
     vec3(0.953, 0.353, 0.719),
     vec3(0.663, 0.195, 0.046),
     vec3(0.012, 0.534, 0.728));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.xyxy/iResolution.xyxy;
    a.xywz *= vec2(9.215, -7.170).xyxy;
    a.xywz += vec2(-1.619, 5.591).xyxy;
    a.xywz += vec2(5.*iTweakA.z, 5.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.2*iTweakA.x, 1.+0.2*iTweakA.y).xyxy;
    vec4 b = a;

    for (int i = 0; i < 2; ++i)
    {
    b.zywx *= (vec4(9.523, 1.692, 1, 0)).xzyy + 2.*iTweakB.w;
    a.wyxz -= (b).yxyx;
    b.yxzw += cos(a-iTime*1.).yzwx;
    a.ywxz -= sin(b+iTime*.77).zxyz + 9.*iTweakB.y;
    a.xzwy += (b).wyxy;
    a.ywzx *= cos(b).yzyx + 2.*iTweakB.z;
    b.xywz /= ceil(a).zyyy;
    a.wzyx += normalize(b).wxzz;
    b.zxyw = lengthA(vec4(0.161, 2.236, -0.832, -1.247)).yzyx;
    }

    a.x += 19.*iTweakB.x;
    a.x = a.x * -0.077+0.636;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.629, 0.555, 0.049),
     vec3(0.500, 0.674, 0.111),
     vec3(0.108, 0.600, 0.447),
     vec3(0.812, 0.304, 0.318));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.yxyx/iResolution.yxyx;
    a.xywz *= vec2(10.850, -8.090).xyxy;
    a.xywz += vec2(5.390, -4.620).xyxy;
    a.xywz += vec2(5.*iTweakA.z, 5.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.05*iTweakA.x, 1.+0.05*iTweakA.y).xyxy;
    vec4 b = a;

    b.ywxz /= (b).xzwy;
    b.yxzw -= sin(a).wwzx + 5.*iTweakB.y;
    b.yxzw *= cos(a-iTime*.217).xxwy+ 5.*iTweakB.z;
    b.yzwx -= tan(b+iTime*.413).wyzw;
    a.xwyz = pow2(b).wxxz+ 5.*iTweakB.w;
    b.xywz *= (b).wyxw;
    a.wyxz = (a).zxxx;
    b.ywxz -= ceil(a).yxyy;
    a.wyxz -= (a).wyzw;
    a.yxwz += normalize(b).wyxw;
    a.xwyz *= (vec4(0, -2.393, 0, 4.372)).wyzw;
    b.yxwz /= (b).zwxx;
    b.xywz *= sign(a).zxzw;
    b.ywzx = (b).xwyz;

    a.x += 19.*iTweakB.x;
    a.x = a.x * 0.077+0.031;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.695, 0.501, 0.987),
     vec3(0.904, 0.076, 0.668),
     vec3(0.587, 0.973, 0.530),
     vec3(0.747, 0.476, 0.410));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.xyxy/iResolution.xyxy;
    a.xywz *= vec2(9.430, 7.730).xyxy;
    a.xywz += vec2(-2.680, -9.400).xyxy;
    a.xywz += vec2(5.*iTweakA.z, 5.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.5*iTweakA.x, 1.+0.5*iTweakA.y).xyxy;
    vec4 b = a;

    b.yxzw += (vec4(9.607, -3.797, 2.134, 0.509)).yyww;
    b.zwxy -= cos(b+iTime*.123).wxxz;
    a.ywzx = sin(b).xyyw+ 1.*iTweakB.w;
    a.ywzx = (a).zyxw;
    a.xywz /= exp(a).wxxw + 1.*iTweakB.y;
    a.yxzw -= cos(a+iTime).wxxz + 3.*iTweakB.z;
    a.yxzw += pow2(a).xxyw;
    b.xzwy += log2A(a).ywyz;
    b.ywxz /= (b).wzzy;
    a.yzxw += logA(a).zxxy;
    a.yzxw *= normalize(b).yxyz;
    a.zxyw += tan(a).yzyz;
    b.xywz = sqrtA(a).wwzz;

    a.x += 19.*iTweakB.x;
    a.x = a.x * -0.094+0.601;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.898, 0.755, 0.379),
     vec3(0.127, 0.579, 0.454),
     vec3(0.515, 0.177, 0.229),
     vec3(0.029, 0.184, 0.759));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.yxyx/iResolution.yxyx;
    a.xywz *= vec2(9.951, 8.354).xyxy;
    a.xywz += vec2(-7.282, -9.095).xyxy;
    a.xywz += vec2(9.*iTweakA.z, 9.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.5*iTweakA.x, 1.+0.08*iTweakA.y).xyxy;
    vec4 b = a;

    for (int i = 0; i < 4; ++i)
    {
    b.xywz *= sin(a+iTime*.2).xzwy +1.*iTweakB.y;
    a.xzwy = (a).yxyy;
    b.xywz += atan(a).yxyw;
    a.yxwz += sign(b +5.*iTweakB.w).xzyz;
    a.zxyw /= sign(b).wyzy +0.8*iTweakB.z;
    }

    a.x += 19.*iTweakB.x;
    a.x = a.x * -0.054+0.061;
    a.xyz = b.x * CosinePalette(a.x,
     vec3(0.015, 0.299, 0.821),
     vec3(0.200, 0.388, 0.905),
     vec3(0.210, 0.277, 0.820),
     vec3(0.017, 0.272, 0.518));
}
`,
`
void mainImage(out vec4 a, in vec2 p)
{
    a=p.xyxy/iResolution.xyxy;
    a.xywz *= vec2(5.150, -4.550).xyxy;
    a.xywz += vec2(-11.370, 6.450).xyxy;
    a.xywz += vec2(5.*iTweakA.z, 5.*iTweakA.w).xyxy;
    a.xywz *= vec2(1.+0.05*iTweakA.x, 1.+0.08*iTweakA.y).xyxy;
    vec4 b = a;
    b+=1.0*iTweakB.y;

    for (int i = 0; i < 9; ++i)
    {
    b.xwzy *= exp(vec4(0, 0, 0, 0.444)).yywy+.3*iTweakB.w;
    b.yxzw += cos(b+iTime).zwxx;
    b.yzxw *= (a).xwyx;
    b.xwyz -= (vec4(0, -6.689, 3.968, 5.719)).zwyz;
    a.yzwx = normalize(b).xzyw;
    b.zwxy *= log2A(a).yxyz;
    b.wyzx /= floor(vec4(-0.008, 4.372, 0, 2.222)).xyxw;
    b.yxwz += abs(b).yyyw+2.0*iTweakB.z;
    }

    a.x += 2.*PI*iTweakB.x;
    a.x = a.x * -0.073+0.100;
    a.y *= 0.886;
    a.xyz = SmoothHSV(a.xyz);
}
`
];

///////////////////////////////////////////////////////////////////////////////
// setup

const canvas = document.getElementById('bgcanvas');
const hud = document.getElementById('bg-hud');
const readout = document.getElementById('bg-readout');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const RES = 2;        // render scale in css pixels; >1 supersamples away the
                      // moire these high frequency shaders throw off at 1:1
const MAX_PIXELS = 8e6; // ceiling: small windows get the full 2x, 4k lands near 1:1
const FPS = 30;       // background does not need 60
const SPEED = .12;    // shader time per second

const gl = canvas.getContext('webgl2',
    {antialias:false, depth:false, stencil:false, alpha:false, powerPreference:'low-power'});

// no webgl2, leave the canvas empty and let the page background show through
if (!gl)
{
    if (hud) hud.hidden = true;
    return;
}

const VERTEX_CODE = '#version 300 es\nlayout(location=0) in vec4 c;void main(){gl_Position=c;}';
const FRAGMENT_PRE =
    '#version 300 es\n' +
    'precision highp float;' +
    'uniform float iTime;' +
    'uniform vec3 iResolution;' +
    'uniform vec4 iTweakA;' +
    'uniform vec4 iTweakB;' +
    'out vec4 outColor;\n';
const FRAGMENT_POST =
    '\nvoid main(){mainImage(outColor,gl_FragCoord.xy);outColor.a=1.;}';

const compile = (type, source) =>
{
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.warn('background shader failed:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return;
    }
    return shader;
};

const buildProgram = (code) =>
{
    const vs = compile(gl.VERTEX_SHADER, VERTEX_CODE);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_PRE + HEADER + code + FRAGMENT_POST);
    if (!vs || !fs)
        return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.warn('background link failed:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return;
    }
    return program;
};

// one big triangle covering clip space
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([-3,1, 1,-3, 1,1]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.BYTE, false, 0, 0);

///////////////////////////////////////////////////////////////////////////////
// pick a look

let program, uniforms, time = 0, lastPick = -1;

const randomize = () =>
{
    // roll a shader, avoiding an immediate repeat
    let pick = Math.random()*SHADERS.length | 0;
    if (SHADERS.length > 1 && pick == lastPick)
        pick = (pick + 1) % SHADERS.length;

    const next = buildProgram(SHADERS[pick]);
    if (!next)
        return;                     // keep whatever is already running

    if (program)
        gl.deleteProgram(program);
    program = next;
    lastPick = pick;

    gl.useProgram(program);
    uniforms =
    {
        res:  gl.getUniformLocation(program, 'iResolution'),
        time: gl.getUniformLocation(program, 'iTime'),
        a:    gl.getUniformLocation(program, 'iTweakA'),
        b:    gl.getUniformLocation(program, 'iTweakB'),
    };

    // 8 random knobs, same layout the OS13k background used
    const t = [];
    for (let i = 8; i--;)
        t[i] = Math.random()*2-1;
    gl.uniform4f(uniforms.a, 10*t[0], 10*t[1], t[2], t[3]);
    gl.uniform4f(uniforms.b, t[4], t[5], t[6], t[7]);

    // random hue spin and start time so no two loads look alike
    const hue = Math.random()*360|0;
    canvas.style.filter = `hue-rotate(${hue}deg)`;
    time = Math.random()*50;

    // report what is actually on screen: which shader, and a seed that
    // is a digest of the knobs that produced this particular look
    if (readout)
    {
        let seed = hue;
        for (const v of t)
            seed = (seed*31 + (v*1e6|0)) >>> 0;
        readout.textContent =
            `SHADER ${String(pick+1).padStart(2,'0')} / ${String(SHADERS.length).padStart(2,'0')}` +
            ` · SEED ${seed.toString(16).slice(-6).toUpperCase().padStart(6,'0')}`;
    }
    return true;
};

///////////////////////////////////////////////////////////////////////////////
// render

const resize = () =>
{
    // render at RES, backing off if that would blow past the pixel ceiling
    const scale = Math.min(RES, Math.sqrt(MAX_PIXELS / (innerWidth*innerHeight)));
    const w = Math.max(1, Math.round(innerWidth * scale));
    const h = Math.max(1, Math.round(innerHeight * scale));
    if (canvas.width == w && canvas.height == h)
        return false;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    return true;
};

const draw = () =>
{
    if (!program)
        return;
    gl.useProgram(program);
    gl.uniform3f(uniforms.res, canvas.width, canvas.height, 1);
    gl.uniform1f(uniforms.time, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

let running = true, lastFrame = 0;

const step = (now) =>
{
    if (!running)
        return;
    requestAnimationFrame(step);
    if (now - lastFrame < 1000/FPS)
        return;
    time += Math.min((now - lastFrame)/1000, .1) * SPEED;
    lastFrame = now;
    resize();
    draw();
};

resize();
if (!randomize())
    return;

if (REDUCED)
{
    draw();
    addEventListener('resize', () => { if (resize()) draw(); });
}
else
{
    requestAnimationFrame(step);
    document.addEventListener('visibilitychange', () =>
    {
        if (document.hidden)
            running = false;
        else if (!running)
        {
            running = true;
            lastFrame = performance.now();
            requestAnimationFrame(step);
        }
    });
}

// the readout doubles as the reshuffle button
if (hud)
    hud.addEventListener('click', () => { if (randomize() && REDUCED) draw(); });

// click the background to roll a new shader
document.addEventListener('click', e =>
{
    if (e.target.closest('a,button,iframe,input,.card,.video-card,.gallery-item,.avatar-frame,.lightbox'))
        return;
    if (getSelection().toString())
        return;     // let people select text without rerolling
    if (randomize() && REDUCED)
        draw();
});

// rebuild after a lost context
canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); running = false; });
canvas.addEventListener('webglcontextrestored', () => location.reload());

})();
