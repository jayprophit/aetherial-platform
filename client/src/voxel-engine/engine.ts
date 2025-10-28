import * as THREE from "three";

const CHUNK_SIZE = 16;

export class VoxelEngine {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  generateChunk(chunkX: number, chunkY: number, chunkZ: number) {
    const chunk = new THREE.Group();

    for (let x = 0; x < CHUNK_SIZE; x++) {
      for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let z = 0; z < CHUNK_SIZE; z++) {
          if (Math.random() > 0.5) {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            const voxel = new THREE.Mesh(geometry, material);
            voxel.position.set(x, y, z);
            chunk.add(voxel);
          }
        }
      }
    }

    chunk.position.set(chunkX * CHUNK_SIZE, chunkY * CHUNK_SIZE, chunkZ * CHUNK_SIZE);
    this.scene.add(chunk);
  }
}

