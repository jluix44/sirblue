<template>
    <div>
        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1" >Cosechas</h3>
        </v-layout>
        
         <v-card>
            <v-card-title>
                Lista de recolecciones
                <v-spacer></v-spacer>
               <v-text-field
                    v-model="buscarR"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
    
            </v-card-title>

            <v-data-table
            :headers="headers"
            :items="listaRecolecciones"
            :search="search" 
            >
                <template v-slot:items="props">
                    <td>{{ props.item.IdRecoleccion }}</td>
                    <td class="text-xs-right"> {{ props.item.empleado }} </td>
                    <td class="text-xs-right"> {{ props.item.producto }} </td>
                    <td class="text-xs-right"> {{ props.item.cantidad }} </td>
                    <td class="text-xs-right"> {{ props.item.fecha }} </td>
                    <td class="text-xs-right"> {{ props.item.precio }} </td>
                    <td class="text-xs-right"> {{ props.item.total }} </td>
                    <td class="text-xs-right"> {{ props.item.estado }} </td>
                    <td class="justify-center layout px-0">
                        <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item)"
                        >
                        edit
                        </v-icon>
                        <v-icon
                        small
                        @click="deleteItem(props.item)"
                        >
                        delete
                    </v-icon>  
                    </td>
                </template>
                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                    No se encontro ningun resultado con "{{ buscarR }}" .
                </v-alert>
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormRecoleccion = !cardFormRecoleccion">Nueva recoleccion</v-btn>
            </v-card-actions>
        </v-card>

    <v-card class="card-form-recolecciones" v-if="cardFormRecoleccion">
        <v-card-title >
            <span class="headline">{{ tituloForm }}</span>
        </v-card-title>

        <v-form>   
            <v-container>
                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                         <v-select
                                :items="empleados"
                                label="Empleado"
                                outline
                                v-model="editedItem.empleado"
                                :item-text="editedItem.empleado"
                            ></v-select>
                        </v-flex>
                    <v-flex xs12 sm6 md6>
                            <v-select
                                :items="productos"
                                label="Fruta"
                                outline
                                v-model="editedItem.producto"
                                :item-text="editedItem.producto"
                            ></v-select>
                        </v-flex>
                </v-layout>

                     <v-layout wrap>
                         <v-flex xs12 sm6 md6>
                             <v-text-field v-model="editedItem.fecha" label="Fecha"></v-text-field>
                        </v-flex>
                         <v-flex xs12 sm6 md6>
                             <v-text-field v-model="editedItem.precio" label="Precio" disabled></v-text-field>
                        </v-flex>                    
                </v-layout>

                        <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.cantidad" label="Cantidad"></v-text-field>
                        </v-flex>
                    <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.total" label="Total" disabled></v-text-field>
                        </v-flex>
                   
                </v-layout>                   

            </v-container>
        </v-form>

        <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cancelarGestionRecoleccion()">Cancelar</v-btn>
                <v-btn flat color="#26C6DA" @click="guardarRecoleccion()">Guardar recoleccion</v-btn>
            </v-card-actions>
    </v-card> 

<!-- <v-card class="card-form-recolecciones" v-if="cardFormPago">
        <v-card-title >
            <span class="headline">{{ tituloForm }}</span>
        </v-card-title>
    <v-form>   
            <v-container>
                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                         <v-select
                                :items="empleados"
                                label="Empleado"
                                outline
                                v-model="editedItem.empleado"
                                :item-text="editedItem.empleado"
                            ></v-select>
                        </v-flex>
                    <v-flex xs12 sm6 md6>
                            <v-select
                                :items="productos"
                                label="Fruta"
                                outline
                                v-model="editedItem.producto"
                                :item-text="editedItem.producto"
                            ></v-select>
                        </v-flex>
                </v-layout>
            </v-container>
        </v-form>
 </v-card> -->
    </div>
</template>

<script>
/*
Modelo de datos a implementar en este componente.

La tabla constara de las siguientes columnas:

ID.Recoleccion
Empleado
Producto
Cantidad
Fecha
Pago

    "recolecciones":[
        {
            "empleado":{}, //usar un select aqui en el input del HTML, luego lo rellenaremos con datos
            "producto":{}, //usar un select aqui en el input del HTML, luego lo rellenaremos con datos
            "cantidad":{}, //usar un select aqui en el input del HTML, luego lo rellenaremos con datos
            "fecha":"", //usar un input
            "pago":{ //usar dos input uno para cada concepto
                "fecha":"",
                "importe":""
            }
        }
    ],
*/

/*
aquí tampoco se como colocar lo siguiente en la tabla en el campo de pago:
"pago":{ //usar dos input uno para cada concepto
                "fecha":"",
                "importe":""
            }
 */


export default {
    data:()=>({
         buscarR:'',
       headers:[
            {text:'ID', value:'IdRecoleccion', align:'left',sortable: false,},
            {text:'Empleado', value:'empleado', align:'left'},
            {text:'Producto', value:'producto', align:'left'},
            {text:'Cantidad', value:'cantidad', align:'left'},
            {text:'Fecha', value:'fecha', align:'left'},
            {text:'Precio', value:'precio', align:'left'},
            {text:'Total', value:'total', align:'left'},
            {text: 'Estado', value: 'estado', align: 'left'},
            {text: 'Gestión', value: 'nombre', align: 'left' }
            
        ],
                 listaRecolecciones:[
            {
                IdRecoleccion:'01',
                empleado: "Maria",
                producto: "Fruta 1",
                cantidad: 17,
                fecha: "15/03/19",
                precio: 15,
                total:234
            },
             {
                IdRecoleccion:'01',
                empleado: "Maria",
                producto: "Fruta 1",
                cantidad: 17,
                fecha: "15/03/19",
                precio: 15,
                estado:"Pagado",
                total: 345                
            },
              {
                IdRecoleccion:'01',
                empleado: "Maria",
                producto: "Fruta 1",
                cantidad: 17,
                fecha: "15/03/19",
                precio: 15,
                total: 345
            },
              {
                IdRecoleccion:'01',
                empleado: "Maria",
                producto: "Fruta 1",
                cantidad: 17,
                fecha: "15/03/19",
                precio: 13,
                total: 433,
                estado: "Pagado"
            }
                ],
        editedIndex: -1,
        editedItem: {
             IdRecoleccion:null,
                empleado: null,
                producto: null,
                cantidad: null,
                fecha: null,
                pago: null
        },
        modoForm: 1, 
        cardFormRecoleccion: false,
    }),
        computed:{
        tituloForm () {
            return this.modoForm === 1 ? 'Nueva recoleccion' : 'Editar recoleccion'
        }
    },

    methods: {
        editItem (item) {
             console.log(item)
            this.editedIndex = this.listaRecolecciones.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.modoForm = 2
            this.cardFormRecoleccion = true
        },
        deleteItem (item) {
            const index = this.listaRecolecciones.indexOf(item)
            confirm('¿Esta usted seguro de que desea eliminar esta recoleccion? ') && this.listaRecolecciones.splice(index, 1)
        },
        guardarRecoleccion (){
            console.info(this.editedItem)

        },
        cancelarGestionRecoleccion(){
            this.cardFormRecoleccion = false
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            console.log(this.editedItem)
            
        }
    }


    
}
</script>


<style scoped>

.card-form-recolecciones{
        margin-top: 2rem
    }

</style>
