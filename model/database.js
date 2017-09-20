app_angular = angular.module('PedidosOnline')

app_angular.service('Factory', function ($webSql) {

    db = $webSql.openDatabase(DATABASE, '1.0', 'Test DB', 200000);

    db.createTable('s_usuarios',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "text",
            "null": "NULL"
        },
        "identificacion": {
            "type": "text",
            "null": "NULL"
        },
        "erp_codigo": {
            "type": "text",
            "null": "NULL"
        },
        "nombre_usuario": {
            "type": "text",
            "null": "NULL"
        },
        "nombre_completo": {
            "type": "text",
            "null": "NULL"
        },
        "mail": {
            "type": "text",
            "null": "NULL"
        },
        "clave": {
            "type": "text",
            "null": "NULL"
        },
        "ind_cambiarclave": {
            "type": "text",
            "null": "NULL"
        },
        "acepto_condiciones": {
            "type": "text",
            "null": "NULL"
        },
        "ind_activo": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "idioma": {
            "type": "text",
            "null": "NULL"
        },
        "tipo_usuario": {
            "type": "text",
            "null": "NULL"
        },
        "coordinador_canal_deault": {
            "type": "text",
            "null": "NULL"
        },
        "superior_rowid": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_canal_superior": {
            "type": "text",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamod": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "text",
            "null": "NULL"
        },
        "id_canal_vendedor": {
            "type": "text",
            "null": "NULL"
        }
    })

    db.createTable('s_planos_pedidos',{
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 
        },
        "indicador": {
            "type": "TEXT",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "codigo_usuario": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_rowid_cliente_facturacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_rowid_cliente_despacho": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_rowid_cliente_precios": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_id_punto_envio": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_pedido_fecha_pedido": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_fecha_entrega": {
            "type": "TEXT",
            "null": "NULL"
        },
        "e_valor_base": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_valor_descuento": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_valor_impuesto": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_valor_total": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_id_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_ind_estado_erp": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "e_valor_facturado": {
            "type": "TEXT",
            "null": "NULL"
        },
        "e_fecha_solicitud": {
            "type": "TEXT",
            "null": "NULL"
        },
        "e_orden_compra": {
            "type": "TEXT",
            "null": "NULL"
        },
        "e_modulo_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "e_observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_rowid_pedido": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_rowid_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_linea_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_cantidad": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_factor": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_cantidad_base": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_stock": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_porcen_descuento": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_valor_base": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_valor_impuesto": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_valor_total_linea": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_item_ext1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_empaque": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "d_rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "s_rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "s_rowid_detalle": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "s_cantidad": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "s_itemExtencion2Detalle": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "ultimo_registro": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "estadoItem": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "estadoSubItem": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_precios_unitario": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "d_valor_descuento": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "lineas_plano": {
            "type": "INTEGER",
            "null": "NULL"
        }
        ,
        "rowid_sku": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "TipoMedida": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "longitud": {
            "type": "text",
            "null": "NULL"
        },
        "latitud": {
            "type": "text",
            "null": "NULL"
        }


    })
    db.createTable('t_pedidos_detalle_detalle_web',{
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 
        },
        "pedidoDetalle": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "itemExtension2Detalle": {
            "type": "text",
            "null": "NULL"
        },
        "cantidad": {
            "type": "INTEGER",
            "null": "NULL"
        }

    })
    db.createTable('t_pedidos_detalle_detalle',{
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 
        },
        "pedidoDetalle": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "itemExtension2Detalle": {
            "type": "text",
            "null": "NULL"
        },
        "cantidad": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "estado": {
            "type": "integer",
            "null": "NULL"
        },
        "indicador": {
            "type": "integer",
            "null": "NULL"
        }
        ,
        "rowid_sku": {
            "type": "integer",
            "null": "NULL"
        }

    })
    db.createTable('s_canales_usuario',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_usuario": {
            "type": "text",
            "null": "NULL"
        },
        "id_canal": {
            "type": "text",
            "null": "NULL"
        },
        "nombre_canal": {
            "type": "text",
            "null": "NULL"
        },
        "usuario_creacion": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_creacion": {
            "type": "text",
            "null": "NULL"
        }

    })
    db.createTable('crm_contactos',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_sucursal": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "identificacion": {
            "type": "text",
            "null": "NULL"
        },
        "nombres": {
            "type": "text",
            "null": "NULL"
        },
        "apellidos": {
            "type": "text",
            "null": "NULL"
        },
        "email": {
            "type": "text",
            "null": "NULL"
        },
        "telefono": {
            "type": "text",
            "null": "NULL"
        },
        "skype": {
            "type": "text",
            "null": "NULL"
        },
        "descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "ruta_imagen": {
            "type": "text",
            "null": "NULL"
        },
        "celular": {
            "type": "text",
            "null": "NULL"
        },
        "cargo": {
            "type": "text",
            "null": "NULL"
        },
        "area": {
            "type": "text",
            "null": "NULL"
        },
        "ind_principal": {
            "type": "integer",
            "null": "NULL"
        },
        "usuario_creacion": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_creacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuario_modificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_modificacion": {
            "type": "text",
            "null": "NULL"
        }
    });

    db.createTable('m_metaclass',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "class_code": {
            "type": "text",
            "null": "NULL"
        },
        "tipo_reg_codigo": {
            "type": "text",
            "null": "NULL"
        },
        "tipo_reg_nombre": {
            "type": "text",
            "null": "NULL"
        },
        "ind_activo": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "CreatedBy": {
            "type": "text",
            "null": "NULL"
        },
        "CreationDate": {
            "type": "text",
            "null": "NULL"
        },
        "ModifiedBy": {
            "type": "text",
            "null": "NULL"
        },
        "ModDate": {
            "type": "text",
            "null": "NULL"
        }
    })
    db.createTable('m_estados',{
        "id_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "tipo_estado": {
            "type": "text",
            "null": "NULL"
        },
        "nombre_estado": {
            "type": "text",
            "null": "NULL"
        },
        "ind_editar": {
            "type": "integer",
            "null": "NULL"
        }
    })


    db.createTable('crm_actividades',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "tipo": {
            "type": "text",
            "null": "NULL"
        },
        "tema": {
            "type": "text",
            "null": "NULL"
        },
        "ind_prioridad": {
            "type": "text",
            "null": "NULL"
        },
        "descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "tipo_relacion": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "relacionado_a": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_inicial": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_final": {
            "type": "text",
            "null": "NULL"
        },
        "usuario_creacion": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_creacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuario_modificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fecha_modificacion": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_relacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "sincronizado": {
            "type": "text",
            "null": "NULL"
        },
        "longitud": {
            "type": "text",
            "null": "NULL"
        },
        "latitud": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_web": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "codigo_reg": {
            "type": "INTEGER",
            "null": "NULL"
        }


    })
    db.createTable('erp_items', {
        //1
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item_erp": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "item_referencia": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_codigo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_linea": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_ext1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_ext2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad_venta": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "descripcion_extensa": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "item_custom1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "impuesto_id": {
            "type": "TEXT",
            "null": "NULL"
        },
        "impuesto_porcentaje": {
            "type": "REAL",
            "null": "NULL"
        },
        "descripcion_adicional": {
            "type": "TEXT",
            "null": "NULL"
        },
        "cantidad_embalaje": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "tipo_inventario": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('t_pedidos', {
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 

        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_facturacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_despacho": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_lista_precios": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fecha_pedido": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_entrega": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_solicitud": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_punto_envio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "orden_compra": {
            "type": "TEXT",
            "null": "NULL"
        },
        "referencia": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "numpedido_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numfactura_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_facturado": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_cond_especial": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
            //  "default": "CURRENT_TIMESTAMP" // default value
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "tipo_doc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_vendedor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_cond_pago": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numremision_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_co": {
            "type": "TEXT",
            "null": " NULL"
        },
        "transporte_conductor_cc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_conductor_nombre": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_placa": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_nota": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "criterio_clasificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado_erp": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "modulo_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "sincronizado": {
            "type": "TEXT",
            "null": "NULL"
        },
        "key_mobile": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_sincronizacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "key_user": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "ambiente": {
            "type": "TEXT",
            "null": "NULL"
        },
        "longitud": {
            "type": "TEXT",
            "null": "NULL"
        },
        "latitud": {
            "type": "TEXT",
            "null": "NULL"
        },
    });
    db.createTable('t_pedidos_web', {
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 

        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_facturacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_despacho": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_lista_precios": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fecha_pedido": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_entrega": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_solicitud": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_punto_envio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "orden_compra": {
            "type": "TEXT",
            "null": "NULL"
        },
        "referencia": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "numpedido_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numfactura_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_facturado": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_cond_especial": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
            //  "default": "CURRENT_TIMESTAMP" // default value
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "tipo_doc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_vendedor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_cond_pago": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numremision_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_co": {
            "type": "TEXT",
            "null": " NULL"
        },
        "transporte_conductor_cc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_conductor_nombre": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_placa": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_nota": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "criterio_clasificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado_erp": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "modulo_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "sincronizado": {
            "type": "TEXT",
            "null": "NULL"
        },
        "key_mobile": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_sincronizacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "key_user": {
            "type": "INTEGER",
            "null": "NULL"
        }
    });
    db.createTable('t_pedidos_temporal', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_facturacion": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_cliente_despacho": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_lista_precios": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fecha_pedido": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_entrega": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_solicitud": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_punto_envio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "observaciones2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "orden_compra": {
            "type": "TEXT",
            "null": "NULL"
        },
        "referencia": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "numpedido_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numfactura_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_facturado": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_cond_especial": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
            //  "default": "CURRENT_TIMESTAMP" // default value
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "tipo_doc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_vendedor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_cond_pago": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numremision_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_co": {
            "type": "TEXT",
            "null": " NULL"
        },
        "transporte_conductor_cc": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_conductor_nombre": {
            "type": "TEXT",
            "null": "NULL"
        },
        "transporte_placa": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_nota": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "criterio_clasificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado_erp": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "modulo_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "sincronizado": {
            "type": "TEXT",
            "null": "NULL"
        },
        "key_mobile": {
            "type": "TEXT",
            "null": "NULL"
        }
    });
    db.createTable('t_pedidos_detalle_temporal', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_pedido": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "linea_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "cantidad": {
            "type": "REAL",
            "null": "NULL"
        },
        "factor": {
            "type": "REAL",
            "null": "NULL"
        },
        "cantidad_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "precio_unitario": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_motivo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "stock": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total_linea": {
            "type": "REAL",
            "null": "NULL"
        },
        "unidad_medida": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "vTEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "item_ext1": {
            "type": "TEXT",
            "null": " NULL"
        },
        "item_ext2": {
            "type": "TEXT",
            "null": " NULL"
        },
        "num_lote": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "flete": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "observaciones": {
            "type": "text",
            "null": "NULL"
        },
        "empaque": {
            "type": "text",
            "null": "NULL"
        }
        
    });
    db.createTable('t_pedidos_detalle', {
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 
        },
        "rowid_pedido": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "linea_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "cantidad": {
            "type": "REAL",
            "null": "NULL"
        },
        "factor": {
            "type": "REAL",
            "null": "NULL"
        },
        "cantidad_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "precio_unitario": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_motivo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "stock": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total_linea": {
            "type": "REAL",
            "null": "NULL"
        },
        "unidad_medida": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "vTEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "item_ext1": {
            "type": "TEXT",
            "null": " NULL"
        },
        "item_ext2": {
            "type": "TEXT",
            "null": " NULL"
        },
        "num_lote": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "flete": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "observaciones": {
            "type": "text",
            "null": "NULL"
        },
        "empaque": {
            "type": "text",
            "null": "NULL"
        },
        "estado": {
            "type": "integer",
            "null": "NULL"
        },
        "indicador": {
            "type": "integer",
            "null": "NULL"
        }
        ,
        "TipoMedida": {
            "type": "integer",
            "null": "NULL"
        }
        
    });
    db.createTable('t_pedidos_detalle_web', {
        "rowid": {
            "type": "INTEGER",
            "null": "NOT NULL",
            "primary": true,
            "auto_increment": true 
        },
        "rowid_pedido": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_bodega": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "linea_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "cantidad": {
            "type": "REAL",
            "null": "NULL"
        },
        "factor": {
            "type": "REAL",
            "null": "NULL"
        },
        "cantidad_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "precio_unitario": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_motivo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "stock": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_base": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_impuesto": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_total_linea": {
            "type": "REAL",
            "null": "NULL"
        },
        "unidad_medida": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "vTEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": " NULL"
        },
        "rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "item_ext1": {
            "type": "TEXT",
            "null": " NULL"
        },
        "item_ext2": {
            "type": "TEXT",
            "null": " NULL"
        },
        "num_lote": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_anulacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "flete": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento2": {
            "type": "REAL",
            "null": "NULL"
        },
        "porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "valor_porcen_descuento3": {
            "type": "REAL",
            "null": "NULL"
        },
        "observaciones": {
            "type": "text",
            "null": "NULL"
        },
        "empaque": {
            "type": "text",
            "null": "NULL"
        },
        "estado": {
            "type": "integer",
            "null": "NULL"
        },
        "indicador": {
            "type": "integer",
            "null": "NULL"
        }
        
    });

    db.createTable('erp_terceros', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_interno": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "identificacion": {
            "type": "TEXT",   
            "null": "NULL"
        },
        "tipo_identificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "razonsocial": {
            "type": "TEXT",
            "null": "NULL"
        },
        "nombre_comercial": {
            "type": "TEXT",
            "null": "NULL"
        },
        "codigo_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_activo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "es_vendedor": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "es_cliente": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "es_proveedor": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "es_accionista": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "industria": {
            "type": "TEXT",
            "null": "NULL"
        },
        "tipo_industria": {
            "type": "TEXT",
            "null": "NULL"
        },
        "clasificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_impuesto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "contacto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "direccion": {
            "type": "TEXT",
            "null": "NULL"
        }
        ,
        "email": {
            "type": "TEXT",
            "null": "NULL"
        },
        "telefono": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('erp_terceros_sucursales',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_tercero": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "tipo_sucursal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "nombre_sucursal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "codigo_sucursal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "direccion1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "direccion2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "direccion3": {
            "type": "TEXT",
            "null": "NULL"
        },
        "telefono1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "telefono2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "codigo_postal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_ciudad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_depto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_pais": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_lista_precios": {
            "type": "TEXT",
            "null": "NULL"
        },
        "nombre_contacto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "email_contacto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "centro_operacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_condicion_pago": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_vendedor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_unidad_negocio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_grupo_descuento": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_zona": {
            "type": "TEXT",
            "null": "NULL"
        },
        "porcen_descuento": {
            "type": "REAL",
            "null": "NULL"
        },
        "ind_bloqueo_cupo": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "ind_bloqueo_mora": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "cupo_credito": {
            "type": "REAL",
            "null": "NULL"
        },
        "id_tipo_cliente": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "usuario": {
            "type": "TEXT",
            "null": "NULL"
        },
        "clave": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_bodega": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_division": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_canal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_principal": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_criterio_clasificacion": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('erp_entidades_master', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_tipo_maestro": {
            "type": "TEXT",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "erp_id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "erp_rowid_maestro": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "erp_id_maestro": {
            "type": "TEXT",
            "null": "NULL"
        },
        "erp_descripcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "custom1": {
            "type": "TEXT",
            "null": "NULL"
        },
        "email": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NOT NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_disabled": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "custom2": {
            "type": "TEXT",
            "null": "NULL"
        },
        "custom3": {
            "type": "TEXT",
            "null": "NULL"
        }
    });
    db.createTable('m_empresas_config', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_tipo_erp": {
            "type": "TEXT",
            "null": "NOT NULL",
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "step": {
            "type": "TEXT",
            "null": "NULL"
        },
        "secuencia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "tiporeg": {
            "type": "TEXT",
            "null": "NULL"
        },
        "parametros": {
            "type": "text",
            "null": "NULL"
        },
        "ind_activo": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('m_modulos_config', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "modulo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "campo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_ocultar": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "valor_defecto": {
            "type": "TEXT",
            "null": "NULL",
        },
        "usuario_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_creacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuario_modificacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_modificacion": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('s_parametros', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "cod_parametro": {
            "type": "TEXT",
            "null": "NULL"
        },
        "nombre_parametro": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_parametro": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('l_log_eventos', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_log": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_tipo_entidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "rowid_entidad": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "nombre_campo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "valor_campo": {
            "type": "TEXT",
            "null": "NULL",
        },
        "observaciones": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('s_opcionmenu', {
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
           
        },
        "rowid_opcionpadre": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "nombre_opcion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_activo": {
            "type": "TEXT",
            "null": "NULL"
        },
        "numorden": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "url_link": {
            "type": "TEXT",
            "null": "NULL"
        },
        "texto_ayuda": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "icono": {
            "type": "TEXT",
            "null": "NULL"
        },
        "bgcolor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fgcolor": {
            "type": "TEXT",
            "null": "NULL"
        }
    });
    
    db.createTable('erp_terceros_punto_envio',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_tercero": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "codigo_sucursal": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_punto_envio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "Nombre_punto_envio": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_vendedor": {
            "type": "TEXT",
            "null": "NULL"
        },
        "ind_estado": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "direccion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "contacto": {
            "type": "TEXT",
            "null": "NULL"
        },
        "email": {
            "type": "TEXT",
            "null": "NULL"
        },
        "telefono": {
            "type": "TEXT",
            "null": "NULL"
        }

    });

    db.createTable('erp_items_precios',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_empresa": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_cia": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_lista_precios": {
            "type": "TEXT",
            "null": "NULL"
        },
        "rowid_item": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "rowid_item_ext": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_unidad": {
            "type": "TEXT",
            "null": "NULL"
        },
        "precio_lista": {
            "type": "REAL",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_activacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fecha_inactivacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "estado_item": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('m_localizacion',{
        "rowid": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_tipo_erp": {
            "type": "TEXT",
            "null": "NULL"
        },
        "tipo_localizacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "id_pais": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_depto": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "id_ciudad": {
            "type": "INTEGER",
            "null": "NULL"
        },
        "nombre": {
            "type": "TEXT",
            "null": "NULL"
        },
        "codigo_alterno": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "TEXT",
            "null": "NULL"
        },
        "fechamod": {
            "type": "TEXT",
            "null": "NULL"
        },
        "usuariomod": {
            "type": "TEXT",
            "null": "NULL"
        }
    });

    db.createTable('erp_item_extension1',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_erp": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion_corta": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamodificacion": {
            "type": "text",
            "null": "NULL"
        }
    })
    db.createTable('erp_item_extension2',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_erp": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion_corta": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamodificacion": {
            "type": "text",
            "null": "NULL"
        }
    })

    db.createTable('erp_item_extencion1_detalle',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "extencion1ID": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_erp": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion_corta": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamodificacion": {
            "type": "text",
            "null": "NULL"
        }
    })

    db.createTable('erp_item_extencion2_detalle',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "extencion2ID": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_erp": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion": {
            "type": "text",
            "null": "NULL"
        },
        "erp_descripcion_corta": {
            "type": "text",
            "null": "NULL"
        },
        "usuariocreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuariomodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechacreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechamodificacion": {
            "type": "text",
            "null": "NULL"
        },
        "rgba": {
            "type": "text",
            "null": "NULL"
        }
        ,
        "url_imagen": {
            "type": "text",
            "null": "NULL"
        }
    })
    db.createTable('erp_items_extenciones',{
        "rowid": {
            "type": "text",
            "null": "NULL"
        },
        "id_cia": {
            "type": "text",
            "null": "NULL"
        },
        "itemID": {
            "type": "text",
            "null": "NULL"
        },
        "extencionDetalle1ID": {
            "type": "text",
            "null": "NULL"
        },
        "extencionDetalle2ID": {
            "type": "text",
            "null": "NULL"
        },
        "indEstado": {
            "type": "text",
            "null": "NULL"
        },
        "fechaInactivacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechaCreacion": {
            "type": "text",
            "null": "NULL"
        },
        "fotoID": {
            "type": "text",
            "null": "NULL"
        },
        "notas": {
            "type": "text",
            "null": "NULL"
        },
        "usuarioCreacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuarioInactivacion": {
            "type": "text",
            "null": "NULL"
        },
        "usuarioModificacion": {
            "type": "text",
            "null": "NULL"
        },
        "fechaDoficacion": {
            "type": "text",
            "null": "NULL"
        },
        "extencion1ID": {
            "type": "text",
            "null": "NULL"
        },
        "extencion2ID": {
            "type": "text",
            "null": "NULL"
        },
        "rowIDmovtoEntidad": {
            "type": "text",
            "null": "NULL"
        },
        "porcMaxExcesoKit": {
            "type": "text",
            "null": "NULL"
        },
        "porcMinExcesoKit": {
            "type": "text",
            "null": "NULL"
        },
        "UnidadValidacionID": {
            "type": "text",
            "null": "NULL"
        },
        "BarrasPrincipalID": {
            "type": "text",
            "null": "NULL"
        },
        "planKitID": {
            "type": "text",
            "null": "NULL"
        },
        "itemExtGenID": {
            "type": "text",
            "null": "NULL"
        },
        "rowid_erp": {
            "type": "text",
            "null": "NULL"
        },
        "stock": {
            "type": "text",
            "null": "NULL"
        },
        "estadoID": {
            "type": "integer",
            "null": "NULL"
        },
        "proceso": {
            "type": "text",
            "null": "NULL"
        },
        "imagen1": {
            "type": "text",
            "null": "NULL"
        },
        "imagen2": {
            "type": "text",
            "null": "NULL"
        },
        "imagen3": {
            "type": "text",
            "null": "NULL"
        },
        "imagen4": {
            "type": "text",
            "null": "NULL"
        }

    })
    db.select("create view if not exists  vw_items_precios "+
        " as  "+ 
        "select    "+
        "  a.item_referencia||'-'||a.item_descripcion  as producto, a.impuesto_porcentaje  , "+
        "a.id_unidad,a.rowid as rowid_item,a.item_descripcion as descripcion,erp_entidades_master.erp_id_maestro,a.item_codigo as item_codigo1,a.item_referencia as item_referencia1 ,b.rowid as rowid_listaprecios,b.precio_lista as precio,erp_entidades_master.rowid, "+
        "  a.tipo_inventario,a.item_custom1  "+
        " FROM erp_items a "  +
            " INNER JOIN erp_items_precios b "+
                " ON b.rowid_item = a.rowid "+
            " INNER JOIN erp_entidades_master "+
                " ON erp_entidades_master.erp_id_maestro=b.id_lista_precios "+
                    " AND erp_entidades_master.id_tipo_maestro='LISTA_PRECIOS' "+
        " WHERE item_referencia NOT LIKE '%*DESC*%' and b.estado_item=1 "+
        "AND strftime('%Y%m%d')>=strftime('%Y%m%d',b.fecha_activacion) and  (strftime('%Y%m%d')<=strftime('%Y%m%d',b.fecha_inactivacion ) or  b.fecha_inactivacion='null'  )   "+
    "");
    db.select("create view if not exists vw_actividades_usuario "+
        " as "  +
        " select  "+
        " usu.id_canal_vendedor as canal,act.tipo,act.tema,  " +
        " act.ind_prioridad,act.descripcion, " +
        " act.relacionado_a, " +
        " act.fecha_inicial,act.fecha_final,act.rowid," +
        " usu.nombre_completo  as usuario , "+
        " case when usu.id_canal_vendedor=null  then  'false'  else  'true' end as cond,act.rowid_estado as rowid_estado  " +
        " from " +
        " crm_actividades  act  inner join   s_usuarios usu  on " +
        " usu.nombre_usuario=act.usuario_creacion " +
        " ")
    db.select("create view if not exists vw_actividades_dia  " + 
        " as "  +
        " select  usu.id_canal_vendedor as canal,usu.nombre_completo as usuario, act.tema,act.descripcion,act.fecha_inicial,"+
        " case when usu.id_canal_vendedor=null  then  'false'  else  'true' end as cond  , act.relacionado_a,act.ind_prioridad, " +
        " act.fecha_final ,replace(act.fecha_inicial,'-','') as fecha_inicialF,replace(act.fecha_final,'-','') as fecha_finalF from crm_actividades  act "  +
        "   inner join   s_usuarios usu  on " +
        " usu.nombre_usuario=act.usuario_creacion " +
        "" )
    
    
    
});
