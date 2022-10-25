/*
Some tips for a better overall understanding
--------------------------------------------
This file "index.js" is called on all client side routes, functions run according on the presence or not of a specific DOM element (if ($("#myIdElement").length) { call function, etc. })
*/

"use strict"

import './wrapper/import-jquery.js'
import 'jquery-ui-dist/jquery-ui.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-select'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import '../css/main.css'
const io = require('socket.io-client')

$(function () {
    const modal = document.getElementById("myModal")
    const span = document.getElementsByClassName("close")[0]
    const socket = io.connect('/', { 'force new connection': true })
    socket.on('connect', () => {
        console.log('Socket connecté')
    })
    socket.on('eventGeocStderr', (data) => {
        document.getElementById("tailing").insertAdjacentHTML('beforeend', data.info)
    })
    socket.on('eventGeocStdout', (data) => {
        document.getElementById("tailing").insertAdjacentHTML('beforeend', data.info)
    })
    socket.on('eventGeocStin', (data) => {
        document.getElementById("tailing").insertAdjacentHTML('beforeend', data.info)
    })
    socket.on('eventGeocError', (data) => {
        document.getElementById("tailing").insertAdjacentHTML('beforeend', data.info)
    })
    socket.on('eventGeocEnd', (data) => {
        document.getElementById("tailing").insertAdjacentHTML('beforeend', data.info)
        document.getElementById("tailing").insertAdjacentHTML('beforeend', '<br/><a href="/api/download/adresses_geocodees.csv" class="btn btn-outline-light mt-2" type="button">Télécharger les adresses géocodées</a>')
        document.getElementById("tailing").insertAdjacentHTML('beforeend', '<br/><a href="/api/download/geocodage_erreurs_restantes.csv" class="btn btn-outline-light mt-2" type="button">Télécharger les erreurs</a>')
    
    })
    socket.on('fileUploaded', (data) => {
        document.getElementById("uploadInfo").innerHTML = ''
        document.getElementById("uploadInfo").insertAdjacentHTML('beforeend', '<div class="alert alert-success text-muted mt-3">' + data.info + '</div>')
    })
    document.getElementById('tail').addEventListener('click', () => {
        modal.style.display = "block"
        document.getElementById("tailing").innerHTML = 'Démarrage...<br/>'
        socket.emit('startGeocoding', { info: "Lancement du géocodage" })
    })
    document.getElementById('kill').addEventListener('click', () => {
        socket.emit('killProcess', {
            info: "Fin de la procédure demandée par l'utilisateur"
        })
        document.getElementById("tailing").insertAdjacentHTML('beforeend', "<br/>Fin de la procédure demandée par l'utilisateur")
    })
    span.onclick = function () {
        modal.style.display = "none"
    }
    // Rechargement à chaud, seulement en environnement de développement
    if (module.hot) {
        module.hot.accept(function () {
            window.location.reload()
        })
    }
})
