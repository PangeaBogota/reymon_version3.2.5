/**
 * Created by dev10 on 1/7/2016.
 */
var app_angular = angular.module('PedidosOnline');


//CONTROLADOR DEL MOULO DE VENTAS
app_angular.controller("pedidoController",['Conexion','$scope','$location','$http','$routeParams','$timeout',function (Conexion,$scope,$location,$http,$routeParams,$timeout) {

	$scope.TABLA_BALANCE=JSON.parse(window.localStorage.getItem("TABLA_BALANCE"));
	$scope.SeleccionDocena=true;
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	if ($scope.sessiondate.codigo_empresa==12) 
	{
		$scope.url='http://reymonpruebas.pedidosonline.co';		
	}
	else
	{
		$scope.url='http://reymon.pedidosonline.co';
	}
	$scope.coma="'";
	angular.element('ul.tabs li').click(function () {
		var tab_id = angular.element(this).find('a').data('tab');
		if (tab_id.includes('2') ) {
			$scope.ValidacionEncabezado(2);
			return;
		}
		if (tab_id.includes('3')) {
			$scope.ValidacionEncabezado(3);
			return;
		}
		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');
		
		angular.element(this).toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	});
	$scope.acciones=[];
	$scope.acciones.BotonAgregar='Agregar';
	$scope.acciones.tituloPagina='Pedido Nuevo';
	$scope.ListaTerceros=[];
	$scope.ListaSucursales=[];
	$scope.ListaPuntoEnvios=[];
	$scope.PuntoEnvio=[];
	$scope.Sucursal=[];
	$scope.ListaItems=[];
	$scope.Tercero=[];
	$scope.Pedido=[];
	$scope.CantidadTotalUnidad=0;
	$scope.Pedido.rowid=0;
	$scope.Tallas=[];
	$scope.TallasUnidad=[];
	$scope.FechaEntrega;
	$scope.ColoresTalla=[];
	$scope.itemsAgregadosPedido=[];
	$scope.MediaDocenaCount=6;
	$scope.ColorMasivoMedia=[];
	$scope.ItemSeleccionado=false;
	$scope.onpenModalColoresunidad=false;
	$scope.LimpiarRegistros=function()
	{
		$scope.ListaItems=[];
		$scope.ListaSucursales=[];
		$scope.ListaPuntoEnvios=[];
		$scope.PuntoEnvio=[];
		$scope.Sucursal=[];
		$scope.Tallas=[];
		$scope.FechaEntrega;
	}
	$scope.LimpiarInformacionItem=function()
	{
		$scope.EditarItem=[];
		$scope.CantidadTotalReferencia=0;
		$scope.CantidadTotalReferenciaUnidades=0;
		$scope.ColorMasivo=[];
		$scope.Tallas=[];
		$scope.TallasUnidad=[];
		$scope.CantidadTotalUnidad=0;
		$scope.SeleccionDocena=true;
		$scope.ColoresTalla=[];
		$scope.ItemSeleccionado=false;
		$scope.ColorMasivoMedia=[];
		$scope.CantidadDocena=12;
		$scope.MediaDocenaCount=6;
	}
	//CONSULTA DE TERCEROS
	CRUD.select('select*from erp_terceros order by razonsocial',
	function(elem)
	{
		$scope.ListaTerceros.push(elem);
	});	
	$scope.onChangeTercero=function(){
		$scope.LimpiarRegistros();
		CRUD.select("select  codigo_sucursal||'-'||nombre_sucursal as sucursal,*from erp_terceros_sucursales where rowid_tercero = '"+$scope.Tercero.rowid+"'   order by codigo_sucursal",
		function(elem){
			$scope.ListaSucursales.push(elem)
		})
	}
	$scope.ListaPrecios=[];
	$scope.onChangeSucursal=function(){
		//CARGAR PUNTOS DE ENVIO
		$scope.ListaPuntoEnvios=[];
		CRUD.select("select direccion ||'-'|| nombre_punto_envio as concatenado, *from erp_terceros_punto_envio where rowid_tercero = '"+$scope.Tercero.rowid+"'  and  codigo_sucursal = '"+$scope.Sucursal.codigo_sucursal+"'   order by direccion ",
		function(elem){
			$scope.ListaPuntoEnvios.push(elem);
		});
		CRUD.select("select*from erp_entidades_master where erp_id_maestro='"+$scope.Sucursal.id_lista_precios+"'",function(elem){
			$scope.ListaPrecios=elem;

		})
		$scope.CargarItems();
	}
	$scope.CargarItems=function(){
		$scope.ListaItems=[];
		$scope.Consulta="";
		if ($scope.Sucursal.centro_operacion=='001') {
			$scope.Consulta="select distinct  *,'' as empaque,'' as observacion from vw_items_precios  where  erp_id_maestro='"+$scope.Sucursal.id_lista_precios+"' and (tipo_inventario = 'IN300501')  order by item_referencia1 ";
		}
		else if ($scope.Sucursal.centro_operacion=='003') 
		{
			$scope.Consulta="select distinct *,'' as empaque,'' as observacion from vw_items_precios  where  erp_id_maestro='"+$scope.Sucursal.id_lista_precios+"'  and    (tipo_inventario = 'IN300502'  or  tipo_inventario = 'IN300503')   order by item_referencia1 ";
		}
		CRUD.select($scope.Consulta,
			function(elem)
			{
				$scope.ListaItems.push(elem);
			}
		);
	}
	$scope.validacionItemExistente=function()
	{
		for (var i = 0; i < $scope.itemsAgregadosPedido.length; i++) {
			if ($scope.itemsAgregadosPedido[i].item_referencia==$scope.Item.item_referencia1) {
				return 'Item ya Agregado a Pedido.';
			}
		}
		return '';
	}
	$scope.onChangeComboItem=function(validacion){
		if ($scope.EditarItem.banderaEditar!=true || validacion==undefined) {
			if ($scope.EditarItem.banderaEditar==true) {
				if (!confirm("Desea Cambiar de Item, mientras se encuentra en la Edicion de otra Referecia")) {
					$scope.Item=$scope.EditarItem.Item;
					return;
				}
			}
			$scope.ItemExistente=$scope.validacionItemExistente();
			if ($scope.ItemExistente!='') {
				$scope.Item=null;
				$scope.LimpiarInformacionItem();
				Mensajes($scope.ItemExistente,'error','');
				return;
			}
			$scope.LimpiarInformacionItem();
		}
		$scope.ItemSeleccionado=true;
		CRUD.select("select distinct  e.itemID,item.item_referencia,e.extencionDetalle1ID as talla,0 as cantidad,0  as multiplo,ext1_d.erp_descripcion_corta,sum(e.stock) as stock from erp_items_extenciones  e inner join erp_items item on item.rowid=e.itemID inner join  erp_item_extencion1_detalle ext1_d on ext1_d.rowid_erp=e.extencionDetalle1ID and ext1_d.extencion1ID=e.extencion1ID where e.itemID='"+$scope.Item.rowid_item+"'  group by e.itemID,item.item_referencia,e.extencionDetalle1ID,ext1_d.erp_descripcion_corta order by ext1_d.erp_descripcion_corta ",function(elem){
			elem.Estado=1;
			elem.duplicado=true;
			elem.Colores=[];
			elem.TipoMedida=true;
			if ($scope.EditarItem.banderaEditar==true) {
				angular.forEach($scope.Item.Tallas,function(value,key){
					if (value.talla==elem.talla && value.TipoMedida==elem.TipoMedida) {
						elem.cantidad=value.cantidad;
						elem.Colores=value.Colores
						if (value.Colores.length>0) {
							elem.Estado=1;	
						}
					}
				})
			}
			$scope.Tallas.push(elem);
			$scope.tallaUnidad = jQuery.extend(true, {}, $scope.Tallas[$scope.Tallas.length-1]);
			$scope.tallaUnidad.TipoMedida=false;
			if ($scope.EditarItem.banderaEditar==true) {
				angular.forEach($scope.Item.Tallas,function(value,key){
					if (value.talla==$scope.tallaUnidad.talla && value.TipoMedida==$scope.tallaUnidad.TipoMedida) {
						$scope.tallaUnidad.cantidad=value.cantidad;
						$scope.tallaUnidad.Colores=value.Colores
						if (value.Colores.length>0) {
							$scope.tallaUnidad.Estado=1;	
						}
					}
				})
			}
			$scope.TallasUnidad.push($scope.tallaUnidad);
			$scope.calcularTotalCantidad();
		})
	}
	$scope.ValidacionEncabezado=function(a)
	{
		if ($scope.Tercero.rowid==undefined) {
			Mensajes('Seleccionar Tercero','error','');
			return
		}
		if ($scope.Sucursal.rowid==undefined) {
			Mensajes('Seleccionar Sucursal','error','');
			return
		}
		if ($scope.PuntoEnvio.rowid==undefined) {
			Mensajes('Seleccionar Punto Envio','error','');
			return
		}
		if ($scope.FechaEntrega==undefined || $scope.FechaEntrega=='') {
			Mensajes('Seleccionar Fecha Entrega','error','');
			return
		}
		$scope.CambiarTab(a);
	}
	$scope.CambiarTab = function (tab) {
		$scope.tab_id = null;
		if (tab == '1' )
			$scope.tab_id = 'tab_1';
		else if (tab == '2' )
			$scope.tab_id = 'tab_2';
		else if (tab == '3' )
			$scope.tab_id = 'tab_3';

		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');

		angular.element("ul.tabs").find("[data-tab='" + $scope.tab_id + "']").toggleClass('active');
		angular.element("#" + $scope.tab_id).toggleClass('active');
	};
	$scope.cantidadTalla=function(talla,accion,stock)
	{
		if (accion=="restar") {
			for (var i = 0;i<$scope.Tallas.length;i++) {

				if ($scope.Tallas[i].talla==talla && $scope.Tallas[i].TipoMedida==$scope.SeleccionDocena) {
					if ($scope.Tallas[i].cantidad==0) {
						$scope.Tallas[i].Colores=[];
						$scope.AgregarColoresMasivoTalla(talla);
						return
					}
					if ($scope.Item.item_custom1!="SI") {
						$scope.Tallas[i].cantidad-=0.5;	
						$scope.Tallas[i].multiplo--;
					}else{
						$scope.Tallas[i].cantidad-=1;	

						$scope.Tallas[i].multiplo--;
					}
					$scope.cantidadrefererencia+=$scope.Tallas[i].cantidad;
					if ($scope.Tallas[i].cantidad>0 && $scope.Tallas[i].duplicado==true) {
						
						$scope.AgregarColoresMasivoTalla(talla);
					}
				}
			}	
		}
		else
		{
			for (var i = 0;i<$scope.Tallas.length;i++) {
				if ($scope.Tallas[i].talla==talla && $scope.Tallas[i].TipoMedida==$scope.SeleccionDocena) {
					if ($scope.Item.item_custom1!="SI") {
						$scope.Tallas[i].cantidad+=0.5;	
						$scope.Tallas[i].multiplo++;
						$scope.Validarstock=$scope.Tallas[i].cantidad*12;
					}
					else{
						$scope.Tallas[i].cantidad+=1;	
						$scope.Tallas[i].multiplo++;
						$scope.Validarstock=$scope.Tallas[i].cantidad;
					}
					if ($scope.Tallas[i].duplicado==true) 
					{
						$scope.AgregarColoresMasivoTalla(talla);	
					}
					
				}
				$scope.cantidadrefererencia+=$scope.Tallas[i].cantidad;
				
			}
		}
		$scope.calcularTotalCantidad();
		$scope.calcularDireferenciaTallasColor();
	}
	$scope.CantidadTotalReferencia=0;
	$scope.CantidadTotalReferenciaUnidades=0;
	$scope.ColorMasivo=[];
	$scope.CantidadDocena=12;
	$scope.calcularTotalCantidad=function()
	{
		$scope.CantidadTotalReferencia=0;
		for (var i = 0;i<$scope.Tallas.length;i++) {
			$scope.CantidadTotalReferencia+=$scope.Tallas[i].cantidad;
		}
		$scope.CantidadTotalReferenciaUnidades=0;
		for (var i = 0; i < $scope.TallasUnidad.length; i++) {
			$scope.CantidadTotalReferenciaUnidades+=$scope.TallasUnidad[i].cantidad;
		}
	}
	$scope.TallasDocena=function()
	{
		$scope.ModalColorMasivo=true;
		$('#OpenModalColor').click();
		if ($scope.ColorMasivo.length==0) {
			$scope.CantidadDocena=12;
			CRUD.select("select distinct a.itemID,a.extencionDetalle2ID,0 as cantidad,d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID  where itemID='"+$scope.Item.rowid_item+"' order by extencionDetalle2ID",function(elem){
				$scope.ColorMasivo.push(elem);
			})		
		}	
	}

	$scope.calcularDireferenciaTallasColor=function()
	{
		var cantidad=0;
		for (var a=0;a<$scope.Tallas.length;a++) {
			if ($scope.Tallas[a].TipoMedida==false) 
			{
				continue;
			}
			for (var i = 0;i<$scope.Tallas[a].Colores.length;i++) {
				cantidad+=$scope.Tallas[a].Colores[i].cantidad;
			}
			var cantidadtalla=($scope.Tallas[a].cantidad*12);
			if (cantidadtalla==0) {
				$scope.Tallas[a].Estado=3;	
			}
			if (cantidadtalla==cantidad) {
				$scope.Tallas[a].Estado=1;		
			}
			else
			{
				$scope.Tallas[a].Estado=2;		
			}
			cantidad=0;
		}	
	}
	$scope.adicionarCantidadColor=function(color,accion)
	{
		if ($scope.CantidadDocena==0 && accion=="SUMAR") {
			Mensajes('Cantidad Maxima Alcanzada','error','');
			return;
		}
		if (accion=="SUMAR") {
			for (var i =0;i<$scope.ColorMasivo.length;i++) {
				if ($scope.ColorMasivo[i].extencionDetalle2ID==color) {
					$scope.ColorMasivo[i].cantidad+=1;
					$scope.CantidadDocena--;
				}
			}	
		}else{
			for (var i =0;i<$scope.ColorMasivo.length;i++) {
				if ($scope.ColorMasivo[i].extencionDetalle2ID==color) {
					if ($scope.ColorMasivo[i].cantidad!=0) {
						$scope.ColorMasivo[i].cantidad-=1;
						$scope.CantidadDocena++;		
					}
				}
			}
		}
	}
	$scope.AgregarColoresMasivo=function()
	{
		$scope.ModalColorMasivo=false;
		if ($scope.ColorMasivo.length==0) {
			return
		}
		for (var i =0; i<$scope.Tallas.length;i++ ) {
			if ($scope.Tallas[i].duplicado==false) 
			{
				continue;
			}
			var CantidadBase=$scope.Tallas[i].cantidad;
			CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID  where a.itemID='"+$scope.Tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.Tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
				var CantidadTalla=0;
				var InidicadorArray=0;
				var ValidacionEstadoCompleto=true;
				if (elem.length>0) {
					InidicadorArray=elem[0].IndicadorArray;
					CantidadTalla=elem[0].cantidadextension1;	
					for (var t =0;t< elem.length;t++) {
						for (var x=0;x<$scope.ColorMasivo.length;x++) {
							if (elem[t].extencionDetalle2ID==$scope.ColorMasivo[x].extencionDetalle2ID) {
								if (CantidadTalla % 1 == 0) {
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
								else
								{
									ValidacionEstadoCompleto=false;
									CantidadTalla-=0.5
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
							}	
						}
					}
					if (CantidadTalla>0) {
						$scope.Tallas[InidicadorArray].Colores=elem;
					}
				}
				$scope.calcularDireferenciaTallasColor();
			})			
		}
	}
	$scope.openModalColoresUnidad=function(item,talla,cantidad){
		$scope.onpenModalColoresunidad=true;
		item=item.trim();
		$scope.InfoItemAdicional=[];
		$scope.cantidadParcialItem=$scope.InfoItemAdicional.cantidad
		$scope.InfoItemAdicional.talla=talla;
		$scope.ColoresTalla=[];
		$scope.contadorDetalle2=0;
		$scope.banderaConsumo=1;
		for (var i =0;i<$scope.TallasUnidad.length;i++) {

			if ($scope.TallasUnidad[i].talla==talla && $scope.SeleccionDocena==$scope.TallasUnidad[i].TipoMedida) {
				if ($scope.TallasUnidad[i].Colores.length!=0) {
					for (var f=0;f<$scope.TallasUnidad[i].Colores.length;f++) {
						$scope.TallasUnidad[i].Colores[f].cantidadextension1=cantidad;	
					}
					$scope.ColoresTalla=$scope.TallasUnidad[i].Colores;
					$scope.banderaConsumo=0;
				}
			}
		}

		if ($scope.banderaConsumo==1) {
			CRUD.select("select a.*,0 as cantidad,'"+cantidad+"' as cantidadextension1,d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID where itemID='"+item+"'  and  extencionDetalle1ID='"+talla+"'  order by a.extencionDetalle2ID ",function(elem){
				$scope.ColoresTalla.push(elem);
			})	
		}
		$scope.CantidadTotalUnidadF();
		$('#ColoresUnidad').click();
	}
	$scope.openModalDetalle2=function(item,talla,cantidad){
		if (cantidad==undefined) {
			Mensajes('Agregar Cantidad','error','');
			return
		}
		if (cantidad==0) {
			Mensajes('Agregar Cantidad','error','');
			return
		}
		$scope.consultaDetalle2(item,talla,cantidad);
		$('#extension2').click();
		$scope.ModalColorOpen=true;
	}
	$scope.InfoItemAdicional=[];
	$scope.consultaDetalle2=function(item,talla,cantidad){
		item=item.trim();
		$scope.InfoItemAdicional=[];
		if ($scope.Item.item_custom1!='SI') {
			$scope.InfoItemAdicional.cantidad=cantidad*12;	
		}
		$scope.cantidadParcialItem=$scope.InfoItemAdicional.cantidad
		$scope.InfoItemAdicional.talla=talla;
		$scope.ColoresTalla=[];
		$scope.contadorDetalle2=0;
		$scope.banderaConsumo=1;
		for (var i =0;i<$scope.Tallas.length;i++) {

			if ($scope.Tallas[i].talla==talla && $scope.SeleccionDocena==$scope.Tallas[i].TipoMedida) {
				if ($scope.Tallas[i].Colores.length!=0) {
					for (var f=0;f<$scope.Tallas[i].Colores.length;f++) {
						$scope.Tallas[i].Colores[f].cantidadextension1=cantidad;	
					}
					$scope.ColoresTalla=$scope.Tallas[i].Colores;
					$scope.banderaConsumo=0;
				}
			}
		}

		if ($scope.banderaConsumo==1) {
			CRUD.select("select a.*,0 as cantidad,'"+cantidad+"' as cantidadextension1,d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID where itemID='"+item+"'  and  extencionDetalle1ID='"+talla+"'  order by a.extencionDetalle2ID ",function(elem){
				$scope.ColoresTalla.push(elem);
			})	
		}
		$scope.cantidadRestanteColorF($scope.InfoItemAdicional.cantidad);
	}
	$scope.cantidadRestanteColor=0;
	$scope.cantidadRestanteColorF=function(cantidad){
		$scope.cantidadRestanteColor=cantidad;
		for (var i = 0;i<$scope.ColoresTalla.length;i++) {
			$scope.cantidadRestanteColor-=$scope.ColoresTalla[i].cantidad;
		}
	}
	$scope.CantidadTotalUnidadF=function()
	{
		$scope.CantidadTotalUnidad=0;
		for (var i = 0; i <$scope.ColoresTalla.length; i++) {
			$scope.CantidadTotalUnidad+=$scope.ColoresTalla[i].cantidad;
		}
		
	}
	$scope.onChangeCantidadColorunidad=function(extension,stock,cantidad){
		if ($scope.Item.item_custom1!="SI") {
			cantidad=cantidad*12;
		}
		for (var i = 0;i<$scope.ColoresTalla.length;i++) {
			if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
				if ($scope.Item.item_custom1!="SI") {
					
					$scope.validacionStock=$scope.ColoresTalla[i].cantidad;
					if ($scope.validacionStock>stock && $scope.ColoresTalla[i].estadoID==4003) {
						$scope.ColoresTalla[i].cantidad=0;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
					if ($scope.validacionStock>stock) 
					{
						Mensajes("La Cantidad sobrepasa el stock","information","");
					}
				}else{
					$scope.validacionStock=$scope.ColoresTalla[i].cantidad;
					if ($scope.validacionStock>stock && $scope.ColoresTalla[i].estadoID==4003) {
						$scope.ColoresTalla[i].cantidad=0;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
				}
			}
		}
		$scope.CantidadTotalUnidadF();
	}
	
	$scope.adicionarCantidadColorUnidad=function(extension,accion,stock,cantidad)
	{
		
		if (accion=="restar") {
			for (var i = 0;i<$scope.ColoresTalla.length;i++) {

				if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
					if ($scope.ColoresTalla[i].cantidad==0) {
						return
					}
					if ($scope.Item.item_custom1!="SI") {
						$scope.ColoresTalla[i].cantidad-=1;
						$scope.contadorDetalle2--;	
					}else{
						$scope.ColoresTalla[i].cantidad-=1;
						$scope.contadorDetalle2--;		
					}
				}
			}
		}
		else
		{
			for (var i = 0;i<$scope.ColoresTalla.length;i++) {
				if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
					if ($scope.Item.item_custom1!="SI") {
						$scope.ColoresTalla[i].cantidad+=1;	
						$scope.Validarstock=$scope.ColoresTalla[i].cantidad;
						$scope.contadorDetalle2++;	
						if ($scope.Validarstock>stock && $scope.ColoresTalla[i].estadoID==4003) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
						if ($scope.Validarstock>stock) 
						{
							Mensajes("La Cantidad sobrepasa el stock","information","");
						}
					}else{
						$scope.ColoresTalla[i].cantidad+=1;	
						$scope.contadorDetalle2++;	
						$scope.Validarstock=$scope.ColoresTalla[i].cantidad;

						if ($scope.Validarstock>stock && $scope.ColoresTalla[i].estadoID==4003) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
					}
					
				}
			}
		}
		$scope.CantidadTotalUnidadF();
	}
	$scope.adicionarCantidadDetalle2=function(extension,accion,stock,cantidad)
	{	
		if ($scope.Item.item_custom1!="SI") {
			cantidad=cantidad*12;
		}
		
		if (accion=="restar") {
			for (var i = 0;i<$scope.ColoresTalla.length;i++) {

				if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
					if ($scope.ColoresTalla[i].cantidad==0) {
						return
					}
					if ($scope.Item.item_custom1!="SI") {
						$scope.ColoresTalla[i].cantidad-=1;
						$scope.contadorDetalle2--;	
					}else{
						$scope.ColoresTalla[i].cantidad-=1;
						$scope.contadorDetalle2--;		
					}
				}
			}
		}
		else
		{
			if ($scope.cantidadRestanteColor==0) {
				Mensajes('Cantidad Maxima Alcanzada','error','');
				return;
			}
			for (var i = 0;i<$scope.ColoresTalla.length;i++) {
				if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
					if ($scope.Item.item_custom1!="SI") {
						$scope.ColoresTalla[i].cantidad+=1;	
						$scope.Validarstock=$scope.ColoresTalla[i].cantidad;
						$scope.contadorDetalle2++;	
						if ($scope.Validarstock>stock && $scope.ColoresTalla[i].estadoID==4003) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
						if ($scope.Validarstock>stock) 
						{
							Mensajes("La Cantidad sobrepasa el stock","information","");
						}
						if ($scope.ColoresTalla[i].cantidad>cantidad) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede sobrepasar la Cantidad Seleccionada","error","");
						}
					}else{
						$scope.ColoresTalla[i].cantidad+=1;	
						$scope.contadorDetalle2++;	
						$scope.Validarstock=$scope.ColoresTalla[i].cantidad;

						if ($scope.Validarstock>stock && $scope.ColoresTalla[i].estadoID==4003) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
						if ($scope.ColoresTalla[i].cantidad>cantidad) {
							$scope.ColoresTalla[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede sobrepasar la Cantidad Seleccionada","error","");
						}
					}
					
				}
			}
		}
		$scope.cantidadRestanteColorF(cantidad);
	}
	$scope.agregarColoresTalla=function(){
		$scope.ModalColorOpen=false;
		for (var i = 0;i<$scope.Tallas.length;i++) {
			if ($scope.Tallas[i].talla==$scope.InfoItemAdicional.talla && $scope.Tallas[i].TipoMedida==$scope.SeleccionDocena) {
				$scope.Tallas[i].Colores=$scope.ColoresTalla;
			}
		}
		$scope.calcularDireferenciaTallasColor();

	}
	$scope.agregarColoresTallaUnidad=function(){
		for (var i = 0;i<$scope.TallasUnidad.length;i++) {
			if ($scope.TallasUnidad[i].talla==$scope.InfoItemAdicional.talla && $scope.TallasUnidad[i].TipoMedida==$scope.SeleccionDocena) {
				$scope.TallasUnidad[i].Colores=$scope.ColoresTalla;
				$scope.TallasUnidad[i].cantidad=$scope.CantidadTotalUnidad;
			}
			
		}
		$scope.ColoresTalla=[];
		$scope.CantidadTotalUnidad=0;
		$scope.calcularDireferenciaTallasColor();
		$scope.calcularTotalCantidad();
		$scope.onpenModalColoresunidad=false;

	}
	$scope.AgregarColoresMasivoTalla=function(TallaChange)
	{
		if ($scope.ColorMasivo.length==0) {
			return;
		}
		for (var i =0; i<$scope.Tallas.length;i++ ) {
			var CantidadBase=$scope.Tallas[i].cantidad;
			if (CantidadBase==0) {
				continue;
			}
			if ($scope.Tallas[i].talla!=TallaChange) {
				continue;
			}
			if ($scope.Tallas[i].TipoMedida==false) 
			{
				continue;
			}
			CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and d.extencion2ID=a.extencion2ID  where a.itemID='"+$scope.Tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.Tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
				if (elem.length>0) {
					var CantidadTalla=0;
					var InidicadorArray=0;
					var ContadorColor=0;
					var ValidacionEstadoCompleto=true;
					InidicadorArray=elem[0].IndicadorArray;
					CantidadTalla=elem[0].cantidadextension1;
					for (var t =0;t< elem.length;t++) {
						for (var x=0;x<$scope.ColorMasivo.length;x++) {
							if (elem[t].extencionDetalle2ID==$scope.ColorMasivo[x].extencionDetalle2ID) {
								if (CantidadTalla % 1 == 0) {
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
										ContadorColor+=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
								else
								{
									ValidacionEstadoCompleto=false;
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5)))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5);
										ContadorColor+=$scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5);
									}
								}
							}	
						}
					}
					ContadorColor=0;
					if (CantidadTalla>0) {
						$scope.Tallas[InidicadorArray].Colores=elem;
					}	
					if (CantidadTalla % 1 != 0) {
						$scope.AgregarColoresMTalla(InidicadorArray);
					}
					$scope.calcularDireferenciaTallasColor();
				}
			})			
		}
	}
	
	$scope.TallasMediaDocena=function()
	{
		$scope.ModalColorMasivo=true;
		$('#OpenModalColorMedia').click();
		if ($scope.ColorMasivoMedia.length==0) {
			CRUD.select("select distinct a.itemID,a.extencionDetalle2ID,0 as cantidad,d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID  where itemID='"+$scope.Item.rowid_item+"' order by extencionDetalle2ID",function(elem){
				$scope.ColorMasivoMedia.push(elem);
				
			})		
		}
	}
	$scope.adicionarCantidadColorM=function(color,accion)
	{
		if ($scope.MediaDocenaCount==0 && accion=="SUMAR") {
			Mensajes('Cantidad Maxima Alcanzada','error','');
			return;
		}
		if (accion=="SUMAR") {
			for (var i =0;i<$scope.ColorMasivoMedia.length;i++) {
				if ($scope.ColorMasivoMedia[i].extencionDetalle2ID==color) {
					$scope.ColorMasivoMedia[i].cantidad+=1;
					$scope.MediaDocenaCount--;
				}
			}	
		}else{
			for (var i =0;i<$scope.ColorMasivoMedia.length;i++) {
				if ($scope.ColorMasivoMedia[i].extencionDetalle2ID==color) {
					if ($scope.ColorMasivoMedia[i].cantidad!=0) {
						$scope.ColorMasivoMedia[i].cantidad-=1;
						$scope.MediaDocenaCount++;		
					}
					
				}
			}
		}
	}
	$scope.cantidadColor=function(InidicadorArray)
	{
		var Cantidad=0;
		for (var i = 0; i < $scope.Tallas[InidicadorArray].Colores.length; i++) {
			Cantidad+=$scope.Tallas[InidicadorArray].Colores[i].cantidad;
		}
		return Cantidad;
	}
	$scope.AgregarColoresMasivoM=function()
	{
		$scope.ModalColorMasivo=false;
		if ($scope.ColorMasivoMedia.length==0) {
			return;
		}
		for (var i =0; i<$scope.Tallas.length;i++ ) {
			if ($scope.Tallas[i].duplicado==false) 
			{
				continue;
			}
			var CantidadBase=$scope.Tallas[i].cantidad;
			if (CantidadBase% 1 != 0) {
				var cantidadColores=$scope.cantidadColor(i);
				if (((CantidadBase*12)-cantidadColores)==6) {
					CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.Tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.Tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
						var CantidadTalla=0;
						var InidicadorArray=0;
						var ContadorColor=0;
						var ValidacionEstadoCompleto=true;
						if (elem.length>0) {
							InidicadorArray=elem[0].IndicadorArray;
							CantidadTalla=elem[0].cantidadextension1;	
							if ($scope.Tallas[InidicadorArray].Colores.length>0) {
								for (var t =0;t< $scope.Tallas[InidicadorArray].Colores.length;t++) {
									for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
										if ($scope.Tallas[InidicadorArray].Colores[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
											
											$scope.Tallas[InidicadorArray].Colores[t].cantidad+=$scope.ColorMasivoMedia[x].cantidad;
											if (elem[t].estadoID==4003 && (($scope.Tallas[InidicadorArray].Colores[t].cantidad+$scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
												elem[t].cantidad=elem[t].stock*1;
											}
											else
											{
												elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
											}
										}	
									}
								}
							}
							else
							{
								for (var t =0;t< elem.length;t++) {
									for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
										if (elem[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
											if (elem[t].estadoID==4003 && (($scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
												elem[t].cantidad=elem[t].stock*1;
											}
											else
											{
												elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
											}
										}	
									}
								}
								if (CantidadTalla>0) {
									$scope.Tallas[InidicadorArray].Colores=elem;
								}
							}
						}
						ContadorColor=0;
						$scope.calcularDireferenciaTallasColor();
					})	
				}
			}
		}
	}
	$scope.AgregarColoresMTalla=function(i)
	{
		if ($scope.ColorMasivoMedia.length==0) {
			return;
		}
		var CantidadBase=$scope.Tallas[i].cantidad;
		if (CantidadBase% 1 != 0) {
			var cantidadColores=$scope.cantidadColor(i);
			if (((CantidadBase*12)-cantidadColores)==6) {
				CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.Tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.Tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
					var CantidadTalla=0;
					var InidicadorArray=0;
					var ContadorColor=0;
					var ValidacionEstadoCompleto=true;
					if (elem.length>0) {
						InidicadorArray=elem[0].IndicadorArray;
						CantidadTalla=elem[0].cantidadextension1;	
						if ($scope.Tallas[InidicadorArray].Colores.length>0) {
							for (var t =0;t< $scope.Tallas[InidicadorArray].Colores.length;t++) {
								for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
									if ($scope.Tallas[InidicadorArray].Colores[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
										if (elem[t].estadoID==4003 && (($scope.Tallas[InidicadorArray].Colores[t].cantidad+$scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
											$scope.Tallas[InidicadorArray].Colores[t].cantidad=elem[t].stock*1;
										}
										else
										{
											$scope.Tallas[InidicadorArray].Colores[t].cantidad+=$scope.ColorMasivoMedia[x].cantidad;
										}
									}	
								}
							}
						}
						else
						{
							for (var t =0;t< elem.length;t++) {
								for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
									if (elem[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
										if (elem[t].estadoID==4003 && (($scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
											elem[t].cantidad=elem[t].stock*1;
										}
										else
										{
											elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
										}
										
									}	
								}
							}
							if (CantidadTalla>0) {
								$scope.Tallas[InidicadorArray].Colores=elem;
							}
						}
					}
					ContadorColor=0;
					$scope.calcularDireferenciaTallasColor();
				})	
			}
		}
	}
	$scope.Empaque=function(){
		$scope.Empaques=[];
		CRUD.select("select*from m_metaclass where  class_code='PEDIDO.EMPAQUE'",
		function(elem)
		{	
			$scope.Empaques.push(elem)
		});	
	}
	$scope.Empaque();
	$scope.validacionColoresCompletos=function()
	{
		var ResultaColores='';
		for (var i =0;i< $scope.Tallas.length ;i++) {
			if ($scope.Tallas[i].cantidad==0) {
				$scope.Tallas[i].detalle2=[];
			}
			if ($scope.Tallas[i].cantidad>0 && $scope.Tallas[i].Estado!=1) {
				ResultaColores= 'Asignar todos los Colores a Las Tallas';
			}
		}	
		if (ResultaColores!='') {
			return ResultaColores;
		}
		
		var CatidadtotalTalla=0;
		for (var i =0;i< $scope.Tallas.length ;i++) {
			CatidadtotalTalla+=$scope.Tallas[i].cantidad;
		}
		for (var i =0;i< $scope.TallasUnidad.length ;i++) {
			CatidadtotalTalla+=$scope.TallasUnidad[i].cantidad;
		}
		if (CatidadtotalTalla==0) {
			return 'Se debe Asignar Cantidad almenos a una talla.';
		}
		if ($scope.Item.empaque==undefined || $scope.Item.empaque=='') {
			return 'Seleccionar Empaque';
		}
		return '';
	}
	$scope.eliminarReferencia = function (index,validacion) {
		if (validacion) {
			if (!confirm("Deseas Eliminar Esta Referecia?") ) {
				return
			}
		}
	}
	$scope.EliminarItemPedido=function(item)
	{
		if (!confirm("Deseas Eliminar Esta Referecia?") ) {
			return;
		}
		CRUD.selectAllinOne("select*from t_pedidos_detalle where rowid_item='"+item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'",function(elem){
		if (elem.length>0) 
		{
			var IDElimintar='(';
			for (var i = 0; i < elem.length; i++) {
				IDElimintar+=elem[i].rowid+',';
			}
			IDElimintar=IDElimintar.substring(0,IDElimintar.length-1);
			IDElimintar+=')';
			var query="delete from t_pedidos_detalle_detalle where pedidodetalle in "+IDElimintar+" ";
			CRUD.Updatedynamic(query)
			CRUD.Updatedynamic("delete from t_pedidos_detalle where rowid_item='"+item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'");
			//$scope.ItemsPedidoAgregados();
			//$scope.CalcularCantidadValorTotal();
			$scope.ItemsPedidoAgregados();
		}
	})

	}
	$scope.adicionarItem=function(){
		$scope.ResultadoValidacion=$scope.validacionColoresCompletos();
		if ($scope.ResultadoValidacion!='') {
			Mensajes($scope.ResultadoValidacion,'error','');
			return;
		}
		if ($scope.EditarItem.banderaEditar==true) 
		{
			//$scope.eliminarReferencia($scope.EditarItem.banderaEditarDelete,false);
			/*CRUD.selectAllinOne("select*from t_pedidos_detalle where rowid_item='"+$scope.Item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'",function(elem){
				if (elem.length>0) 
				{
					var IDElimintar='(';
					for (var i = 0; i < elem.length; i++) {
						IDElimintar+=elem[i]+',';
					}
					IDElimintar=IDElimintar.substring(0,IDElimintar.length-1);
					IDElimintar=')';
					CRUD.Updatedynamic("delete t_pedidos_detalle where rowid_item='"+$scope.Item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'")
					CRUD.Updatedynamic("delete t_pedidos_detalle where rowid_item='"+$scope.Item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'")

				}
			})*/
		}
		$scope.Item.iva=$scope.Item.precio*$scope.Item.impuesto_porcentaje/100;
		$scope.Item.valorTotal=0;
		$scope.Item.cantidadTotal=0;
		$scope.tallasAgregar=[];
		for (var i=1;i<9;i++) {
			$scope.banderaSimilar=true;
			for (var f=0;f<$scope.Tallas.length;f++) {
				$scope.i=parseInt($scope.Tallas[f].erp_descripcion_corta);
				if ($scope.i==i) {
					$scope.var1=0;
					if ($scope.Item.item_custom1!="SI") {
						$scope.var1=$scope.Tallas[f].cantidad*12;
					}else{
						$scope.var1=$scope.Tallas[f].cantidad;	
					}
					$scope.Tallas[f].cantidad1=parseInt($scope.var1);
					$scope.Item.cantidadTotal+=$scope.Tallas[f].cantidad1;
					$scope.validacionCantidades++;
					$scope.tallasAgregar.push($scope.Tallas[f]);
					$scope.banderaSimilar=false;
				}
			}
			if ($scope.banderaSimilar) {
				$scope.tallas1=[];
				$scope.tallas1.itemID="0";
				$scope.tallas1.item_referencia1="0";
				$scope.tallas1.talla="0";
				$scope.tallas1.cantidad="0";
				$scope.tallas1.cantidad1=0;
				$scope.tallas1.multiplo="0";
				$scope.tallas1.erp_descripcion_corta="0";
				$scope.tallasAgregar.push($scope.tallas1);
			}
		}
		$scope.Item.Tallas=$scope.tallasAgregar;
		$scope.Item.TallasUnidad=$scope.TallasUnidad;
		$scope.Item.ColorMasivo=$scope.ColorMasivo;
		$scope.Item.ColorMasivoMedia=$scope.ColorMasivoMedia;
		$scope.Item.EmpaqueS=$scope.Item.empaque.tipo_reg_nombre.slice(0,3);
		//$scope.itemsAgregadosPedido.unshift($scope.Item);
		if ($scope.EditarItem.banderaEditar==true) 
		{
			
			CRUD.selectAllinOne("select*from t_pedidos_detalle where rowid_item='"+$scope.Item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'",function(elem){
				if (elem.length>0) 
				{
					var IDElimintar='(';
					for (var i = 0; i < elem.length; i++) {
						IDElimintar+=elem[i].rowid+',';
					}
					IDElimintar=IDElimintar.substring(0,IDElimintar.length-1);
					IDElimintar+=')';
					CRUD.Updatedynamic("delete from t_pedidos_detalle_detalle where pedidodetalle in "+IDElimintar+" ")
					CRUD.Updatedynamic("delete from t_pedidos_detalle where rowid_item='"+$scope.Item.rowid_item+"' and rowid_pedido='"+$scope.Pedido.rowid+"'")
					
					
					$scope.GuardarItem($scope.Item);
				}
			})
		}
		else{
			$scope.GuardarItem($scope.Item);
		}
		
		$scope.LimpiarInformacionItem();
		//$scope.Item=null;
		$scope.acciones.BotonAgregar='Agregar';
		$scope.EditarItem=[];
	}
	$scope.ItemModal=[];
	$scope.ColoresModal=[];
	$scope.ModalItem=function(item){
		$scope.ColoresModal=[];
		$scope.modalColorOpenBalance=true;
		//$scope.ModalColoreOpen=true;
		$('#ColoresAgregados').click();
		$scope.ItemModal=[];
		$scope.ItemModal=angular.copy(item)	;
		for (var i = 0; i < $scope.ItemModal.tallas.length; i++) {
			if ( $scope.ItemModal.tallas[i].cantidad>0) {
				$scope.ItemModal.tallas[i].colores=[];
				CRUD.selectAllinOne("select  '"+i+"' as array,c.*,b.cantidad from t_pedidos_detalle a inner join t_pedidos_detalle_detalle  b on b.pedidoDetalle=a.rowid inner join erp_items_extenciones ext on ext.itemID=a.rowid_item and ext.extencionDetalle1ID=a.item_ext1 and ext.extencionDetalle2ID=b.itemExtension2Detalle inner join erp_item_extencion2_detalle c on c.rowid_erp=ext.extencionDetalle2ID and c.extencion2ID=ext.extencion2ID    where a.rowid_pedido='"+item.rowid_pedido+"' and  a.rowid_item='"+item.rowid_item+"'  and a.item_ext1='"+$scope.ItemModal.tallas[i].talla+"'",function(elem){
					if (elem.length>0) {
						$scope.ItemModal.tallas[elem[0].array].colores=elem;
					}
				})
			}
			else
			{
				$scope.ItemModal.tallas[i]=[];	
				$scope.ItemModal.tallas[i].cantidad=0;		
			}
		}
		
	}
	$scope.GuardarItem=function(Item)
    {
    	ProcesadoShow();
    	angular.forEach(Item.Tallas,function(detalle,key){
			$scope.detalle=[];
			if (detalle.cantidad==0 || detalle.cantidad==undefined) {
				return;
			}
			detalle.cantidad=detalle.cantidad1;
			$scope.detalle.rowid_item=Item.rowid_item;
			$scope.detalle.rowid_pedido=$scope.Pedido.rowid;
			$scope.detalle.linea_descripcion=Item.descripcion;
			$scope.detalle.id_unidad=Item.id_unidad;
			$scope.detalle.cantidad=detalle.cantidad;
			$scope.detalle.factor=0;
			$scope.detalle.cantidad_base=detalle.cantidad;
			$scope.detalle.stock=0;
			$scope.detalle.porcen_descuento=Item.impuesto_porcentaje;
			$scope.calculo=[];
			$scope.calculo.valor_base=Item.precio*detalle.cantidad;
			$scope.calculo.iva=$scope.calculo.valor_base*Item.impuesto_porcentaje/100;
			$scope.detalle.valor_impuesto=$scope.calculo.iva
			$scope.calculo.total=$scope.calculo.valor_base+$scope.calculo.iva;
			$scope.detalle.valor_descuento=0;
			$scope.detalle.rowid_item_ext=parseInt(detalle.erp_descripcion_corta);
			$scope.detalle.valor_total_linea=$scope.calculo.total;
			$scope.detalle.precio_unitario=Item.precio;
			$scope.detalle.valor_base=Item.precio*detalle.cantidad;
			$scope.detalle.usuariocreacion=$scope.sessiondate.nombre_usuario;
			$scope.detalle.empaque=Item.empaque.tipo_reg_nombre;
			$scope.detalle.item_ext1=detalle.talla;
			$scope.detalle.estado=0;
			$scope.detalle.indicador=$scope.sessiondate.key;
			$scope.detalle.TipoMedida=1378
			if (Item.observacion==undefined) {
				$scope.detalle.observaciones='';
			}
			else
			{
				$scope.detalle.observaciones=Item.observacion;	
			}
			$scope.detalle.fechacreacion=$scope.CurrentDate();
			CRUD.insert('t_pedidos_detalle',$scope.detalle);
			CRUD.select("select max(rowid) as rowid from t_pedidos_detalle",function(Detalle){
				var NewQuery=true
				var stringSentencia="";
				var contador=0;
				for (var i = 0;i<detalle.Colores.length;i++) {
					contador++;
					if (detalle.Colores[i].cantidad>0) {
						if (NewQuery) {
							stringSentencia=" insert into t_pedidos_detalle_detalle  ";
							NewQuery=false;
						}
						else{
							stringSentencia+= "   UNION   ";
						}
						stringSentencia+=  "  SELECT  "+
						"null,'"+parseInt(Detalle.rowid)+
						"','"+detalle.Colores[i].extencionDetalle2ID+"','"+detalle.Colores[i].cantidad+"',0,0,0,0,0,0,"+detalle.Colores[i].rowid_erp+""; 
					}
					if (contador==499) {
						CRUD.Updatedynamic(stringSentencia)
						NewQuery=true;
						stringSentencia="";
						contador=0;
					}
				}	
				if (stringSentencia!="") {
					CRUD.Updatedynamic(stringSentencia)
					NewQuery=true;
					stringSentencia="";
					contador=0;
				}
			})
		})
		angular.forEach(Item.TallasUnidad,function(detalle,key){
			$scope.detalle=[];
			if (detalle.cantidad==0 || detalle.cantidad==undefined) {
				return;
			}
			$scope.detalle.rowid_item=Item.rowid_item;
			$scope.detalle.rowid_pedido=$scope.Pedido.rowid;
			$scope.detalle.linea_descripcion=Item.descripcion;
			$scope.detalle.id_unidad=Item.id_unidad;
			$scope.detalle.cantidad=detalle.cantidad;
			$scope.detalle.factor=0;
			$scope.detalle.cantidad_base=detalle.cantidad;
			$scope.detalle.stock=0;
			$scope.detalle.porcen_descuento=Item.impuesto_porcentaje;
			$scope.calculo=[];
			$scope.calculo.valor_base=Item.precio*detalle.cantidad;
			$scope.calculo.iva=$scope.calculo.valor_base*Item.impuesto_porcentaje/100;
			$scope.detalle.valor_impuesto=$scope.calculo.iva
			$scope.calculo.total=$scope.calculo.valor_base+$scope.calculo.iva;
			$scope.detalle.valor_descuento=0;
			$scope.detalle.rowid_item_ext=parseInt(detalle.erp_descripcion_corta);
			$scope.detalle.valor_total_linea=$scope.calculo.total;
			$scope.detalle.precio_unitario=Item.precio;
			$scope.detalle.valor_base=Item.precio*detalle.cantidad;
			$scope.detalle.usuariocreacion=$scope.sessiondate.nombre_usuario;
			$scope.detalle.empaque=Item.empaque.tipo_reg_nombre;
			$scope.detalle.item_ext1=detalle.talla;
			$scope.detalle.estado=0;
			$scope.detalle.TipoMedida=1377
			$scope.detalle.indicador=$scope.sessiondate.key;
			if (Item.observacion==undefined) {
				$scope.detalle.observaciones='';
			}
			else
			{
				$scope.detalle.observaciones=Item.observacion;	
			}
			$scope.detalle.fechacreacion=$scope.CurrentDate();
			CRUD.insert('t_pedidos_detalle',$scope.detalle);
			CRUD.select("select max(rowid) as rowid from t_pedidos_detalle",function(Detalle){
				var NewQuery=true
				var stringSentencia="";
				var contador=0;
				for (var i = 0;i<detalle.Colores.length;i++) {
					contador++;
					if (detalle.Colores[i].cantidad>0) {
						if (NewQuery) {
							stringSentencia=" insert into t_pedidos_detalle_detalle  ";
							NewQuery=false;
						}
						else{
							stringSentencia+= "   UNION   ";
						}
						stringSentencia+=  "  SELECT  "+
						"null,'"+parseInt(Detalle.rowid)+
						"','"+detalle.Colores[i].extencionDetalle2ID+"','"+detalle.Colores[i].cantidad+"',0,0,0,0,0,0,"+detalle.Colores[i].rowid_erp+""; 
					}
					if (contador==499) {
						CRUD.Updatedynamic(stringSentencia)
						NewQuery=true;
						stringSentencia="";
						contador=0;
					}
				}	
				if (stringSentencia!="") {
					CRUD.Updatedynamic(stringSentencia)
					NewQuery=true;
					stringSentencia="";
					contador=0;
				}
			})
		})
		setTimeout(function() {
			ProcesadoHiden();	
			$scope.ItemsPedidoAgregados();
			$scope.Item=null;
		}, 4000);
		
    }
	$scope.EditarItem=[];
	$scope.editarItem=function(item,index){
		if ($scope.Item!=undefined || $scope.Item!=null) {
			if (!confirm("Desea Editar Este Item, mientras se esta adicionando otro item?")) {
				return;
			}
		}
		$scope.LimpiarInformacionItem();
		$scope.EditarItem.banderaEditar=true;
		$scope.EditarItem.banderaEditarDelete=index;
		for (var i = 0; i < $scope.ListaItems.length; i++) {
			if ($scope.ListaItems[i].item_referencia1==item.item_referencia) 
			{
				$scope.Item=$scope.ListaItems[i];
				$scope.EditarItem.Item=$scope.ListaItems[i];
			}
		}
		CRUD.selectAllinOne("select*from t_pedidos_detalle  where rowid_pedido='"+$scope.rowid_Pedido+"' and rowid_item='"+item.rowid_item+"' ",function(elem){
			$scope.Item.Tallas=elem;
			CRUD.selectAllinOne("select*from t_pedidos_detalle talla inner join t_pedidos_detalle_detalle color on color.pedidodetalle=talla.rowid  where rowid_pedido='"+$scope.rowid_Pedido+"' and rowid_item='"+item.rowid_item+"' ",function(Colores){
				CRUD.selectAllinOne("select distinct  e.itemID,item.item_referencia,e.extencionDetalle1ID as talla,0 as cantidad,0  as multiplo,ext1_d.erp_descripcion_corta,sum(e.stock) as stock from erp_items_extenciones  e inner join erp_items item on item.rowid=e.itemID inner join  erp_item_extencion1_detalle ext1_d on ext1_d.rowid_erp=e.extencionDetalle1ID and ext1_d.extencion1ID=e.extencion1ID where e.itemID='"+item.rowid_item+"'  group by e.itemID,item.item_referencia,e.extencionDetalle1ID,ext1_d.erp_descripcion_corta order by ext1_d.erp_descripcion_corta ",function(tallas){
					for (var i = 0; i < tallas.length; i++) {
						tallas[i].Estado=1;
						tallas[i].duplicado=true;
						tallas[i].Colores=[];
						tallas[i].TipoMedida=true;
						if ($scope.EditarItem.banderaEditar==true) {
							angular.forEach($scope.Item.Tallas,function(value,key){
								if (value.item_ext1==tallas[i].talla && value.TipoMedida==1378) {
									tallas[i].cantidad=value.cantidad/12;
									tallas[i].Colores=[];
								}
							})
						}
						$scope.Tallas.push(tallas[i]);
						$scope.tallaUnidad = angular.copy(tallas[i]);//jQuery.extend(true, {}, $scope.Tallas[$scope.Tallas.length-1]);
						$scope.tallaUnidad.cantidad=0;
						$scope.tallaUnidad.TipoMedida=false;
						if ($scope.EditarItem.banderaEditar==true) {
							angular.forEach($scope.Item.Tallas,function(value,key){
								if (value.item_ext1==$scope.tallaUnidad.talla && value.TipoMedida==1377) {
									$scope.tallaUnidad.cantidad=value.cantidad;
									
								}
							})
						}
						$scope.TallasUnidad.push($scope.tallaUnidad);
						$scope.calcularTotalCantidad();
					}
					for (var i = 0; i < $scope.Tallas.length; i++) {
						if ($scope.Tallas[i].cantidad>0) 
						{
							CRUD.selectAllinOne("select a.*,0 as cantidad,'"+$scope.Tallas[i].cantidad+"' as cantidadextension1,d.rgba,d.url_imagen,"+i+" as b,'"+$scope.Tallas[i].talla+"' as talla from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID where itemID='"+item.rowid_item+"'  and  extencionDetalle1ID='"+$scope.Tallas[i].talla+"'  order by a.extencionDetalle2ID ",function(elemColores){
								if (elemColores.length>0) 
								{
									for (var i = 0; i < elemColores.length; i++) {
										for (var j = 0; j < Colores.length; j++) {
											if (Colores[j].TipoMedida==1378 && Colores[j].item_ext1==elemColores[i].extencionDetalle1ID && Colores[j].itemExtension2Detalle==elemColores[i].extencionDetalle2ID ) 
											{
												elemColores[i].cantidad=Colores[j].cantidad;
											}
										}
									}
									$scope.Tallas[elemColores[0].b].Colores=elemColores;
								}
							})
						}
					}
					for (var i = 0; i < $scope.TallasUnidad.length; i++) {
						if ($scope.TallasUnidad[i].cantidad>0) 
						{
							CRUD.selectAllinOne("select a.*,0 as cantidad,'"+$scope.TallasUnidad[i].cantidad+"' as cantidadextension1,d.rgba,d.url_imagen,"+i+" as b from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID where itemID='"+item.rowid_item+"'  and  extencionDetalle1ID='"+$scope.TallasUnidad[i].talla+"'  order by a.extencionDetalle2ID ",function(elemColores){
								if (elemColores.length>0) 
								{
									for (var i = 0; i < elemColores.length; i++) {
										for (var j = 0; j < Colores.length; j++) {
											if (Colores[j].TipoMedida==1377 && Colores[j].item_ext1==elemColores[i].extencionDetalle1ID && Colores[j].itemExtension2Detalle==elemColores[i].extencionDetalle2ID ) 
											{
												elemColores[i].cantidad=Colores[j].cantidad;
											}
										}
									}
									$scope.TallasUnidad[elemColores[0].b].Colores=elemColores;

								}
							})
						}
					}
				})
			})
			
		})
		$scope.ItemSeleccionado=true;
		for (var i = 0; i < $scope.Empaques.length; i++) {
			if (item.empaque==$scope.Empaques[i].tipo_reg_nombre) 
			{
				$scope.Item.empaque=$scope.Empaques[i]
			}
		}
		$scope.Item.observacion=item.observacion;	
		//$scope.Item=item;
		//$scope.EditarItem.Item=item;
		//$scope.ColorMasivo=$scope.Item.ColorMasivo;
		//$scope.ColorMasivoMedia=$scope.Item.ColorMasivoMedia;
		//$scope.MasivoCalcularCantidades();
		//$scope.onChangeComboItem(true);
		$scope.CambiarTab(2);
		$scope.acciones.BotonAgregar='Editar Item';
	}
	$scope.MasivoCalcularCantidades=function()
	{
		$scope.CantidadDocena=12;
		$scope.MediaDocenaCount=6;
		for (var i = 0; i < $scope.ColorMasivo.length; i++) {
			$scope.CantidadDocena-=$scope.ColorMasivo[i].cantidad;
		}
		for (var i = 0; i < $scope.ColorMasivoMedia.length; i++) {
			$scope.MediaDocenaCount-=$scope.ColorMasivoMedia[i].cantidad;
		}
	}
	$scope.onChangeCantidad=function(talla,stock)
	{
		for (var i = 0;i<$scope.Tallas.length;i++) {
			if ($scope.Tallas[i].talla==talla &&  $scope.Tallas[i].TipoMedida==$scope.SeleccionDocena) {
				$scope.Tallas[i].Colores=[];
				$scope.AgregarColoresMasivoTalla(talla);
			}
		}
		$scope.calcularDireferenciaTallasColor();
	}
	$scope.onChangeCantidadDetalle2=function(extension,stock,cantidad){
		if ($scope.Item.item_custom1!="SI") {
			cantidad=cantidad*12;
		}
		for (var i = 0;i<$scope.ColoresTalla.length;i++) {
			if ($scope.ColoresTalla[i].extencionDetalle2ID==extension) {
				if ($scope.Item.item_custom1!="SI") {
					
					$scope.validacionStock=$scope.ColoresTalla[i].cantidad;
					if ($scope.validacionStock>stock && $scope.ColoresTalla[i].estadoID==4003) {
						$scope.ColoresTalla[i].cantidad=0;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
					if ($scope.validacionStock>stock) 
					{
						Mensajes("La Cantidad sobrepasa el stock","information","");
					}
					if ($scope.validacionStock>cantidad) {
						$scope.ColoresTalla[i].cantidad=0;
						Mensajes("La Cantidad no sobrepasar la Cantidad Inicial","error","");
					}
				}else{
					$scope.validacionStock=$scope.ColoresTalla[i].cantidad;
					if ($scope.validacionStock>stock && $scope.ColoresTalla[i].estadoID==4003) {
						$scope.ColoresTalla[i].cantidad=0;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
					if ($scope.validacionStock>cantidad) {
						$scope.itemextension2Detalle[i].cantidad=0;
						Mensajes("La Cantidad no sobrepasar la Cantidad Inicial","error","");
					}
				}
			}
		}
		$scope.cantidadRestanteColorF(cantidad);
	}
	$scope.onChangeFechaEntrega=function()
	{
		if (document.getElementById("FechaEntrega").valueAsDate==null) {
			return;
		}
		var hoy = new Date($scope.FechaEntrega);
		month = '' + (hoy.getMonth() + 1),
        day = '' + hoy.getDate(),
        year = hoy.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

		var dia1=  [year, month, day].join('');
		
		month = '' + ($scope.fechaDefault.getMonth() + 1),
        day = '' + $scope.fechaDefault.getDate(),
        year = $scope.fechaDefault.getFullYear();
		
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
	    var dia2=[year, month, day].join('');

		if (dia2>dia1) {
			Mensajes('Dias minimos de entrega son 3 Dias','error','');
			$scope.FechaEntrega='';
			document.getElementById("FechaEntrega").valueAsDate = null;
			return;
		}
		var i=hoy.getDay()
		var d = new Date(hoy),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
	    /*debugger
	    if (day=="01") 
	    {
	    	Mensajes('No se Puede Seleccionar el primer dia del mes','error','');
			$scope.FechaEntrega='';
			document.getElementById("FechaEntrega").valueAsDate = null;
			return;
	    }*/
    	var diaSeleccionado= [year, month, day].join('-');
		for (var i =0;i<DiasFestivos.length;i++) {
			if (diaSeleccionado==DiasFestivos[i]) {
				Mensajes('No se puede seleccionar un dia festivo','error','');
				$scope.FechaEntrega='';
				document.getElementById("FechaEntrega").valueAsDate = null;
				return;
			}
		}

	}

	$scope.fechaDefault='';
	$scope.FechaEntrega=function()
	{
		var hoy = new Date();
		var count=0;
		while (count<3) {
		  hoy.setTime(hoy.getTime()+24*60*60*1000); // añadimos 1 día
		  if ( hoy.getDay() != 0)
		  {
			var d = new Date(hoy),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();
		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;
	    	var diaSeleccionado= [year, month, day].join('-');
			for (var  i= 0; i < DiasFestivos.length; i++) {
				if (diaSeleccionado==DiasFestivos[i]) {
					hoy.setDate(hoy.getDate() + 1);
				}
			}
			 day = '' + hoy.getDate();
			 if (day.length < 2) {day = '0' + day};
			 if (day=="01") {hoy.setDate(hoy.getDate() + 1);}
		  	count++;  
		  }
		}
		$scope.fechaDefault=hoy;
		document.getElementById("FechaEntrega").valueAsDate = hoy;
		$scope.FechaEntrega=	hoy;
	}

	$scope.FechaEntrega();
	$scope.ValoresTotales=[];
	$scope.CalcularCantidadValorTotal=function(){
		/*$scope.valortotal=0;
		$scope.iva=0;
		$scope.cantidad=0;
		$scope.ivatotal=0;
		$scope.precioEstandar=0;
		$scope.precioEstandar1=0;*/
		$scope.Valores=[];
		$scope.ivatotal=0;
		$scope.valornetototal=0;
		$scope.valorneto=0;
		$scope.valortotal=0;
		$scope.cantidad=0;
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.valornetototal+=value.precio*value.cantidadtotal;
			$scope.valorneto=value.precio*value.cantidadtotal;
			$scope.ivatotal+=value.iva*$scope.valorneto/100;
			$scope.cantidad+=value.cantidadtotal;
			/*$scope.precioEstandar1+=value.precio*value.cantidadtotal;
			$scope.precioEstandar=value.precio*value.cantidadtotal;
			$scope.valortotal+=$scope.precioEstandar;
			$scope.cantidad+=value.cantidadtotal;
			$scope.ivatotal+=value.iva*$scope.precioEstandar1/100;*/

		})
		$scope.ValoresTotales.neto=$scope.valornetototal;
		$scope.ValoresTotales.iva=$scope.ivatotal;
		$scope.ValoresTotales.cantidad=$scope.cantidad;
		$scope.ValoresTotales.total=$scope.valornetototal+$scope.ivatotal;
		var query="update t_pedidos set valor_total='"+$scope.ValoresTotales.total+"',valor_base='"+$scope.ValoresTotales.neto+"',valor_impuesto='"+$scope.ValoresTotales.iva+"'  where rowid='"+$scope.Pedido.rowid+"'";
		CRUD.Updatedynamic(query);
	}
	$scope.openModalProductoC=false;
	$scope.openModalProducto=function(item)
	{
		$scope.openModalProductoC=true;
		$scope.ProductoModal=item;
		$('#OpenModalProducto').click();
	}
	$scope.closeModalProducto=function()
	{
		$scope.openModalProductoC=false;
	}
	$scope.confimar=[];
	$scope.confimar.next=[]
	$scope.confimar.current=[]
	$scope.confimar.salir=false;
	$scope.modalColorOpenBalance=false;
	$scope.ModalColorOpen=false;
	$scope.ModalColorMasivo=false;
	$scope.btnCerrarBalanceColores=function()
	{
		$scope.modalColorOpenBalance=false;
	}
	$scope.$on('$routeChangeStart', function(event,next, current) { 
		if ($scope.openModalProductoC==true) 
		{
			$scope.openModalProductoC=false;
			event.preventDefault();
			$('#btnCerrarModalProducto').click();
			return;
		}
		if ($scope.modalColorOpenBalance==true) 
		{
			$scope.modalColorOpenBalance=false;
			event.preventDefault();
			$('#modalBalanceColores').click();
			return;
		}
		if ($scope.onpenModalColoresunidad==true) 
		{
			$scope.agregarColoresTallaUnidad();
			$scope.onpenModalColoresunidad=false;
			event.preventDefault();
			$('#btnCerrarModalCantidadUnidad').click();
			return;
		}
		if ($scope.ModalColorMasivo==true) {
			$scope.ModalColorMasivo=false;
			$scope.AgregarColoresMasivo();
			$('#ModalMasivo').click();
			$scope.AgregarColoresMasivoM();
			event.preventDefault();
			$('#ModalMasivoMedia').click();
			return;
		}
		if ($scope.ModalColorOpen==true) 
		{
			$scope.agregarColoresTalla();
			$scope.ModalColorOpen=false;
			event.preventDefault();
			$('#CerrarModalColores').click();
			return;
		}
		if ($scope.openmodalBalance==true) {
			$scope.openmodalBalance=false;
			event.preventDefault();
			$('#modalBalanceColores').click();

			return;
		}
		if ($scope.confimar.salir==false) {
			$scope.confimar.next=next;
			  $scope.confimar.current=current
			  $scope.confimar.salir=true;
			  event.preventDefault();
			  $('#confirmacion').click();
		} 

	});
	$scope.onConfirmarSalida=function(accion){
		if (accion=='salir') {
			var a='';
			if ($scope.confimar.next.params.modulo==undefined) {
				a='/';
			}
			else{
				a='/'+$scope.confimar.next.params.modulo+'/'+$scope.confimar.next.params.url;
			}

			$timeout(function () {
				$location.path(a)
			}, 100);
			
		}else if (accion=='permanecer') {
			$scope.confimar.salir=false;
			
		}
		else if (accion=='guardar') {
			$scope.confimar.salir=false;
			$scope.validacionInsert()
		}
	}
	$scope.ItemModal=[];
	$scope.openmodalBalance=false;
	/*$scope.ModalItem=function(item){
		$scope.openmodalBalance=true;
		$('#ColoresAgregados').click();
		$scope.ItemModal=[];
		$scope.ItemModal=item;
	}*/
	$scope.GuardarEncabezado=function()
	{
		var codigoclave=0;
		if ($scope.sessiondate.key==undefined) {
			codigoclave=Math.floor(Math.random()*(999999-10000+1)+10000);
		}
		else
		{
			codigoclave=$scope.sessiondate.key;
		}
		var d = new Date($scope.FechaEntrega),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
    	var diaSeleccionado= [year, month, day].join('-');
    	d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
        var hoy= [year, month, day].join('-');
		var v=$scope.ValidacionEncabezadoGuardar();
		if (v!='') 
		{
			Mensajes(v,'error','')
			return
		}
		ProcesadoShow();
		$scope.Pedido=[];
		$scope.Pedido.modulo_creacion='MOBILE';
		$scope.Pedido.fecha_entrega=diaSeleccionado;
		$scope.Pedido.valor_total=0;
		$scope.Pedido.valor_base=0;
		$scope.Pedido.usuariocreacion=$scope.sessiondate.nombre_usuario;
		$scope.Pedido.rowid_empresa=4;
		$scope.Pedido.id_cia=1;
		$scope.Pedido.fecha_solicitud=hoy;
		$scope.Pedido.fecha_pedido=hoy;
		$scope.Pedido.fechacreacion=hoy;
		$scope.Pedido.valor_impuesto=0;
		$scope.Pedido.valor_descuento=0;
		$scope.Pedido.id_estado=101;
		$scope.Pedido.ind_estado_erp=0;
		$scope.Pedido.valor_facturado=0;
		$scope.Pedido.id_punto_envio=$scope.PuntoEnvio.rowid
		$scope.Pedido.sincronizado='false';
		$scope.Pedido.estado_sincronizacion=0;
		$scope.Pedido.key_user=codigoclave;
		$scope.Pedido.latitud=$scope.Latitude;
		$scope.Pedido.longitud=$scope.Longitud;
		$scope.Pedido.rowid_lista_precios=$scope.ListaPrecios.rowid;
		if ($scope.Pedido.observaciones==undefined) {
			$scope.Pedido.observaciones='';
		}
		$scope.Pedido.ambiente=$scope.sessiondate.codigo_empresa;
		$scope.Pedido.rowid_cliente_facturacion=$scope.Sucursal.rowid;
		$scope.Pedido.rowid_cliente_despacho=$scope.Sucursal.rowid;
		if ($scope.OrdenCompra==undefined) {
			$scope.OrdenCompra='';
		}
		$scope.Pedido.orden_compra=$scope.OrdenCompra;
		CRUD.insert('t_pedidos',$scope.Pedido)
		setTimeout(function() {
			CRUD.select('select*from t_pedidos order by rowid desc LIMIT 1',function(pedido){
				$scope.Pedido=pedido;
				$scope.confimar.salir=true;
				MODAL_SINCRONIZACION=1;
				ProcesadoHiden();
				$location.path('/ventas/pedido_nuevo/Pedido='+pedido.rowid)
			})
		}, 1000);
	}
	$scope.ValidacionEncabezadoGuardar=function(a)
	{
		var a='';
		if ($scope.Tercero.rowid==undefined) {
			return 'Seleccionar Tercero'
		}
		if ($scope.Sucursal.rowid==undefined) {
			return 'Seleccionar Sucursal';
		}
		if ($scope.PuntoEnvio.rowid==undefined) {
			return 'Seleccionar Punto';
		}
		if ($scope.FechaEntrega==undefined || $scope.FechaEntrega=='') {
			return 'Seleccionar Fecha';
		}
		return a;
	}
	$scope.Latitude='';
	$scope.Longitud='';
	$scope.rowid_Pedido=$routeParams.personId;
	//CARGAR PEDIDO SI EL PARAMETRO DE LA URL TRAE UN ID
	if ($scope.rowid_Pedido!=undefined) {
		ProcesadoShow();
		$scope.rowid_Pedido=$scope.rowid_Pedido.split('=')[1];
		$scope.acciones.tituloPagina='Pedido # '+$scope.rowid_Pedido;
		CRUD.select('select*from t_pedidos where rowid='+$scope.rowid_Pedido+' ',function(pedido){
			$scope.Pedido=pedido;
			$scope.OrdenCompra=$scope.Pedido.orden_compra;
			var d = new Date($scope.Pedido.fecha_entrega.replace('-','/'));
			document.getElementById("FechaEntrega").valueAsDate = d;
			$scope.FechaEntrega=d;
			CRUD.select("select  codigo_sucursal||'-'||nombre_sucursal as sucursal,*from erp_terceros_sucursales where rowid = '"+$scope.Pedido.rowid_cliente_facturacion+"'   order by codigo_sucursal",
			function(elem){
				$scope.ListaSucursales.push(elem);
				$scope.Sucursal=elem;
				//CARGAR LISTA DE LOS ITEMS PARA SELECCIONAR
				$scope.CargarItems();
				for (var i = 0; i < $scope.ListaTerceros.length; i++) {
					if ($scope.ListaTerceros[i].rowid==$scope.Sucursal.rowid_tercero) 
					{
						$scope.Tercero=$scope.ListaTerceros[i];
					}
				}
				CRUD.select("select direccion ||'-'|| nombre_punto_envio as concatenado, *from erp_terceros_punto_envio where rowid='"+$scope.Pedido.id_punto_envio+"'   order by direccion ",
				function(elem){
					$scope.ListaPuntoEnvios.push(elem);
					$scope.PuntoEnvio=elem;
					ProcesadoHiden();
				});
				$scope.ItemsPedidoAgregados();
				
			})
			$('.creado').attr('disabled','disabled');
			
		});
	}
	else
	{
		var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 18000000};
		var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        function onSuccess(position)
        {
            //$scope.sessiondate
            $scope.Latitude=position.coords.latitude;
            $scope.Longitud= position.coords.longitude;
        }
        function onError(error)
        {
            //alert("Por favor habilitar la Ubicacion, Verificar Conexion a Internet!");
        }
	}
	$scope.CantidadTotalPedido=0;
	$scope.ItemsPedidoAgregados=function()
	{
		$scope.itemsAgregadosPedido=[];
		$scope.CantidadTotalPedido=0;
		$scope.contadores=[];
		$scope.tallasAgregar=[];
		$scope.contadores.cont1=0;
		$scope.contadores.cont2=0;
		$scope.contadores.cont3=0;
		$scope.contadores.cont4=0;
		$scope.contadores.cont5=0;
		var consulta="select distinct dt.rowid_item,dt.linea_descripcion,dt.rowid_pedido,item.item_referencia,dt.empaque,dt.precio_unitario as precio,item.impuesto_porcentaje as iva  from t_pedidos_detalle dt inner join erp_items item on item.rowid=dt.rowid_item where dt.rowid_pedido ='"+$scope.rowid_Pedido+"'";
		CRUD.select(consulta,function(elem){
			elem.tallas=[];
			elem.cantidadtotal=0;
			$scope.itemsAgregadosPedido.unshift(elem);
			$scope.contadores.cont1++;
			var query2="select   item_ext1 as c   from t_pedidos_detalle where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' group by item_ext1 ";
			CRUD.selectAllinOne(query2,function(contadorItems){
				var query3="select "+contadorItems.length+" as contador ,rowid_item_ext, item_ext1 as talla,sum(cantidad) as cantidad,rowid_item from t_pedidos_detalle where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' group by rowid_item_ext, item_ext1,rowid_item order by rowid_item_ext asc"
				CRUD.select(query3,function(tallas){
					$scope.contadores.cont4++;
					$scope.indicePush=true;
					$scope.indicemenor=true;
					for (var i =0;i<$scope.itemsAgregadosPedido.length;i++) {
						var a=$scope.itemsAgregadosPedido[i].rowid_item;
						if (a==tallas.rowid_item) {
							$scope.generico=[];
							$scope.generico.contador=0;
							$scope.generico.talla=0;
							$scope.generico.cantidad=0;
							$scope.generico.rowid_item=0;
							for (var f=1;f<9;f++) {
								$scope.generico.rowid_item_ext=f;
								if (f<tallas.rowid_item_ext && $scope.itemsAgregadosPedido[i].tallas.length+1!=tallas.rowid_item_ext && $scope.indicemenor) {
									$scope.itemsAgregadosPedido[i].tallas.push($scope.generico)
								}
								else if ( ($scope.indicePush && f==tallas.rowid_item_ext) || ($scope.itemsAgregadosPedido[i].tallas.length+1==tallas.rowid_item_ext  && $scope.indicePush))
								{
									$scope.itemsAgregadosPedido[i].tallas.push(tallas)
									$scope.itemsAgregadosPedido[i].cantidadtotal+=tallas.cantidad;
									$scope.contadores.cont5+=tallas.cantidad;
									$scope.indicemenor=false;
									$scope.indicePush=false;
								}
								else if ($scope.contadores.cont4>=tallas.contador) {
									
									if ($scope.itemsAgregadosPedido[i].tallas.length<8) {
										$scope.itemsAgregadosPedido[i].tallas.push($scope.generico)
									}
									if ($scope.itemsAgregadosPedido[i].tallas.length+1==9) {
										$scope.contadores.cont4=0;
									}
								}
							}
						}
					}
					$scope.CalcularCantidadValorTotal();
				})
			})
			
		})
	}
	/*$scope.ItemsPedidoAgregados=function()
	{
		$scope.CantidadTotalPedido=0;
		$scope.itemsAgregadosPedido=[];
		$scope.Detalles=[];
		$scope.Colores=[];
		$scope.ItemsPedido=[];
		$scope.Consulta='';
		if ($scope.Sucursal.centro_operacion=='001') {
			$scope.Consulta=' select distinct item.*,dt.empaque as empaque,dt.observaciones as observacion from vw_items_precios item inner join t_pedidos_detalle dt on dt.rowid_item=item.rowid_item where dt.rowid_pedido='+$scope.Pedido.rowid+' and erp_id_maestro="'+$scope.Sucursal.id_lista_precios+'" and (tipo_inventario = "IN300501")  ';
		}
		else if ($scope.Sucursal.centro_operacion=='003') 
		{
			$scope.Consulta=' select distinct item.*,dt.empaque as empaque,dt.observaciones as observacion from vw_items_precios item inner join t_pedidos_detalle dt on dt.rowid_item=item.rowid_item where dt.rowid_pedido='+$scope.Pedido.rowid+' and erp_id_maestro="'+$scope.Sucursal.id_lista_precios+'" and (tipo_inventario = "IN300502"  or  tipo_inventario = "IN300503")  ';
		}
		CRUD.selectAllinOne($scope.Consulta,
		function(items){
			$scope.ItemsPedido=items;
			//EMPAQUE DE CADA ITEM
			for (var i = 0; i < $scope.ItemsPedido.length; i++) {
				for (var x = 0; x < $scope.Empaques.length; x++) {
					if ($scope.ItemsPedido[i].empaque==$scope.Empaques[x].tipo_reg_nombre) {
						$scope.ItemsPedido[i].empaque=$scope.Empaques[x];
						$scope.ItemsPedido[i].EmpaqueS=$scope.ItemsPedido[i].empaque.tipo_reg_nombre.slice(0,3);
					}
				}
			}
			///
			CRUD.selectAllinOne('select*from   t_pedidos_detalle where rowid_pedido="'+$scope.Pedido.rowid+'"',function(Detalles){
				$scope.Consulta=true;
				if (Detalles.length==0) {
					$scope.CantidadTotalPedido=0;
					$scope.Consulta=false;
				}
				if ($scope.Consulta==false) 
				{
					ProcesadoHiden();
					return;
				}
				$scope.Detalles=Detalles;
				var IDTallas='(';	
				for (var i = 0; i < $scope.Detalles.length; i++) {
					IDTallas+=$scope.Detalles[i].rowid+',';
				}
				IDTallas=IDTallas.substring(0,IDTallas.length-1);
				IDTallas+=')';
				CRUD.selectAllinOne('select color.*,talla.rowid_item, talla.item_ext1 from t_pedidos_detalle_detalle color  inner join t_pedidos_detalle talla on color.pedidodetalle=talla.rowid  where pedidodetalle in  '+IDTallas+' ',function(Colores){

					$scope.Colores=Colores;
					for (var i = 0; i < $scope.ItemsPedido.length; i++) {
						$scope.ItemsPedido[i].iva=$scope.ItemsPedido[i].precio*$scope.ItemsPedido[i].impuesto_porcentaje/100;
						CRUD.selectAllinOne("select distinct  "+i+"  posicionArray ,e.itemID,item.item_referencia,e.extencionDetalle1ID as talla,0 as cantidad,0  as multiplo,ext1_d.erp_descripcion_corta,sum(e.stock) as stock from erp_items_extenciones  e inner join erp_items item on item.rowid=e.itemID inner join  erp_item_extencion1_detalle ext1_d on ext1_d.rowid_erp=e.extencionDetalle1ID where e.itemID='"+$scope.ItemsPedido[i].rowid_item+"'  group by e.itemID,item.item_referencia,e.extencionDetalle1ID,ext1_d.erp_descripcion_corta order by ext1_d.erp_descripcion_corta ",function(TallasColores){
							if (TallasColores.length>0) {
								var Indicador=TallasColores[0].posicionArray;
								$scope.ItemsPedido[Indicador].Tallas=[];
								$scope.ItemsPedido[Indicador].Tallas=TallasColores;
								for (var v = 0; v < $scope.ItemsPedido[Indicador].Tallas.length; v++) {
									$scope.ItemsPedido[Indicador].Tallas[v].Colores=[];
									$scope.ItemsPedido[Indicador].Tallas[v].cantidad=0
									$scope.ItemsPedido[Indicador].Tallas[v].cantidad1=0
									for (var x = 0; x < $scope.Detalles.length; x++) {
										
										if ($scope.ItemsPedido[Indicador].Tallas[v].talla==$scope.Detalles[x].item_ext1 && $scope.ItemsPedido[Indicador].rowid_item==$scope.Detalles[x].rowid_item) 
										{
											$scope.ItemsPedido[Indicador].Tallas[v].cantidad1=$scope.Detalles[x].cantidad
											$scope.ItemsPedido[Indicador].Tallas[v].cantidad=$scope.Detalles[x].cantidad/12;
											$scope.ItemsPedido[Indicador].Tallas[v].TipoMedida=$scope.Detalles[x].TipoMedida;
										}
									}
								}
								$scope.OrganizarTallasTabla();
								for (var v = 0; v < $scope.ItemsPedido[Indicador].Tallas.length; v++) {

									if ($scope.ItemsPedido[Indicador].Tallas[v].cantidad1>0) 
									{
										$scope.CantidadTotalPedido+=$scope.ItemsPedido[Indicador].Tallas[v].cantidad1;
										CRUD.selectAllinOne("select '"+v+"' as v,'"+Indicador+"' indicador,a.*,0 as cantidad,'"+$scope.ItemsPedido[Indicador].Tallas[v].cantidad1+"' as cantidadextension1,d.rgba,d.url_imagen from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID and a.extencion2ID=d.extencion2ID where itemID='"+$scope.ItemsPedido[Indicador].rowid_item+"'  and  extencionDetalle1ID='"+$scope.ItemsPedido[Indicador].Tallas[v].talla+"'  order by a.extencionDetalle2ID ",function(coloresC){
											if (coloresC.length>0) 
											{
												var C1=coloresC[0].v;
												var C2=coloresC[0].indicador;
												$scope.ItemsPedido[C2].Tallas[C1].Colores=coloresC;
												for (var x = 0; x < $scope.ItemsPedido[C2].Tallas[C1].Colores.length; x++) {
													for (var f = 0; f < $scope.Colores.length; f++) {
														if ($scope.ItemsPedido[C2].Tallas[C1].Colores[x].extencionDetalle2ID==$scope.Colores[f].itemExtension2Detalle  && $scope.ItemsPedido[C2].Tallas[C1].talla== $scope.Colores[f].item_ext1 && $scope.Colores[f].rowid_item==$scope.ItemsPedido[C2].rowid_item) 
														{
															$scope.ItemsPedido[C2].Tallas[C1].Colores[x].cantidad=$scope.Colores[f].cantidad;
														}
													}
												}
												$scope.itemsAgregadosPedido=$scope.ItemsPedido;	
												$scope.CalcularCantidadValorTotal();
											}
										})
									}
								}
							}
						})
					}
				})
			})
		})
	}


	$scope.OrganizarTallasTabla=function()
	{
		for (var t = 0; t < $scope.ItemsPedido.length; t++) {
			$scope.ItemsPedido[t].cantidadTotal=0
			$scope.tallasAgregar=[];
			for (var i=1;i<9;i++) {
				$scope.banderaSimilar=true;
				if ($scope.ItemsPedido[t].Tallas==undefined) {
					continue;
				}
				for (var f=0;f<$scope.ItemsPedido[t].Tallas.length;f++) {
					$scope.i=parseInt($scope.ItemsPedido[t].Tallas[f].erp_descripcion_corta);
					if ($scope.i==i) {
						$scope.var1=0;
						if ($scope.ItemsPedido[t].item_custom1!="SI") {
							$scope.var1=$scope.ItemsPedido[t].Tallas[f].cantidad*12;
						}else{
							$scope.var1=$scope.ItemsPedido[t].Tallas[f].cantidad;	
						}
						$scope.ItemsPedido[t].Tallas[f].cantidad1=parseInt($scope.var1);
						$scope.ItemsPedido[t].cantidadTotal+=$scope.ItemsPedido[t].Tallas[f].cantidad1;
						$scope.validacionCantidades++;
						$scope.tallasAgregar.push($scope.ItemsPedido[t].Tallas[f]);
						$scope.banderaSimilar=false;
					}
				}
				if ($scope.banderaSimilar) {
					$scope.tallas1=[];
					$scope.tallas1.itemID="0";
					$scope.tallas1.item_referencia1="0";
					$scope.tallas1.talla="0";
					$scope.tallas1.cantidad="0";
					$scope.tallas1.cantidad1=0;
					$scope.tallas1.multiplo="0";
					$scope.tallas1.erp_descripcion_corta="0";
					$scope.tallasAgregar.push($scope.tallas1);
				}
			}
			$scope.ItemsPedido[t].Tallas=$scope.tallasAgregar;
		}
	}*/
	$scope.onConfirmarSalida=function(accion){
		if (accion=='salir') {
			var a='';
			if ($scope.confimar.next.params.modulo==undefined) {
				a='/';
			}
			else{
				a='/'+$scope.confimar.next.params.modulo+'/'+$scope.confimar.next.params.url;
			}

			$timeout(function () {
				$location.path(a)
			}, 100);
			
		}else if (accion=='permanecer') {
			$scope.confimar.salir=false;
			
		}
		else if (accion=='guardar') {
			$scope.confimar.salir=false;
			if ($scope.Pedido.rowid>0) 
			{
				$scope.FinalizarPedido();
			}
			else
			{
				$scope.GuardarEncabezado();
			}
		}
	}
	$scope.FinalizarPedido=function()
	{
		if ($scope.Tercero.rowid==undefined) {
			Mensajes('Seleccionar Tercero','error','');
			return
		}
		if ($scope.Sucursal.rowid==undefined) {
			Mensajes('Seleccionar Sucursal','error','');
			return
		}
		if ($scope.PuntoEnvio.rowid==undefined) {
			Mensajes('Seleccionar Punto Envio','error','');
			return
		}
		if ($scope.FechaEntrega==undefined || $scope.FechaEntrega=='') {
			Mensajes('Seleccionar Fecha Entrega','error','');
			return
		}
		if ($scope.Pedido.observaciones==undefined) 
		{
			$scope.Pedido.observaciones='';
		}
		if ($scope.Pedido.orden_compra==undefined) 
		{
			$scope.Pedido.orden_compra='';
		}
		var d = new Date($scope.FechaEntrega),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;
    	var diaSeleccionado= [year, month, day].join('-');
    	if ($scope.OrdenCompra==undefined) {
			$scope.OrdenCompra='';
		}
    	$scope.Pedido.orden_compra=$scope.OrdenCompra;
    	$scope.CalcularCantidadValorTotal();
		var query="update t_pedidos set observaciones='"+$scope.Pedido.observaciones+"',orden_compra='"+$scope.Pedido.orden_compra+"',fecha_entrega='"+diaSeleccionado+"',valor_total='"+$scope.ValoresTotales.total+"',valor_base='"+$scope.ValoresTotales.neto+"',valor_impuesto='"+$scope.ValoresTotales.iva+"'  where rowid='"+$scope.Pedido.rowid+"'";
		CRUD.Updatedynamic(query);
		$scope.confimar.salir=true;
		window.location.href = '#/ventas/pedidos_ingresados';
	}
	setTimeout(function() {
		if (MODAL_SINCRONIZACION==0) {
			var FechaActual=new Date();
			if (FechaActual.getDay()!=$scope.fechaSincronizacionDate.getDay()) 
			{
				$('#AlertaSin').click();	
			}
		}
		else
		{
			MODAL_SINCRONIZACION=0;
		}
	}, 1000);
	$scope.CambiarSeleccion=function(estado)
    {
    	if (estado==1) 
    	{
    		$scope.SeleccionDocena=true;
    	}
    	else
		{
			$scope.SeleccionDocena=false;	
		}
		$scope.$apply();
		//$scope.$digest()
    }
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");		
	$scope.fechaSincronizacion=window.localStorage.getItem("FECHA_SINCRONIZACION");
	$scope.fechaSincronizacionDate=new Date(window.localStorage.getItem("FECHA_SINCRONIZACION_DATE"));
	$scope.sincronizar=function(){
		
		$scope.errorAlerta=[];
        $scope.errorAlerta.bandera=0;
        ProcesadoShow();   
        //$scope.EnvioActividades();
        //CRUD.Updatedynamic("update t_pedidos set sincronizado='EnvioCorrecto' where sincronizado='true'");
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
            CRUD.Updatedynamic("delete from crm_actividades");
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
            
            //
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
            //Guardar Nuevos Datos
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
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].sincronizado+"' "; 
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
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].proceso+"' "; 
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
                $scope.confimar.salir=true;
                Mensajes('Sincronizado Con Exito','success','')
                $route.reload();
                //$location.path('/ventas/pedidos_ingresados')
                
            },7000)
        },6000)
    }
}]);

