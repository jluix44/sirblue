<template>
    <div>
        
        <v-layout align-center justify-center row fill-height class="ma-4">
            <h3 class="display-1">Ventas</h3>
        </v-layout>
        
        <v-card>
            <v-card-title>
                Lista de ventas
                <v-spacer></v-spacer>
                <v-text-field
                v-model="buscarv"
                append-icon="search"
                label="Buscar"
                single-line
                hide-details
                ></v-text-field> 
            </v-card-title>
            <v-data-table
            :headers="headers"
            :items="listaVentas"
            :search="buscarv"
            >
            <template v-slot:items="props">
                <td class="text-xs-right">{{ props.item.producto }}</td>
                <td class="text-xs-right">{{ props.item.fecha }}</td>
                <td class="text-xs-right">{{ props.item.cliente }}</td>
                <td class="text-xs-right">{{ props.item.cantidad }}</td>
                <td class="text-xs-right">{{ props.item.precio }}</td>
                <td class="text-xs-right">{{ props.item.total }}</td>               
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
                No se encontro ningun resultado con "{{ buscarv }}" .
            </v-alert>
            </v-data-table>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cardFormVenta = !cardFormVenta">Nueva venta</v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="card-form-ventas" v-if="cardFormVenta">
            <v-card-title dark>
                <span class="headline">{{ formaTitulo }}</span>
            </v-card-title>
            <v-form>
                <v-container>
                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-select
                                :items="productos"
                                label="Fruta"
                                outline
                                v-model="editedItem.producto"
                                :item-text="editedItem.producto"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.fecha" label="Fecha"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field v-model="editedItem.cliente" label="Cliente"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field type="number" v-model.number="editedItem.cantidad" label="Cantidad"></v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout wrap>
                        <v-flex xs12 sm6 md6>
                            <v-text-field type="number" v-model.number ="editedItem.precio" label="Precio"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6 md6>
                            <v-text-field type="number" v-model.number="editedItem.total" label="Total" disabled ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <h3>Total de venta {{ totalv }} </h3>
                        </v-flex>
                    </v-layout>

                </v-container>
            </v-form>
            <v-card-actions>
                <v-btn flat color="#26C6DA" @click="cancelarGestionVenta()">Cancelar</v-btn>
                <v-btn flat color="#26C6DA" @click="guardarVenta()">Guardar venta</v-btn>
            </v-card-actions> 
        </v-card>

    </div>
</template>

<script>
export default {
    data: ()=>({
        buscarv:'',
        headers:[
            { text: 'Producto', value: 'producto', align: 'left' },
            { text: 'Fecha', value: 'fecha', align: 'left'},
            { text: 'Cliente', value: 'cliente', align: 'left'},
            { text: 'Cantidad', value: 'cantidad', align: 'left'},
            { text: 'Precio', value: 'precio', align: 'left'},
            { text: 'Total', value: 'total', align: 'left'}
            
        ],
       listaVentas:[
            {
                producto: "fruta 1",
                fecha:"01/05/19",
                cliente:"abbce defvg",
                cantidad:32,
                precio:43,
                total: 323
            },
            {
                producto: "fruta 1",
                fecha:"01/05/19",
                cliente:"abbce defvg",
                cantidad:32,
                precio:43,
                total: 323
            }
        ], 
        editedIndex: -1,
        editedItem:{
            producto: null,
            fecha: null,
            cliente:null,
            cantidad: 0,
            precio:0,
            total: 0
        
        },
        totalv: 0,
        modoForm:1,
        cardFormVenta: false,
    }),
    computed:{
        formaTitulo (){
            return this.modoForm === 1 ? 'Nueva venta' : 'Editar venta'
        },
        
        sumarvtas(){
            this.totalv = 0;
            for(num of this.editedItem){
                this.totalv=this.totalv + num.cantidad + num.precio;
            }
            return this.totalv;
        }

    },

    methods:{
        editItem (item) {
            console.log(item)
            this.editedIndex = this.listaVentas.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.modoForm = 2
            this.cardFormVenta = true
        },
        deleteItem(item) {
            const index = this.listaVentas.indexOf(item)
            confirm('¿Esta usted seguro de que desea eliminar esta venta?') && this.listaVentas.splice(index,1)
        },
        guardarVenta(item) {
            console.info(this.editedItem)
        },
        cancelarGestionVenta(item) {
            this.cardFormVenta = false
            for (const key in this.editedItem){
                this.editedItem[key] = null
            }
            console.log(this.editedItem)
        },
    }   

}
</script>


<style scoped>

    .card-form-ventas{
        margin-top: 2rem
    }

</style>
