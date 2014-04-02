# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import requests
import json
from collections import defaultdict


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
        "IdentityCustomer": "user name",
        "clave": "user pass"
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

    print "obra_id: ", id_obra
    print "teatro_id: ", id_teatro
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
    r = requests.post("https://www.plateanet.com/Services/getSectoresYDescuentos", params=params)
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
                #print "sector: ", sector_nombre, totales, sector_disponible
                #print nombre_promo, promo["idAsignacion"], vendidas, quote, disponibles, "\n"

    return promociones_encontradas


def get_promociones_obra(nombre_obra):
    print " ------------- OBRA: %s ----------------" % nombre_obra
    id_teatro_w, id_obra_w = get_info_obra(nombre_obra)
    funciones = get_funciones(id_teatro_w, id_obra_w)
    for id_funcion, nombre_funcion in funciones.iteritems():
        print "Id funcion:", id_funcion, "   nombre funcion: ", nombre_funcion
        promociones_encontradas = get_sectores_y_descuentos(id_funcion)
        if promociones_encontradas:
            for promo, sectores in promociones_encontradas.iteritems():
                print "promo: ", promo, "   sectores:", sectores
        else:
            print "No se encontraron promociones para esta funcion"

    return id_funcion, nombre_funcion


def get_obras_con_promocion(obras=get_obras_en_cartel().keys()):
    for obra_id in obras:
        get_promociones_obra(obra_id)


def get_obras_con_promocion_parallel(obras=get_obras_en_cartel().keys()):
    import IPython.parallel as p
    print "1"
    rc = p.Client()
    print "Client created"
    lview = rc.load_balanced_view()
    print "Load balanced view created"
    parallel_result = lview.map(get_promociones_obra, obras)
    print parallel_result
    print "Task running, waiting for results"
    lview.wait()
    print "task finished"
    print parallel_result


if __name__ == "__main__":

    #get_initial_info()
    #get_promociones_obra("wainraich-y-los-frustrados")
    #get_promociones_obra("escenas-de-la-vida-conyugal")
    #login()
    #get_obras_con_promocion(['wainraich-y-los-frustrados'])
    get_obras_con_promocion_parallel(['wainraich-y-los-frustrados'])