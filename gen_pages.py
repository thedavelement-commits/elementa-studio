import json, yaml, glob
def label(k): return k.replace('_',' ').capitalize()
def field(k,v,ind):
    sp=' '*ind
    if isinstance(v,bool): return f"{sp}- {{ name: {k}, label: {label(k)}, type: boolean }}\n"
    if isinstance(v,(int,float)): return f"{sp}- {{ name: {k}, label: {label(k)}, type: number }}\n"
    if v is None or isinstance(v,str):
        v=v or ''
        t='image' if v.startswith('/assets/') else ('text' if len(v)>70 or '\n' in v else 'string')
        return f"{sp}- {{ name: {k}, label: \"{label(k)}\", type: {t} }}\n"
    if isinstance(v,list):
        if v and isinstance(v[0],dict):
            keys={}
            for it in v:
                for kk,vv in it.items(): keys.setdefault(kk,vv)
            s=f"{sp}- name: {k}\n{sp}  label: \"{label(k)}\"\n{sp}  type: object\n{sp}  list: true\n{sp}  fields:\n"
            for kk,vv in keys.items(): s+=field(kk,vv,ind+4)
            return s
        t='image' if v and isinstance(v[0],str) and v[0].startswith('/assets/') else 'string'
        return f"{sp}- {{ name: {k}, label: \"{label(k)}\", type: {t}, list: true }}\n"
    if isinstance(v,dict):
        s=f"{sp}- name: {k}\n{sp}  label: \"{label(k)}\"\n{sp}  type: object\n{sp}  fields:\n"
        for kk,vv in v.items(): s+=field(kk,vv,ind+4)
        return s
    return ''
def fm(path):
    t=open(path).read().split('---')[1]; return yaml.safe_load(t)
out='media:\n  input: public/assets\n  output: /assets\n\ncontent:\n'
proj=fm(sorted(glob.glob('content/projects/*.md'))[0])
out+='  - name: projects\n    label: Case studies\n    type: collection\n    path: content/projects\n    format: yaml-frontmatter\n    filename: "{fields.title}.md"\n    view:\n      fields: [title, year, order]\n    fields:\n'
for k,v in proj.items(): out+=field(k,v,6)
post=fm(sorted(glob.glob('content/blog/*.md'))[0])
out+='  - name: blog\n    label: Blog posts\n    type: collection\n    path: content/blog\n    format: yaml-frontmatter\n    filename: "{fields.title}.md"\n    view:\n      fields: [title, date]\n    fields:\n'
for k,v in post.items():
    if k=='date': out+='      - { name: date, label: Date, type: date }\n'
    else: out+=field(k,v,6)
out+='      - { name: body, label: Article, type: rich-text }\n'
for name,lab,f in [('settings','Studio details (email, socials, footer)','settings.json'),('home','Home page','home.json'),('about','About page','about.json'),('pages','Other pages (Case studies, Blog, Contact, Sign up, 404, Menu)','pages.json')]:
    d=json.load(open('content/'+f))
    out+=f'  - name: {name}\n    label: "{lab}"\n    type: file\n    path: content/{f}\n    format: json\n    fields:\n'
    for k,v in d.items(): out+=field(k,v,6)
for slug,lab in [('privacy-policy','Privacy Policy'),('terms-of-service','Terms of Service')]:
    out+=f'  - name: {slug.split("-")[0]}\n    label: "{lab}"\n    type: file\n    path: content/legal/{slug}.md\n    format: yaml-frontmatter\n    fields:\n      - {{ name: title, label: Title, type: string }}\n      - {{ name: body, label: Content, type: rich-text }}\n'
open('.pages.yml','w').write(out)
yaml.safe_load(open('.pages.yml'))
print(len(out.splitlines()),'lines ok')
