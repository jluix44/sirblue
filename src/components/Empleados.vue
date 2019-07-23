<template>
    <div>
        <v-layout align-center justify-center row fill-height class="ma-4">
        <h3 class="display-1">Empleados</h3>
        </v-layout>

        <v-card>
            <v-card-title>
                Lista de empleados
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
            :items="empleados"
            :search="search"
            >
            <template v-slot:items="props">
                <td>{{ props.item.nombre }}</td>
                <td class="text-xs-right">{{ props.item.apellidos }}</td>
                <td class="text-xs-right">{{ props.item.genero }}</td>
                <td class="text-xs-right">{{ props.item.edad }}</td>
                <td class="text-xs-right">{{ props.item.telefono }}</td>
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
                No se encontro ningun resutlado con "{{ search }}" .
            </v-alert>
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormEmpleado = !cardFormEmpleado, newEmpleado()">Nuevo empleado</v-btn>
            </v-card-actions>
        </v-card>
        
        <v-card class="card-form-empleados" v-if="cardFormEmpleado">
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
                            <v-text-field v-model="editedItem.apellidos" label="Apellidos"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="generos"
                                label="Genero"
                                outline
                                v-model="editedItem.genero"
                                :item-text="editedItem.genero"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="edades"
                                label="Edad"
                                outline
                                :value="editedItem.edad"
                                v-model="editedItem.edad"
                            ></v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.direccion" label="Dirección"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.telefono" label="Teléfono"></v-text-field>
                        </v-flex>
                    </v-layout>
               
                    
                </v-container>
            </v-form>
            <v-card-actions>
                <v-btn flat color="red dark" @click="cancelarGestionEmpleado()">Cancelar</v-btn>
                <v-btn flat color="green dark" v-if="btnSaveAdd" @click="seveEmpleado()">Guardar empleado</v-btn>
                <v-btn flat color="blue dark" v-if="btnUpdate" @click="updateEmpleado(currentDoc)">Actualizar empleado</v-btn>
            </v-card-actions>
        </v-card>


    </div>
</template>

<script>
import db from '@/services/database'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { truncate } from 'fs';
import { constants } from 'crypto';
export default {
    data: ()=>({
        search: '',
        headers: [
          { text: 'Nombre',  value: 'nombre', align: 'left', sortable: false,},
          { text: 'Apellidos', value: 'apellidos', align: 'right' },
          { text: 'Genero', value: 'genero', align: 'right' },
          { text: 'Edad', value: 'edad', align: 'right' },
          { text: 'Teléfono', value: 'telefono', align: 'right' },
          { text: 'Gestión', value: 'nombre', align: 'right' },
        ],
        generos: ['Masculino', 'Femenino'],
        edades: [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57],
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
        btnUpdate: false
    }),
    created () {
        this.$store.dispatch('loadEmpleados')
    },
    computed:{
        ...mapState(['empleados']),
        generadEdades (){
            // for (let i = 18; i <= 100; i++) { /* Esta función es para en el select aparezcan números del 16 al 10 y el usuario pueda elegir opcion? */
            //     this.edades.push(i);  /*PEro al parecer no funciona */
            // }
        },
        formTitle () {
            return this.modoForm === 1 ? 'Nuevo empleado' : 'Editar empleado'
        }
    }, 
    methods: {
        editItem (item) {
            console.log(item.id)
            this.editedIndex = this.$store.state.empleados.indexOf(item)
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
        deleteItem (item) {
            const index = this.listaEmpleados.indexOf(item)
            confirm('¿Esta usted seguro de que desea eliminar este empleado? ') && this.listaEmpleados.splice(index, 1)
        },
        seveEmpleado (){

            db.collection("empleados").doc().set({
                nombre: this.editedItem.nombre, 
                apellidos: this.editedItem.apellidos,
                genero: this.editedItem.genero,
                edad: this.editedItem.edad,
                telefono: this.editedItem.telefono,
                direccion: this.editedItem.direccion
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            console.info(this.editedItem)
                this.editedItem.nombre = '';
                this.editedItem.apellidos = '';
                this.editedItem.genero = '';
                this.editedItem.edad = '';
                this.editedItem.telefono = '';
                this.editedItem.direccion = '';
                this.updateEmpleado();
                this.$store.dispatch('loadEmpleados');

        },
        updateEmpleado(document) {
            let sfDocRef = db.collection("empleados").doc(document)//(doc.id, "==", "");

            // Uncomment to initialize the doc.
            // sfDocRef.set({ population: 0 });

            return db.runTransaction(function(transaction) {
                console.log(JSON.stringify(this.editedItem))
                
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(sfDocRef).then(function(sfDoc) {
                    if (!sfDoc.exists) {
                        throw "Document does not exist!";
                    }
                    transaction.update(sfDocRef, { 
                        nombre: this.editedItem.nombre, 
                        apellidos: this.editedItem.apellidos,
                        genero: this.editedItem.genero,
                        edad: this.editedItem.edad,
                        telefono: this.editedItem.telefono,
                        direccion: this.editedItem.direccion
                    });
                });
            }).then(function() {
                console.log("Transaction successfully committed!");
            }).catch(function(error) {
                console.log("Transaction failed: ", error);
            });
            //this.$store.dispatch('loadEmpleados');
            
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
    .card-form-empleados{
        margin-top: 2rem
    }
</style>
