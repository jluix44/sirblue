<template>
    <div>
        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1">Huertas</h3>
        </v-layout>
    
        <v-card>
            <v-card-title>
                Lista de huertas
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>

            <v-data-table
            :headers="headers"
            :items="ListaHuertas"
            :search="search"
            >
                <template v-slot:items="props">
                    <td>{{props.item.nombreh}}</td>
                    <td class="text-xs-right"> {{ props.item.ubicacion }} </td>
                    <td class="text-xs-right"> {{ props.item.metraje }} </td>
                    <td class="text-xs-right"> {{ props.item.frutas }} </td>
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
                    No se encontro ningun resultado con "{{ search }}" .
                </v-alert>
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormHuerta = !cardFormHuerta">Nueva huerta</v-btn>
            </v-card-actions>
        </v-card>

    <v-card class="card-form-huertas" v-if="cardFormHuerta">
        <v-card-title>
            <span class="headline">{{ formTitulo }}</span>
        </v-card-title>
    
        <v-form>   
            <v-container>
                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                            <v-text-field  v-model="editedItem.nombreh" label="Nombre"></v-text-field>
                        </v-flex>
                    <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.ubicacion" label="Ubicacion"></v-text-field>
                        </v-flex>
                </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.metraje"  label="Metraje"></v-text-field>
                        </v-flex>
                         <v-flex xs12 sm6 md6>
                            <v-select
                                :items="frutas"
                                item-text="nombreFruta"
                                item-value="frutasId"
                                label="Frutas"
                                :value="frutas.frutasId"
                                outline
                            ></v-select>
                            <!-- 
                                NOTA: aqui como la comeleccion de datos en es un array de obejtos hay que indicarle primer el array que es productos y luego que propiedad se va a tomar para ponerla en el text de select. faltaria agregar el value que es el productosId
                            -->

                        </v-flex>
                    </v-layout>

            </v-container>
        </v-form>
        <v-card-actions>
            <v-btn flat color="#26C6DA" @click="cancelarGestionHuerta()">Cancelar</v-btn>
            <v-btn flat color="#26C6DA" @click="guardarFruta()">Guardar fruta</v-btn>
        </v-card-actions> 

    </v-card>

    </div>
</template>

<script>
/*

Modelo de datos a implementar en este componente.

La tabla constara de las siguientes columnas:

ID.Huerta  <-- Aquí en el Id, ¿lo voy a colocar de forma manual o a la hora de ingresar un nuevo dato se va a generar automáticamente?
Nombre
Ubicacion
Metraje


"huertas":[
        {
            "nombre":"",
            "ubicacion":"",
            "metraje":"",
            "productos":[ //usar un select aqui en el input del HTML, luego lo rellenaremos con datos
                {
                    "nombreFruta":"", 
                    "tipo":"",
                    "precioBase":""
                }
            ]
        }
    ],
*/

/* 



y en esta parte: no entendí como colocar esos datos o en qué los debo colocar para que aparezcan en la tabla
            "productos":[ //usar un select aqui en el input del HTML, luego lo rellenaremos con datos
                {
                    "nombreFruta":"",
                    "tipo":"",
                    "precioBase":""
                }
            ]
Pregunta:
¿Lo que coloqué abajo es el modelo de datos, de lo cual me pides implementar arriba?

*/


export default {
    data:()=>({
        search:'',
        headers:[
            {text:'Nombre', value:'nombreh', align:'left'},
            {text:'Ubicacion', value:'ubicacion', align:'right'},
            {text:'Metraje', value:'metraje', align:'right'},
            {text:'Frutas', value:'frutas', align:'right'},
            {text:'Gestión', value:'nombre', align:'right'}
        ],
      /*  ListaHuertas:[
            {
                nombreh:'Huerta Uno', 
                ubicacion: "Zacatlan",
                metraje: "30m x 500 m",
                frutas: "Fruta Dos"                

            },
                        {
                nombreh:'Huerta Dos',
                ubicacion: "Zacatlan",
                metraje: "300m x 500 m",
                frutas: "Fruta Cinco"                 

            },
                        {
                nombreh:'Huerta Tres',
                ubicacion: "Zacatlan",
                metraje: "200m x 100 m",
                frutas: "Fruta Tres"                 

            },
                        {
                nombreh:'Huerta Cuatro',
                ubicacion: "Zacatlan",
                metraje: "1000m x 500 m",
                frutas: "Fruta Uno"                 

            },
            {
                nombreh:'Huerta Cinco',
                ubicacion: "Zacatlan",
                metraje: "400 m x 600 m",
                frutas: "Fruta Cuatro"                 

            },
            {
                nombreh:'Huerta Seis',
                ubicacion: "Zacatlan",
                metraje: "800 m x 100 m" ,             
                frutas: "Fruta Cuatro"
            }
            
        ],
        frutas: [
            {   
                frutasId: "3DFFSD23T",
                nombreFruta:'bb1',
                tipo:'buena',
                precioBase:13
            },
            { 
                frutasId: "SDFASDF",
                nombreFruta:'bb2',
                tipo:'buena',
                precioBase:13
            },
            { 
                frutasId: "3DFFS232323D23T",
                nombreFruta:'bb3',
                tipo:'buena',
                precioBase:13
            }
        ], */
        editedIndex: -1,
        editedItem: {
            nombreh:null, 
            ubicacion: null,
            metraje: null,
            frutas: null
        },
      modoForm: 1, 
      cardFormHuerta: false,

    }),
    
    computed:{
      formTitulo () {
        return this.modoForm === 1 ? 'Nueva huerta' : 'Editar huerta'
      }
    },
    methods: {
         editItem (item) {
             console.log(item)
            this.editedIndex = this.ListaHuertas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.modoForm = 2
            this.cardFormHuerta = true
        },
        deleteItem (item) {
            const index = this.ListaHuertas.indexOf(item)
            confirm('¿Esta usted seguro de que desea eliminar esta huerta? ') && this.ListaHuertas.splice(index, 1)
        },
      guardarFruta(){
          console.info(this.editedItem)
      },
      cancelarGestionHuerta(){
        this.cardFormHuerta = false
        for (const key in this.editedItem){
            this.editedItem[key] = null
        }
        console.log(this.editedItem)
      }
    }
    
}
</script>


<style scoped>

    .card-form-huertas{
        margin-top: 2rem
    }

</style>
