!function() {
    "use strict";
    let e = heatMap, t = e.getContext("2d");
    var o = t.createLinearGradient(0, e.height, 0, 0);
    o.addColorStop(0, "#f2f2b0"), o.addColorStop(.45, "#f2f2b0"), o.addColorStop(.5, "#f4a460"), 
    o.addColorStop(.51, "#228b22"), o.addColorStop(.7, "#228b22"), o.addColorStop(.85, "#8b4513"), 
    o.addColorStop(.95, "#8b4513"), o.addColorStop(1, "#fffafa"), t.fillStyle = o, t.fillRect(0, 0, e.width, e.height);
    let a, n, i, r, l, s, d, c = new THREE.CanvasTexture(e);
    const u = !0, p = 1e3, h = 501, E = 420, f = 450, m = 3, w = 4, T = 5;
    let g, R, v;
    function M() {
        a.aspect = window.innerWidth / window.innerHeight, a.updateProjectionMatrix(), i.setSize(window.innerWidth, window.innerHeight);
    }
    !function() {
        const e = document.createElement("div");
        document.body.appendChild(e), (n = new THREE.Scene()).background = 0, (i = new THREE.WebGLRenderer({
            antialias: !0
        })).setPixelRatio(window.devicePixelRatio), i.setSize(window.innerWidth, window.innerHeight), 
        i.outputEncoding = THREE.sRGBEncoding, i.shadowMap.enabled = !0, i.shadowMap.type = THREE.PCFSoftShadowMap, 
        e.appendChild(i.domElement), (a = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3 * p)).position.set(0, .1 * p, .5 * p), 
        a.lookAt(0, 0, 0);
        const t = new THREE.DirectionalLight(16777215, .5);
        t.position.set(.5 * p, .3 * p, .5 * p), t.castShadow = !0, n.add(t);
        const o = t.clone();
        o.position.set(.5 * -p, .3 * p, .5 * p), n.add(o);
        const H = function(e, t) {
            const o = e * t;
            let a = [ ...Array(o) ].map(() => 0), n = new THREE.ImprovedNoise(), i = 100 * Math.random(), r = 1;
            for (let t = 0; t < w; t++) {
                for (let t = 0; t < o; t++) {
                    let o = t % e, l = ~~(t / e);
                    a[t] += Math.abs(n.noise(o / r, l / r, i) * r);
                }
                r *= T;
            }
            let l = new THREE.Vector3(e / 2, t / 2, 0), s = Math.floor(Math.min(e / 2, t / 2)), d = (Math.floor(Math.max(e / 2, t / 2)), 
            s * E * 2 / p), c = s * f * 2 / p;
            for (let t = 0; t < o; t++) {
                let o = t % e, n = ~~(t / e), i = new THREE.Vector3(o, n, 0);
                var u = Math.abs(i.distanceTo(l));
                u >= s - .5 ? a[t] = -11 : u >= d && u < c ? a[t] = 0 : u >= c ? (a[t] = -Math.abs(a[t]), 
                a[t] *= Math.tan((u - c) / s * Math.PI) * m) : a[t] *= Math.cos(u / d * (Math.PI / 2)) * m;
            }
            return a;
        }(h, h);
        (l = new THREE.PlaneGeometry(p, p, h - 1, h - 1)).rotateX(-Math.PI / 2);
        const x = l.attributes.position.array;
        let S, y = 0;
        for (let e = 0, t = 0, o = x.length; e < o; e++, t += 3) S = H[e], l.attributes.position.setY(e, S), 
        y < S && (y = S);
        l.computeVertexNormals();
        let C = {
            colorTexture: {
                value: c
            },
            limits: {
                value: y
            }
        };
        s = new THREE.MeshStandardMaterial({
            color: 65280,
            transparent: !0,
            opacity: 1,
            roughness: 1,
            metalness: 0,
            polygonOffset: !0,
            polygonOffsetFactor: -.1,
            onBeforeCompile: e => {
                e.uniforms.colorTexture = C.colorTexture, e.uniforms.limits = C.limits, e.vertexShader = `\n      varying vec3 vPos;\n      ${e.vertexShader}\n    `.replace("#include <fog_vertex>", "#include <fog_vertex>\n      vPos = vec3(position);\n      "), 
                e.fragmentShader = `\n      uniform float limits;\n      uniform sampler2D colorTexture;\n      \n      varying vec3 vPos;\n      ${e.fragmentShader}\n    `.replace("vec4 diffuseColor = vec4( diffuse, opacity );", "\n        float h = (vPos.y - (-limits))/(limits * 2.);\n        h = clamp(h, 0., 1.);\n        vec4 diffuseColor = texture2D(colorTexture, vec2(0, h));\n      ");
            }
        }), (d = new THREE.Mesh(l, s)).castShadow = !0, d.receiveShadow = !0, n.add(d), 
        l = new THREE.RingGeometry(f - 2 - 3, f - 2, 200);
        new THREE.TextureLoader().load("https://happy358.github.io/Images/textures/t_brick_floor_002_diffuse_1k.jpg", function(e) {
            e.wrapS = e.wrapT = THREE.RepeatWrapping;
        });
        s = new THREE.MeshStandardMaterial({
            color: 13882323
        });
        const b = new THREE.Mesh(l, s);
        b.rotation.x = -Math.PI / 2, b.position.y = .2, d.add(b), function() {
            (g = new THREE.Sky()).scale.setScalar(45e4), n.add(g), R = new THREE.Vector3();
            const e = {
                turbidity: 10,
                rayleigh: 3,
                mieCoefficient: .005,
                mieDirectionalG: .7,
                elevation: 2,
                azimuth: 180,
                exposure: i.toneMappingExposure
            }, t = g.material.uniforms;
            t.turbidity.value = e.turbidity, t.rayleigh.value = e.rayleigh, t.mieCoefficient.value = e.mieCoefficient, 
            t.mieDirectionalG.value = e.mieDirectionalG;
            const o = THREE.MathUtils.degToRad(90 - e.elevation), r = THREE.MathUtils.degToRad(e.azimuth);
            R.setFromSphericalCoords(1, o, r), t.sunPosition.value.copy(R), i.toneMappingExposure = e.exposure, 
            i.render(n, a);
        }(), function() {
            const e = new THREE.CircleGeometry(p, 200);
            (v = new THREE.Water(e, {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load("https://happy358.github.io/Images/textures/waternormals.jpg", function(e) {
                    e.wrapS = e.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 16777215,
                waterColor: 7695,
                distortionScale: 3.7,
                fog: void 0 !== n.fog
            })).position.y = -10, v.rotation.x = -Math.PI / 2, n.add(v);
        }(), (r = new THREE.OrbitControls(a, i.domElement)).autoRotate = !1, r.autoRotateSpeed = 2, 
        r.enableDamping = !0, r.enablePan = !1, r.minDistance = .1, r.maxDistance = 2 * p, 
        r.minPolarAngle = 0, r.maxPolarAngle = Math.PI / 2 * .99, r.target.set(0, 0, 0), 
        r.update(), window.addEventListener("resize", M), u || function() {
            let e = {
                value: 0
            }, t = f - 2 - 1;
            a.position.set(t * Math.sin(0), 1.8, t * Math.cos(0));
            let o = new TWEEN.Tween(e).to({
                value: 360
            }, 1e5).onUpdate(() => {
                a.position.set(t * Math.sin(THREE.MathUtils.degToRad(e.value)), 1.8, t * Math.cos(THREE.MathUtils.degToRad(e.value))), 
                r.target.set(t * Math.sin(THREE.MathUtils.degToRad(e.value + 1)), 1.8, t * Math.cos(THREE.MathUtils.degToRad(e.value + 1)));
            }).start().onComplete(() => {
                e.value = 0, o.start();
            });
        }();
    }(), function e() {
        requestAnimationFrame(e);
        r.update();
        TWEEN.update();
        !function() {
            performance.now();
            v.material.uniforms.time.value += 1 / 60, i.clear(), i.render(n, a);
        }();
    }();
}();