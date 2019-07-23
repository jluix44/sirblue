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
        cosechas: [],
        ventas: [],
        gastos: [],
    },
    getters:{
        namesAllEmpleados(state){
            let lista = []
            state.empleados.forEach(function(item){
                let r = item.nombre + " " + item.apellidos
                lista.push(r)
            })
            return lista
        },
        namesAllHuertas(state){
            let lista = []
            state.huertas.forEach(function(item){
                lista.push(item.nombre)
            })
            return lista
        }
    },
    mutations: {
        SET_EMPLEADOS (state, payload) {
            state.empleados = payload
        },
        SET_HUERTAS (state, payload) {
            state.huertas = payload
        },
        SET_COSECHAS (state, payload) {
            state.cosechas = payload
        },
        SET_VENTAS (state, payload) {
            state.ventas = payload
        },
        SET_GASTOS (state, payload) {
            state.gastos = payload
        }
    },
    actions: {
        loadEmpleados ({ commit }){
            let lista = []
            db.collection("empleados").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_EMPLEADOS', lista)
            });
        },
        loadHuertas({ commit }){
            let lista = []
            db.collection("huertas").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_HUERTAS', lista)
            });
        },
        loadCosechas({ commit }){
            let lista = []
            db.collection("cosechas").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_COSECHAS', lista)
            });
        },
        loadVentas({ commit }){
            let lista = []
            db.collection("ventas").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_VENTAS', lista)
            });
        },
        loadGastos({ commit }){
            let lista = []
            db.collection("gastos").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let r = doc.data()
                    r.id = doc.id
                    lista.push(r)
                    console.log(doc.id, " => ", doc.data());
                });
                commit('SET_GASTOS', lista)
            });
        },
        
    }
});
