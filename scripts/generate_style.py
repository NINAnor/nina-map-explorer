import pathlib
import sys
import json

BASE = pathlib.Path('.')

SOURCES = {}

for filepath in BASE.iterdir():
    if not filepath.is_dir() and 'cog' in filepath.suffix:
        name, first_dot, rest = filepath.name.partition('.')
        SOURCES[name] = {
            "type": "raster",
            "url": f"cog:///datasets/{BASE.absolute().parent.name}/{BASE.absolute().name}/{filepath}"
        }


print(json.dumps({
    "sources": SOURCES,
    "layers": [{"id": k, "type": "raster", "source": k}  for k in SOURCES.keys()]
}))
