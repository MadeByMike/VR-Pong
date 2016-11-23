AFRAME.registerPrimitive('a-laser', {
    defaultComponents: {
      laser: {}
    },
    mappings: {
      radius: 'laser.radius',
      length: 'laser.length',
      detail: 'laser.detail',
      opacity: 'laser.opacity',
    }
});

AFRAME.registerComponent('laser', {

  schema: {
    radius: {default: 0.5, min: 0},
    length: {default: 10, min: 0},
    detail: {default: 2, min: 0},
    opacity: {default: 1 }
  },

  init: function(){
    this.start  =  Date.now();
  },

  /**
   * Use play() instead of init(), because component mappings – unavailable as dependencies – are
   * not guaranteed to have parsed when this component is initialized.
   */

  play: function () {
    var el = this.el,
        data = this.data,
        material = el.components.material;

    this.geometry = new THREE.CylinderGeometry(
      data.radius,
      data.radius,
      data.length,
      5
    );
    if (!material) {
      material = {};

      material.material = new THREE.ShaderMaterial( {
        vertexShader: [
          'uniform float amplitude;',
          'attribute float displacement;',
          'varying vec3 vNormal;',
          'void main() {',
              'vNormal = normal;',
              '// multiply our displacement by the',
              '// amplitude. The amp will get animated',
              '// so well have animated displacement',
              'vec3 newPosition = position + ',
                                 'normal * ',
                                 'vec3(0.05 * amplitude);',
              'gl_Position = projectionMatrix *',
                            'modelViewMatrix *',
                            'vec4(newPosition, 1.0);',
          '}',
        ].join('\n'),

        fragmentShader: [
          'uniform float opacity;',
          'void main() {',
              'vec4 color = vec4(0.96,0.41,.56,0);',
              'gl_FragColor = vec4( color.rgb, opacity);',

          '}'
        ].join('\n'),

        transparent: true,
        uniforms: {
          opacity: {
            type: "f",
            value: data.opacity
          },
          amplitude: {
              type: 'f', // a float
              value: 0
          },
          displacement: {
              type: 'f', // a float
              value: [] // an empty array
          }
        }
      });
      this.material = material.material;
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    el.object3D.add(this.mesh);
  },

  remove: function () {
    this.el.object3D.remove(this.mesh);
  },

  tick: function(){
    this.material.uniforms[ 'amplitude' ].value = Math.sin(( Date.now() - this.start ))
  }

});
