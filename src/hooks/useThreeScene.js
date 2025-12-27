import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { useEffect, useRef } from 'react';
import fromLatLongToXY from '../utils/projection';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function useThreeScene(canvasRef, roadData, settings) {
    const materialRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {
        if (!materialRef.current || !sceneRef.current) {
            return;
        }
        materialRef.current.color.set(settings.streetColor);
        materialRef.current.linewidth = settings.lineWidth;
        sceneRef.current.background = settings.bgColor === 'transparent' ?
            null : new THREE.Color(settings.bgColor);

    }, [settings]);

    useEffect(() => {
        if (!roadData?.elements?.length || !canvasRef.current) {
            console.log("data not supplied properly");
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Orthographic camera
        const camera = new THREE.OrthographicCamera(
            -width / 2, width / 2,
            height / 2, -height / 2,
            -1, 1
        );
        camera.zoom = 1;
        camera.updateProjectionMatrix();

        const scene = new THREE.Scene();
        scene.background = settings.bgColor === 'transparent' ? null : new THREE.Color(settings.bgColor);
        sceneRef.current = scene;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        rendererRef.current = renderer;
        canvasRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableRotate = false;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.screenSpacePanning = true;


        // Project roads to 60% of screen (centered)
        const projectedRoads = fromLatLongToXY(roadData, width * 0.6, height * 0.6);

        // Build positions array
        const totalCoords = projectedRoads.reduce(
            (sum, road) => sum + (road.canvasGeometry.length - 1) * 6, 0
        );
        const positions = new Float32Array(totalCoords);

        let index = 0;
        const halfWidth = width * 0.3;  // half of 60%
        const halfHeight = height * 0.3;

        projectedRoads.forEach(road => {
            const points = road.canvasGeometry;
            for (let i = 0; i < points.length - 1; i++) {
                positions[index++] = points[i].x - halfWidth;
                positions[index++] = -(points[i].y - halfHeight);
                positions[index++] = 0;
                positions[index++] = points[i + 1].x - halfWidth;
                positions[index++] = -(points[i + 1].y - halfHeight);
                positions[index++] = 0;
            }
        });

        const geometry = new LineSegmentsGeometry();
        geometry.setPositions(positions);

        const material = new LineMaterial({
            color: '#1a1a1a',
            linewidth: 2,
            resolution: new THREE.Vector2(width, height)
        });

        materialRef.current = material;

        const line2 = new Line2(geometry, material);
        scene.add(line2);

        // Animation
        const totalSegments = positions.length / 6;
        let currentProgress = 0;
        const drawSpeed = 500;
        line2.geometry.instanceCount = 0;

        // Zoom handler
        let zoom = 1;
        const handleWheel = (e) => {
            e.preventDefault();
            zoom *= e.deltaY > 0 ? 0.9 : 1.1;
            zoom = Math.max(0.3, Math.min(zoom, 10));
            camera.zoom = zoom;
            camera.updateProjectionMatrix();
        };
        // canvasRef.current.addEventListener('wheel', handleWheel, { passive: false });

        // Resize handler
        const handleResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            camera.left = -w / 2;
            camera.right = w / 2;
            camera.top = h / 2;
            camera.bottom = -h / 2;
            camera.updateProjectionMatrix();
            material.resolution.set(w, h);
        };
        window.addEventListener('resize', handleResize);

        function animate() {
            if (currentProgress < totalSegments) {
                currentProgress += drawSpeed;
                line2.geometry.instanceCount = Math.min(currentProgress, totalSegments);
            }
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            controls.dispose();
            sceneRef.current = null;
            material.current = null;
            rendererRef.current = null;
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        };

    }, [roadData]);
}