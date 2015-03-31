# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import requests
import json
from collections import defaultdict
import dao
try:
    from settings import plateanet_user, plateanet_password
except:
    plateanet_user = "user name"
    plateanet_password = "user password"

import urllib3

ca_certs = "/etc/ssl/certs/ca-certificates.crt"  # Or wherever it lives.

http = urllib3.PoolManager(
    cert_reqs='CERT_REQUIRED', # Force certificate check.
    ca_certs=ca_certs,         # Path to your certificate bundle.
)


def get_obras_en_cartel():
    """
    Obtiene todas las obras con sus ids
    """
    r = requests.get("https://www.plateanet.com/")

    html = r.text

    soup = BeautifulSoup(html)

    obras_options = soup.select("#Obras > option")
    obras = {}
    for obra in obras_options:
        url_obra = obra.get('value')
        if url_obra is not None:
            id_obra = get_obra_id(url_obra)
            nombre_obra = obra.text
            obras[id_obra] = (nombre_obra, url_obra)

    return obras


def get_initial_info():
    """
    Get all the shows and promotions.
    """
    r = requests.get("https://www.plateanet.com/")

    html = r.text

    soup = BeautifulSoup(html)

    obras_options = soup.select("#Obras > option")
    obras = []
    print "\nOBRAS --------- \n"
    for obra in obras_options:
        if obra.get('value') is not None:
            print obra.text, get_obra_id(obra.get('value'))
            obras.append((obra.text, get_obra_id(obra.get('value'))))

    promos_option = soup.select("#promo > option")
    promos = []
    print "\nPROMOS --------- \n"
    for promo in promos_option:
        if promo.get('value') is not None:
            print promo.text, promo.get('value')
            promos.append((promo.text, promo.get('value')))


def get_obra_id(url):
    return url.rsplit("/", 1)[1]


def login():
    """
    login on www.plateanet.com
    """
    # you have to complete this to login plateanet user
    data = {
        "IdentityCustomer": plateanet_user,
        "clave": plateanet_password
    }
    r = requests.post("https://www.plateanet.com/Account/LogOn/", data)

    print r.text


def get_info_obra(name):
    """
    Usando el nombre (id_name) de la obra obtiene el id_obra y id_teatro
    """
    obra_url = "https://www.plateanet.com/Obras/" + name

    r = requests.get(obra_url)

    html = r.text

    soup = BeautifulSoup(html)

    id_obra = soup.find(id="Hidden2").get("value")
    id_teatro = soup.find(id="Hidden3").get("value")

    return id_teatro, id_obra


def get_funciones(id_teatro, id_obra):
    """
    Usando id_teatro y id_obra obtiene los id_funciones de la obra

    var idTeatro=$('#drop1').val()
    idObra=$('#drop1 option:selected').attr('obraId')
    cantidadPedida=parseInt($('#dropEntr').val());
    $.post("/Services/getFuncionesPorTeatroyObra",{token:"..leofdfojerh.",nIdTeatro:idTeatro,nIdInfoObra:idObra}
    """
    params = {"token": "..leofdfojerh.", "nIdTeatro": id_teatro, "nIdInfoObra": id_obra}
    r = requests.post("https://www.plateanet.com/Services/getFuncionesPorTeatroyObra", params=params)
    json_response = r.text
    json_resp = json.loads(json_response)
    funciones = {}
    for funcion in json_resp["objeto"]:
        id_funcion = funcion["idFuncion"]
        nombre_funcion = funcion["Nombre"]
        funciones[id_funcion] = nombre_funcion

    return funciones


def get_sectores_y_descuentos(id_funcion):
    """
    Usando el id de la obra obtiene los sectores y descuentos
    $.post("/Services/getSectoresYDescuentos",{token:"..leofdfojerh.",nIdFuncion:idFuncion}
    """
    params = {"token": "..leofdfojerh.", "nIdFuncion": id_funcion}
    try:
        r = requests.post("https://www.plateanet.com/Services/getSectoresYDescuentos", params=params, )
    except requests.exceptions.ConnectionError as ce:
        print "Connection error searching for id_funcion: %s" % id_funcion
        print r
        raise ce

    json_response = r.text
    json_resp = json.loads(json_response)
    promociones_encontradas = defaultdict(list)
    for sector in json_resp["objeto"]:
        totales = int(sector['Totales']) #parseInt(Sectores.objeto[i].Totales)
        sector_disponible = int(sector['Disponible']) #parseInt(Sectores.objeto[i].Disponible)
        sector_nombre = sector['Sector']
        for promo in sector["Promos"]:
            nombre_promo = promo["Nombre"]
            vendidas = int(promo["Vendidas"]) #parseInt(Sectores.objeto[i].Promos[j].Vendidas);
            quote = int(promo["Quote"]) #parseInt(Sectores.objeto[i].Promos[j].Quote)
            tope = min(quote, totales)
            disp_reales = 0 if tope - vendidas < 0 else tope - vendidas
            disponibles = min(disp_reales, sector_disponible)
            if disponibles > 0:
                promociones_encontradas[nombre_promo].append(sector_nombre)

    return promociones_encontradas


def get_promociones_obra(nombre_obra):
    obra = {"nombre_obra": nombre_obra}
    id_teatro_w, id_obra_w = get_info_obra(nombre_obra)
    obra["teatro"] = id_teatro_w
    obra["_id"] = id_obra_w
    funciones = get_funciones(id_teatro_w, id_obra_w)
    funciones_list = list()
    for id_funcion, nombre_funcion in funciones.iteritems():
        funcion = {"_id": id_funcion, "nombre": nombre_funcion}
        promociones_encontradas = get_sectores_y_descuentos(id_funcion)

        if promociones_encontradas:
            promos = list()
            for nombre_promo, sectores in promociones_encontradas.iteritems():
                promo = {"nombre": nombre_promo, "sectores": sectores}
                promos.append(promo)
            funcion["promos"] = promos

        funciones_list.append(funcion)

    obra["funciones"] = funciones_list

    return obra


def get_obras_con_promocion(obras=get_obras_en_cartel().keys()):
    d = dao.ObrasDAO()
    for i, obra_id in enumerate(obras, start=1):
        obra = get_promociones_obra(obra_id)
        d.save(obra)
        print "processing obra: %s (%d/%d)" % (obra_id, i, len(obras))


def get_obras_con_promocion_parallel(obras=get_obras_en_cartel().keys()):
    import IPython.parallel as p
    rc = p.Client()

    dview = rc.direct_view()
    dview.execute("from plateanet import *", block=True)
    print "Load balanced view created"
    lview = rc.load_balanced_view()
    parallel_result = lview.map(get_promociones_obra, obras)
    print parallel_result
    print "Task running, waiting for results"
    parallel_result.wait_interactive()
    print "task finished"
    parallel_result.display_outputs()


if __name__ == "__main__":
    obras = get_obras_en_cartel()
    print json.dumps(obras, sort_keys=True, indent=4)
    #get_initial_info()
    #get_promociones_obra("wainraich-y-los-frustrados")
    #get_promociones_obra("escenas-de-la-vida-conyugal")
    #login()
    #get_obras_con_promocion(['wainraich-y-los-frustrados'])
    # get_obras_con_promocion(get_obras_en_cartel().keys())
    #get_obras_con_promocion_parallel(get_obras_en_cartel().keys()[0:50])
