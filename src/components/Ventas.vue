<template>
    <div>
        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1" >Ventas</h3>
        </v-layout>
        
         <v-card>
            <v-card-title>
                Lista de ventas
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
            :items="ventas"
            :search="search" 
            >
                <template v-slot:items="props">
                    <td class="text-xs-right"> {{ props.item.producto }} </td>
                    <td class="text-xs-right"> {{ props.item.cliente }} </td>
                    <td class="text-xs-right"> {{ props.item.fecha }} </td>
                    <td class="text-xs-right"> {{ props.item.cantidad }} </td>
                    <td class="text-xs-right"> {{ props.item.precio }} </td>
                    <td class="text-xs-right"> {{ props.item.total }} </td>
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
                <v-btn flat color="#26C6DA" @click="cardFormEmpleado = !cardFormEmpleado">Nueva venta</v-btn>
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
                            <v-text-field v-model="editedItem.producto" label="Producto"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.cliente" label="Cliente"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.fecha" label="Fecha" mask="##/##/####"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.cantidad" label="Cantidad"></v-text-field>
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
                <v-btn flat color="green dark" v-if="btnSaveAdd" @click="addEmpleado()">Guardar venta</v-btn>
                <v-btn flat color="blue dark" v-if="btnUpdate" @click="updateEmpleado(currentDoc)">Actualizar venta</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">¿Esta usted seguro de elimiar la siguiente venta?</v-card-title>
                <v-card-text>
                    <ul>
                        <li>{{ editedItem.producto }}</li>
                        <li>{{ editedItem.cliente }}</li>
                        <li>{{ editedItem.fecha }}</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="green darken-1" flat @click="deleteEmpleado(currentDoc)">Eliminar venta</v-btn>
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
            {text:'Producto', value:'producto', align:'left'},
            {text:'Cliente', value:'cliente', align:'left'},
            {text:'Fecha', value:'fecha', align:'left'},
            {text:'Cantidad', value:'cantidad', align:'left'},
            {text:'Precio', value:'precio', align:'left'},
            {text:'Total', value:'total', align:'left'},
            {text: 'Gestión', value: 'nombre', align: 'left' }
            
        ],
        editedIndex: -1,
        editedItem: {
            producto: null,
            cliente: null,
            fecha: null,
            cantidad: null,
            precio: null,
            total: null,
        },
        currentDoc: null,
        modoForm: 1, //1 para nuevo, 2 para edicion 
        cardFormEmpleado: false,
        btnSaveAdd: false,
        btnUpdate: false,
        dialogDelete: false,
    }),
    created () {
        this.$store.dispatch('loadVentas')
    },
    computed:{
        ...mapState(['ventas']),
        formTitle () {
            return this.modoForm === 1 ? 'Nueva venta' : 'Editar venta'
        }
    },

    methods: {
         editItem (item) {
            console.log(item.id)
            this.editedIndex = this.$store.state.ventas.indexOf(item)
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
            this.editedIndex = this.$store.state.ventas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            console.log("documento para eliminar: ", this.currentDoc)
        },
        addEmpleado (){
            db.collection("ventas").doc().set({
                producto: this.editedItem.producto, 
                cliente: this.editedItem.cliente,
                fecha: this.editedItem.fecha,
                cantidad: this.editedItem.cantidad,
                precio: this.editedItem.precio,
                total: this.editedItem.total,
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
            this.$store.dispatch('loadVentas');
        },
        updateEmpleado(document) {
            let sfDocRef = db.collection("ventas").doc(document)//(doc.id, "==", "");
            sfDocRef.update({
                producto: this.editedItem.producto, 
                cliente: this.editedItem.cliente,
                fecha: this.editedItem.fecha,
                cantidad: this.editedItem.cantidad,
                precio: this.editedItem.precio,
                total: this.editedItem.total,
            })
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            this.cardFormEmpleado = false
            this.$store.dispatch('loadVentas');
        },
        deleteEmpleado (document) {
            db.collection("ventas").doc(document).delete().then(function(){
                console.log("deleted")
            }).catch(function(error){
                console.log("Error: ", error)
            }) 
            this.dialogDelete = false
            this.$store.dispatch('loadVentas');
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
