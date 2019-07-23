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
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
    
            </v-card-title>

            <v-data-table
            :headers="headers"
            :items="cosechas"
            :search="search" 
            >
                <template v-slot:items="props">
                    <td class="text-xs-right"> {{ props.item.empleado }} </td>
                    <td class="text-xs-right"> {{ props.item.producto }} </td>
                    <td class="text-xs-right"> {{ props.item.cantidad }} </td>
                    <td class="text-xs-right"> {{ props.item.fecha }} </td>
                    <td class="text-xs-right"> {{ props.item.precio }} </td>
                    <td class="text-xs-right"> {{ props.item.total }} </td>
                    <td class="text-xs-right"> {{ props.item.estatus }} </td>
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
                <v-btn flat color="#26C6DA" @click="cardFormEmpleado = !cardFormEmpleado">Nueva recoleccion</v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="card-form-recolecciones" v-if="cardFormEmpleado">
            <v-card-title dark>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
            <v-form >
                <v-container>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="namesAllEmpleados"
                                label="Empleados"
                                outline
                                :value="editedItem.empleado"
                                v-model="editedItem.empleado"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="frutas"
                                label="Producto"
                                outline
                                :value="editedItem.producto"
                                v-model="editedItem.producto"
                            ></v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.cantidad" label="Cantidad"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.fecha" label="Fecha" mask="##/##/####"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.precio" @change="editedItem.total = editedItem.cantidad * editedItem.precio" label="Precio"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.total" label="Total" readonly></v-text-field>
                        </v-flex>
                    </v-layout>

                    
                </v-container>
            </v-form>
            <v-card-actions>
                <v-btn flat color="red dark" @click="cancelarGestionEmpleado()">Cancelar</v-btn>
                <v-btn flat color="green dark" v-if="btnSaveAdd" @click="addEmpleado()">Guardar huerta</v-btn>
                <v-btn flat color="blue dark" v-if="btnUpdate" @click="updateEmpleado(currentDoc)">Actualizar huerta</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">¿Esta usted seguro de elimiar la siguiente recolección?</v-card-title>
                <v-card-text>
                    <ul>
                        <li>{{ editedItem.empleado }}</li>
                        <li>{{ editedItem.producto }}</li>
                        <li>{{ editedItem.cantidad }}</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="green darken-1" flat @click="deleteEmpleado(currentDoc)">Eliminar recolección</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
import db from '@/services/database'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
    data:()=>({
        search:'',
        headers:[
            {text:'Empleado', value:'empleado', align:'left'},
            {text:'Producto', value:'producto', align:'left'},
            {text:'Cantidad', value:'cantidad', align:'left'},
            {text:'Fecha', value:'fecha', align:'left'},
            {text:'Precio', value:'precio', align:'left'},
            {text:'Total', value:'total', align:'left'},
            {text: 'Estatus', value: 'estatus', align: 'left'},
            {text: 'Gestión', value: 'nombre', align: 'left' }
            
        ],
        editedIndex: -1,
        editedItem: {
            empleado: null,
            producto: null,
            cantidad: null,
            fecha: null,
            precio: null,
            total: null,
            estatus: null
        },
        currentDoc: null,
        modoForm: 1, //1 para nuevo, 2 para edicion 
        cardFormEmpleado: false,
        btnSaveAdd: false,
        btnUpdate: false,
        dialogDelete: false,
        nombresEmpleados:[],
        frutas: ['Blueberry', 'Fresa', 'Manzana', 'Pera'],
    }),
    created () {
        this.$store.dispatch('loadEmpleados')
        this.$store.dispatch('loadCosechas')
    },
    computed:{
        ...mapState(['cosechas']),
        ...mapGetters(['namesAllEmpleados']),
        formTitle () {
            return this.modoForm === 1 ? 'Nueva recoleccion' : 'Editar recoleccion'
        }
    },

    methods: {
         editItem (item) {
            console.log(item.id)
            this.editedIndex = this.$store.state.cosechas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.modoForm = 2
            this.cardFormEmpleado = true
            this.currentDoc = item.id 
            this.btnUpdate = true 
            this.btnSaveAdd = false
        },
        newEmpleado(){
            this.btnSaveAdd = true
            this.btnUpdate = false 
        },
        confirmDelete(item){
            console.log(item)
            this.currentDoc = item.id 
            this.editedIndex = this.$store.state.cosechas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            console.log("documento para eliminar: ", this.currentDoc)
        },
        addEmpleado (){
            db.collection("cosechas").doc().set({
                nombre: this.editedItem.empleado, 
                ubicacion: this.editedItem.producto,
                metraje: this.editedItem.cantidad,
                fruta: this.editedItem.fecha,
                precio: this.editedItem.precio,
                total: this.editedItem.total,
                estatus: this.editedItem.estatus
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            console.info(this.editedItem)
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            this.cardFormEmpleado = false
            this.$store.dispatch('loadCosechas');
        },
        updateEmpleado(document) {
            let sfDocRef = db.collection("cosechas").doc(document)//(doc.id, "==", "");
            sfDocRef.update({
                nombre: this.editedItem.empleado, 
                ubicacion: this.editedItem.producto,
                metraje: this.editedItem.cantidad,
                fruta: this.editedItem.fecha,
                precio: this.editedItem.precio,
                total: this.editedItem.total,
                estatus: this.editedItem.estatus
            })
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            this.cardFormEmpleado = false
            this.$store.dispatch('loadCosechas');
        },
        deleteEmpleado (document) {
            db.collection("cosechas").doc(document).delete().then(function(){
                console.log("deleted")
            }).catch(function(error){
                console.log("Error: ", error)
            }) 
            this.dialogDelete = false
            this.$store.dispatch('loadCosechas');
        },
        cancelarGestionEmpleado (){
            this.cardFormEmpleado = false
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
