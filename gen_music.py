import os,re

pattern = re.compile('(.*?)\.txt')

for p,d,fs in os.walk('./audio/music_res/music'):
    for f in fs:
        fname = pattern.findall(f)[0]
        with open(os.path.join(p,f),'r') as file:
            music = file.read()
        seq = music.split()
        seq = [ x if x != '-' else 'null' for x in seq ]
        res = '''export const rhythm = [''' + ', '.join(seq) + '''];'''
        with open('./music/'+fname+'.js','w') as target:
            target.write(res)




