import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import db from './services/database'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null, 
        empleados: [],
        huertas: [],
        recolecciones: [],
        ventas: [],
        gastos: [],
    },
    getters:{

    },
    mutations: {
        SET_EMPLEADOS (state, payload) {
            state.empleados = payload
        }
    },
    actions: {
        loadEmpleados ({ commit }){
            let lista = []
            db.collection("empleados").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_EMPLEADOS', lista)
            });
        },
        addEmplado ({ commit }){
            
        }
    }
});
