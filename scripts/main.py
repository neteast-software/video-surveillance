import json

lng_offset = 6.0000
lat_offset = -0.00


with open('./public/temp.geojson') as f:
    data = json.load(f)

def offset_coordinates(coords):
    if isinstance(coords[0], list):
        return [offset_coordinates(coord) for coord in coords]
    else:
        return [coords[0] + lng_offset, coords[1] + lat_offset]
def offset_loop(geometry):
    # geometry = feature["geometry"]
    if geometry["type"] == "Point":
        geometry["coordinates"] = offset_coordinates(geometry["coordinates"])
    elif geometry["type"] in ["LineString", "MultiPoint"]:
        geometry["coordinates"] = offset_coordinates(geometry["coordinates"])
    elif geometry["type"] in ["Polygon", "MultiLineString"]:
        geometry["coordinates"] = [offset_coordinates(ring) for ring in geometry["coordinates"]]
    elif geometry["type"] == "MultiPolygon":
        geometry["coordinates"] = [[offset_coordinates(ring) for ring in poly] for poly in geometry["coordinates"]]
    elif geometry["type"] == "GeometryCollection":
        for g in geometry["geometries"]:
            offset_loop(g)
for feature in data["features"]:
    offset_loop(feature["geometry"])

    

with open('./public/output.geojson', 'w') as f:
    json.dump(data, f)


    