"""Rig Ferrari F40 by BlackSnow, preserving original loop normals, UVs and materials.
Run: blender --background --python prepare-f40-rig.py -- source.glb output.glb
No vertex weld, decimation or recomputed normals. Geometry remains byte-equivalent
in position/normal/UV values before Draco's declared quantization. Physical groups
are derived from original indexed topology so touching authored seams stay split.
"""
import bpy,sys,json,math
from pathlib import Path
from collections import defaultdict
from mathutils import Matrix,Vector
args=sys.argv[sys.argv.index('--')+1:];source=Path(args[0]);dest=Path(args[1]);dest.parent.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(source))
# Blender source is X across / Y longitudinal (front negative) / Z up.
# Bake a 180-degree turn so exported glTF is X across / Y up / Z front negative.
transform=Matrix(((-1,0,0,-.00025),(0,-1,0,-.10935),(0,0,1,-.006),(0,0,0,1)))
def groups(mesh):
 roots=list(range(len(mesh.vertices)))
 def find(a):
  while roots[a]!=a:roots[a]=roots[roots[a]];a=roots[a]
  return a
 def union(a,b):
  a=find(a);b=find(b)
  if a!=b:roots[b]=a
 for p in mesh.polygons:
  for v in p.vertices[1:]:union(p.vertices[0],v)
 result=defaultdict(list)
 for p in mesh.polygons:result[find(p.vertices[0])].append(p.index)
 return sorted(result.values(),key=lambda f:-len(f))
def source_bounds(o,faceids):
 pts=[o.matrix_world@o.data.vertices[v].co for f in faceids for v in o.data.polygons[f].vertices]
 return [[min(p[i] for p in pts) for i in range(3)],[max(p[i] for p in pts) for i in range(3)]]
def door(lo,hi):
 if lo[0]>.50:side='right_source'
 elif hi[0]<-.50:side='left_source'
 else:return None
 # Original door exterior/inner trim, window and mirrors; pillars and rockers stay.
 if lo[1]>-.807 and hi[1]<.455 and lo[2]>.25 and hi[2]<1.145:return 'hinge_left' if side=='right_source' else 'hinge_right'
 return None
def assign(o,faces,lo,hi):
 name=o.name
 if name in ['Object_3','Object_7','Object_8','Object_10','Object_23']:return 'hinge_rear'
 if name=='Object_9':
  if lo[1]<-1 and hi[1]<-.76 and lo[2]>.37:return 'hinge_front'
  return door(lo,hi)
 if name in ['Object_12','Object_13','Object_14','Object_15','Object_17','Object_22','Object_25']:
  if name in ['Object_12','Object_25'] and lo[1]>.60 and lo[2]>.46:return 'hinge_rear'
  d=door(lo,hi)
  if d:return d
 if name in ['Object_4','Object_6','Object_42']:return 'hinge_front'
 if name in ['Object_12','Object_25','Object_35','Object_43']:
  if hi[1]<-1.6 and lo[2]>.40:return 'hinge_front'
 if name in ['Object_35','Object_43'] and lo[1]>1.9:return 'hinge_rear'
 return 'static'
# Pivots specified in original source frame; all empty rotations remain identity.
source_pivots={'hinge_left':(.82,-.79,.56),'hinge_right':(-.82,-.79,.56),'hinge_front':(0,-2.23,.41),'hinge_rear':(0,2.09,.45)}
hinges={}
for name,pos in source_pivots.items():
 h=bpy.data.objects.new(name,None);bpy.context.collection.objects.link(h);h.location=transform@Vector(pos);hinges[name]=h
bpy.context.view_layer.update()
report=[];originals=[o for o in bpy.context.scene.objects if o.type=='MESH'];totals=[0,0]
for o in originals:
 mesh=o.data;mesh.calc_loop_triangles();normals=[n.vector.copy() for n in mesh.corner_normals];facegroups=groups(mesh);buckets=defaultdict(list)
 for faceids in facegroups:
  lo,hi=source_bounds(o,faceids);target=assign(o,faceids,lo,hi) or 'static';buckets[target].extend(faceids)
 for target,faceids in buckets.items():
  verts=sorted(set(v for f in faceids for v in mesh.polygons[f].vertices));remap={v:i for i,v in enumerate(verts)}
  coords=[transform@(o.matrix_world@mesh.vertices[v].co) for v in verts]
  faces=[[remap[v] for v in mesh.polygons[f].vertices] for f in faceids]
  new=bpy.data.meshes.new(o.name+'_'+target);new.from_pydata(coords,[],faces);new.update()
  for mat in mesh.materials:new.materials.append(mat)
  src_loopids=[li for f in faceids for li in mesh.polygons[f].loop_indices]
  for uvsrc in mesh.uv_layers:
   uvdst=new.uv_layers.new(name=uvsrc.name)
   for idx,srcidx in enumerate(src_loopids):uvdst.data[idx].uv=uvsrc.data[srcidx].uv
  for idx,f in enumerate(faceids):new.polygons[idx].material_index=mesh.polygons[f].material_index;new.polygons[idx].use_smooth=mesh.polygons[f].use_smooth
  # Rotate authored normal vectors through the same rigid transform. No averaging.
  normalmat=transform.to_3x3()@o.matrix_world.to_3x3().inverted().transposed()
  new.normals_split_custom_set([(normalmat@normals[i]).normalized() for i in src_loopids])
  obj=bpy.data.objects.new(o.name+'_'+target,new);bpy.context.collection.objects.link(obj)
  if target!='static':
   obj.parent=hinges[target];obj.matrix_parent_inverse=hinges[target].matrix_world.inverted()
  totals[0]+=len(new.polygons);totals[1]+=len(new.vertices)
  report.append(dict(name=obj.name,target=target,faces=len(faceids),min=source_bounds(o,faceids)[0],max=source_bounds(o,faceids)[1]))
 bpy.data.objects.remove(o,do_unlink=True)
# Remove all emptied imported scene wrappers to leave predictable root empties.
for o in list(bpy.context.scene.objects):
 if o.type=='EMPTY' and o.name not in hinges and not o.children:bpy.data.objects.remove(o,do_unlink=True)
bpy.context.view_layer.update()
bpy.ops.export_scene.gltf(filepath=str(dest),export_format='GLB',export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=7,export_draco_position_quantization=16,export_draco_normal_quantization=12,export_draco_texcoord_quantization=14,export_cameras=False,export_lights=False)
bpy.ops.wm.save_as_mainfile(filepath=str(dest.with_suffix('.blend')))
Path(str(dest.with_suffix('.report.json'))).write_text(json.dumps({'source':str(source),'source_credit':'Ferrari F40 by BlackSnow, CC BY; https://sketchfab.com/3d-models/ferrari-f40-52a66c41cfcd4f999fb1b1c49bf24d70','hinges_source':source_pivots,'hinges_gltf':{k:[h.location.x,h.location.z,-h.location.y] for k,h in hinges.items()},'open_rotations_gltf':{'hinge_left':{'y':-1.08},'hinge_right':{'y':1.08},'hinge_front':{'x':-1.0},'hinge_rear':{'x':1.1}},'geometry_totals':totals,'parts':report},indent=2))
print('FINAL',dest,'BYTES',dest.stat().st_size,'TOTALS',totals,flush=True)
