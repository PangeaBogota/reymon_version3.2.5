app_angular.controller("configController",['Conexion','$scope','$route',function (Conexion,$scope,$route) {
	$scope.sincronizacion=window.localStorage.getItem("TIPO_SINCRONIZACION");
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	if ($scope.sincronizacion==null || $scope.sincronizacion==undefined || $scope.sincronizacion==NaN) {
		$scope.sincronizacion='AUTOMATICA';
	}
	$scope.$watch('sincronizacion',function(a,b){
		//TIPO_SINCRONIZACION=$scope.sincronizacion;
	})
	$scope.Guardar=function()
	{
		localStorage.removeItem('TIPO_SINCRONIZACION');
		localStorage.setItem('TIPO_SINCRONIZACION',$scope.sincronizacion); 
		Mensajes('Guardado Correctamente','success');
	}
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.empresa="";
	if ($scope.sessiondate.codigo_empresa==10) 
	{
		$scope.empresa="Produccion REYMON ";
	}
	else if ($scope.sessiondate.codigo_empresa==12) 
	{
		$scope.empresa="Pruebas REYMON";
	}
	else 
	{
		$scope.empresa="Desconocido";
	}
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
			'tpd.tipomedida as tipomedida,'+
			'tpdd.rowid as s_rowid,'+
			'tpdd.pedidodetalle as s_rowid_detalle,'+
			'tpdd.cantidad as s_cantidad,'+
			'tpdd.itemExtension2Detalle as s_itemextencion2detalle,tpdd.rowid_sku,t.longitud,t.latitud '+
			' from t_pedidos t'+
			' inner  join  t_pedidos_detalle tpd '+
			' on tpd.rowid_pedido=t.rowid'+
			' inner  join t_pedidos_detalle_detalle tpdd '+
			' on tpdd.pedidodetalle=tpd.rowid   '+
			' order by t.rowid asc';

	$scope.EnviarInformacion=function()
	{
		CRUD.selectAllinOne($scope.queryBuild,function(resultado){
			$scope.usuario=$scope.sessiondate.nombre_usuario;
	        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
	        var datos=JSON.stringify(resultado);
	        var formdata = new FormData();
	        formdata.append("datos",datos)
	        formdata.append("usuario", $scope.usuario)
	        formdata.append("codigo_empresa",$scope.codigoempresa)
	        formdata.append("id",$scope.sessiondate.id)
	        $.ajax({
	            type: "POST",
	            //url: "http://reymon.pedidosonline.co/mobile/syncv3",
	            url:"http://reymonpruebas.pedidosonline.co/Mobile/LogPedidosUsuarios",
	            contentType: false,
	            processData: false,
	            data: formdata,
	            success: function (data) {
	            	alert("ok")
	            },
	            error: function (request) {
	                alert("error")
	            }
	        });
		})
	}
}]);
