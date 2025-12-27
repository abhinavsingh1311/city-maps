import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { useEffect } from 'react';

export default function useThreeScene(canvasRef, projectedRoads) {

    useEffect(() => {

        const width = window.innerWidth, height = window.innerHeight;

        if (!projectedRoads?.length || !canvasRef.current) {
            console.log("data not supplied properly");
            return;
        }

        //init

        // orthographic camera
        const left = -width / 2;
        const right = width / 2;
        const top = height / 2;
        const bottom = -height / 2;
        const near = -1;
        const far = 1;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.zoom = 1;
        camera.position.z = 1;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('gray');
        scene.backgroundBlurriness = 0.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        canvasRef.current.appendChild(renderer.domElement);

        //line geometry
        const totalCoords = projectedRoads.reduce(
            (sum, road) => sum + (road.canvasGeometry.length - 1) * 6, 0
        );

        const positions = new Float32Array(totalCoords);

        let index = 0;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        projectedRoads.forEach(roads => {
            const points = roads.canvasGeometry;
            for (let i = 0; i < points.length - 1; i++) {
                positions[index++] = points[i].x - halfWidth;
                positions[index++] = -(points[i].y - halfHeight);
                positions[index++] = 0;
                //second point 
                positions[index++] = points[i + 1].x - halfWidth;
                positions[index++] = -(points[i + 1].y - halfHeight);
                positions[index++] = 0;
            }
        });

        const geometry = new LineSegmentsGeometry();
        geometry.setPositions(positions);

        //line material 

        const material = new LineMaterial({
            color: 0X000000,
            linewidth: 2, resolution: new THREE.Vector2(width, height)
        });


        //line 2

        const line2 = new Line2(geometry, material);

        scene.add(line2);

        const totalVertices = positions.length / 3;
        let currentProgress = 0;
        const drawSpeed = 1000;

        function animate() {
            if (currentProgress < totalVertices) {
                currentProgress += drawSpeed;

                if (currentProgress > totalVertices) {
                    currentProgress = totalVertices;
                }
                geometry.setDrawRange(0, currentProgress);
            }
            renderer.render(scene, camera);

        }

        renderer.setAnimationLoop(animate);
        return () => {
            renderer.setAnimationLoop(null);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }
        }

    }, [projectedRoads]);

};

