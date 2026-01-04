import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader, RepeatWrapping } from "three";

import { FloorState } from "../types/floor";
import { WallState } from "../types/wall";
import { FLOOR_TEXTURES, WALL_TEXTURES } from "./textures";

type WallGroup = {
  tile: THREE.Mesh;
  paint: THREE.Mesh;
};

export class BathroomScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  floor: THREE.Mesh;
  walls: WallGroup[] = [];
  fixtures: THREE.Object3D[] = [];

  textureLoader: TextureLoader;
  gltfLoader: GLTFLoader;

  readonly WALL_WIDTH = 6;
  readonly WALL_HEIGHT = 3;
  private animationId: number = 0;

  constructor(container: HTMLDivElement) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf3f4f6);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(6, 6, 6);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    }); // preserveDrawingBuffer needed for export
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2.2;

    // Loaders
    this.textureLoader = new TextureLoader();
    this.gltfLoader = new GLTFLoader();

    // Lights
    this.addLights();

    // Floor
    this.floor = this.createFloor();
    this.scene.add(this.floor);

    // Walls
    this.walls = this.createWalls();

    // Fixtures
    this.loadFixture(
      "/models/toilet.glb",
      new THREE.Vector3(-1.4, 0, 1.4),
      0.8
    );
    this.loadFixture("/models/basin.glb", new THREE.Vector3(1.4, 0, -1.4), 0.9);
    this.loadFixture("/models/shower.glb", new THREE.Vector3(0, 0, -2.3), 1.2);

    this.animate();
  }

  // ───────────────────────── LIGHTING (PRO)
  addLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(5, 8, 5);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    this.scene.add(key);

    const fill = new THREE.PointLight(0xfff1dc, 0.4);
    fill.position.set(-2, 2.5, 2);
    this.scene.add(fill);

    const rim = new THREE.PointLight(0xffffff, 0.3);
    rim.position.set(0, 2.5, -2);
    this.scene.add(rim);
  }

  // ───────────────────────── FLOOR
  createFloor() {
    const geo = new THREE.PlaneGeometry(6, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    return floor;
  }

  updateFloor(state: FloorState) {
    const textureUrl = FLOOR_TEXTURES[state.tileType];
    if (!textureUrl) return;

    const tex = this.textureLoader.load(textureUrl);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(state.scale, state.scale);
    tex.rotation = THREE.MathUtils.degToRad(state.rotation);
    tex.colorSpace = THREE.SRGBColorSpace;

    if (state.pattern === "brick") {
      tex.offset.x = 0.5 / state.scale;
    } else {
      tex.offset.set(0, 0);
    }

    const mat = this.floor.material as THREE.MeshStandardMaterial;
    mat.map = tex;
    mat.needsUpdate = true;
  }

  // ───────────────────────── WALLS
  createWall(position: THREE.Vector3, rotationY: number): WallGroup {
    const tileMat = new THREE.MeshStandardMaterial();
    const paintMat = new THREE.MeshStandardMaterial({ color: "#ffffff" });

    const tileGeo = new THREE.PlaneGeometry(this.WALL_WIDTH, 1.2);
    const paintGeo = new THREE.PlaneGeometry(
      this.WALL_WIDTH,
      this.WALL_HEIGHT - 1.2
    );

    const tile = new THREE.Mesh(tileGeo, tileMat);
    const paint = new THREE.Mesh(paintGeo, paintMat);

    // Initial positioning
    tile.position.set(position.x, 0.6, position.z);
    paint.position.set(position.x, 2.1, position.z);

    tile.rotation.y = rotationY;
    paint.rotation.y = rotationY;

    tile.receiveShadow = true;
    paint.receiveShadow = true;

    this.scene.add(tile);
    this.scene.add(paint);

    return { tile, paint };
  }

  createWalls() {
    return [
      this.createWall(new THREE.Vector3(0, 0, -3), 0),
      this.createWall(new THREE.Vector3(0, 0, 3), Math.PI),
      this.createWall(new THREE.Vector3(-3, 0, 0), Math.PI / 2),
      this.createWall(new THREE.Vector3(3, 0, 0), -Math.PI / 2),
    ];
  }

  updateWalls(state: WallState) {
    const textureUrl = WALL_TEXTURES[state.tileTexture];
    if (!textureUrl) return;

    const tex = this.textureLoader.load(textureUrl);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(state.tileScale, state.tileScale);
    tex.colorSpace = THREE.SRGBColorSpace;

    // Use default height if undefined (prevents crash)
    const tileHeight = state.tileHeight || 1.2;

    this.walls.forEach(({ tile, paint }) => {
      // Update Tile Material
      const tileMat = tile.material as THREE.MeshStandardMaterial;
      tileMat.map = tex;
      tileMat.needsUpdate = true;

      // Update Tile Geometry & Position
      tile.scale.y = tileHeight / 1.2; // 1.2 was initial height
      tile.position.y = tileHeight / 2;
      tile.visible = true;

      // Update Paint Material
      const paintMat = paint.material as THREE.MeshStandardMaterial;
      paintMat.color.set(state.paintColor);

      // Update Paint Visibility & Position
      paint.visible = state.mode === "half-tile";

      if (state.mode === "half-tile") {
        const remainingHeight = this.WALL_HEIGHT - tileHeight;
        paint.scale.y = remainingHeight / (this.WALL_HEIGHT - 1.2); // normalize to initial geom
        paint.position.y = tileHeight + remainingHeight / 2;
      } else {
        // In full tile mode, you might want to hide paint or scale tile to full wall
        // For now, let's just assume we hide paint and scale tile if mode is full-tile
        if (state.mode === "full-tile") {
          tile.scale.y = this.WALL_HEIGHT / 1.2;
          tile.position.y = this.WALL_HEIGHT / 2;
        }
      }
    });
  }

  // ───────────────────────── FIXTURES (GLTF)
  loadFixture(url: string, position: THREE.Vector3, scale = 1) {
    this.gltfLoader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.position.copy(position);
        model.scale.setScalar(scale);

        model.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        this.scene.add(model);
        this.fixtures.push(model);
      },
      undefined,
      (error) => {
        console.warn(`Could not load model: ${url}`, error);
      }
    );
  }

  // ───────────────────────── EXPORT
  exportImage() {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL("image/png");
  }

  // ───────────────────────── LOOP
  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  stop() {
    cancelAnimationFrame(this.animationId);
  }

  resize(w: number, h: number) {
    if (h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    this.stop();
    this.renderer.dispose();
    this.controls.dispose();

    // Dispose textures and materials to free memory
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });

    // Remove canvas from DOM
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(
        this.renderer.domElement
      );
    }
  }
}
