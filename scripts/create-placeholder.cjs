// Generate a flat-shaded glTF 2.0 cube without a build-time dependency.
const fs = require('node:fs');
const path = require('node:path');
const faces = [
  [[0,0,1], [1,0,0], [0,1,0]],
  [[0,0,-1], [-1,0,0], [0,1,0]],
  [[1,0,0], [0,0,-1], [0,1,0]],
  [[-1,0,0], [0,0,1], [0,1,0]],
  [[0,1,0], [1,0,0], [0,0,-1]],
  [[0,-1,0], [1,0,0], [0,0,1]]
];
const positions = [], normals = [], indices = [];
faces.forEach(([normal,u,v], face) => {
  for (const [x,y] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
    positions.push(...normal.map((n,i) => .65 * (n + x*u[i] + y*v[i])));
    normals.push(...normal);
  }
  indices.push(...[0,1,2,0,2,3].map(i=>i+face*4));
});
const positionBuffer = Buffer.from(new Float32Array(positions).buffer);
const normalBuffer = Buffer.from(new Float32Array(normals).buffer);
const indexBuffer = Buffer.from(new Uint16Array(indices).buffer);
const binary = Buffer.concat([positionBuffer, normalBuffer, indexBuffer]);
const gltf = {
  asset:{version:'2.0',generator:'saldi.dev placeholder cube'},
  scene:0, scenes:[{nodes:[0]}], nodes:[{mesh:0,name:'Placeholder cube'}],
  meshes:[{primitives:[{attributes:{POSITION:0,NORMAL:1},indices:2,material:0}]}],
  materials:[{name:'Workbench lime',pbrMetallicRoughness:{baseColorFactor:[.68,.88,.20,1],metallicFactor:.05,roughnessFactor:.5}}],
  accessors:[
    {bufferView:0,componentType:5126,count:24,type:'VEC3',min:[-.65,-.65,-.65],max:[.65,.65,.65]},
    {bufferView:1,componentType:5126,count:24,type:'VEC3'},
    {bufferView:2,componentType:5123,count:36,type:'SCALAR'}
  ],
  bufferViews:[
    {buffer:0,byteOffset:0,byteLength:positionBuffer.length,target:34962},
    {buffer:0,byteOffset:positionBuffer.length,byteLength:normalBuffer.length,target:34962},
    {buffer:0,byteOffset:positionBuffer.length+normalBuffer.length,byteLength:indexBuffer.length,target:34963}
  ], buffers:[{byteLength:binary.length}]
};
const json = Buffer.from(JSON.stringify(gltf));
const paddedJson = Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,0x20)]);
const header = Buffer.alloc(12), jsonHeader = Buffer.alloc(8), binaryHeader = Buffer.alloc(8);
header.writeUInt32LE(0x46546c67,0); header.writeUInt32LE(2,4);
header.writeUInt32LE(12+8+paddedJson.length+8+binary.length,8);
jsonHeader.writeUInt32LE(paddedJson.length,0); jsonHeader.writeUInt32LE(0x4e4f534a,4);
binaryHeader.writeUInt32LE(binary.length,0); binaryHeader.writeUInt32LE(0x004e4942,4);
const output = path.resolve(__dirname,'../assets/models/placeholder-cube.glb');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,Buffer.concat([header,jsonHeader,paddedJson,binaryHeader,binary]));
console.log(`Created ${output}`);
