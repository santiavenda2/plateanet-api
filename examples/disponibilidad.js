/**
 * Created by santiago on 24/03/14.
 */

var nombrePromo = Sectores.objeto[i].Promos[j].Nombre;
cantidadValida = Sectores.objeto[i].Promos[j].CantidadValida;
reqCod = (Sectores.objeto[i].Promos[j].RequiereCod == "True") ? 1 : 0;
reqVal = (Sectores.objeto[i].Promos[j].ReqValidacion == "True") ? 1 : 0;
isPin = (Sectores.objeto[i].Promos[j].IsPin == "True") ? 1 : 0;
idAsignacion = Sectores.objeto[i].Promos[j].idAsignacion;
linkImg = Sectores.objeto[i].Promos[j].Img;
vendidas = parseInt(Sectores.objeto[i].Promos[j].Vendidas);
tope = Math.min(parseInt(Sectores.objeto[i].Promos[j].Quote), parseInt(Sectores.objeto[i].Totales));
dispReales = (tope - vendidas < 0) ? 0 : tope - vendidas;
disponibles = Math.min(dispReales, parseInt(Sectores.objeto[i].Disponible));
ocupacionPromo = Sectores.objeto[i].Promos[j].Ocupacion;
estadoDispPromo = disponibilidad(ocupacionPromo)[0];
colorDisp = disponibilidad(ocupacionPromo)[1];
estadoDispNums = "";
jsActivos = 'onmouseover="this.style.backgroundColor = \'#38517A\'; this.style.color=\'#FFF\'; " onmouseout="this.style.backgroundColor = \'#D2DBEA\'; this.style.color=\'#000\';" onclick="dejarValue(this;\'prom\'); codigoValidPromo(' + reqCod + ';' + reqVal + ';' + isPin + ');"'; colorActivos = '#D2DBEA';
