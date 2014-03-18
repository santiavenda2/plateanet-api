# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import requests
import json


def get_initial_info():
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
    # you have to complete this to login plateanet user
    data = {
        "IdentityCustomer": "user name",
        "clave": "user pass"
    }
    r = requests.post("https://www.plateanet.com/Account/LogOn/", data)

    #print r.text


def get_info_obra(name):
    obra_url = "https://www.plateanet.com/Obras/"+name

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
    var idTeatro=$('#drop1').val()
    idObra=$('#drop1 option:selected').attr('obraId')
    cantidadPedida=parseInt($('#dropEntr').val());
    $.post("/Services/getFuncionesPorTeatroyObra",{token:"..leofdfojerh.",nIdTeatro:idTeatro,nIdInfoObra:idObra}
    """
    params = {"token": "..leofdfojerh.", "nIdTeatro": id_teatro, "nIdInfoObra": id_obra}
    r = requests.post("https://www.plateanet.com/Services/getFuncionesPorTeatroyObra", params=params)
    json_response = r.text
    json_resp = json.loads(json_response)
    id_funciones = []
    for funcion in json_resp["objeto"]:
        id_funciones.append(funcion["idFuncion"])

    print "id_funciones: ", id_funciones
    return id_funciones


def get_sectores_y_descuentos(id_funcion):
    """
    $.post("/Services/getSectoresYDescuentos",{token:"..leofdfojerh.",nIdFuncion:idFuncion}
    """
    params = {"token": "..leofdfojerh.", "nIdFuncion": id_funcion}
    r = requests.post("https://www.plateanet.com/Services/getSectoresYDescuentos", params=params)
    json_response = r.text
    json_resp = json.loads(json_response)
    print json_resp
    for sector in json_resp["objeto"]:
        for promo in sector["Promos"]:
            print promo["Nombre"], promo["idAsignacion"], promo["Vendidas"], promo["Quote"]


def get_promociones_obra(nombre_obra):
    id_teatro_w, id_obra_w = get_info_obra(nombre_obra)
    funciones = get_funciones(id_teatro_w, id_obra_w)
    for funcion in funciones:
        print "Id funcion:", funcion
        get_sectores_y_descuentos(funcion)

get_initial_info()
#get_promociones_obra("wainraich-y-los-frustrados")
get_promociones_obra("escenas-de-la-vida-conyugal")
#login()