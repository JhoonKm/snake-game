let scene, camera, renderer;
let snake = [];
let direction = new THREE.Vector3(1, 0, 0);
let apple;
let gridSize = 10;
let cubeSize = 1;
let score = 0;
let gameOver = false;

const scoreboard = document.getElementById('scoreboard');

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 바닥
    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const planeMaterial = new THREE.MeshPhongMaterial({color: 0x333333, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 초기 뱀
    for (let i = 0; i < 3; i++) {
        let segment = createCube(0 - i, 0, 0x00ff00);
        snake.push(segment);
        scene.add(segment);
    }

    // 사과
    apple = createCube(getRandomInt(-gridSize/2+1, gridSize/2-1), getRandomInt(-gridSize/2+1, gridSize/2-1), 0xff0000);
    scene.add(apple);

    camera.position.set(0, 13, 13);
    camera.lookAt(0, 0, 0);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);

    animate();
}

function createCube(x, z, color) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, 0.5, z);
    return cube;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function onKeyDown(e) {
    if (gameOver && (e.key === 'r' || e.key === 'R')) {
        location.reload();
        return;
    }
    if (e.key === 'ArrowUp' && direction.z !== 1) direction.set(0, 0, -1);
    else if (e.key === 'ArrowDown' && direction.z !== -1) direction.set(0, 0, 1);
    else if (e.key === 'ArrowLeft' && direction.x !== 1) direction.set(-1, 0, 0);
    else if (e.key === 'ArrowRight' && direction.x !== -1) direction.set(1, 0, 0);
}

let lastMove = 0;
function animate(time) {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (gameOver) return;
    if (!lastMove || time - lastMove > 200) {
        moveSnake();
        lastMove = time;
    }
}

function moveSnake() {
    // 새 머리 위치
    const head = snake[0];
    const newX = head.position.x + direction.x;
    const newZ = head.position.z + direction.z;

    // 벽 충돌
    if (Math.abs(newX) > gridSize/2 || Math.abs(newZ) > gridSize/2) {
        showGameOver();
        return;
    }

    // 자기 몸 충돌
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].position.x === newX && snake[i].position.z === newZ) {
            showGameOver();
            return;
        }
    }

    // 새 머리 추가
    const newHead = createCube(newX, newZ, 0x00ff00);
    scene.add(newHead);
    snake.unshift(newHead);

    // 사과 먹음
    if (newX === apple.position.x && newZ === apple.position.z) {
        score++;
        scoreboard.textContent = `점수: ${score}`;
        scene.remove(apple);
        apple = createCube(getRandomInt(-gridSize/2+1, gridSize/2-1), getRandomInt(-gridSize/2+1, gridSize/2-1), 0xff0000);
        scene.add(apple);
    } else {
        // 꼬리 제거
        scene.remove(snake.pop());
    }
}

function showGameOver() {
    gameOver = true;
    scoreboard.textContent = `으앙 쥬금! 점수: ${score} (R키로 재시작)`;
    // 3D Space Cat 표시
    showSpaceCat();
}

function showSpaceCat() {
    // 고양이 머리
    const catHead = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.MeshPhongMaterial({color: 0xffffff})
    );
    catHead.position.set(0, 2.2, 0);
    scene.add(catHead);
    // 귀
    const earGeom = new THREE.ConeGeometry(0.4, 0.7, 16);
    const earMat = new THREE.MeshPhongMaterial({color: 0xffffff});
    const leftEar = new THREE.Mesh(earGeom, earMat);
    leftEar.position.set(-0.7, 3.2, 0);
    leftEar.rotation.z = Math.PI/10;
    scene.add(leftEar);
    const rightEar = new THREE.Mesh(earGeom, earMat);
    rightEar.position.set(0.7, 3.2, 0);
    rightEar.rotation.z = -Math.PI/10;
    scene.add(rightEar);
    // 눈 >_<
    const eyeMat = new THREE.MeshPhongMaterial({color: 0x000000});
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), eyeMat);
    leftEye.position.set(-0.4, 2.4, 1.1);
    leftEye.rotation.z = Math.PI/6;
    scene.add(leftEye);
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), eyeMat);
    rightEye.position.set(0.4, 2.4, 1.1);
    rightEye.rotation.z = -Math.PI/6;
    scene.add(rightEye);
    // 입 ( >_< )
    const mouthMat = new THREE.MeshPhongMaterial({color: 0xff3399});
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.05), mouthMat);
    mouth.position.set(0, 2.1, 1.1);
    scene.add(mouth);
    // 텍스트(으앙 쥬금)
    const loader = new THREE.FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.153.0/examples/fonts/helvetiker_regular.typeface.json', function(font) {
        const textGeo = new THREE.TextGeometry('으앙 쥬금', {
            font: font,
            size: 0.5,
            height: 0.1
        });
        const textMat = new THREE.MeshPhongMaterial({color: 0xff3399});
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.set(-1.2, 1.2, 1.2);
        scene.add(textMesh);
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
