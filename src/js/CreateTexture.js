export default class CreateTexture {
  constructor(info) {
    this.cubeTextureLoader = info.cubeTextureLoader;
    this.folder = info.folder;

    this.cubeTextureLoader
      .setPath(`./public/texture/${this.folder}/`)
      .load([
          'px.png', 'nx.png',
          'py.png', 'ny.png',
          'pz.png', 'nz.png',
      ]);

    return this.cubeTextureLoader;
  }
}