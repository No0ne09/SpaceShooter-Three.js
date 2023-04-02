//-----------------zmienne pomocnicze------------//

var i=1;
var tablicaAlien=[];
var tablicaPocisk=[];
var wymiary=[-600,-400,-200,0,200,400,600]
var punkty=0;
var wynik=document.getElementById('wynik');

//------------------inicjalizacja----------------//


//skybox
const scene = new THREE.Scene();
const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'textures/lf.jpg',
    'textures/rt.jpg',
    'textures/up.jpg',
    'textures/dn.jpg',
    'textures/ft.jpg',
    'textures/bk.jpg',
  ]);
scene.background = texture;


//kamera
const camera = new THREE.PerspectiveCamera( 85, window.innerWidth/window.innerHeight, 0.1, 20000);
camera.lookAt( scene.position );


//pozycjonowanie kamery
camera.position.set( 11200, 0, 5300 );
camera.rotation.y=Math.PI;


//renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
var canvas = renderer.domElement;
renderer.setClearColor( new THREE.Color( 0xffffff ) );

document.getElementsByTagName('body')[0].appendChild( canvas );



//----------------wlaczenie cieni-----------------//


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


//------------------swiatlo------------------------//


const light = new THREE.PointLight( 0xe7f5c6,1,0 );
scene.add( light );
light.position.set(15000,0,5000);


//------------------statek gracza--------------------//


//naped
const geometryNaped = new THREE.TorusGeometry( 50, 8, 15, 15 );
const NapedTexture =  new THREE.TextureLoader().load('textures/naped.jpg');
const materialNaped = new THREE.MeshStandardMaterial( { map:NapedTexture,  } );
NapedTexture.map=NapedTexture;
const Naped = new THREE.Mesh( geometryNaped, materialNaped );
Naped.receiveShadow=true;
Naped.castShadow=true;
Naped.position.set(50,-65,0);
Naped.rotation.x+=Math.PI/2;


//body
const geometryBody = new THREE.CylinderGeometry( 120,30, 60, 64 );
const BodyTexture=new THREE.TextureLoader().load('textures/body.jpg');
const materialBody = new THREE.MeshStandardMaterial( {map: BodyTexture} );
BodyTexture.map=BodyTexture;
const Body = new THREE.Mesh( geometryBody, materialBody );
Body.castShadow=true;
Body.receiveShadow=true;
Body.rotation.z+=Math.PI;
Body.position.set(50,0,0);


//okno
const geometryOkno = new THREE.SphereGeometry( 30, 32, 16 );
const OknoTexture=new THREE.TextureLoader().load('textures/eye.jpg');
const materialOkno = new THREE.MeshBasicMaterial( { map:OknoTexture,
  envMap: scene.background,      
  combine: THREE.MixOperation,  
  reflectivity: 0.8,
  } );
OknoTexture.map=OknoTexture;
const Okno = new THREE.Mesh( geometryOkno, materialOkno );
Okno.receiveShadow=true;
Okno.castShadow=true;
Okno.position.set(50,30,0);
Okno.rotation.y-=Math.PI/2;


//dzialko1
const geometryGun1 = new THREE.CapsuleGeometry( 12, 100, 5, 5 );
const Gun1Texture=new THREE.TextureLoader().load('textures/gun.jpg');
const materialGun1 = new THREE.MeshBasicMaterial( {map:Gun1Texture,
  envMap: scene.background,      
  combine: THREE.MixOperation,  
  reflectivity: .3,} );
Gun1Texture.map=Gun1Texture;
const Gun1 = new THREE.Mesh( geometryGun1, materialGun1 );
Gun1.castShadow=true;
Gun1.receiveShadow=true;
Gun1.position.set(-60,-28,-20);
Gun1.rotation.x+=Math.PI/2;


//dzialko2
var Gun2=Gun1.clone();
Gun2.position.set(160,-28,-20);


//caly statek
var mesh=new THREE.Group();
 mesh.add(Body);
 mesh.add(Okno);
 mesh.add(Naped);
 mesh.add(Gun1);
 mesh.add(Gun2);
mesh.position.set(10000,0,5000);
mesh.rotation.y-=Math.PI/6;
mesh.castShadow=true;

scene.add(mesh);


//-----------------tło-------------------------//


//planeta1
const geometryPlanet1 = new THREE.SphereGeometry( 9900, 256, 256 );
const Planet1Texture=new THREE.TextureLoader().load('textures/planet1.jpg');
const materialPlanet1 = new THREE.MeshStandardMaterial( { map:Planet1Texture,

  } );
Planet1Texture.map=Planet1Texture;
const Planet1 = new THREE.Mesh( geometryPlanet1, materialPlanet1 );
Planet1.receiveShadow=true;
Planet1.castShadow=true;

Planet1.position.set(0,0,0);


//---------------sledzenie kamery--------------//


var follow=new THREE.Group();
follow.add(Planet1);
follow.add(camera);
follow.add(light);
scene.add(follow);
  

//---------------sterowanie-------------------//


window.addEventListener(
  'keydown',
  function( e ) {
    
    e = e || window.event;
    switch ( e.key ) {

//gora
    case 'w': 
    
    if(mesh.position.y<600){
    mesh.position.y+=200;
   }
      break;

// dol
    case 's': 
    
    if(mesh.position.y>-600){
    mesh.position.y-=200;
    }
      break;

case ' ':    
Strzel();
  break;    
    default:
      
    }
    renderer.render( scene, camera );
  },
  false
  );


//--------------------strzelanie---------------------------//


//tablicowanie pociskow
function Strzel(){
  const x =mesh.position.x;
  const y=mesh.position.y;
  const z=mesh.position.z;
  const geometryPocisk=new THREE.SphereGeometry(50,3,2);
  const PociskTexture= new THREE.TextureLoader().load('textures/pocisk.jpg')
  const materialPocisk=new THREE.MeshStandardMaterial({map:PociskTexture});
  const Pocisk=new THREE.Mesh(geometryPocisk,materialPocisk);
  Pocisk.receiveShadow=true;
  Pocisk.receiveShadow=true;
  Pocisk.position.set(x,y,z);
  Pocisk.rotation.x+=Math.PI;

  scene.add(Pocisk);
  tablicaPocisk.push(Pocisk);
}


//------------------enemy spawner----------------//


//tablicowanie przeciwnikow
function Enemy(){
i++;
const x =10000;
var temp=Math.floor(Math.random() * (wymiary.length - 0) + 0);
 const y=wymiary[temp];
 const z=mesh.position.z-(i*10000);
 const geometryAlien= new THREE.ConeGeometry( 100,300, 32 );
  const AlienTexture =new THREE.TextureLoader().load('textures/alien.jpg');
  AlienTexture.map=AlienTexture;
const materialAlien = new THREE.MeshStandardMaterial( {map:AlienTexture,
 } );
AlienTexture.map=AlienTexture;
const Alien = new THREE.Mesh( geometryAlien, materialAlien );
Alien.receiveShadow=true;
Alien.castShadow=true;
Alien.position.set(x,y,z);
Alien.rotation.x+=Math.PI/2;

scene.add( Alien );
tablicaAlien.push(Alien);
}
 

//-------usuwanie niewidocznych przeciwnikow------//


function DelAlien(){
  for(let j=tablicaAlien.length-1;j>=0;j--){
    if(follow.position.z<tablicaAlien[j].position.z-10000){
      scene.remove(tablicaAlien[j]);
      tablicaAlien.splice(j,1);
    }
    
  }
}


//-------usuwanie zbyt odleglych Pociskow------//


function DelPocisk(){
  for(let j=tablicaPocisk.length-1;j>=0;j--){
    if(tablicaPocisk[j].position.z<follow.position.z-1500){
      scene.remove(tablicaPocisk[j]);
      tablicaPocisk.splice(j,1);
    }
  }

}


//---------------------kolizje--------------------------//


function Detect()
{

  //kolizjce pociskow z enemy
  for(let a=tablicaPocisk.length-1; a>=0 ; a--) {
    for(let j=tablicaAlien.length-1; j>=0; j--) {
      if(tablicaPocisk[a].position.y==tablicaAlien[j].position.y) 
      {
        if(Math.abs(tablicaPocisk[a].position.z-tablicaAlien[j].position.z)<300)
        { 
        scene.remove(tablicaAlien[j]);
      tablicaAlien.splice(j,1);
    scene.remove(tablicaPocisk[a]);
  tablicaPocisk.splice(a,1);
  punkty+=5;
  
 
        }
       }

  
    }
  }
  for(let j=tablicaAlien.length-1; j>=0; j--) 
  {
  if(mesh.position.y==tablicaAlien[j].position.y)
  {
    if(mesh.position.z==tablicaAlien[j].position.z)
    {
      alert("GAME OVER");
    alert("Za chwilę gra rozpocznie się od nowa");
    window.location.reload();
      
      
    }
  }
    }
}


//---------------------------animacje--------------------//


function animate() {

//animacja statku
 Naped.rotation.z+=1;
follow.position.z-=200;
mesh.position.z-=200;

//animacja tła
Planet1.rotation.y+=0.001;


//usuwanie zbednych przeciwnikow i pociskow
DelAlien();
DelPocisk();
Detect();





//napedzanie pociskow
for(let a=tablicaPocisk.length-1;a>=0;a--){
  
  tablicaPocisk[a].position.z-=500;
}

camera.lookAt(follow.position);
 requestAnimationFrame( animate );
	renderer.render( scene, camera );
  wynik.textContent=punkty;
}
//wywołanie funkcji dodającej wrogów
setInterval(Enemy,1337);

animate();


//--------------zmiana rozmiaru okna----------------------------//


window.addEventListener(
  'resize',
  function() {
    this.alert("resize");
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
  },
  false
);



