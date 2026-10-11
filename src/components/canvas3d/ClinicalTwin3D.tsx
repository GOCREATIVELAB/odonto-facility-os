import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { clinicStore } from '../../state/clinicStore';
import { CameraPreset, ThemeMode } from '../../types/clinic';

interface ClinicalTwin3DProps {
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number | null) => void;
  activeView: string;
  cameraPreset: CameraPreset;
  onSelectCCTV?: (roomId: number) => void;
}

export const ClinicalTwin3D: React.FC<ClinicalTwin3DProps> = ({
  selectedRoomId,
  onSelectRoom,
  activeView,
  cameraPreset,
  onSelectCCTV,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const roomLightsRef = useRef<Map<number, { light: THREE.PointLight; mesh: THREE.Mesh }>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Camera presets
  const presetsPos = {
    campus: { pos: { x: 26, y: 26, z: 26 }, target: { x: 0, y: 0, z: 0 }, frustum: 32 },
    torre: { pos: { x: 20, y: 22, z: 20 }, target: { x: 0, y: 0, z: 0 }, frustum: 26 },
    andar: { pos: { x: 18, y: 18, z: 18 }, target: { x: 0, y: 0, z: 0 }, frustum: 22 },
    consultorios: { pos: { x: 13, y: 15, z: 13 }, target: { x: 0, y: 0, z: -0.5 }, frustum: 18 },
  };

  const animateCameraTo = useCallback(
    (targetPos: { x: number; y: number; z: number }, targetLookAt: { x: number; y: number; z: number }, duration: number = 1.4) => {
      if (!cameraRef.current) return;
      
      gsap.killTweensOf(cameraRef.current.position);
      gsap.killTweensOf(cameraTargetRef.current);

      gsap.to(cameraRef.current.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (cameraRef.current) {
            cameraRef.current.lookAt(cameraTargetRef.current);
            cameraRef.current.updateProjectionMatrix();
          }
        },
      });

      gsap.to(cameraTargetRef.current, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (cameraRef.current) {
            cameraRef.current.lookAt(cameraTargetRef.current);
          }
        },
      });
    },
    []
  );

  // Respond to camera preset changes
  useEffect(() => {
    if (selectedRoomId) return;
    const p = presetsPos[cameraPreset] || presetsPos.andar;
    animateCameraTo(p.pos, p.target, 1.4);
  }, [cameraPreset, selectedRoomId, animateCameraTo]);

  // Respond to selected room zoom
  useEffect(() => {
    if (selectedRoomId) {
      const room = clinicStore.getRoomById(selectedRoomId);
      if (room) {
        animateCameraTo(
          {
            x: room.coords_centro.x + 7.5,
            y: 9.5,
            z: room.coords_centro.z + 7.5,
          },
          {
            x: room.coords_centro.x,
            y: 0.5,
            z: room.coords_centro.z,
          },
          1.5
        );
      }
    } else {
      const p = presetsPos[cameraPreset] || presetsPos.andar;
      animateCameraTo(p.pos, p.target, 1.4);
    }
  }, [selectedRoomId, cameraPreset, animateCameraTo]);

  // Sync lights and theme
  useEffect(() => {
    const updateSceneColors = () => {
      const theme = clinicStore.getTheme();
      const rooms = clinicStore.getRooms();

      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(theme === 'light' ? '#eef2f7' : '#0b0e14');
        if (sceneRef.current.fog) {
          sceneRef.current.fog.color = new THREE.Color(theme === 'light' ? '#eef2f7' : '#0b0e14');
        }
      }

      rooms.forEach((room) => {
        const item = roomLightsRef.current.get(room.id);
        if (item) {
          const color = new THREE.Color(room.luz_cor_hex);
          const intensity = room.luz_ativa ? room.luz_intensidade * (theme === 'light' ? 2.5 : 3.5) : 0.05;
          item.light.color.set(color);
          item.light.intensity = intensity;
          (item.mesh.material as THREE.MeshStandardMaterial).emissive.set(color);
          (item.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = room.is_gargalo ? 2.5 : 1.2;
        }
      });
    };

    updateSceneColors();
    const unsub = clinicStore.subscribe(updateSceneColors);
    return () => unsub();
  }, []);

  // Initialize scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const theme = clinicStore.getTheme();

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(theme === 'light' ? '#eef2f7' : '#0b0e14');
    scene.fog = new THREE.FogExp2(theme === 'light' ? '#eef2f7' : '#0b0e14', 0.012);

    // 2. Camera
    const aspect = width / height;
    const frustumSize = 22;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(18, 18, 18);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const hemiLight = new THREE.HemisphereLight(
      theme === 'light' ? '#ffffff' : '#93c5fd',
      theme === 'light' ? '#dbeafe' : '#0f172a',
      theme === 'light' ? 0.85 : 0.4
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#ffffff', theme === 'light' ? 1.0 : 0.85);
    sunLight.position.set(22, 35, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0001;
    const d = 18;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#38bdf8', 0.35);
    fillLight.position.set(-18, 20, -18);
    scene.add(fillLight);

    // 5. Architectural Building Podium / Slab with Balustrade (Matching the Video)
    const podiumGroup = new THREE.Group();

    // Base Floating Slab (Tier 1)
    const slab1Geo = new THREE.BoxGeometry(26, 0.6, 22);
    const slab1Mat = new THREE.MeshStandardMaterial({
      color: theme === 'light' ? '#ffffff' : '#131926',
      roughness: 0.25,
      metalness: 0.1,
    });
    const slab1 = new THREE.Mesh(slab1Geo, slab1Mat);
    slab1.position.y = -0.3;
    slab1.receiveShadow = true;
    podiumGroup.add(slab1);

    // Upper Clinical Floor Plate (Tier 2 with fine chamfer feel)
    const slab2Geo = new THREE.BoxGeometry(24.5, 0.25, 20.5);
    const slab2Mat = new THREE.MeshStandardMaterial({
      color: theme === 'light' ? '#f8fafc' : '#151d2c',
      roughness: 0.2,
      metalness: 0.05,
    });
    const slab2 = new THREE.Mesh(slab2Geo, slab2Mat);
    slab2.position.y = 0.125;
    slab2.receiveShadow = true;
    podiumGroup.add(slab2);

    // Floor subtle grid & corridor marking
    const corridorMat = new THREE.MeshStandardMaterial({
      color: theme === 'light' ? '#e2e8f0' : '#1e293b',
      roughness: 0.3,
    });
    const corridor = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 19), corridorMat);
    corridor.rotation.x = -Math.PI / 2;
    corridor.position.set(0, 0.255, 0);
    corridor.receiveShadow = true;
    podiumGroup.add(corridor);

    // Glass Balustrade on Perimeter Terrace
    const railingGlassMat = new THREE.MeshPhysicalMaterial({
      color: '#bae6fd',
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.8,
      depthWrite: false,
    });
    const railPostMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8 });

    // Balustrade walls
    const railFront = new THREE.Mesh(new THREE.BoxGeometry(25.5, 0.8, 0.06), railingGlassMat);
    railFront.position.set(0, 0.4, 10.7);
    podiumGroup.add(railFront);

    const railBack = new THREE.Mesh(new THREE.BoxGeometry(25.5, 0.8, 0.06), railingGlassMat);
    railBack.position.set(0, 0.4, -10.7);
    podiumGroup.add(railBack);

    const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 21.4), railingGlassMat);
    railLeft.position.set(-12.7, 0.4, 0);
    podiumGroup.add(railLeft);

    const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 21.4), railingGlassMat);
    railRight.position.set(12.7, 0.4, 0);
    podiumGroup.add(railRight);

    scene.add(podiumGroup);

    // 6. Build Procedural Clinical Rooms
    const rooms = clinicStore.getRooms();

    const glassWallMat = new THREE.MeshPhysicalMaterial({
      color: theme === 'light' ? '#e0f2fe' : '#7dd3fc',
      transparent: true,
      opacity: theme === 'light' ? 0.32 : 0.22,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.45,
      depthWrite: false,
    });

    const roomFloorMat = new THREE.MeshStandardMaterial({
      color: theme === 'light' ? '#ffffff' : '#172033',
      roughness: 0.3,
    });

    rooms.forEach((room) => {
      const roomGroup = new THREE.Group();
      roomGroup.position.set(room.coords_centro.x, 0.25, room.coords_centro.z);
      roomGroup.userData = { roomId: room.id };

      const roomW = 4.2;
      const roomD = 4.4;
      const wallH = 1.6;

      // Floor Pad with border
      const padGeo = new THREE.BoxGeometry(roomW, 0.04, roomD);
      const pad = new THREE.Mesh(padGeo, roomFloorMat.clone());
      pad.position.y = 0.02;
      pad.receiveShadow = true;
      pad.userData = { roomId: room.id, isClickable: true };
      roomGroup.add(pad);

      // Glass partition walls
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, wallH, 0.08), glassWallMat);
      backWall.position.set(0, wallH / 2, -roomD / 2);
      roomGroup.add(backWall);

      const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, roomD), glassWallMat);
      sideWallL.position.set(-roomW / 2, wallH / 2, 0);
      roomGroup.add(sideWallL);

      const sideWallR = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, roomD), glassWallMat);
      sideWallR.position.set(roomW / 2, wallH / 2, 0);
      roomGroup.add(sideWallR);

      // Procedural Dental Treatment Unit
      const chairGroup = new THREE.Group();
      
      // Heavy hydraulic base
      const chairBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: '#475569', metalness: 0.8, roughness: 0.3 })
      );
      chairBase.position.y = 0.06;
      chairBase.castShadow = true;
      chairGroup.add(chairBase);

      // Seat cushion
      const seatMat = new THREE.MeshStandardMaterial({
        color: room.id === 4 ? '#ef4444' : room.id === 5 ? '#a855f7' : '#0284c7',
        roughness: 0.4,
      });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 1.4), seatMat);
      seat.position.set(0, 0.55, 0);
      seat.rotation.x = 0.2;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Headrest
      const headrest = new THREE.Mesh(
        new THREE.BoxGeometry(0.38, 0.1, 0.3),
        new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.3 })
      );
      headrest.position.set(0, 0.72, -0.7);
      chairGroup.add(headrest);

      // Overhead articulated dental lamp
      const lampPillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8),
        new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.8 })
      );
      lampPillar.position.set(0.65, 0.75, 0.3);
      lampPillar.rotation.z = -0.25;
      chairGroup.add(lampPillar);

      const lampHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.08, 0.25),
        new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.0 })
      );
      lampHead.position.set(0.45, 1.35, 0.1);
      lampHead.rotation.x = 0.4;
      chairGroup.add(lampHead);

      // Dentist Stool
      const stool = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.45, 12),
        new THREE.MeshStandardMaterial({ color: '#334155' })
      );
      stool.position.set(-0.85, 0.25, -0.3);
      chairGroup.add(stool);

      // Medical Console with Countertop & Monitor
      const consoleBench = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.75, 0.6),
        new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.3 })
      );
      consoleBench.position.set(1.1, 0.38, -1.5);
      chairGroup.add(consoleBench);

      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.35, 0.04),
        new THREE.MeshStandardMaterial({ color: '#0284c7', emissive: '#0284c7', emissiveIntensity: 0.5 })
      );
      monitor.position.set(1.1, 0.95, -1.5);
      chairGroup.add(monitor);

      roomGroup.add(chairGroup);

      // Corner CCTV Camera (Matching Video)
      const cctvMount = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.12, 0.18),
        new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.9 })
      );
      cctvMount.position.set(-roomW / 2 + 0.15, 1.45, -roomD / 2 + 0.15);
      cctvMount.rotation.y = 0.75;
      roomGroup.add(cctvMount);

      // LED on camera
      const cctvLed = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        new THREE.MeshStandardMaterial({ color: '#22c55e', emissive: '#22c55e', emissiveIntensity: 1.5 })
      );
      cctvLed.position.set(-roomW / 2 + 0.22, 1.45, -roomD / 2 + 0.22);
      roomGroup.add(cctvLed);

      // Ceiling fixture with dynamic PointLight
      const fixtureMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.06, 16),
        new THREE.MeshStandardMaterial({
          color: '#ffffff',
          emissive: new THREE.Color(room.luz_cor_hex),
          emissiveIntensity: 1.2,
        })
      );
      fixtureMesh.position.set(0, 2.6, 0);
      roomGroup.add(fixtureMesh);

      const pointLight = new THREE.PointLight(
        new THREE.Color(room.luz_cor_hex),
        room.luz_intensidade * 3.5,
        8
      );
      pointLight.position.set(0, 2.4, 0);
      roomGroup.add(pointLight);

      roomLightsRef.current.set(room.id, { light: pointLight, mesh: fixtureMesh });
      scene.add(roomGroup);
    });

    // 7. Reception Hall & Lounge Desk
    const receptionGroup = new THREE.Group();
    receptionGroup.position.set(0, 0.25, 3.2);

    // Reception Curved Desk
    const desk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.8, 0.85, 24, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: theme === 'light' ? '#ffffff' : '#1e293b', roughness: 0.25 })
    );
    desk.position.set(0, 0.425, -0.3);
    desk.rotation.y = Math.PI;
    desk.castShadow = true;
    receptionGroup.add(desk);

    // Waiting Lounge Sofas
    const sofaMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.6 });
    const sofa1 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.85), sofaMat);
    sofa1.position.set(-2.0, 0.2, 1.2);
    sofa1.castShadow = true;
    receptionGroup.add(sofa1);

    const sofa2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 0.85), sofaMat);
    sofa2.position.set(2.0, 0.2, 1.2);
    sofa2.castShadow = true;
    receptionGroup.add(sofa2);

    // Potted Medical Plants (Architectural greenery)
    const plantPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.25, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: '#94a3b8' })
    );
    plantPot.position.set(-3.6, 0.3, 0);
    receptionGroup.add(plantPot);

    const plantLeaves = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.45, 1),
      new THREE.MeshStandardMaterial({ color: '#15803d', roughness: 0.8 })
    );
    plantLeaves.position.set(-3.6, 0.8, 0);
    receptionGroup.add(plantLeaves);

    scene.add(receptionGroup);

    // 8. Render Loop
    let animationFrameId: number;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      // Bottleneck pulsing
      const time = performance.now() * 0.003;
      rooms.forEach((r) => {
        const item = roomLightsRef.current.get(r.id);
        if (item && r.is_gargalo) {
          const pulse = 1.0 + Math.sin(time * 3) * 0.35;
          item.light.intensity = r.luz_intensidade * 3.5 * pulse;
        }
      });

      renderer.render(scene, camera);
    };

    renderLoop();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      const newAspect = newW / newH;

      cameraRef.current.left = (-frustumSize * newAspect) / 2;
      cameraRef.current.right = (frustumSize * newAspect) / 2;
      cameraRef.current.top = frustumSize / 2;
      cameraRef.current.bottom = -frustumSize / 2;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 10. Click detection on rooms
    const handleClick = (e: MouseEvent) => {
      if (!container || !cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent) {
          if (parent.userData?.roomId) {
            onSelectRoom(parent.userData.roomId);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    container.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectRoom]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
