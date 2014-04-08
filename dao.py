__author__ = 'santiago'

from pymongo import MongoClient
import json
import time


class ObrasDAO():

    def __init__(self):
        self.client = MongoClient()
        self.db = self.client.plateanet
        self.obras_collection = self.db.obras

    def count_numero_de_obras(self):
        return self.obras_collection.count()

    def get_promociones(self):
        return self.obras_collection.distinct("funciones.promos.nombre")

    def get_obras_con_promocion(self, nombre_promocion=None):
        if nombre_promocion is None:
            return self.obras_collection.find({"funciones.promos": {"$exists": True}},
                {"nombre_obra": 1, "funciones": 1, "funciones.promos.nombre": 1, "funciones.promos.sectores": 1, "_id": 0})
        else:
            return self.obras_collection.find(
                {"funciones.promos.nombre": nombre_promocion},
                {"nombre_obra": 1, "funciones": 1, "funciones.promos.sectores": 1, "_id": 0})

    def get_info_obra(self, obra_name):
        return self.obras_collection.find_one({"nombre_obra": obra_name})

    def save(self, obra):
        obra["last_update"] = time.time()
        self.obras_collection.save(obra)

if __name__ == "__main__":
    dao = ObrasDAO()
    print dao.count_numero_de_obras()
    print "promociones: ", dao.get_promociones()
    obras_la_nacion = dao.get_obras_con_promocion()
    for o in obras_la_nacion:
        print json.dumps(o, indent=3, ensure_ascii=False)

    print "\n Info Obra \n"
    print json.dumps(dao.get_info_obra("wainraich-y-los-frustrados"), indent=3, ensure_ascii=False)
    print json.dumps(dao.get_info_obra("escenas-de-la-vida-conyugal"), indent=3, ensure_ascii=False)
