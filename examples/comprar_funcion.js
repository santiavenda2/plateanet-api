function correcAlturaDer() {
    var heightAux = $('#comprasColIzq').height();
    $('#comprasColDer').css({'height': heightAux.toString() + 'px'});
}
function desplaza() {
    $.scrollTo({top: '+=400px', left: '0'}, 800);
}
setTimeout(desplaza, 300);
function submitenter(e) {
    var keycode;
    if (window.event)keycode = window.event.keyCode; else if (e)keycode = e.which; else return true;
    if (keycode == 13) {
        checkCodigo();
        return false;
    } else
        return true;
}
function cierraClickAfuera() {
    $('html').click(function (event) {
        var ids = ['sec_ocu', 'func_ocu', 'prom_ocu'];
        for (i = 0; i < 3; i++) {
            el = document.getElementById(ids[i]);
            if (el.style.display == 'block') {
                var _x = 0, _y = 0;
                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft;
                    _y += el.offsetTop;
                    el = el.offsetParent;
                }
                var m_y = event.clientY + $(document).scrollTop(), m_x = event.clientX, min_x = _x, min_y = _y - 42, max_x = _x + 600, max_y = _y + document.getElementById(ids[i]).clientHeight;
                if ((m_y < min_y || m_y > max_y) || (m_x < min_x || m_x > max_x)) {
                    $('#' + ids[i]).slideUp(200);
                    $('#inputPin').css('z-index', '0');
                }
            }
        }
    });
}
function mostrarSiguientes() {
    if ($('#drop1').val() == "") {
        $('#comprasColIzq').css({'height': '324px'});
        $('#comprasColDer').css({'height': '324px'});
        $('#dropEntr_child a[class="enabled selected"]').removeClass('selected');
        $('#dropEntr_msa_0').addClass('selected');
        $('#dropEntr_titletext').text($('#dropEntr_msa_0').text());
        $('#entr_drop').hide();
    } else {
        $('#entr_drop').show();
    }
    $('#codPromo').hide();
    $('#inputPin').val("");
    $('#func_drop').hide();
    $('#sec_drop').hide();
    $('#prom_drop').hide();
    $('#entr_label').removeClass('labelElegido');
    $('#func_label').removeClass('labelElegido');
    $('#sec_label').removeClass('labelElegido');
    $('#prom_label').removeClass('labelElegido');
    $('#mapaSector').hide();
    $('#sigPasoFun').hide();
}
function mostrarFunciones(me) {
    if ($(me).val() == 0) {
        $('#func_drop').hide();
        $('#comprasColIzq').css({'height': '324px'});
        $('#comprasColDer').css({'height': '324px'});
        $('#mapaSector').hide();
        $('#entr_label').removeClass('labelElegido');
    } else {
        doyFunciones();
        $('#entr_label').addClass('labelElegido');
        $('#comprasColIzq').css({'height': 'auto'});
        $('#comprasColDer').css({'height': 'auto'});
        $('#mapaSector').show();
    }
    $('#codPromo').hide();
    $('#inputPin').val("");
    $('#sec_drop').hide();
    $('#prom_drop').hide();
    $('#sigPasoFun').hide();
    $('#func_label').removeClass('labelElegido');
    $('#sec_label').removeClass('labelElegido');
    $('#prom_label').removeClass('labelElegido');
    $('#sec_txt').html("Seleccioná");
    $('#prom_txt').html("Ninguna");
    correcAlturaDer();
}
function mostrarOcultarDDTablas(idStr) {
    var height = $('#' + idStr + '_ocu').height(), alto = (height >= 304) ? '304px' : height.toString() + 'px';
    if (idStr == 'sec')widthColorBlock = 40; else widthColorBlock = 30;
    if ($('#' + idStr + '_ocu').css('display') == "none") {
        $("div[id*='_ocu']").hide();
        $('#' + idStr + '_ocu').show().css({'overflow': 'hidden', 'height': alto});
        if (alto == '304px')($('#' + idStr + '_ocu .colorBlock').attr('width', widthColorBlock + 15));
        setTimeout(function () {
            $('#' + idStr + '_ocu').css('overflow-y', 'auto');
        }, 100);
        $('#inputPin').css('z-index', '-1');
    } else {
        $('#' + idStr + '_ocu').slideUp(200);
        setTimeout(function () {
            $('#' + idStr + '_ocu').css({'overflow': 'hidden', 'height': 'auto'});
        }, 250);
        $('#inputPin').css('z-index', '0');
    }
}
function disponibilidad(ocup) {
    if (ocup == "Amplia")
        return[ocup, '#92d050'];
    else if (ocup == "Limitada")
        return[ocup, '#FFFF00'];
    if (ocup == 100)
        return['Agotada', '#FF0000'];
    else if (ocup > 55)
        return['Baja', '#FFC000'];
    else if (ocup > 25)
        return['Media', '#FFFF00'];
    else return['Alta', '#92d050'];
}
function doyEntradas() {
    for (i = 0; i <= 10; i++) {
        var textoEntradas;
        (i != 1) ? textoEntradas = " entradas" : textoEntradas = " entrada";
        if (i == 0) {
            $('#dropEntr').append('<option value="' + i + '" style="display:none">' + i.toString() + " " + textoEntradas + '</option>');
        } else {
            $('#dropEntr').append('<option value="' + i + '">' + i.toString() + " " + textoEntradas + '</option>');
        }
    }
}
function doyTeatros() {
    var $slctTeatros = $('#infoTeatros'), idTeatro = $slctTeatros.attr('idTeatro'), nameTeatro = $slctTeatros.attr('nameTeatro'), zonaTeatro = $slctTeatros.attr('zonaTeatro'), obraId = $slctTeatros.attr('obraId');
    $('#drop1').append('<option value="' + idTeatro + '" selected="selected" obraId="' + obraId + '">TEATRO: ' + nameTeatro + ' - (' + zonaTeatro + ')</option>');
    $('#drop1').attr('cantTeatros', '1');
}
function doyFunciones() {
    $('#tabla_funciones tbody').children().slice(1).remove();
    var idTeatro = $('#drop1').val(), idObra = $('#drop1 option:selected').attr('obraId'), cantidadPedida = parseInt($('#dropEntr').val());
    $.post("/Services/getFuncionesPorTeatroyObra", {token: "..leofdfojerh.", nIdTeatro: idTeatro, nIdInfoObra: idObra}, function (Funciones) {
        if (Funciones.success != true) {
        } else {
            var cant = Funciones.CantTotal;
            for (i = (Funciones.CantTotal - 1); i >= 0; i--) {
                var nombreFunc = Funciones.objeto[i].Nombre, funcID = Funciones.objeto[i].idFuncion, roomID = Funciones.objeto[i].idSala, ocupacionFunc = parseInt(Funciones.objeto[i].ocupacion), estadoDispFunc = disponibilidad(ocupacionFunc)[0], colorDisp = disponibilidad(ocupacionFunc)[1], disponible = parseInt(Funciones.objeto[i].disponible), jsActivos = (ocupacionFunc <= 99 || cantidadPedida <= disponible) ? ('onmouseover="this.style.backgroundColor = \'#38517A\'; this.style.color=\'#FFF\';" onmouseout="this.style.backgroundColor = \'#D2DBEA\'; this.style.color=\'#000\';" onclick="dejarValue(this,\'func\')"') : (''), colorActivos = ((ocupacionFunc > 99) || (cantidadPedida > disponible)) ? ('#999999') : ('#D2DBEA');
                $('#tabla_funciones').append('<tr bgcolor="' + colorActivos + '" ' + jsActivos + ' funid="' + funcID + '" roomid="' + roomID + '"><td width="300" height="15" style=" text-align: left; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; padding-left: 10px; border-bottom:1px solid black;">' + nombreFunc + '</td><td width="110" height="15" style="text-align: center; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; border-bottom:1px solid black; " >' + estadoDispFunc + '</td><td width="30" height="20" class="colorBlock" bgcolor="' + colorDisp + '" style="border-bottom:1px solid black">&nbsp;</td></tr>');
            }
        }
        if (cant > 0) {
            cargar(roomID);
            $('#func_txt').text('Seleccioná');
            $('#valueDrop_fun').val("");
            $('#func_drop').show();
            correcAlturaDer();
            $.scrollTo('#func_drop', 700, {offset: -150})
        } else {
            $('#comprasColIzq').children().remove();
            $('#comprasColIzq').append('<h3 style="margin-top: 30px; margin-left: 30px;">NO HAY FUNCIONES ACTIVAS.</h3>');
        }
    });
};
function doySectores() {
    var idFuncion = $('#func_txt').attr('funid'), cantidadPedida = parseInt($('#dropEntr').val());
    if (idFuncion != "") {
        $('#tabla_sector tbody').children().slice(1).remove();
        $.post("/Services/getSectoresYDescuentos", {token: "..leofdfojerh.", nIdFuncion: idFuncion}, function (Sectores) {
            if (Sectores.success != true) {
            } else {
                $('#sec_drop').hide();
                for (i = 0; i < Sectores.CantTotal; i++) {
                    var nombreSector = Sectores.objeto[i].Sector, precioSector = Sectores.objeto[i].Precio, keySector = Sectores.objeto[i].KeySector, pluralidadEntr = function (num) {
                        if (num != 1)return'entradas'; else return'entrada';
                    }, mediaSector = parseInt(Sectores.objeto[i].Media), maximaSector = parseInt(Sectores.objeto[i].Maxima), mediaSector = (maximaSector == 2) ? (mediaSector = 2) : (mediaSector), ocupacionSector = parseInt(Sectores.objeto[i].Ocupacion), estadoDispSector = (cantidadPedida > maximaSector) ? ('Máximo ' + maximaSector + ' ' + pluralidadEntr(maximaSector)) : ((cantidadPedida > mediaSector) ? ('Sólo hay ' + mediaSector + ' ' + pluralidadEntr(mediaSector) + ' disp.') : disponibilidad(ocupacionSector)[0]), colorDisp = (cantidadPedida > mediaSector) ? ('#FF0000') : (disponibilidad(ocupacionSector)[1]), jsActivos = (ocupacionSector > 99 || cantidadPedida > mediaSector) ? '' : 'onmouseover="this.style.backgroundColor = \'#38517A\'; this.style.color=\'#FFF\'; " onmouseout="this.style.backgroundColor = \'#D2DBEA\'; this.style.color=\'#000\';" onclick="dejarValue(this,\'sec\');"', colorActivos = (ocupacionSector > 99 || cantidadPedida > mediaSector) ? '#999999' : '#D2DBEA';
                    $('#tabla_sector').append('<tr bgcolor="' + colorActivos + '" ' + jsActivos + ' sectorName="' + nombreSector + '" sectorPrice="$' + precioSector + '" sectorKey="' + keySector + '" secid="' + i + '">' + '<td width="300" height="15" style=" text-align: left; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bolder; font-size:14px; padding-top: 10px; padding-left: 10px; border-bottom:1px solid black;">' + nombreSector + '</td>' + '<td width="150" height="15" style=" text-align: center; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; border-bottom:1px solid black; ">$' + precioSector + '</td>' + '<td width="110" height="15" style=" text-align: center; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; border-bottom:1px solid black; ">' + estadoDispSector + '</td>' + '<td width="40" height="20" class="colorBlock" bgcolor="' + colorDisp + '" border="1" bordercolor="#000" style="border-bottom:1px solid black">&nbsp;</td>' + '</tr>');
                }
                $('#sec_drop').show();
                correcAlturaDer();
                $.scrollTo('#sec_drop', 700, {offset: -150})
            }
        });
    }
};
function doyPromos() {
    var idFuncion = $('#func_txt').attr('funid'), i = $('#sec_txt').attr('secid'), cantidadPedida = parseInt($('#dropEntr').val());
    if (idFuncion != "" && i != "") {
        $('#tabla_promos tbody').children().slice(1).remove();
        $.post("/Services/getSectoresYDescuentos", {token: "..leofdfojerh.", nIdFuncion: idFuncion}, function (Sectores) {
            if (Sectores.success != true) {
            } else {
                $('#sigPasoFun').hide();
                var ocupacionSector = parseInt(Sectores.objeto[i].Ocupacion), estadoDispSector = disponibilidad(ocupacionSector)[0], colorDispSector = disponibilidad(ocupacionSector)[1], colorActivos = '#D2DBEA', jsActivos = 'onmouseover="this.style.backgroundColor = \'#38517A\'; this.style.color=\'#FFF\'; " onmouseout="this.style.backgroundColor = \'#D2DBEA\'; this.style.color=\'#000\';" onclick="dejarValue(this,\'prom\'); codigoValidPromo(' + reqCod + ',' + reqVal + ',' + isPin + ');"';
                if (estadoDispSector == "Alta") {
                    estadoDispSector = "Amplia";
                } else {
                    estadoDispSector = "Limitada";
                    colorDispSector = "#FFFF00";
                }
                $('#tabla_promos').append('<tr bgcolor="' + colorActivos + '" ' + jsActivos + ' prmid="">' + '<td width="300" height="15" style=" text-align: left; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; padding-left: 10px; border-bottom:1px solid black;"><div style=" background: url(../../img/promos/ninguna_promo.png) no-repeat; width:60px; height:30px; float:left; bottom: 5px; position: relative; margin-right: 20px;"></div><span style="position: relative; top:0px; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:18px;">Ninguna</span></td>' + '<td width="110" height="15" style=" text-align: center; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; border-bottom:1px solid black;"><span style="position: relative; top:-2px; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:12px;">' + estadoDispSector + ' </span></td>' + '<td width="30" height="20" class="colorBlock" bgcolor="' + colorDispSector + '" border="1" bordercolor="#000" style="border-bottom:1px solid black">&nbsp;</td>' + '</tr>');
                for (j = 0; j < Sectores.objeto[i].Promos.length; j++) {
                    var nombrePromo = Sectores.objeto[i].Promos[j].Nombre, cantidadValida = Sectores.objeto[i].Promos[j].CantidadValida, reqCod = (Sectores.objeto[i].Promos[j].RequiereCod == "True") ? 1 : 0, reqVal = (Sectores.objeto[i].Promos[j].ReqValidacion == "True") ? 1 : 0, isPin = (Sectores.objeto[i].Promos[j].IsPin == "True") ? 1 : 0, idAsignacion = Sectores.objeto[i].Promos[j].idAsignacion, linkImg = Sectores.objeto[i].Promos[j].Img, vendidas = parseInt(Sectores.objeto[i].Promos[j].Vendidas), tope = Math.min(parseInt(Sectores.objeto[i].Promos[j].Quote), parseInt(Sectores.objeto[i].Totales)), dispReales = (tope - vendidas < 0) ? 0 : tope - vendidas, disponibles = Math.min(dispReales, parseInt(Sectores.objeto[i].Disponible)), ocupacionPromo = Sectores.objeto[i].Promos[j].Ocupacion, estadoDispPromo = disponibilidad(ocupacionPromo)[0], colorDisp = disponibilidad(ocupacionPromo)[1], estadoDispNums = "", jsActivos = 'onmouseover="this.style.backgroundColor = \'#38517A\'; this.style.color=\'#FFF\'; " onmouseout="this.style.backgroundColor = \'#D2DBEA\'; this.style.color=\'#000\';" onclick="dejarValue(this,\'prom\'); codigoValidPromo(' + reqCod + ',' + reqVal + ',' + isPin + ');"', colorActivos = '#D2DBEA';
                    if (disponibles == 0) {
                        estadoDispPromo = 'Agotada';
                        colorDisp = '#FF0000';
                        estadoDispNums = "";
                        jsActivos = "";
                        colorActivos = "#999999";
                    } else if (cantidadValida < 11 && cantidadValida != cantidadPedida) {
                        estadoDispPromo = "Válido para " + cantidadValida + " entradas";
                        colorDisp = '#FF0000';
                        estadoDispNums = "";
                        jsActivos = "";
                        colorActivos = "#999999";
                    }
                    $('#tabla_promos').append('<tr bgcolor="' + colorActivos + '" ' + jsActivos + ' prmid="' + idAsignacion + '">' + '<td width="300" height="15" style=" text-align: left; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; padding-left: 10px; border-bottom:1px solid black;"><div style=" background: url(../../img/promos/' + linkImg + '.jpg) no-repeat 0px -30px; width:60px; height:30px; float:left; bottom: 5px; position: relative; margin-right: 20px;"></div><span style="position: relative; top:3px; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px;">' + nombrePromo + '</span></td>' + '<td width="110" height="15" style=" text-align: center; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:14px; padding-top: 10px; border-bottom:1px solid black;"><span style="position: relative; top:3px; font-family: Tahoma, Arial, Helvetica, sans-serif; font-weight:bold; font-size:12px;">' + estadoDispPromo + ' ' + estadoDispNums + '</span></td>' + '<td width="30" height="20" class="colorBlock" bgcolor="' + colorDisp + '" border="1" bordercolor="#000" style="border-bottom:1px solid black">&nbsp;</td>' + '</tr>');
                }
                $('#sigPasoFun').show();
                if (Sectores.objeto[i].Promos.length > 0) {
                    $('#prom_drop').show();
                    $.scrollTo('#prom_drop', 700, {offset: -150})
                } else {
                    $('#prom_drop').hide();
                }
                correcAlturaDer();
            }
        });
    }
};
function codigoValidPromo(reqCod, reqVal, isPin) {
    if (isPin && reqVal && !reqCod) {
        $('#titcodValidaPin').show();
        $('#titcodValida').hide();
        $('#titcodPromo').hide();
    } else if (!isPin && reqVal && !reqCod) {
        $('#titcodValida').show();
        $('#titcodValidaPin').hide();
        $('#titcodPromo').hide();
    } else if (reqCod) {
        $('#titcodPromo').show();
        $('#titcodValida').hide();
        $('#titcodValidaPin').hide();
    }
    if (reqCod || reqVal) {
        $('#divcodigo').show();
        $('#codPromo').show();
    } else if (!reqCod && !reqVal) {
        $('#codPromo').hide();
        $('#inputPin').val("");
    }
    correcAlturaDer();
};
function dejoEnBlanco() {
    $("#tickVerde").hide();
    $("#cruzRoja").hide();
    $('#inputPin').css('background', 'white');
    $(".campoDatoEntegaA").css('background', 'white');
    $(".campoDatoEntegaA .erroresForm").hide();
    $(".campoDatoEntegaA .erroresForm p").text("");
};
function pongoEnBlancoCodigo() {
    $('#inputPin').bind('input', function () {
        dejoEnBlanco();
    });
};
function checkCodigo() {
    var idAsignacion = $('#prom_txt').attr('prmid'), idTeatro = $('#drop1').val(), idObra = $('#drop1 option:selected').attr('obraid'), idFuncion = $('#func_txt').attr('funid'), precio = parseFloat($('#sec_txt').attr('sectorPrice').substr(1).replace(",", ".")), cantEntradas = $('#dropEntr').val(), codigo = $('#inputPin').val();
    if ($('#codPromo').css('display') == 'none') {
        submitForm();
    } else if (idAsignacion == "" || idFuncion == "" || precio == "" || cantEntradas == 0 || idTeatro == "" || idObra == "") {
        return 1;
    } else {
        if ($('#titcodPromo').css('display') == 'block' || $('#titcodValida').css('display') == 'block' || $('#titcodValidaPin').css('display') == 'block') {
            $.post("/Services/ValidoPromo", {token: "..leofdfojerh.", nIdAsignacion: idAsignacion, nIdTeatro: idTeatro, nIdObra: idObra, nIdFuncion: idFuncion, fPrecio: precio, Cantidad: cantEntradas, sCodigo: codigo}, function (Validez) {
                if (Validez.success) {
                    $("#cruzRoja").hide();
                    $("#tickVerde").show();
                    $('#inputPin').css('background', '#8EEC8E');
                    $(".campoDatoEntegaA").css('background', '#75CE75');
                    $(".campoDatoEntegaA .erroresForm").hide();
                    $(".campoDatoEntegaA .erroresForm p").text("");
                    submitForm();
                } else {
                    $("#tickVerde").hide();
                    $("#cruzRoja").show();
                    $('#inputPin').css('background', '#FA7272');
                    $(".campoDatoEntegaA").css('background', '#C74848');
                    $(".campoDatoEntegaA .erroresForm p").text("El código ingresado es INCORRECTO");
                    $(".campoDatoEntegaA .erroresForm").show();
                }
            });
        }
    }
};
function dejarValue(me, idStr) {
    var textoPrinc = $(':first-child', me).text();
    if (idStr == "func") {
        var funid = $(me).attr('funid'), roomid = $(me).attr('roomid');
        $('#' + idStr + '_txt').html(textoPrinc).attr('funid', funid);
        $('#valueDrop_' + idStr).val(funid);
        $('#sec_txt').text("Seleccioná");
        $('#valueDrop_sec').val("");
        $('#valuePrecio').val("");
        $('#valueDrop_prom').val("");
        $('#func_label').addClass('labelElegido');
        $('#sec_label').removeClass('labelElegido');
        doySectores();
        $('#sigPasoFun').hide();
        $('#codPromo').hide();
        $('#inputPin').val("");
        $('#prom_drop').hide();
    } else if (idStr == "sec") {
        var sectorName = $(me).attr('sectorName'), sectorPrice = $(me).attr('sectorPrice'), sectorKey = $(me).attr('sectorKey');
        secid = $(me).attr('secid'), espacios = '\xa0\xa0\xa0\xa0\xa0\xa0-\xa0\xa0\xa0\xa0\xa0\xa0';
        $('#' + idStr + '_txt').html(sectorKey).attr('sectorPrice', sectorPrice).attr('secid', secid).attr('sectorKey', sectorKey);
        $('#valueDrop_' + idStr).val(sectorName);
        sectorPrice = sectorPrice.replace('$', '');
        $('#valuePrecio').val(sectorPrice);
        $('#codPromo').hide();
        $('#prom_txt').text("Ninguna");
        $('#valueDrop_prom').val("");
        $('#sec_label').addClass('labelElegido');
        $('#prom_label').removeClass('labelElegido');
        doyPromos();
    } else {
        var nombrePromo = $(':first-child span', me).text(), prmid = $(me).attr('prmid');
        if (prmid == "") {
            $('#codPromo').hide();
            $('#valueDrop_prom').val("");
        } else {
            $('#valueDrop_prom').val(prmid);
        }
        $('#' + idStr + '_txt').html(nombrePromo).attr('prmid', prmid);
        $('#inputPin').val("");
        dejoEnBlanco();
        $('#prom_label').addClass('labelElegido');
    }
    $('#' + idStr + '_ocu').hide();
    $('#inputPin').css('z-index', '0');
    correcAlturaDer();
};
$(document).ready(function () {
    doyTeatros();
    doyEntradas();
    pongoEnBlancoCodigo();
    $(".selectDrop select").msDropDown({showIcon: false});
    $('#aceptarYMapa').hide();
    $('#entr_drop').hide();
    $('#func_drop').hide();
    $('#sec_drop').hide();
    $('#prom_drop').hide();
    $('#mapaSector').hide();
    $('#sigPasoFun').hide();
    cierraClickAfuera();
    $('#dropEntr_arrow').after('<div id="entr_label" class="labelsDrops">CANTIDAD DE ENTRADAS:</div>');
    $('#dropEntr_title .textTitle').text('Seleccioná');
    if (parseInt($('#drop1').attr('cantTeatros')) == 1) {
        $('#drop1_child').remove();
        $('#drop1_arrow').remove();
        $('#drop1_titletext').css('color', '#747474');
        mostrarSiguientes();
    }
});