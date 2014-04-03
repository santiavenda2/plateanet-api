__author__ = 'santiago'


class Obra(object):

    def __init__(self, nombre):
        self.nombre = nombre
        self.funciones = []


class Funcion(object):

    def __init__(self, nombre):
        self.nombre = nombre
        self.promociones = {}


def main():
    obra = Obra("Wainraich y Los frustrados")
    obra.funciones.append()