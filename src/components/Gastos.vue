<template>
    <div>
        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1" >Gastos</h3>
        </v-layout>
        
         <v-card>
            <v-card-title>
                Lista de gastos
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
            :items="gastos"
            :search="search" 
            >
                <template v-slot:items="props">
                    <td class="text-xs-right"> {{ props.item.huerta }} </td>
                    <td class="text-xs-right"> {{ props.item.fecha }} </td>
                    <td class="text-xs-right"> {{ props.item.concepto }} </td>
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
                <v-btn flat color="#26C6DA" @click="cardFormEmpleado = !cardFormEmpleado">Nuevo gasto</v-btn>
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
                                :items="namesAllHuertas"
                                label="Huertas"
                                outline
                                :value="editedItem.huerta"
                                v-model="editedItem.huerta"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.fecha" label="Fecha" mask="##/##/####"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.concepto" label="Concepto" ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.total" label="Total"></v-text-field>
                        </v-flex>
                    </v-layout>
                    
                </v-container>
            </v-form>
            <v-card-actions>
                <v-btn flat color="red dark" @click="cancelarGestionEmpleado()">Cancelar</v-btn>
                <v-btn flat color="green dark" v-if="btnSaveAdd" @click="addEmpleado()">Guardar gasto</v-btn>
                <v-btn flat color="blue dark" v-if="btnUpdate" @click="updateEmpleado(currentDoc)">Actualizar gasto</v-btn>
            </v-card-actions>
        </v-card>

        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">¿Esta usted seguro de elimiar el siguiente gasto?</v-card-title>
                <v-card-text>
                    <ul>
                        <li>{{ editedItem.huerta }}</li>
                        <li>{{ editedItem.fecha }}</li>
                        <li>{{ editedItem.concepto }}</li>
                        <li>{{ editedItem.total }}</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="green darken-1" flat @click="deleteEmpleado(currentDoc)">Eliminar gasto</v-btn>
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
            {text:'Huerta', value:'producto', align:'left'},
            {text:'Fecha', value:'fecha', align:'left'},
            {text:'Concepto', value:'concepto', align:'left'},
            {text:'Total', value:'total', align:'left'},
            {text:'Gestión', value: 'nombre', align: 'left' }
            
        ],
        editedIndex: -1,
        editedItem: {
            huerta: null,
            fecha: null,
            concepto: null,
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
        this.$store.dispatch('loadGastos')
        this.$store.dispatch('loadHuertas')
    },
    computed:{
        ...mapState(['gastos']),
        ...mapGetters(['namesAllHuertas']),
        formTitle () {
            return this.modoForm === 1 ? 'Nuevo gasto' : 'Editar gasto'
        }
    },

    methods: {
         editItem (item) {
            console.log(item.id)
            this.editedIndex = this.$store.state.gastos.indexOf(item)
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
            this.editedIndex = this.$store.state.gastos.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            console.log("documento para eliminar: ", this.currentDoc)
        },
        addEmpleado (){
            db.collection("gastos").doc().set({
                huerta: this.editedItem.huerta, 
                fecha: this.editedItem.fecha,
                concepto: this.editedItem.concepto,
                total: this.editedItem.total
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
            this.$store.dispatch('lodadGastos');
        },
        updateEmpleado(document) {
            let sfDocRef = db.collection("gastos").doc(document)//(doc.id, "==", "");
            sfDocRef.update({
                huerta: this.editedItem.huerta, 
                fecha: this.editedItem.fecha,
                concepto: this.editedItem.concepto,
                total: this.editedItem.total
            })
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            this.cardFormEmpleado = false
            this.$store.dispatch('lodadGastos');
        },
        deleteEmpleado (document) {
            db.collection("gastos").doc(document).delete().then(function(){
                console.log("deleted")
            }).catch(function(error){
                console.log("Error: ", error)
            }) 
            this.dialogDelete = false
            this.$store.dispatch('lodadGastos');
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
