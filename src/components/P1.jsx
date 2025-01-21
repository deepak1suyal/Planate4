import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
export default function P1() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const spheresave=[];
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 9;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
const radius=1.3;
const segments=64;
const colors=["red","green","blue","yellow"];
const textures=["/csilla/color.png","/earth/map.jpg","/venus/map.jpg","/volcanic/color.png"];
const spheres=new THREE.Group();
    // Add HDRI environment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/moonlit_golf_4k.hdr', function(texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
     
    });
    // Remove orbit controls
    controls.dispose();

    // Add ambient light since HDRI may need supplemental lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add a simple sphere
  for (let i = 0; i < 4; i++) {
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(textures[i]);
   texture.colorSpace=THREE.SRGBColorSpace;
    const material = new THREE.MeshStandardMaterial({map: texture});
    const sphere = new THREE.Mesh(geometry, material);
   spheresave.push(sphere);
    const angle=(i/4)*Math.PI*2;
    sphere.position.x=Math.cos(angle)*4.5;
    sphere.position.z=Math.sin(angle)*4.5;
    
    spheres.add(sphere);
  }
  spheres.rotation.x=.1;
  spheres.position.y=-.8;
scene.add(spheres);
// Add a large background sphere
const bigSphereGeometry = new THREE.SphereGeometry(15, 64, 64);
const bigTextureLoader = new THREE.TextureLoader();
const bigTexture = bigTextureLoader.load('/stars.jpg');
bigTexture.colorSpace=THREE.SRGBColorSpace;
const bigSphereMaterial = new THREE.MeshStandardMaterial({
  map: bigTexture,
 
  side:THREE.BackSide,
});
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
scene.add(bigSphere);


    // Add throttled wheel event listener
    let lastScrollTime = 0;
    const scrollThrottleTime = 2000; // 2 seconds

    const handleWheel = (event) => {
      const currentTime = Date.now();
      if (currentTime - lastScrollTime >= scrollThrottleTime) {
        lastScrollTime = currentTime;
        
        // Determine scroll direction
        const direction = event.deltaY > 0 ? 1 : -1;
        
        // Rotate the spheres group
        gsap.to(spheres.rotation,{
          duration:1,
          y:`-=${Math.PI/2}%`,
          ease:"power2.inOut",
        });
      }
    };

    window.addEventListener('wheel', handleWheel);

const clock=new THREE.Clock();
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      for(let i=0;i<spheresave.length;i++){
        const sp=spheresave[i];
        sp.rotation.y=clock.getElapsedTime()*0.01;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      // Dispose of all sphere geometries and materials
      spheres.children.forEach(sphere => {
        sphere.geometry.dispose();
        sphere.material.dispose();
      });
      spheres.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}
