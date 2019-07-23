<template>
    <div id="app">
    <v-app id="inspire" dark>
        <v-navigation-drawer
        clipped
        fixed 
        v-model="drawer"
        app
        >
            <v-list dense>

                <v-list-tile @click="currentComponent = 'Empleados' ">
                <v-list-tile-action>
                    <v-icon>people</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Empleados</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="currentComponent = 'Huertas' ">
                <v-list-tile-action>
                    <v-icon>terrain</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Huertas</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="currentComponent = 'Cosechas' ">
                <v-list-tile-action>
                    <v-icon>list</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Recolecciones</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="currentComponent = 'Ventas' " >
                <v-list-tile-action>
                    <v-icon>assignment</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Ventas</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>

                <v-list-tile @click="currentComponent = 'Gastos' " >
                <v-list-tile-action>
                    <v-icon>attach_money</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>Gastos</v-list-tile-title>
                </v-list-tile-content>
                </v-list-tile>

            </v-list>
        </v-navigation-drawer>
        <v-toolbar app fixed clipped-left>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Sirblue</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>Salir</v-btn>
        </v-toolbar>

    <!-- AREA DONDE SE CARGARAN LOS COMPONENTES -->
    <v-content  style="padding: 1rem 1rem;">
        <keep-alive>
            <component :is="currentComponent"></component>
        </keep-alive>
    </v-content>



    <v-footer app fixed>
      <span>&copy; {{yearCopyright}}</span>
    </v-footer>
  </v-app>
</div>
</template>

<script>
import Empleados from './../components/Empleados.vue'
import Cosechas from './../components/Cosechas.vue'
import Huertas from './../components/Huertas.vue'
import Ventas from './../components/Ventas.vue'
import Gastos from './../components/Gastos.vue'


export default {
    components: {
        Empleados,
        Cosechas,
        Huertas,
        Ventas,
        Gastos
    },
    
    data: () => ({
        drawer: true,
        currentComponent: '',
    }),
    computed:{
        yearCopyright(){
            return new Date().getFullYear()
        }
    },
    methods:{

    }
}
</script>


<style scoped>

</style>
