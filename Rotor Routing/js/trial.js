// Helper Classes
class Vertex {
    constructor(x,y, mesh, center) {
        this.x = x;
        this.y = y;
        this.id = mesh.uuid;
        this.color = 0xffffff;
        this.center = center;
        this.cycord = [];
        this.chips = [];
        this.rotorpos = 0;
        this.temppos = 0;
        this.mesh = mesh;
    }

    orderCycord(clockwise = true) {
        const angles = []
        this.cycord.forEach(v => {
            let x = v.x - this.x;
            let y = v.y - this.y;
            let phi = cart2pol(x,y)[1];
            angles.push([phi, v]);
        });
        if (clockwise)
            angles.sort(function (a,b) {return b[0]-a[0]})
        else
            angles.sort(function (a,b) {return a[0]-b[0]})
        const cycord = []
        angles.forEach(a => {
            cycord.push(a[1])
        });
        this.cycord = cycord;
    }

    setFirst(v) {
        this.rotorpos = this.cycord.indexOf(v);
    }

    drawRotor() {
        if (this.id === sink_vertex.id) {
            return;
        }
        let w = this.cycord[this.rotorpos];
        let from = this.center;
        let to = w.center;
        let direction = to.clone().sub(from);
        let length = direction.length();
        const helper = new THREE.ArrowHelper(direction.normalize(), from, length, 0xffffff, 2, 2)
        scene.add(helper)
        this.rotor = helper;
        arrows.push(helper.uuid)
    }
}

function cart2pol(x, y) {
    let r = Math.sqrt(x ** 2 + y ** 2)
    let phi = Math.atan2(y, x)
    return [r, phi]
}


class Edge {
    constructor(v_1, v_2, mesh) {
        this.v_1 = v_1;
        this.v_2 = v_2;
        this.id = mesh.uuid;
        this.color = 0xffffff;
        this.v_1.cycord.push(v_2);
        this.v_2.cycord.push(v_1);
        this.mesh = mesh;
    }

}


class Chip {
    constructor(v, mesh) {
        this.vertex = v;
        this.xpos = v.x;
        this.ypos = v.y;
        v.chips.push(this);
        this.mesh = mesh;
        this.id = mesh.uuid;
    }

    updatePosition(x,y) {
        this.xpos = x;
        this.ypos = y;
        this.mesh.position.set(x,y,0)
    }
}


// Variables to keep track of
const vertices = [];
const edges = [];
let tree_active = false;
let cursor = 0;
let edge1;
let edge_index = 0;
let sink = false;
const tree = [];
const arrows = [];
const cverts = [];
const chips = [];
let sink_vertex;

const f_per_op = 30;
let t = 0;
let firings;
let total_operations;
let total_frames;
let oldv;
let newv;


// Helper Function
function getCenterPoint(mesh) {
    let geometry = mesh.geometry;
    geometry.computeBoundingBox();
    let center = new THREE.Vector3();
    geometry.boundingBox.getCenter( center );
    mesh.localToWorld( center );
    return center;
}


// Variables to make viewing work
init_ui();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const scene = new THREE.Scene();


// Variables ot make clicking work
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)
camera.position.set(0, 0 , 100);
camera.lookAt( 0, 0, 0);


function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    switch (cursor) {
        case 0:
            createVertex();
            renderer.render(scene, camera);
            break;
        case 1:
            createEdge();
            renderer.render(scene, camera);
            break;
        case 2:
            createSink();
            renderer.render(scene, camera);
            break;
        case 3:
            createTree();
            renderer.render(scene, camera);
            break;
        case 4:
            addChip()
            renderer.render(scene, camera);
            break;
    }
}

// Create a new vertex for chip firing
// Works Fine
function createVertex() {

    if (mouse.y > 0.9)
        return

    planeNormal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    const sphereMesh = new THREE.Mesh(
        new THREE.CircleGeometry(.5, 360),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    );
    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);
    let center = getCenterPoint(sphereMesh);
    vertices.push(new Vertex(mouse.x, mouse.y, sphereMesh, center))

}

function createEdge() {
    raycaster.setFromCamera( mouse, camera );

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children );

    if (intersects.length < 1)
        return

    let object;
    if (intersects.length > 0) {
        for (let i = 0; i<intersects.length; i++){
            if (intersects[i].object.geometry.type === "CircleGeometry") {
                object = intersects[i].object
            }
        }
    }
    if (typeof object === "undefined") {
        return
    }

    if (edge_index === 0) {
        object.material.color.set( 0x0000ff );
        edge1 = object
        edge_index = 1
    }
    else {
        //TODO: Make this based on line length
        const material = new MeshLineMaterial({
            color:0x808080,
            linewidth: 1,
            dashArray: 0.2,
            dashRatio: 0.3,
            transparent: true,
            opacity: 0.4,
        });
        const line = new MeshLine();
        line.setPoints([getCenterPoint(edge1), getCenterPoint(object)])
        const mesh = new THREE.Mesh(line, material);
        mesh.raycast = MeshLineRaycast;
        scene.add(mesh);
        let color;
        vertices.forEach(v => {
            if (v.id === edge1.uuid) {
                color = v.color;
            }

        })
        edge1.material.color.set(color);
        edge_index = 0
        edges.push(new Edge(find_Vertex(edge1.uuid), find_Vertex(object.uuid), mesh));
    }
}

function find_Vertex(id) {
    let vertex;
    vertices.forEach( v => {
        if (v.id === id) {
            vertex= v;
        }
    })
    return vertex
}

function createSink() {
    if (!sink) {
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length < 1)
            return

        let object;

        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.geometry.type === "CircleGeometry") {
                    object = intersects[i].object
                }
            }

        }

        if (typeof object === "undefined") {
            return
        }

        object.material.color.set(0xff0000)
        vertices.forEach(v => {
            if (v.id === object.uuid) {
                v.color = 0xff0000;
                sink_vertex = v;
            }

        });
        sink = true;
    }

}

function createTree() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length < 1)
        return

    let object;

    if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.geometry.type === "MeshLine") {
                object = intersects[i].object;
            }
        }

    }

    if (typeof object === "undefined") {
        return
    }

    object.material.color.set(0x0000ff);

    edges.forEach(e => {
        if (e.id === object.uuid)
            tree.push(e);
    })

}

function addChip() {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length < 1)
        return

    let object;

    if (intersects.length > 1) {
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.geometry.type === "CircleGeometry") {
                object = intersects[i].object;
            }
        }

    } else {
        object = intersects[0].object;
    }

    let vertex;
    vertices.forEach(v => {
        if (object.uuid === v.id) {
            vertex = v;
        }
    })

    if (mouse.y > 0.9)
        return

    const sphereMesh = new THREE.Mesh(
        new THREE.CircleGeometry(.75, 360),
        new THREE.MeshBasicMaterial({color: 0x98ff98})
    );
    scene.add(sphereMesh);
    sphereMesh.position.copy(vertex.mesh.position);

    chips.push(new Chip(vertex, sphereMesh));
    cverts.push(vertex);
}

window.addEventListener('mousedown', onMouseDown)