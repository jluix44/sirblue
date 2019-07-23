<template>
    <div>

        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1">Gastos</h3>
        </v-layout>

        <v-card>
            <v-card-title>
                Lista de gastos
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="buscarg"
                    append-icon="search" 
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
            :headers="headers"
            :items="listaGastos"
            :search="buscarg"
            >
            <template v-slot:items="props">
                <td class="text-xs-right">{{ props.item.idGasto }}</td>
                <td class="text-xs-right">{{ props.item.huerta }}</td>
                <td class="text-xs-right">{{ props.item.fecha }}</td>
                <td class="text-xs-right">{{ props.item.concepto }}</td>
                <td class="text-xs-right">{{ props.item.total }} </td>
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
                        class="mr-2"
                        @click="deleteItem(props.item)"
                    >
                    delete
                    </v-icon>
                </td>

            </template>
            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                No se encontró ningun resultado con "{{ buscarg }}" .
            </v-alert>    
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormGasto = !cardFormGasto">Nuevo Gasto</v-btn>
            </v-card-actions>

        </v-card>
            
        <v-card class="card-form-gastos" v-if="cardFormGasto">
            <v-card-title dark>
                <span class="headline">{{ formaTitulo }}</span>
            </v-card-title>
        <v-form>
            <v-container>
                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                        <v-select
                        :items="huertas"
                        label="Huerta"
                        outline
                        v-model="editedItem.huerta"
                        :item-text="editedItem.huerta"
                        ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <v-text-field v-model="editedItem.fecha" label="Fecha"></v-text-field>
                    </v-flex>
                </v-layout>

                <v-layout wrap>
                    <v-flex xs12 sm6 md6>
                        <v-text-field v-model="editedItem.concepto" label="Concepto"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md6>
                        <v-text-field v-model="editedItem.total" label="Total" disabled></v-text-field>
                    </v-flex>
                </v-layout>

            </v-container>
        </v-form>
        
           <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cancelarGestionGasto()">Cancelar</v-btn>
                <v-btn flat color="#26C6DA" @click="guardarEmpleado()">Guardar gasto</v-btn>
            </v-card-actions> 
        </v-card>

    </div>
</template>

<script>
export default {
    data: ()=>({
        buscarg: '',
        headers: [
            { text: 'IdGasto', value: 'idGasto', align: 'left'},
            { text: 'Huerta', value: 'huerta', align: 'right' },
            { text: 'Fecha', value: 'fecha', align: 'right' },
            { text: 'Concepto', value: 'concepto', align: 'right'},
            { text: 'Total', value: 'total', align: 'right'}
        ],
        listaGastos: [
            {
                idGasto: '001',
                huerta: 'Huerta 1',
                fecha: '05/04/19',
                concepto: 'Gasolina',
                total: '544.00'
            },
            {
                idGasto: '002',
                huerta: 'Huerta 2',
                fecha: '15/04/19',
                concepto: 'Agua',
                total: '123.00'
            },
            {
                idGasto: '003',
                huerta: 'Huerta 1',
                fecha: '25/04/19',
                concepto: 'Contenedores',
                total: '2,124.00'
            },
            {
                idGasto: '004',
                huerta: 'Huerta 5',
                fecha: '02/04/19',
                concepto: 'Gasolina',
                total: '345.00'
            }
        ], 
        editedIndex: -1,
        editedItem: {
            idGasto: null,
            huerta: null,
            fecha: null,
            concepto: null,
            total: null,
        },
        modoForm: 1,
        cardFormGasto: false
    }),
    computed: {
        formaTitulo(){
            return this.modoForm === 1 ? 'Nuevo gasto' : 'Editar gasto'
        }
    },
    methods: {
        editItem (item) {
            console.log(item)
            this.editedIndex = this.listaGastos.indexOf (item)
            this.editedItem = Object.assign({}, item)
            this.modoForm = 2
            this.cardFormGasto = true 
        },
        deleteItem (item) {
            const index = this.listaGastos.indexOf(item)
            confirm('Está usted seguro de eliminar este gasto') && this.listaGastos.splice(index, 1)
        },
        guardarGasto(item){
            console.log(this.editedItem)
        },
        cancelarGestionGasto(item){
            this.cardFormGasto = false
            for (const key in this.editedItem){
                this.editedItem[key] = null
            }
            console.log(this.editedItem)
        },
    }

}
</script>


<style scoped>
    .card-form-gastos{
        margin-top: 2rem
    }
</style>
