<template>
    <v-app>
        <v-toolbar app>
        <v-toolbar-title class="headline text-uppercase">
            <span>SIRBLUE </span>
            <span class="font-weight-light">by Vero</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat>
            <span class="mr-2" @click="dialog=true">Entrar</span>
        </v-btn>
        </v-toolbar>

        <v-content>
            <transition name="fade">
                <router-view></router-view>
            </transition>

             <v-layout row justify-center>
                <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">Entrar al sistema</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                        

                        <v-flex xs12>
                            <v-text-field label="Email*" type="text" v-model="email" required></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field label="Password*" type="password" v-model="password" required></v-text-field>
                        </v-flex>

                        </v-layout>
                    </v-container>
                    <small>*campos requeridos</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="blue darken-1" flat @click="login">Entrar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import db from '@/services/database'
import firebase from 'firebase'
import { constants } from 'crypto';
export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data () {
        return {
            dialog: false,
            email: '',
            password: ''
        }
    },
    methods:{
        login () {
            console.log(this.email, this.password)
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
                this.dialog = false
                this.$router.replace('dashboard')
            }).catch((err) => {
                alert(err.message)
            })
        }
    }

}
</script>
