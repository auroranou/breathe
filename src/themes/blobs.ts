import * as THREE from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

import type { BreatheConfig } from "../types";

let time = 0;
const clock = new THREE.Clock();
const resolution = 56;
const numBlobs = 8;

export function draw({ container }: BreatheConfig) {
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight
  );
  camera.position.set(0, 0, 160);

  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0.5, 0.5, 1);
  scene.add(light);

  const pointLight = new THREE.PointLight(0xff7c00, 3, 0, 0);
  pointLight.position.set(0, 0, 100);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x323232, 3);
  scene.add(ambientLight);

  const material = new THREE.MeshPhongMaterial({
    specular: 0xc1c1c1,
    shininess: 250,
  });

  const effect = new MarchingCubes(resolution, material, false, true, 20000);
  effect.scale.set(50, 50, 50);
  scene.add(effect);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setAnimationLoop(function () {
    animate(renderer, scene, camera, effect);
  });
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", function () {
    onWindowResize(camera, renderer, container);
  });
}

function onWindowResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer,
  container: Element
) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

function updateCubes(object: MarchingCubes, time: number) {
  object.reset();

  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numBlobs) - 1) / 4 + 1);

  for (let i = 0; i < numBlobs; i++) {
    const x =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
      0.5;
    const y =
      Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
    const z =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    object.addBall(x, y, z, strength, subtract);
  }

  object.update();
}

function animate(
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  effect: MarchingCubes
) {
  const delta = clock.getDelta();
  time += delta * 0.5;

  effect.init(Math.floor(resolution));
  updateCubes(effect, time);
  renderer.render(scene, camera);
}
