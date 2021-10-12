(async () => {
    const THREE = await import("../libs/three.module.js");
    // const { OrbitControls } = await import("../libs/OrbitControls.js");

    // const images = [];
    // await new Promise((resolve) => {
    //     const image = new Image();
    //     image.src = "../images/logo.png";
    //     image.onload = () => resolve(image);
    //     images.push(image);
    // });
    // const texture = new THREE.Texture(images[0]);

    const textures = [];
    await new Promise((resolve) => {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load("../images/logo.png", resolve);
        textures.push(texture);
    });
    const texture = textures[0];

    const footer = document.querySelector('.o3j99.c93Gbe');
    const image = document.querySelector('img[alt="Google"]');

    footer.style.visibility = 'hidden';
    image.style.visibility = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.className = 'webgl';
    image.parentNode.appendChild(canvas);

    const vertexShader = /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        vec3 pos;
        void main() {
            vUv = uv;
            pos = position;
            pos.x += 0.1 * sin(uv.x * uv.y * uTime * 5.0);
            gl_Position = vec4(pos, 1.0);
        }
    `;

    const fragmentShader = /* glsl */ `
        uniform sampler2D uTexture;     
        varying vec2 vUv;
        void main() {
            gl_FragColor = texture2D(uTexture, vUv);
        }
    `;

    // const ctx = canvas.getContext('2d');
    // ctx.drawImage(images[0], 0, 0);

    const size = {};
    size.width = canvas.clientWidth;
    size.height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
    camera.position.z = 1.5;
    scene.add(camera);

    // const cube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
    // scene.add(cube);

    const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uTexture : { value: texture }
        }
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // const renderer = new THREE.WebGLRenderer({ canvas });
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.width, size.height);

    // const controls = new OrbitControls(camera, canvas);
    // controls.target = new THREE.Vector3();
    // controls.enableDamping = true;

    // window.addEventListener('resize', () => {
    //     camera.aspect = size.width / size.height;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize(size.width, size.height);
    // });

    const clock = new THREE.Clock();
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;
        // cube.rotation.y += 0.01;
        // controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };
    tick();
})();