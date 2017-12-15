/**
 * Created by dev10 on 12/23/2015.
 */
var app_angular = angular.module('PedidosOnline', ['chart.js','ui.calendar','angular-websql', 'ngResource', 'ngRoute','angular-bootbox','angular.directives-round-progress']);

app_angular.config(['$routeProvider',//'$locationProvider',
    function ($routeProvider) {
        //, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: 'appController',
                templateUrl: "view/home/home.html"
            })
            .when('/:modulo/:url', {
                template: '<div ng-include="templateUrl">Loading...</div>',
                controller: 'appController'
            })
            .when('/:modulo/:url/:personId', {
                template: '<div ng-include="templateUrl">Loading...</div>',
                controller: 'appController'
            })
            /*.when("/:modulo/:url",{
             controller:'appController',
             templateUrl: function(urlattr){
             if(urlattr.modulo=='pagina_Actual')
             return '#'+ urlattr.url;
             if(urlattr.modulo=='' || urlattr.url=='') {
             urlattr.modulo = 'home';
             urlattr.urlurl = 'home';
             }
             //angular.element('#titulo').html( urlattr.urlurl);
             return 'view/'+ urlattr.modulo+'/' + urlattr.url + '.html';
             }
             })*/
            .otherwise("/");
        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }
]);

//CONTROLADOR DE GENERAL
app_angular.controller('sessionController',['bootbox','Conexion','$scope','$location','$http','$route', '$routeParams', 'Factory' ,function (bootbox,Conexion, $scope, $location, $http,$route, $routeParams, Factory) {
    var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    $scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
    if ($scope.sessiondate!=undefined) {
        $scope.nombreUsuario=$scope.sessiondate.nombre_completo.split(' ');
        $scope.nombreUsuario=$scope.nombreUsuario[$scope.nombreUsuario.length-1]
        $scope.nombreUsuario=ucWords($scope.nombreUsuario);
    }
    $scope.pedidos=[];
    $scope.actividades=[];
    $scope.status=[];
    $scope.alerta=[];
    $scope.errorAlerta=[];
    $scope.errorAlerta.banderaPedido=0;
    $scope.errorAlerta.bandera=0;
    $scope.detalle_pedidos_detalle=[];
    function ucWords(string){
        var arrayWords;
        var returnString = "";
        var len;
        arrayWords = string.split(" ");
        len = arrayWords.length;
        for(i=0;i < len ;i++){
            if(i != (len-1)){
               returnString = returnString+ucFirst(arrayWords[i])+" ";
            }
            else{
               returnString = returnString+ucFirst(arrayWords[i]);
            }
        }
        return returnString;
    }
    function ucFirst(string){
        return string.substr(0,1).toUpperCase()+string.substr(1,string.length).toLowerCase();
    }
    $scope.executeSync=function()
    {
        $scope.envioDataWeb();
    }
    $scope.$watch('online', function(newStatus) {
        $scope.status.connextionstate=newStatus;  
        if ($scope.status.connextionstate==false) {
            $scope.alerta.message='Verifique su conexion a Internet ';
            $scope.alerta.disableBtnAceptar=false;
            $scope.alerta.header='Conexion Internet'
        }
        else
        {
            $scope.alerta.header='Confirmar Sincronizacion'
            $scope.alerta.disableBtnAceptar=true;
            $scope.alerta.message='Esta seguro de realizar la Sincronizacion asumiendo el posible  consumo de datos elevado?';
        }
    });
    $scope.confirmarSincronizacion=function(){
        if ($scope.procesoEnvio) {
            Mensajes('Sincronizacion en Progreso, Por Favor Esperar','warning','');
            return
        }
        $('#openConfirmacion').click();
    }
    $scope.cerrarsesion=function(){
        $('#openModalLogOut').click();
    }
    $scope.confimarCerrarSion=function()
    {
        location.href="login.html"        
    }
    var $elie = $("#sync"), degree = 0, timer;
    function rotate() {    
        $('#subirID i').css('color','#2fc296');
    }
    $scope.rotacionOn=function(){
       rotate();       
    }
    $scope.rotacionOff=function(){
        $('#subirID i').css('color','#3e5c7d');
    }
    $scope.procesoEnvio=false;
    $scope.Proceso=[];
    $scope.Proceso.Porcentaje=0;
    $scope.Proceso.CantidadFaltante=0;
    $scope.Proceso.CantidadEnviada=0;
    $scope.Proceso.Total=0;
    $('#progreso').hide();
    $scope.roundProgressData = {
      label: 0,
      percentage: 0
    }
    $scope.CalculoPorcentaje=function()
    {
        if ($scope.Proceso.Total>0) 
        {
            $('#progreso').show();
            $scope.Proceso.Porcentaje= Math.round(($scope.Proceso.CantidadEnviada*100)/$scope.Proceso.Total);
            $scope.roundProgressData.label =Math.round(($scope.Proceso.CantidadEnviada*100)/$scope.Proceso.Total);
            if (isNaN($scope.roundProgressData.label)) 
            {
                $scope.roundProgressData.label=0;
            }
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
    }
    $scope.$watch('roundProgressData', function (newValue, oldValue) {
        newValue.percentage = newValue.label/100;
    }, true);
    setInterval(function()
    { 
        $scope.sincronizacion=window.localStorage.getItem("TIPO_SINCRONIZACION");
        if ($scope.sincronizacion==null || $scope.sincronizacion==undefined || $scope.sincronizacion==NaN) {
            $scope.sincronizacion='AUTOMATICA';
        }
        if ($scope.sincronizacion=='AUTOMATICA') {
            //$scope.envioDataWeb('AUTOMATICA');    
            $scope.EnvioAutomatico();
            $scope.EnvioActividades();
        }
    }, 5000);
    setInterval(function()
    { 
        geolocation();
    }, 30000);
    
    function geolocation()
    {
        var options1 = {enableHighAccuracy: true, timeout: 7000, maximumAge: 18000000};
        if ($scope.status.connextionstate==false) 
        {
            return;
        }
        var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options1);
        function onSuccess(position)
        {
            //$scope.sessiondate
            $scope.Latitude=position.coords.latitude;
            $scope.Longitud= position.coords.longitude;
            $.ajax({
                url:"http://reymonpruebas.pedidosonline.co/mobile/LocalizacionUsuario",
                data:{
                    usuario:$scope.sessiondate.id,
                    longitud:position.coords.longitude,
                    latitud:position.coords.latitude    ,
                    codigo_empresa:$scope.sessiondate.codigo_empresa
                },
                success:function(data)
                {
                },
                error:function(data)
                {
                }
            })
        }
        function onError(error)
        {
            Mensajes("Por favor habilitar la Ubicacion.",'information');
        }
    }
    $scope.procesoSincronizacion=false;
    $scope.RegistroEnviar=[];
    $scope.SincronizacionProceso=false;
    $scope.EnvioAutomatico=function()
    {
        $scope.usuario=$scope.sessiondate.nombre_usuario;
        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
        if ($scope.SincronizacionProceso==true) 
            return;
        CRUD.selectAllinOne("select count(rowid) as cantidad from s_planos_pedidos where estado=0",function(faltante){
            CRUD.selectAllinOne("select count(rowid) as cantidad from s_planos_pedidos where estado=1",function(enviado){
                CRUD.selectAllinOne("select*from s_planos_pedidos where estado=0 order by ultimo_registro asc",function(elem){
                    if (elem.length==0) {
                        $scope.SincronizacionProceso=false;
                        CRUD.Updatedynamic("update t_pedidos set sincronizado='true' where sincronizado='plano'");
                        CRUD.Updatedynamic("delete from s_planos_pedidos where  estado=1 ");
                        var URLactual = window.location;
                        var nueva_sinc=window.localStorage.getItem("NUEVA_SINCRONIZACION");

                        if (nueva_sinc==1) 
                        {
                            if (URLactual.hash.includes('ingresados')) {
                                localStorage.removeItem('NUEVA_SINCRONIZACION');
                                localStorage.setItem('NUEVA_SINCRONIZACION',0);
                                setTimeout(function(){
                                    $route.reload();
                                },1000)
                            }    
                        }
                        return;
                    }
                    else
                    {
                        localStorage.removeItem('NUEVA_SINCRONIZACION');
                        localStorage.setItem('NUEVA_SINCRONIZACION',1);
                    }
                    $scope.procesoSincronizacion=true;
                    $scope.RegistroEnviar=elem;
                    $scope.EnvioformData();
                    //$scope.EnvioRegistroWeb(0);
                })
            })
        })
    }
    $scope.EnvioRegistroWeb=function(contador)
    {
        var datos=JSON.stringify($scope.RegistroEnviar[contador]);
        if (datos!=undefined) 
        {
            $http({
                method: 'GET',
                async: true,
                url: SERVIDOR_ENVIO_PEDIDOS,
                params:{
                    usuario:$scope.usuario,
                    entidad:'PLANO',
                    codigo_empresa:$scope.codigoempresa,
                    datos:datos
                }}).then(
                function success(data) {
                    CRUD.Updatedynamic("update s_planos_pedidos set estado=1 where rowid="+data.data.rowid+"");
                    $scope.Proceso.CantidadEnviada+=1;
                    $scope.CalculoPorcentaje();
                    if ((contador+1)==$scope.RegistroEnviar.length) {
                        $scope.SincronizacionProceso=false;
                        //Mensajes('Sincronizacion Terminada con Exito','success','')
                    }
                    else
                    {
                        contador++;
                        $scope.EnvioRegistroWeb(contador)
                    }
                }, 
                function error(err) {
                    Mensajes('Por favor revisar conexion','error','');
                    $scope.SincronizacionProceso=false;
                    $scope.CalculoPorcentaje();
            });
        }
        else
        {
            //Mensajes('Por favor revisar conexion','error','');
            $scope.SincronizacionProceso=false;
            $scope.CalculoPorcentaje();
        }
        
    }
    $scope.EnvioformData=function()
    {
        $scope.usuario=$scope.sessiondate.nombre_usuario;
        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
        var datos=JSON.stringify($scope.RegistroEnviar);
        var formdata = new FormData();
        formdata.append("datos",datos)
        formdata.append("usuario", $scope.usuario)
        formdata.append("codigo_empresa",$scope.codigoempresa)
        $.ajax({
            type: "POST",
            //url: "http://reymon.pedidosonline.co/mobile/syncv3",
            url:"http://reymonpruebas.pedidosonline.co/mobile/syncv3",
            contentType: false,
            processData: false,
            data: formdata,
            success: function (data) {
                var id=" (";
                for (var i = 0; i < $scope.RegistroEnviar.length; i++) {
                    id+= $scope.RegistroEnviar[i].rowid+",";
                }
                id = id.substring(0,id.length-1);
                id+=")";
                CRUD.Updatedynamic("update s_planos_pedidos set estado=1 where rowid in "+id);
                setTimeout(function() {
                    Mensajes('Pedidos Sincronizados','success','');
                    $scope.SincronizacionProceso=false;
                    $scope.procesoSincronizacion=false;    
                }, 1000);
            },
            error: function (request) {
                debugger
                $scope.SincronizacionProceso=false;
                $scope.procesoSincronizacion=false;
                Mensajes('Por favor revisar conexion','error','');
            }
        });
    }
    $scope.envioDataWeb=function(tipo){
        $scope.usuario=$scope.sessiondate.nombre_usuario;
        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
        if ($scope.procesoEnvio) {
            if (tipo!="AUTOMATICA") {
                Mensajes('Sincronizacion en Progreso','success','');    
            }
            return
        }
        CRUD.selectAllinOne("select count(rowid) as cantidad from s_planos_pedidos where estado=0",function(faltante){
            if (faltante.length==0) 
            {
                return;
            }
            $scope.Proceso.CantidadFaltante=faltante[0].cantidad;
            CRUD.selectAllinOne("select count(rowid) as cantidad from s_planos_pedidos where estado=1",function(enviado){
                $scope.Proceso.CantidadEnviada=enviado[0].cantidad;
                $scope.Proceso.Total=$scope.Proceso.CantidadFaltante + $scope.Proceso.CantidadEnviada;
                CRUD.selectAllinOne("select*from s_planos_pedidos where estado=0 order by ultimo_registro asc LIMIT 15",function(elem){
                    $scope.procesoEnvio=true;
                    if ($scope.status.connextionstate==false) {
                        $scope.rotacionOff();
                        $scope.procesoEnvio=false;
                        if (tipo!="AUTOMATICA") 
                        {
                            Mensajes('Revisar Conexion Internet','warning','');    
                        }
                        return;
                    }
                    $scope.rotacionOff();
                    $scope.rotacionOn();
                    if (elem.length>0) 
                    {
                        localStorage.removeItem('NUEVA_SINCRONIZACION');
                        localStorage.setItem('NUEVA_SINCRONIZACION',1); 
                    }
                    if (elem.length==0) {
                        $scope.nueva_sincronizacion=window.localStorage.getItem("NUEVA_SINCRONIZACION");
                        if ($scope.nueva_sincronizacion==null || $scope.sincronizacion==undefined || $scope.sincronizacion==NaN) {
                            $scope.nueva_sincronizacion=1;
                        }
                        $scope.rotacionOff();
                        $scope.procesoEnvio=false;
                        CRUD.Updatedynamic("update t_pedidos set sincronizado='true' where sincronizado='plano'");
                        CRUD.Updatedynamic("delete from s_planos_pedidos where  estado=1 ");
                        $scope.Proceso.Porcentaje=0;
                        $scope.Proceso.CantidadFaltante=0;
                        $scope.Proceso.CantidadEnviada=0;
                        if (tipo!="AUTOMATICA") 
                        {
                            Mensajes('Pedidos Sincronizados','success','');
                        }
                        var URLactual = window.location;
                        $scope.Proceso=[];
                        $scope.Proceso.Porcentaje=0;
                        $scope.Proceso.CantidadFaltante=0;
                        $scope.Proceso.CantidadEnviada=0;
                        $scope.Proceso.Total=0;
                        $('#progreso').hide();
                        $scope.roundProgressData = {
                          label: 0,
                          percentage: 0
                        }
                        if (tipo!="AUTOMATICA") 
                        {
                            if (URLactual.hash.includes('ingresados')) {
                                setTimeout(function(){
                                    $route.reload();
                                },1000)
                            }
                        }
                        if ($scope.nueva_sincronizacion=="1" && tipo=="AUTOMATICA") 
                        {
                            localStorage.removeItem('NUEVA_SINCRONIZACION');
                            localStorage.setItem('NUEVA_SINCRONIZACION',0); 
                            if (URLactual.hash.includes('ingresados')) {
                                setTimeout(function(){
                                    $route.reload();
                                },1000)
                            }
                        }
                        return;
                    }
                    $scope.CalculoPorcentaje();
                    for (var i =0;i<elem.length;i++) {
                        var rowid=elem[i].rowid
                        if ($scope.status.connextionstate==false) {
                            $scope.errorAlerta.bandera=1;
                            break;
                        }
                        $http({
                          method: 'GET',
                          async: true,
                          timeout:14000,
                          url: SERVIDOR_ENVIO_PEDIDOS,//+'usuario='+$scope.usuario+'&entidad=PLANO&codigo_empresa=' + $scope.codigoempresa + '&datos=' + JSON.stringify(elem[i]),
                          params:{
                            usuario:$scope.usuario,
                            entidad:'PLANO',
                            codigo_empresa:$scope.codigoempresa,
                            datos:JSON.stringify(elem[i])
                          }
                            }).then(
                            function success(data) { 
                                CRUD.Updatedynamic("update s_planos_pedidos set estado=1 where rowid="+data.data.rowid+"");
                                $scope.Proceso.CantidadEnviada+=1;
                                $scope.CalculoPorcentaje();
                            }, 
                            function error(err) {
                                $scope.errorAlerta.bandera=1;
                                return ;
                        });
                    }
                    setTimeout(function(){
                        $scope.procesoEnvio=false;
                        if (tipo!='AUTOMATICA') {
                            $scope.envioDataWeb();
                        }
                        
                    },15000)
                })    
            })   
        });
    }

    $scope.EnvioRegistro=[];
    $scope.ContadorEnvios=0;
    
    $scope.build=function(){
        $scope.queryBuild='    select  '+
           ' t.key_user,'+
           ' t.rowid_empresa,'+
            't.id_cia,t.usuariocreacion,'+
            't.fechacreacion,'+
            't.rowid as e_rowid, '+
            't.rowid_cliente_facturacion as  e_rowid_cliente_facturacion,'+
            't.rowid_cliente_despacho as e_rowid_cliente_despacho,'+
            't.rowid_lista_precios as e_rowid_lista_precios,'+
            't.id_punto_envio as e_id_punto_envio,'+
            't.fecha_pedido as e_fecha_pedido,'+
            't.fecha_entrega as e_fecha_entrega,'+
            't.valor_base as e_valor_base,'+
            't.valor_descuento as e_valor_descuento,'+
            't.valor_impuesto as e_valor_impuesto,'+
            't.valor_total as e_valor_total,'+
            't.id_estado as e_id_estado,'+
            't.ind_estado_erp as e_ind_estado_erp,'+
            't.valor_facturado as e_valor_facturado,'+
            't.fecha_solicitud as e_fechasolicitud,'+
            't.orden_compra as e_orden_compra,'+
            't.modulo_creacion as e_modulo_creacion,'+
            't.observaciones as e_observaciones,'+
            'tpd.rowid as d_rowid,'+
            'tpd.rowid_pedido as d_rowid_pedido,'+
            'tpd.rowid_item as d_rowid_item,'+
            'tpd.linea_descripcion as d_linea_descripcion,'+
            'tpd.id_unidad as d_id_unidad,'+
            'tpd.cantidad as d_cantidad,'+
            'tpd.factor as d_factor,'+
            'tpd.cantidad_base as d_cantidad_base,'+
           'tpd.stock as d_stock,'+
           'tpd.tipomedida as tipomedida,'+
            'tpd.porcen_descuento as d_porcen_descuento,'+
            'tpd.valor_base as d_valor_base,'+
            'tpd.valor_impuesto as d_valor_impuesto,'+
            'tpd.valor_total_linea as d_valor_total_linea,'+
            'tpd.item_ext1 as d_item_ext1,'+
            'tpd.rowid_item_ext as d_rowid_item_ext,'+
            'tpd.empaque as d_empaque,'+
            'tpd.observaciones as d_observaciones,'+
            'tpd.rowid_bodega as d_rowid_bodega,'+
            'tpd.precio_unitario as d_precio_unitario,'+
            'tpd.valor_descuento as d_valor_descuento,'+
            'tpdd.rowid as s_rowid,'+
            'tpdd.pedidodetalle as s_rowid_detalle,'+
            'tpdd.cantidad as s_cantidad,'+
            'tpdd.itemExtension2Detalle as s_itemextencion2detalle '+
            'tpdd.rowid_sku as rowid_sku '+
            ' from t_pedidos t'+
            ' inner  join  t_pedidos_detalle tpd '+
            ' on tpd.rowid_pedido=t.rowid'+
            ' inner  join t_pedidos_detalle_detalle tpdd '+
            ' on tpdd.pedidodetalle=tpd.rowid   where  t.rowid= __REQUIRED  and estado_sincronizacion=0 '+
            ' order by t.rowid asc';
        CRUD.select("select*from t_pedidos where estado_sincronizacion=0 ",function(elem){
            $scope.queryBuild=$scope.queryBuild.replace('__REQUIRED',elem.rowid)
            CRUD.selectAllinOne($scope.queryBuild,function(ped){
                var rowidPedido=0;
                var contador=0;
                var  stringSentencia='';
                var NewQuery=true;
                var ultimoregistro=ped.length-1;
                var step=0;
                for (var i =0;i<ped.length;i++) {
                    if (ultimoregistro==i) {
                        step=1
                    }
                    rowidPedido=ped[i].e_rowid
                    if (NewQuery) {
                        stringSentencia=" insert into s_planos_pedidos  ";
                        NewQuery=false;
                    }
                    else{
                        stringSentencia+= "   UNION   ";
                    }
                    stringSentencia+=  "  SELECT  "+
                    //ped[i].e_rowid+

                    "null,'"+ped[i].key_user+
                    "','"+ped[i].rowid_empresa+
                    "','"+ped[i].id_cia+
                    "','"+ped[i].key_user+
                    "','"+ped[i].usuariocreacion+
                    "','"+ped[i].fechacreacion+
                    "','"+ped[i].e_rowid+
                    "','"+ped[i].e_rowid_cliente_facturacion+
                    "','"+ped[i].e_rowid_cliente_despacho+
                    "','"+ped[i].e_rowid_lista_precios+
                    "','"+ped[i].e_id_punto_envio+
                    "','"+ped[i].e_fecha_pedido+
                    "','"+ped[i].e_fecha_entrega+
                    "','"+ped[i].e_valor_base+
                    "','"+ped[i].e_valor_descuento+
                    "','"+ped[i].e_valor_impuesto+
                    "','"+ped[i].e_valor_total+
                    "','"+ped[i].e_id_estado+
                    "','"+ped[i].e_ind_estado_erp+
                    "','"+ped[i].e_valor_facturado+
                    "','"+ped[i].e_fechasolicitud+
                    "','"+ped[i].e_orden_compra+
                    "','"+ped[i].e_modulo_creacion+
                    "','"+ped[i].e_observaciones+
                    "','"+ped[i].d_rowid+
                    "','"+ped[i].d_rowid_pedido+
                    "','"+ped[i].d_rowid_item+
                    "','"+ped[i].d_linea_descripcion+
                    "','"+ped[i].d_id_unidad+
                    "','"+ped[i].d_cantidad+
                    "','"+ped[i].d_factor+
                    "','"+ped[i].d_cantidad_base+
                    "','"+ped[i].d_stock+
                    "','"+ped[i].d_porcen_descuento+
                    "','"+ped[i].d_valor_base+
                    "','"+ped[i].d_valor_impuesto+
                    "','"+ped[i].d_valor_total_linea+
                    "','"+ped[i].d_item_ext1+
                    "','"+ped[i].d_rowid_item_ext+
                    "','"+ped[i].d_empaque+
                    "','"+ped[i].d_observaciones+
                    "','"+ped[i].d_rowid_bodega+
                    "','"+ped[i].s_rowid+
                    "','"+ped[i].s_rowid_detalle+
                    "','"+ped[i].s_cantidad+
                    "','"+ped[i].s_itemextencion2detalle+
                    "',0,"+step+",0,0,'"+ped[i].d_precio_unitario+"','"+ped[i].d_valor_descuento+"','"+ped.length+"','"+ped.rowid_sku+"','"+ped[i].tipomedida+"' "; 
                    if (contador==499) {
                        CRUD.Updatedynamic(stringSentencia)
                        NewQuery=true;
                        stringSentencia="";
                        contador=0;
                    }
                }
                if (stringSentencia!='') {
                    CRUD.Updatedynamic(stringSentencia)
                    NewQuery=true;
                }
                CRUD.Updatedynamic("update t_pedidos set estado_sincronizacion=1,sincronizado='plano' where rowid="+rowidPedido+"");
            })
        }) 
    }
    $scope.EnvioActividades=function(){
        if ($scope.status.connextionstate==false) 
        {
            return;
        }
        $scope.usuario=$scope.sessiondate.nombre_usuario;
        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;         
        CRUD.selectAllinOne('select *from crm_actividades where sincronizado="false"',function(Actividad){

            for (var i =0;i<Actividad.length;i++) {
                var datos=JSON.stringify(Actividad[i]);
                var formdata = new FormData();
                formdata.append("datos",datos)
                formdata.append("usuario", $scope.usuario)
                formdata.append("codigo_empresa",$scope.codigoempresa)
                formdata.append("rowid_usuario",$scope.sessiondate.id)
                $.ajax({
                    type: "POST",
                    //url: "http://reymon.pedidosonline.co/mobile/syncv3",
                    url:"http://reymonpruebas.pedidosonline.co/Mobile/Sincronizacion_Actividades",
                    contentType: false,
                    processData: false,
                    data: formdata,
                    success: function (data) {
                        CRUD.Updatedynamic("update crm_actividades set sincronizado='true',rowid_web='"+data.rowid_web+"' where rowid="+data.rowid);
                    },
                    error: function (request) {
                    }
                });
                /*debugger
                $http({
                    type: "POST",
                    //url: "http://reymon.pedidosonline.co/mobile/syncv3",
                    url:"http://localhost:45091/Mobile/Sincronizacion_Actividades",
                    contentType: false,
                    processData: false,
                    data: formdata,
                    }).then(
                    function success(data) { 
                        debugger
                        CRUD.Updatedynamic("update crm_actividades set sincronizado='true',rowid_web='"+data.rowid_web+"' where rowid="+data.rowid);
                    }, 
                    function error(err) {
                        debugger
                    }) */
            }
        });
    }
    $scope.sincronizar=function(){
        $scope.errorAlerta.bandera=0;
        ProcesadoShow();   
        $scope.EnvioActividades();
        CRUD.Updatedynamic("update t_pedidos set sincronizado='EnvioCorrecto' where sincronizado='true'");
        window.setTimeout(function(){
            if ($scope.errorAlerta.bandera==1) {
                Mensajes('Error al Sincronizar, Por favor revise que su conexion sea estable','warning','');
                ProcesadoHiden();
                $route.reload();
                return
            }
            else
            {
            }
            CRUD.Updatedynamic("delete from crm_actividades where sincronizado!='false'");
            CRUD.Updatedynamic("delete from erp_items");
            CRUD.Updatedynamic("delete from erp_entidades_master");
            CRUD.Updatedynamic("delete from erp_items_precios");
            CRUD.Updatedynamic("delete  from erp_terceros");
            CRUD.Updatedynamic("delete from erp_terceros_punto_envio");
            CRUD.Updatedynamic("delete from erp_terceros_sucursales");
            CRUD.Updatedynamic("delete from m_estados");
            CRUD.Updatedynamic("delete from m_metaclass");
            CRUD.Updatedynamic("delete from crm_contactos");
            CRUD.Updatedynamic("delete from s_usuarios");
            CRUD.Updatedynamic("delete from erp_item_extension1");
            CRUD.Updatedynamic("delete from erp_item_extension2");
            CRUD.Updatedynamic("delete from erp_item_extencion1_detalle");
            CRUD.Updatedynamic("delete from erp_item_extencion2_detalle");
            CRUD.Updatedynamic("delete from erp_items_extenciones");
            CRUD.Updatedynamic("delete from t_pedidos_detalle_web");
            CRUD.Updatedynamic("delete from t_pedidos_detalle_detalle_web");
            CRUD.Updatedynamic("delete from t_pedidos_web");
            Sincronizar($scope.sessiondate.nombre_usuario,$scope.sessiondate.codigo_empresa);
            if (CONSTATE_SYNCT==1) {
                Mensajes("Error Conexion! Verificar Conexion.Sincronizar nuevamente","warning","");
                CONSTATE_SYNCT=0;
                ProcesadoHiden();
                return
            }
            else
            {
                Mensajes('Informacion Procesada','success','');
            }
                var contador=0;
                var stringSentencia='';
                var NewQuery=true;
               for(var i=0; i < STEP_SINCRONIZACION.length; i++)
                {
                    var contador1=0;
                    contador=0;
                    NewQuery=true;
                    stringSentencia='';
                    for(var j=0; j < DATOS_ENTIDADES_SINCRONIZACION[i].length; j++) {
                        contador1++;
                        contador++;
                        if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0  ) {
                            //CRUD.insert('t_pedidos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //

                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_cliente_facturacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_cliente_despacho+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_bodega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_pedido+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_entrega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_solicitud+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].orden_compra+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].referencia+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_base+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_descuento+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_total+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numpedido_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numfactura_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].estado_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_facturado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cond_especial+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_doc+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cond_pago+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numremision_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_co+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_conductor_cc+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_conductor_nombre+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_placa+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_nota+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].criterio_clasificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].modulo_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].sincronizado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].key_mobile+
                            "','1','00000000001' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0 ) {
                            //CRUD.insert('t_pedidos_detalle',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //debugger
                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_detalle_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_pedido+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_bodega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].linea_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].factor+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad_base+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].precio_unitario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_motivo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].stock+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_base+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_descuento+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_total_linea+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].unidad_medida+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].num_lote+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].flete+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento3+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento3+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].empaque+"',1,1 "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_TERCEROS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_interno+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_identificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].razonsocial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_comercial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_cliente+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_proveedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_accionista+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].industria+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_industria+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clasificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_SUCURSALES && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros_sucursales',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (DATOS_ENTIDADES_SINCRONIZACION[i][j].length==0) {

                            }
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros_sucursales  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_tercero+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion2+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion3+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_postal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_ciudad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_depto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_pais+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_contacto+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email_contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].centro_operacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_condicion_pago+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad_negocio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_grupo_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_zona+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_bloqueo_cupo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_bloqueo_mora+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cupo_credito+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_cliente+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clave+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_bodega+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_division+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_principal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_criterio_clasificacion+"' "; 
                            if (contador==499) {
                                
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_MAESTROS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_entidades_master',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_entidades_master  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_maestro+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_id_cia+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_rowid_maestro+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_id_maestro+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_disabled+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom3+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS_COLORES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_entidades_master',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_detalle_detalle_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].pedidoDetalle+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemExtencion2Detalle+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PUNTOS_ENVIO  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros_punto_envio',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros_punto_envio  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_tercero+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_items',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_referencia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_codigo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_linea+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext2+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad_venta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion_extensa+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_custom1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].impuesto_id+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].impuesto_porcentaje+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion_adicional+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad_embalaje+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_inventario+"' "; 
                            
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS_PRECIOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_items_precios',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items_precios  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].precio_lista+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_activacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_inactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].estado_item+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ACTIVIDADES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_actividades',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //debugger
                            if (NewQuery) {
                                stringSentencia=" insert into crm_actividades  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tema+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_prioridad+
                             "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_relacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].relacionado_a+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_inicial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_final+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_relacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].sincronizado+"','','','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_METACLASS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('m_metaclass',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_metaclass  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].class_code+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_reg_codigo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_reg_nombre+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].CreatedBy+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].CreationDate+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ModifiedBy+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ModDate+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ESTADOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('m_estados',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_estados  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].id_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_editar+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_CONTACTOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into crm_contactos  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_sucursal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombres+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].apellidos+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].skype+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ruta_imagen+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].celular+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cargo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].area+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_principal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_modificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        } 
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_LOCALIZACION  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_localizacion  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_localizacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_pais+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_depto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_ciudad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_alterno+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_USUARIOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into s_usuarios  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_codigo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_usuario+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_completo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clave+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_cambiarclave+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].acepto_condiciones+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].idioma+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_usuario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].coordinador_canal_deault+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].superior_rowid+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_canal_superior+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal_vendedor+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_CANALES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into s_canales_usuario  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_usuario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_canal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        } 
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION1  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extension1  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION2  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extension2  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION1_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extencion1_detalle  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion1ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION2_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extencion2_detalle  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion2ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rgba+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].url_imagen+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEM_EXTENSION  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items_extenciones  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            debugger
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencionDetalle1ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencionDetalle2ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].indEstado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaInactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaCreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fotoID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].notas+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioInactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioCreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioModificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaDodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion1ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion2ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowIDmovtoEntidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porMaxExcesoKit+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porMinExcesoKit+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].UnidadValidacionID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].BarrasPrincipalID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].planKitID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemExtGenID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].stock+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].EstadoID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].proceso+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].imagen1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].imagen2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].imagen3+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].imagen4+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_GRAFICA_DIARIO  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            GRAFICA_DIA_LABEL[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].dia;
                            GRAFICA_DIA_CANTIDAD[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad;

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_GRAFICA_MENSUAL  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            GRAFICA_MES_LABEL[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].mes;
                            GRAFICA_MES_CANTIDAD[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad;

                        } 
                        else if (STEP_SINCRONIZACION[i] == TABLA_BALANCE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            TABLA_BALANCE_DATOS[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j];

                        } 
                    }
                    if (stringSentencia!='') {
                        CRUD.Updatedynamic(stringSentencia)
                        NewQuery=true;
                    }
                }
                localStorage.removeItem('TABLA_BALANCE'); 
                localStorage.setItem('TABLA_BALANCE',JSON.stringify(TABLA_BALANCE_DATOS));
                localStorage.removeItem('GRAFICA_MES_CANTIDAD'); 
                localStorage.setItem('GRAFICA_MES_CANTIDAD',JSON.stringify(GRAFICA_MES_CANTIDAD));
                localStorage.removeItem('GRAFICA_MES_LABEL');
                localStorage.setItem('GRAFICA_MES_LABEL',JSON.stringify( GRAFICA_MES_LABEL));
                localStorage.removeItem('GRAFICA_DIA_LABEL');
                localStorage.setItem('GRAFICA_DIA_LABEL',JSON.stringify( GRAFICA_DIA_LABEL));
                localStorage.removeItem('GRAFICA_DIA_CANTIDAD');
                localStorage.setItem('GRAFICA_DIA_CANTIDAD',JSON.stringify(GRAFICA_DIA_CANTIDAD)); 
                localStorage.removeItem('FECHA_SINCRONIZACION');
                localStorage.removeItem('FECHA_SINCRONIZACION_DATE');
                var f = new Date();
                $scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
                var FechaSincronizacion=f.getHours() + ':'+f.getMinutes() +' '+diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
                localStorage.setItem('FECHA_SINCRONIZACION',JSON.stringify(FechaSincronizacion)); 
                localStorage.setItem('FECHA_SINCRONIZACION_DATE',f); 
                ULTIMA_EMPRESA_SINCRONIZADA=$scope.sessiondate.codigo_empresa;
            window.setTimeout(function(){
                ProcesadoHiden();
                //$location.path('/ventas/pedidos_ingresados')
                $route.reload();
                Mensajes('Sincronizado Con Exito','success','')
            },7000)
            
            
        },6000)
    }
}]);
app_angular.controller('appController',['Conexion','$scope','$location','$http', '$routeParams', 'Factory' ,function (Conexion, $scope, $location, $http, $routeParams, Factory) {
    if (window.localStorage.getItem("CUR_USER") == null || window.localStorage.getItem("CUR_USER")==undefined) {
        location.href='login.html';
        return;
    }
    if ($routeParams.url == undefined) {
   
    }
    else {
        console.log($routeParams);
        $scope.templateUrl = 'view/' + $routeParams.modulo + '/' + $routeParams.url + '.html';
    }
    $scope.CurrentDate=function(){
        $scope.day;
        $scope.DayNow=Date.now();
        $scope.YearS=$scope.DayNow.getFullYear();
        $scope.MonthS=$scope.DayNow.getMonth()+1;
        if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
        $scope.DayS=$scope.DayNow.getDate();
        $scope.HourS=$scope.DayNow.getHours();
        $scope.MinuteS=$scope.DayNow.getMinutes();
        if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
        $scope.day=$scope.YearS+''+$scope.MonthS+''+$scope.DayS;
        return $scope.day;
    }
    $scope.GetMonth=function(){
        $scope.day;
        $scope.DayNow=Date.now();
        $scope.YearS=$scope.DayNow.getFullYear();
        $scope.MonthS=$scope.DayNow.getMonth()+1;
        if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
        $scope.DayS=$scope.DayNow.getDate();
        $scope.HourS=$scope.DayNow.getHours();
        $scope.MinuteS=$scope.DayNow.getMinutes();
        if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
        $scope.day=$scope.YearS+''+$scope.MonthS+''+$scope.DayS;
        return $scope.MonthS;
    }
    $scope.SelectedDate=function(daySelected){
        $scope.day;
        $scope.DayNow=new Date(daySelected);
        $scope.YearS=$scope.DayNow.getFullYear();
        $scope.MonthS=$scope.DayNow.getMonth()+1;
        if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
        $scope.DayS=$scope.DayNow.getDate();
        $scope.HourS=$scope.DayNow.getHours();
        $scope.MinuteS=$scope.DayNow.getMinutes();
        if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
        $scope.day=$scope.YearS+'-'+$scope.MonthS;
        return $scope.day;
    }
    $scope.RequestDate=function(day){
        $scope.day;
        $scope.DayNow=new Date(day);
        $scope.YearS=$scope.DayNow.getFullYear();
        $scope.MonthS=$scope.DayNow.getMonth()+1;
        if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
        $scope.DayS=$scope.DayNow.getDate();
        $scope.HourS=$scope.DayNow.getHours();
        $scope.MinuteS=$scope.DayNow.getMinutes();
        if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
        $scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
        return $scope.day;
    }
    $scope.RequestDay=function(day){
        $scope.day;
        $scope.DayNow=new Date(day);
        $scope.YearS=$scope.DayNow.getFullYear();
        $scope.MonthS=$scope.DayNow.getMonth()+1;
        if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
        $scope.DayS=$scope.DayNow.getDate();
        $scope.HourS=$scope.DayNow.getHours();
        $scope.MinuteS=$scope.DayNow.getMinutes();
        if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
        $scope.day=$scope.DayS;
        return $scope.day;
    }
    $scope.actividadesToday=[];

    var query="select  tema,descripcion,fecha_inicial,fecha_final ,replace(fecha_inicial,'-','') as fecha_inicialF,replace(fecha_final,'-','') as fecha_finalF from crm_actividades ";
    $scope.today=$scope.CurrentDate();
    CRUD.select(query,function(elem){
        var f1 = elem.fecha_inicialF.slice(0,8);
        var f2 = elem.fecha_finalF.slice(0,8);
        f1.replace(' ','');
        f2.replace(' ','');
        if (f1<=$scope.today) {
            if (f2>=$scope.today) {
                $scope.actividadesToday.push(elem);
            }
        }
    })
    var GRAFICA_DIA_CANTIDAD=JSON.parse(window.localStorage.getItem("GRAFICA_DIA_CANTIDAD"));
    var GRAFICA_DIA_LABEL=JSON.parse(window.localStorage.getItem("GRAFICA_DIA_LABEL"));
    var GRAFICA_MES_CANTIDAD=JSON.parse(window.localStorage.getItem("GRAFICA_MES_CANTIDAD"));
    var GRAFICA_MES_LABEL=JSON.parse(window.localStorage.getItem("GRAFICA_MES_LABEL"));
    $scope.registros=[GRAFICA_MES_CANTIDAD];
    $scope.labels=GRAFICA_MES_LABEL;
    $scope.dataGD=[GRAFICA_DIA_CANTIDAD];
    $scope.labelsGD=GRAFICA_DIA_LABEL;
    $scope.data = [ [65, 59, 80, 81, 56, 55] ];
    $scope.colours=["#26B99A"];
    $scope.fechaSincronizacion=window.localStorage.getItem("FECHA_SINCRONIZACION");
   $scope.labels1 = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series1 = ['Pedidos'];

      $scope.data1 = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
      ];
}]);


//CONTROLADOR DE MENU
app_angular.controller('menuController', function ($scope, Factory) {
    $scope.menuList = [
        {
            nombre_opcion: 'Ventas', url: '#/', isSubmenu: true, icono: 'fa fa-bar-chart',
            submenu: [{nombre_opcion: 'Pedidos', url: '#/ventas/pedidos_ingresados'}
            ]
        },
        {
            nombre_opcion: 'Crm', url: '#/', isSubmenu: true, icono: 'icon-user',
            submenu: [{nombre_opcion: 'Clientes', url: '#/crm/terceros'}
            ]
        },
        {
            nombre_opcion: 'Configuracion', url: '#/', isSubmenu: true, icono: 'icon-cog',
            submenu: [{nombre_opcion: 'Mi Cuenta', url: '#/configuracion/mi_cuenta'}, {
                nombre_opcion: 'Cambiar Clave',
                url: '#/'
            }]
        }
    ];
});

//CONTROLADOR DEL LOGIN
app_angular.controller('loginController', function ($scope, Factory, $location, $http) {
});


//CONTROLADOR DE PANTALLA DE CALENDARIO
app_angular.controller('calendarioController', function ($scope, Factory) {
    
});