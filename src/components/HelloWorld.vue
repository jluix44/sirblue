<template>
  <v-container>
    <v-layout text-xs-left wrap>
      

    <v-carousel>
        <v-carousel-item
        v-for="(foto,i) in fotos"
        :key="i"
        :src="foto.src"
        ></v-carousel-item>
    </v-carousel>



    <v-layout row wrap texrt>
        <h2 class="display-3">Sirblue</h2>
    </v-layout>            
    <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md6>
        <v-card color="blue lighten-2" dark>
          <v-card-title primary class="title">Registros confiables</v-card-title>
          <v-card-text>{{ registrosCon }}</v-card-text>
        </v-card>
      </v-flex>

            <v-flex d-flex xs12 sm6 md6>
        <v-card color="green lighten-2" dark>
          <v-card-title primary class="title">Fácil consulta de información</v-card-title>
          <v-card-text>{{ consultaInfo }}</v-card-text>
        </v-card>
      </v-flex>

      </v-layout>

      </v-container>

    </v-layout>

    

  </v-container>

  



</template>

<script>

export default {
    data () {
        return {
            fotos:[
            {
                src: require('@/assets/bUno.jpeg')
            },
            {
                src:require('@/assets/bDos.jpeg')
            }
            ],
            registrosCon:"Lleva un registro de una forma rápida segura de todos los empleados, frutas, huertas y gastos durante toda la producciión",
            consultaInfo:"Consulta todos lo datos registrados para su análisis, conoce de manera fácil los kilogramos cosechados, las ventas y gastos generados al día o en un tiempo determinado",
            
          
        }
    }
}

</script>

<style>

</style>
