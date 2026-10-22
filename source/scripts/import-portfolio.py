import sys,subprocess,hashlib,json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(root/'.tools'));import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe();project=root/'reel-studio'; out=project/'public/media/portfolio';out.mkdir(exist_ok=True)
names=json.loads((project/'scripts/import-list.json').read_text());seen={};entries=[]
for n in names:
 p=Path.home()/'Downloads'/n; digest=hashlib.sha256(p.read_bytes()).hexdigest()
 if digest in seen:
  seen[digest]['originals'].append(n);continue
 item={'id':str(len(entries)+1).zfill(2),'originals':[n],'sha256':digest};seen[digest]=item;entries.append(item)
def run(args):
 p=subprocess.run([ff,'-hide_banner','-loglevel','error','-y',*args],capture_output=True,text=True)
 if p.returncode: raise RuntimeError(p.stderr)
def convert(item):
 n=item['id'];source=str(Path.home()/'Downloads'/item['originals'][0]);full=out/f'{n}.mp4'
 run(['-i',source,'-map','0:v:0','-map','0:a?','-vf','scale=1080:1080:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1','-r','30','-c:v','libx264','-threads','2','-preset','fast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(full)])
 run(['-i',str(full),'-t','8','-vf','scale=360:640:force_original_aspect_ratio=decrease:force_divisible_by=2,setsar=1','-r','24','-c:v','libx264','-threads','2','-preset','fast','-crf','27','-an','-movflags','+faststart',str(out/f'{n}-preview.mp4')])
 run(['-ss','1','-i',str(full),'-frames:v','1','-q:v','3',str(out/f'{n}.jpg')])
 print(f'Pronto: {n} {item["originals"][0]}',flush=True)
with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(convert,entries))
(project/'src/portfolio.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
print('DONE',len(entries),flush=True)
