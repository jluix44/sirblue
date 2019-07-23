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
            :items="huertas"
            :search="search"
            >
            <template v-slot:items="props">
                <td>{{ props.item.nombre }}</td>
                <td class="text-xs-right">{{ props.item.ubicacion }}</td>
                <td class="text-xs-right">{{ props.item.metraje }}</td>
                <td class="text-xs-right">{{ props.item.fruta }}</td>
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
                        @click="confirmDelete(props.item)"
                    >
                        delete
                    </v-icon>
                    </td>
            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                No se encontro ningun resutlado con "{{ search }}" .
            </v-alert>
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormEmpleado = !cardFormEmpleado, newEmpleado()">Nueva Huerta</v-btn>
            </v-card-actions>
        </v-card>
        
        <v-card class="card-form-huertas" v-if="cardFormEmpleado">
            <v-card-title dark>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
            <v-form >
                <v-container>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.ubicacion" label="Ubicación"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.metraje" label="Metraje"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="frutas"
                                label="Frutas"
                                outline
                                :value="editedItem.fruta"
                                v-model="editedItem.fruta"
                            ></v-select>
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
                <v-card-title class="headline">¿Esta usted seguro de elimiar la siguiente huerta?</v-card-title>
                <v-card-text>
                    <ul>
                        <li>{{ editedItem.nombre }}</li>
                        <li>{{ editedItem.ubicacion }}</li>
                        <li>{{ editedItem.metraje }}</li>
                        <li>{{ editedItem.fruta }}</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" flat @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="green darken-1" flat @click="deleteEmpleado(currentDoc)">Eliminar huerta</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
import db from '@/services/database'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
    data: ()=>({
        search: '',
        headers: [
          { text: 'Nombre',  value: 'nombre', align: 'left', sortable: false,},
          { text: 'Ubicacion', value: 'ubicacion', align: 'right' },
          { text: 'Metraje', value: 'metraje', align: 'right' },
          { text: 'Fruta', value: 'fruta', align: 'right' },
          { text: 'Gestión', value: 'nombre', align: 'right' },
        ],
        frutas: ['Blueberry', 'Fresa', 'Manzana', 'Pera'],
        editedIndex: -1,
        editedItem: {
            nombre: null, 
            apellidos: null,
            genero: null,
            edad: null,
            telefono: null,
            direccion: null
        },
        currentDoc: null,
        modoForm: 1, //1 para nuevo, 2 para edicion 
        cardFormEmpleado: false,
        btnSaveAdd: false,
        btnUpdate: false,
        dialogDelete: false
    }),
    created () {
        this.$store.dispatch('loadHuertas')
    },
    computed:{
        ...mapState(['huertas']),

        formTitle () {
            return this.modoForm === 1 ? 'Nueva huerta' : 'Editar huerta'
        }
    }, 
    methods: {
        editItem (item) {
            console.log(item.id)
            this.editedIndex = this.$store.state.huertas.indexOf(item)
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
            this.editedIndex = this.$store.state.huertas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
            console.log("documento para eliminar: ", this.currentDoc)
        },
        addEmpleado (){
            db.collection("huertas").doc().set({
                nombre: this.editedItem.nombre, 
                ubicacion: this.editedItem.ubicacion,
                metraje: this.editedItem.metraje,
                fruta: this.editedItem.fruta
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
            this.$store.dispatch('loadHuertas');
        },
        updateEmpleado(document) {
            let sfDocRef = db.collection("huertas").doc(document)//(doc.id, "==", "");
            sfDocRef.update({
                nombre: this.editedItem.nombre, 
                ubicacion: this.editedItem.ubicacion,
                metraje: this.editedItem.metraje,
                fruta: this.editedItem.fruta
            })
            for (const key in this.editedItem) {
                this.editedItem[key] = null
            }
            this.cardFormEmpleado = false
            this.$store.dispatch('loadHuertas');
        },
        deleteEmpleado (document) {
            db.collection("huertas").doc(document).delete().then(function(){
                console.log("deleted")
            }).catch(function(error){
                console.log("Error: ", error)
            }) 
            this.dialogDelete = false
            this.$store.dispatch('loadHuertas');
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
    .card-form-huertas{
        margin-top: 2rem
    }
</style>
