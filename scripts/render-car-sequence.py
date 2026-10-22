"""Ray-traced F40 scroll sequence. Blender 5.2 / Cycles with optional Metal.

blender -b --python scripts/render-f40-sequence.py -- --poses --samples 32
blender -b --python scripts/render-f40-sequence.py -- --start 0 --end 103 --samples 32 --keys-first

104 unique keyframes: 0..59 p=.12..47; 60..103 p=.58..86.
Uses the licensed source rig, retaining its topology and authored split normals.
No automatic per-frame framing or artificial engine geometry.
"""
import argparse, json, math, sys, time
from pathlib import Path
import bpy
from mathutils import Vector, Matrix

BASE = Path.cwd()
parser = argparse.ArgumentParser()
parser.add_argument('--source', default=str(BASE/'public/models/ferrari-f40-rigged.glb'))
parser.add_argument('--output', '--outputdir', dest='output', default=str(BASE/'work/f40-sequence'))
parser.add_argument('--start', type=int, default=0)
parser.add_argument('--end', type=int, default=103)
parser.add_argument('--samples', type=int, default=32)
parser.add_argument('--width', type=int, default=1280)
parser.add_argument('--height', type=int, default=800)
parser.add_argument('--poses', action='store_true')
parser.add_argument('--cpu', action='store_true')
parser.add_argument('--device', choices=['AUTO','METAL','CPU'], default='AUTO')
parser.add_argument('--save-blend')
parser.add_argument('--measure-only', action='store_true')
parser.add_argument('--indices', help='Optional comma-separated frame indices')
parser.add_argument('--keys-first', action='store_true')
parser.add_argument('--prepared', action='store_true', help='Source is an already prepared studio .blend')
args = parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
if not 0 <= args.start <= args.end <= 103:parser.error('Frame range must satisfy 0 <= start <= end <= 103')
if args.width <= 0 or args.height <= 0 or args.samples < 1:parser.error('Resolution and samples must be positive')
if args.indices and any(not x.strip().isdigit() or not 0 <= int(x) <= 103 for x in args.indices.split(',')):parser.error('Frame indices must be integers from 0 to 103')
outdir=Path(args.output);outdir.mkdir(parents=True,exist_ok=True)
if Path(args.source).suffix.lower()=='.glb':
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=args.source)
else:bpy.ops.wm.open_mainfile(filepath=args.source)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.device='CPU'
scene.cycles.samples=args.samples
scene.cycles.seed=0
scene.cycles.use_denoising=True
scene.cycles.adaptive_threshold=.035
scene.cycles.max_bounces=7
scene.cycles.diffuse_bounces=3
scene.cycles.glossy_bounces=4
scene.cycles.transmission_bounces=6
scene.cycles.transparent_max_bounces=6
scene.cycles.sample_clamp_indirect=2.0
scene.render.use_persistent_data=True
try:
 pref=bpy.context.preferences.addons['cycles'].preferences
 pref.compute_device_type='METAL';pref.get_devices()
 for device in pref.devices:device.use=(device.type=='METAL' and not args.cpu and args.device!='CPU')
 if any(d.use for d in pref.devices):scene.cycles.device='GPU'
 else:scene.cycles.device='CPU'
 print('RENDER_DEVICE',scene.cycles.device,[(d.name,d.type,d.use) for d in pref.devices],flush=True)
except Exception as exc:print('CPU fallback',exc,flush=True)
scene.render.resolution_x=args.width;scene.render.resolution_y=args.height;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB';scene.render.image_settings.color_depth='8'
scene.render.film_transparent=False
scene.view_settings.view_transform='AgX'
try:scene.view_settings.look='AgX - Medium High Contrast'
except:pass
scene.view_settings.exposure=-.10
scene.render.image_settings.compression=15

if args.prepared:
 cam=bpy.data.objects.get('Authored scroll camera')
 if cam is None:raise ValueError('Prepared studio camera missing')
else:
 # Carefully tuned physically based finishes. Existing detail maps are retained.
 def principled(mat):
  if not mat.node_tree:return None
  return next((n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
 for mat in bpy.data.materials:
  p=principled(mat)
  if not p:continue
  name=mat.name
  if name=='material':
   p.inputs['Base Color'].default_value=(.28,.008,.012,1)
   p.inputs['Metallic'].default_value=0
   p.inputs['Roughness'].default_value=.30
   p.inputs['Coat Weight'].default_value=.30
   p.inputs['Coat Roughness'].default_value=.22
   p.inputs['Specular IOR Level'].default_value=.32
   p.inputs['IOR'].default_value=1.48
  elif name in ['F40_Window.001','super_headlight']:
   p.inputs['Base Color'].default_value=(.018,.022,.021,1);p.inputs['Metallic'].default_value=0;p.inputs['Roughness'].default_value=.55;p.inputs['Alpha'].default_value=1;p.inputs['Transmission Weight'].default_value=0
  elif 'Window' in name or 'Glass' in name:
   p.inputs['Base Color'].default_value=(.60,.68,.72,1)
   p.inputs['Metallic'].default_value=0
   p.inputs['Roughness'].default_value=.055
   p.inputs['Alpha'].default_value=1
   p.inputs['Transmission Weight'].default_value=1
   p.inputs['IOR'].default_value=1.45
  elif name.startswith('Scene_-_Root'):
   p.inputs['Base Color'].default_value=(.012,.013,.014,1)
   p.inputs['Metallic'].default_value=0;p.inputs['Roughness'].default_value=.76
  elif 'Rrims' in name:
   p.inputs['Base Color'].default_value=(.26,.28,.30,1)
   p.inputs['Metallic'].default_value=.8;p.inputs['Roughness'].default_value=.27
  elif 'Chrome' in name:
   p.inputs['Metallic'].default_value=.8;p.inputs['Roughness'].default_value=.23
  elif 'Carbon' in name or 'Cockpit' in name or 'Skin' in name:
   p.inputs['Roughness'].default_value=max(.53,p.inputs['Roughness'].default_value)
   p.inputs['Metallic'].default_value=0
  elif 'Mechanics' in name:
   p.inputs['Roughness'].default_value=max(.38,p.inputs['Roughness'].default_value)
   if name.endswith('.001'):
    p.inputs['Base Color'].default_value=(.24,.26,.27,1);p.inputs['Metallic'].default_value=.7;p.inputs['Roughness'].default_value=.45

 # Muted graphite studio cyclorama: continuous plane with subtle microstructure.
 def new_material(name,color,roughness,metallic=0):
  mat=bpy.data.materials.new(name);mat.use_nodes=True;nodes=mat.node_tree.nodes;nodes.clear()
  p=nodes.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=color;p.inputs['Roughness'].default_value=roughness;p.inputs['Metallic'].default_value=metallic
  output=nodes.new('ShaderNodeOutputMaterial');mat.node_tree.links.new(p.outputs['BSDF'],output.inputs['Surface'])
  return mat,p
 # Finish small authored details without changing topology or split normals.
 gold,gp=new_material('Yellow enamel Ferrari wing badges',(.74,.43,.012,1),.3,.15)
 redcover,rp=new_material('Satin red cylinder covers',(.23,.009,.014,1),.48,.02)
 for obj in bpy.context.scene.objects:
  if obj.type!='MESH' or not obj.data.materials:continue
  matname=obj.data.materials[0].name
  if obj.parent and obj.parent.name=='hinge_front' and matname in ['F40_Chrome','F40_Headlights']:
   dark,dp=new_material('Graphite headlight rear housings '+obj.name,(.018,.022,.021,1),.6,0);obj.data.materials[0]=dark
  if matname=='F40_Logos':
   slot=len(obj.data.materials);obj.data.materials.append(gold)
   for poly in obj.data.polygons:
    co=obj.matrix_world@poly.center
    if abs(co.x)>.90 and .70<co.y<.86 and .58<co.z<.78:poly.material_index=slot
  if matname=='F40_Mechanics.001':
   slot=len(obj.data.materials);obj.data.materials.append(redcover)
   # Two valve covers and their top reliefs; all intake pipes stay aluminium.
   for poly in obj.data.polygons:
    co=obj.matrix_world@poly.center
    if .16<abs(co.x)<.34 and -1.08<co.y<-.53 and .48<co.z<.88:poly.material_index=slot
 for name in ['hinge_left','hinge_right','hinge_front','hinge_rear']:
  bpy.data.objects[name].rotation_mode='XYZ'
  bpy.data.objects[name].rotation_euler=(0,0,0)

 floor_mat,floor_shader=new_material('Photographic graphite floor',(.018,.022,.021,1),.48,0)
 floor_shader.inputs['Specular IOR Level'].default_value=.18
 noise=floor_mat.node_tree.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=160;noise.inputs['Detail'].default_value=2
 bump=floor_mat.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.045;bump.inputs['Distance'].default_value=.008
 floor_mat.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);floor_mat.node_tree.links.new(bump.outputs['Normal'],floor_shader.inputs['Normal'])
 bpy.ops.mesh.primitive_plane_add(size=2000,location=(0,0,-.007));bpy.context.object.name='Graphite photographic floor';bpy.context.object.data.materials.append(floor_mat)
 scene.world=bpy.data.worlds.new('Quiet charcoal studio');scene.world.use_nodes=True;wn=scene.world.node_tree.nodes;wn.clear()
 bg=wn.new('ShaderNodeBackground');bg.inputs['Color'].default_value=(.075,.085,.082,1);bg.inputs['Strength'].default_value=.28
 wo=wn.new('ShaderNodeOutputWorld');scene.world.node_tree.links.new(bg.outputs['Background'],wo.inputs['Surface'])

 def softbox(name,location,target,power,width,height,color=(1,1,1)):
  bpy.ops.object.light_add(type='AREA',location=location);obj=bpy.context.object;obj.name=name;obj.data.energy=power;obj.data.shape='RECTANGLE';obj.data.size=width;obj.data.size_y=height;obj.data.color=color
  obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler();return obj
 # Large continuous reflection, soft rear rim and a very low front fill.
 # A real diffusing strip with feathered borders avoids a hard white rectangle.
 bpy.ops.mesh.primitive_plane_add(size=1,location=(-2.5,.3,5.5));key=bpy.context.object;key.name='Feathered photographic strip';key.scale=(1.5,6.5,1);key.rotation_euler=(Vector((0,0,.5))-key.location).to_track_quat('Z','Y').to_euler();key.visible_camera=False;key.visible_glossy=False
 km=bpy.data.materials.new('Feathered softbox emission');km.use_nodes=True;kn=km.node_tree.nodes;kn.clear();ko=kn.new('ShaderNodeOutputMaterial');ke=kn.new('ShaderNodeEmission');ke.inputs['Strength'].default_value=12;uv=kn.new('ShaderNodeTexCoord');sub=kn.new('ShaderNodeVectorMath');sub.operation='SUBTRACT';sub.inputs[1].default_value=(.5,.5,0);length=kn.new('ShaderNodeVectorMath');length.operation='LENGTH';ramp=kn.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=.05;ramp.color_ramp.elements[0].color=(1,.96,.92,1);ramp.color_ramp.elements[1].position=.6;ramp.color_ramp.elements[1].color=(0,0,0,1);ramp.color_ramp.interpolation='EASE';kl=km.node_tree.links;kl.new(uv.outputs['UV'],sub.inputs[0]);kl.new(sub.outputs['Vector'],length.inputs[0]);kl.new(length.outputs['Value'],ramp.inputs[0]);kl.new(ramp.outputs['Color'],ke.inputs['Color']);kl.new(ke.outputs['Emission'],ko.inputs['Surface']);key.data.materials.append(km)
 softbox('Soft rim strip',(4,-5,4),(0,-.8,.65),350,.5,4,(.86,.91,1))
 softbox('Low frontal fill',(-5,4,2.2),(0,0,.6),70,6,2.5,(1,1,1))
 softbox('Red halo behind car',(-3.5,-4,1.8),(-2,-1.8,0),95,3.5,2,(1,.012,.006))
 # A broad flagged side strip lights wheels without creating a white roof patch.
 softbox('Wheel side strip',(-4,-.2,1.9),(0,0,.45),110,1,5.5,(.95,.97,1))

 # Flag the studio lights off the background while keeping real car reflections.
 # This is equivalent to photographic flags controlling floor spill.
 receivers=bpy.data.collections.new('Car lighting receivers')
 scene.collection.children.link(receivers)
 for obj in list(scene.objects):
  if obj.type=='MESH' and obj.name.startswith('Object_'):receivers.objects.link(obj)
 for obj in list(scene.objects):
  if obj.type=='LIGHT' and obj.name!='Red halo behind car':
   obj.light_linking.receiver_collection=receivers
 key.light_linking.receiver_collection=receivers
 floor_receivers=bpy.data.collections.new('Floor lighting receivers');scene.collection.children.link(floor_receivers);floor_receivers.objects.link(bpy.data.objects['Graphite photographic floor'])
 floor_fill=softbox('Broad graphite floor fill',(0,0,6),(0,0,0),450,12,12,(.9,.95,.93));floor_fill.light_linking.receiver_collection=floor_receivers

 bpy.ops.object.camera_add();cam=bpy.context.object;cam.name='Authored scroll camera';scene.camera=cam;cam.data.type='PERSP';cam.data.lens=72;cam.data.sensor_width=36;cam.data.clip_start=.05;cam.data.clip_end=250
 cam.data.dof.use_dof=False

def ease(a,b,p):
 t=max(0,min(1,(p-a)/(b-a)));return t*t*(3-2*t)
def lerp(a,b,t):return a+(b-a)*t

def pose(p):
 orbit=ease(.12,.47,p);opening=ease(.20,.46,p);top=ease(.58,.86,p)
 scene.view_settings.exposure=lerp(-.10,.20,orbit)
 # Camera coordinates are Blender Z-up. Length of car is Y, nose +Y.
 # These three authored positions establish smooth, stable composition.
 side=Vector((-11.1,2.8,3.05));opened=Vector((-8.0,-9.4,5.4));overhead=Vector((0,0,20.0))
 pos=side.lerp(opened,orbit).lerp(overhead,top)
 target=Vector((0,0,.70)).lerp(Vector((0,-.05,.83)),orbit).lerp(Vector((0,-.03,.53)),top)
 # Authored radial easing prevents the open rear clamshell crossing the frame
 # during the elevation move; the three keyframe positions remain unchanged.
 pos=target+(pos-target)*(1+.45*math.sin(math.pi*top)**2)
 cam.location=pos
 # Fixed top orientation: nose +Y remains at the top of the image.
 direction=target-pos
 forward=direction.normalized();up=Vector((0,top,1-top)).normalized();right=forward.cross(up).normalized();actual_up=right.cross(forward).normalized()
 cam.rotation_euler=Matrix((right,actual_up,-forward)).transposed().to_euler()
 cam.data.lens=lerp(72,63,orbit)
 cam.data.lens=lerp(cam.data.lens,68,top)
 cam.data.shift_y=0
 bpy.data.objects['hinge_left'].rotation_euler.z=-1.08*opening
 bpy.data.objects['hinge_right'].rotation_euler.z=1.08*opening
 bpy.data.objects['hinge_front'].rotation_euler.x=-1.0*opening
 bpy.data.objects['hinge_rear'].rotation_euler.x=1.1*opening
 bpy.context.view_layer.update()
 return {'p':p,'opening':opening,'orbit':orbit,'overhead':top,'camera':list(pos)}

def progress(index):
 if index<=59:return .12+.35*index/59
 return .58+.28*(index-59)/44
if args.save_blend:bpy.ops.wm.save_as_mainfile(filepath=args.save_blend)
indices=[int(x) for x in args.indices.split(',')] if args.indices else list(range(args.start,args.end+1))
if args.keys_first:indices=[i for i in [0,59,103] if i in indices]+[i for i in indices if i not in [0,59,103]]
items=[('closed',.12),('open',.47),('overhead',.86)] if args.poses else [(f'frame-{i:03}',progress(i)) for i in indices]
def projected_bbox():
 import numpy as np
 vp=cam.calc_matrix_camera(bpy.context.evaluated_depsgraph_get(),x=args.width,y=args.height)@cam.matrix_world.inverted()
 arrays=[]
 for obj in scene.objects:
  if obj.type!='MESH' or not obj.name.startswith('Object_'):continue
  vertices=np.ones((len(obj.data.vertices),4),dtype=np.float64)
  coords=np.empty(len(obj.data.vertices)*3,dtype=np.float64);obj.data.vertices.foreach_get('co',coords);vertices[:,:3]=coords.reshape((-1,3))
  clip=vertices@np.asarray(vp@obj.matrix_world,dtype=np.float64).T
  ndc=clip[:,:2]/clip[:,3:4];arrays.append(ndc*.5+.5)
 xy=np.concatenate(arrays);lo=xy.min(axis=0);hi=xy.max(axis=0)
 return {'left':float(lo[0]),'right':float(hi[0]),'top':float(1-hi[1]),'bottom':float(1-lo[1]),'centerY':float(1-(lo[1]+hi[1])*.5),'width':float(hi[0]-lo[0]),'height':float(hi[1]-lo[1])}
report=[]
for name,p in items:
 info=pose(p)
 if args.measure_only or args.poses or name in ['frame-000','frame-059','frame-103']:info['bbox']=projected_bbox()
 scene.render.filepath=str(outdir/(name+'.png'));start=time.monotonic()
 if not args.measure_only:bpy.ops.render.render(write_still=True)
 info.update(name=name,seconds=time.monotonic()-start);report.append(info);print('FRAME_TIMING',json.dumps(info),flush=True)
(outdir/f'render-report-{min(indices):03}-{max(indices):03}.json').write_text(json.dumps(report,indent=2))
print('RENDER_DONE',json.dumps(report),flush=True)
