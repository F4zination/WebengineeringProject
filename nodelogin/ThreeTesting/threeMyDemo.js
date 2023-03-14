import * as THREE from 'three';
import {WebGLRenderer} from "three";
console.log("Script Attatched");

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83"
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//
const cam = new THREE.PerspectiveCamera(45, 800, 600)
scene.add(cam)

//
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(800, 600)
renderer.render(scene, cam);