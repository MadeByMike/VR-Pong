/**
 * Based on https://github.com/mrdoob/three.js/blob/dev/examples/webgl_shaders_ocean.html
 * Requires:
 *
 *	'https://cdn.rawgit.com/mrdoob/three.js/82bd697ef06acf5c4173775abe053d7a499a6722/examples/js/Mirror.js',
 *	'https://cdn.rawgit.com/mrdoob/three.js/82bd697ef06acf5c4173775abe053d7a499a6722/examples/js/WaterShader.js'
 *
 */


// <a-water position="0 0 0" src="#water-normal" opacity="0.6" width="1000" depth="1000"></water>

function colorParse(str) {
	return (new THREE.Color(str)).getHex();
}

AFRAME.registerComponent('water', {

	schema: {
		src: { type: 'src' },
		width: { default: 100 },
		depth: { default: 100 },
		distortionScale: { default: 5.0 },
		opacity: {
			default: 1.0,
			min: 0,
			max: 1
		},
		srcHeight: { default: 512 },
		srcWidth: { default: 512 },
		sunDirection: {
			type: 'vec3',
     		default: { x: 1, y: 1, z: 1 }
		},
		sunColor: {
			default: '#ffffff',
			parse: colorParse
		},
		waterColor: {
			default: '#0f4670',
			parse: colorParse
		},
		light: {
			type: 'selector'
		}
	},

	init: function () {
		this.water = null;
		console.log(this.data)
	},

	update: function () {
		this.water = undefined;
		this.el.setObject3D(null);
	},

	tick: function (time) {
		if (this.water) {
			this.water.material.uniforms.time.value = time/15000;
			this.water.render();
		} else if (
			this.el.sceneEl.renderer &&
			this.el.sceneEl.camera
		) {

			this.camera = new THREE.PerspectiveCamera();
			this.el.sceneEl.camera.add(this.camera);

			if (this.data.light && this.data.light.object3D) {
				var p = this.data.light.object3D.position.normalize();
				this.data.sunDirection = {
					x: p.x,
					y: p.y,
					z: p.z
				};
			}

			waterNormals = new THREE.TextureLoader().load( this.data.src );
			waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
			water = new THREE.Water( this.el.sceneEl.renderer, this.el.sceneEl.camera, this.el.sceneEl.object3D, {
				textureWidth: this.data.srcHeight,
				textureHeight: this.data.srcWidth,
				waterNormals: waterNormals,
				alpha: 	this.data.opacity,
				sunDirection: this.data.sunDirection,
				sunColor: this.data.sunColor,
				waterColor: this.data.waterColor,
				distortionScale: this.data.distortionScale,
				fog: true,
				clipBias: 0.1

			} );
			mirrorMesh = new THREE.Mesh(
				new THREE.PlaneBufferGeometry( this.data.width, this.data.depth ),
				water.material
			);
			mirrorMesh.add( water );
			mirrorMesh.rotation.x = - Math.PI * 0.5;
			mirrorMesh.scale.multiplyScalar(10);

			this.water = water;
			this.el.setObject3D('mesh', mirrorMesh);
		}
	},

	remove: function () {
		this.water.remove();
		this.water = undefined;
	}
});

AFRAME.registerPrimitive('a-water', {
	defaultComponents: {
		'water': {}
	},
	mappings: {
		width: 'water.width',
		depth: 'water.depth',
		color: 'water.color',
		opacity: 'water.opacity',
		light: 'water.light',
		src: 'water.src',
		'src-height': 'water.srcWidth',
		'src-width': 'water.srcHeight',
		'sun-color': 'water.sunColor',
		'water-color': 'water.waterColor',
		'distortion-scale': 'water.distortionScale'
	}
});
