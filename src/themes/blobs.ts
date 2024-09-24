import * as THREE from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

import type { BreatheConfig } from "../types";

let time = 0;
const clock = new THREE.Clock();
const numBlobs = 12;
const resolution = 80;

const colors = [
  new THREE.Color(0xff69b4), // hotpink
  new THREE.Color(0xe6e6fa), // lavender
  new THREE.Color(0x87ceeb), // skyblue
  new THREE.Color(0x7fffd4), // aquamarine
  new THREE.Color(0x98fb98), // palegreen
  new THREE.Color(0xffa07a), // lightsalmon
];

export function draw({ container }: BreatheConfig) {
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight
  );
  camera.position.set(0, 0, 160);

  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 0, 1);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xdedede, 3);
  scene.add(ambientLight);

  const material = new THREE.MeshPhongMaterial({
    shininess: 250,
    vertexColors: true,
  });

  const effect = new MarchingCubes(resolution, material, false, true, 20000);
  effect.scale.set(100, 100, 100);
  effect.isolation = 30;
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

  for (let i = 0; i < numBlobs; i++) {
    const subtract = numBlobs;
    const strength = 1.6 / Math.sqrt(numBlobs);

    const x =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.16 +
      0.5;
    const y =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.12 + 0.5;

    object.addBall(x, y, y, strength, subtract, colors[i % 6]);
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
