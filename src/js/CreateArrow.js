export default class CreateArrow {
    constructor(info) {
        this.gltfLoader = info.gltfLoader;
        this.scene = info.scene;
        this.name = info.name;

        this.positionX = info.positionX || 0;
        this.positionY = info.positionY || 0;
        this.positionZ = info.positionZ || 0;

        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;
        
        this.gltfLoader.load(
            './public/models/arrow.glb',
            gltf => {
                const model = gltf.scene.children[0];
                
                model.name = this.name;
                model.position.set(this.positionX, this.positionY, this.positionZ);
                model.rotation.set(this.rotationX, this.rotationY, this.rotationZ);
                
                this.scene.add(model);
            }
        )
        
    }
}