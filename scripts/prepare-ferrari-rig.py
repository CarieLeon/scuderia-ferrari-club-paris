"""Prepare the original three.js Ferrari model for scroll-driven panel animation.

Requires Blender with glTF/Draco import and export support (verified with 5.2.2).
Run outside Blender with the original, unmodified example model:

    blender --background --python scripts/prepare-ferrari-rig.py -- \
        /path/to/ferrari.glb /path/to/output-directory

The second argument can also be a .glb filename. The helper writes the rigged
GLB and a JSON report alongside it. It does not download or overwrite the input.
Original source: https://github.com/mrdoob/three.js/blob/dev/examples/models/gltf/ferrari.glb
Original model: Ferrari 458 Italia by vicent091036 (see public model credits).

This is an asset-specific helper. Physical panels are identified by the loose
island names produced by the original model, plus measured bounds for trim.
Blender (X,Y,Z) converts to glTF/Three (X,Z,-Y). Closed hinge rotations are zero:
left Y=-1.08, right Y=+1.08, front X=+1.12, rear X=+1.37 radians when opened.
"""

import argparse
import json
import sys
from pathlib import Path

import bpy


def parse_arguments():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Original three.js ferrari.glb")
    parser.add_argument("output", type=Path, help="Output directory or .glb file")
    arguments = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    args = parser.parse_args(arguments)
    args.source = args.source.expanduser().resolve(strict=True)
    args.output = args.output.expanduser().resolve()
    if args.output.suffix.lower() != ".glb":
        args.output = args.output / "ferrari-458-rigged.glb"
    if args.source == args.output:
        parser.error("The output must differ from the original source file.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    return args


def split_physical_islands(obj):
    """Reconnect split normals/UV seams, then isolate physical surface islands."""
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=0.00001)
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")


def bounds(obj):
    points = [obj.matrix_world @ vertex.co for vertex in obj.data.vertices]
    return ([min(point[i] for point in points) for i in range(3)],
            [max(point[i] for point in points) for i in range(3)])


def join_objects(objects):
    if len(objects) < 2:
        return
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()


def material_key(obj):
    return tuple(material.name for material in obj.data.materials)


def main():
    args = parse_arguments()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(args.source))
    # These first splits must precede the remaining material splits so that the
    # original body island names remain stable for this specific source asset.
    for name in ("body", "glass"):
        obj = bpy.data.objects.get(name)
        if obj is None or obj.type != "MESH":
            raise RuntimeError(f"Expected original Ferrari mesh {name!r} missing")
        split_physical_islands(obj)
    for obj in list(bpy.context.scene.objects):
        if obj.type == "MESH" and not obj.name.startswith(("body", "glass")):
            split_physical_islands(obj)

    positions = {
        "hinge_left": (-0.79, 0.72, 0.62),
        "hinge_right": (0.79, 0.72, 0.62),
        "hinge_front": (0, 0.88, 0.73),
        "hinge_rear": (0, -2.15, 0.95),
    }
    hinges = {}
    for name, position in positions.items():
        hinge = bpy.data.objects.new(name, None)
        bpy.context.collection.objects.link(hinge)
        hinge.location = position
        hinges[name] = hinge
    # Refresh matrices before preserving world transforms during reparenting.
    bpy.context.view_layer.update()
    assignments = {name: [] for name in hinges}
    explicit_panels = {
        "body.004": "hinge_left", "body.006": "hinge_right",
        "body.017": "hinge_left", "body.018": "hinge_right",
        "body.019": "hinge_left", "body.020": "hinge_right",
        "body.013": "hinge_front", "body.011": "hinge_rear",
        "body.008": "hinge_rear", "body": "hinge_rear",
        "interior_dark": "hinge_rear", "interior_dark.007": "hinge_rear",
    }
    missing = set(explicit_panels) - set(bpy.data.objects.keys())
    if missing:
        raise RuntimeError(f"Unexpected source panel layout; missing {sorted(missing)}")
    report = []
    for obj in list(bpy.context.scene.objects):
        if obj.type != "MESH":
            continue
        minimum, maximum = bounds(obj)
        target = explicit_panels.get(obj.name)
        if not target and not obj.name.startswith(("body", "glass")):
            for sign, name in ((-1, "hinge_left"), (1, "hinge_right")):
                side_min, side_max = ((minimum[0], maximum[0]) if sign > 0
                                      else (-maximum[0], -minimum[0]))
                door = (side_min > 0.68 and side_max < 1.15
                        and minimum[1] > -0.58 and maximum[1] < 0.74
                        and minimum[2] > 0.22 and maximum[2] < 1.02)
                mirror = (side_min > 0.87 and side_max < 1.15
                          and minimum[1] > 0.30 and maximum[1] < 0.68
                          and minimum[2] > 0.71)
                if door or mirror:
                    target = name
                    break
        if target:
            world_matrix = obj.matrix_world.copy()
            obj.parent = hinges[target]
            obj.matrix_world = world_matrix
            assignments[target].append(obj.name)
        report.append({"name": obj.name, "vertices": len(obj.data.vertices),
                       "min": minimum, "max": maximum, "hinge": target})

    # Join static islands by material AND parent, preserving separate wheels.
    static_materials = {}
    for obj in bpy.context.scene.objects:
        if obj.type == "MESH" and obj.parent not in hinges.values():
            key = (material_key(obj), obj.parent.name if obj.parent else "none")
            static_materials.setdefault(key, []).append(obj)
    for objects in static_materials.values():
        join_objects(objects)
    for name, hinge in hinges.items():
        materials = {}
        for child in list(hinge.children):
            materials.setdefault(material_key(child), []).append(child)
        for objects in materials.values():
            join_objects(objects)
        for child in hinge.children:
            material = child.data.materials[0].name if child.data.materials else "part"
            child.name = name.replace("hinge_", "panel_") + "_" + material
        if not hinge.children:
            raise RuntimeError(f"Empty hinge assembly: {name}")
    for name in ("wheel_fl", "wheel_fr", "wheel_rl", "wheel_rr"):
        if not bpy.data.objects.get(name):
            raise RuntimeError(f"Wheel assembly lost: {name}")
    bpy.ops.export_scene.gltf(
        filepath=str(args.output), export_format="GLB",
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_cameras=False, export_lights=False,
    )
    args.output.with_suffix(".report.json").write_text(json.dumps({
        "source": str(args.source), "blender_version": bpy.app.version_string,
        "hinge_positions_blender": positions, "assignments": assignments,
        "physical_components": report,
    }, indent=2))
    print(f"Prepared Ferrari rig: {args.output}")


if __name__ == "__main__":
    main()
