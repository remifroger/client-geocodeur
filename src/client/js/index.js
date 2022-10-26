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
//const io = require('socket.io-client')

$(function () {
    const modal = document.getElementById("myModal")
    const span = document.getElementsByClassName("close")[0]
    span.onclick = function () {
        modal.style.display = "none"
    }
    const getUploadProgressFromServer = () => {
        const socket = io.connect("http://localhost:3000")
        const uploadProgress = document.getElementById("uploadProgress")
        socket.on("progress", function (data) {
            if ("progress" === data.name) {
                uploadProgress.innerText = data.percent + '%'
                uploadProgress.style.width = data.percent + '%'
            }
        })
        socket.on("uploaded", (data) => {
            document.getElementById("uploadInfo").insertAdjacentHTML('beforeend', '<div class="alert alert-success alert-dismissible fade show text-muted mt-3" role="alert">' + data.msg + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>')
        })
    }
    document.getElementById('uploadFileForm').addEventListener("submit", getUploadProgressFromServer())
    const getConsoleGeocoding = () => {
        const socket = io.connect("http://localhost:3000")
        const consoleMsg = document.getElementById("tailing")
        socket.on('startGeoc', (data) => {
            modal.style.display = "block"
            consoleMsg.innerHTML = data.info
        })
        socket.emit('startGeocoding', { info: "Lancement du géocodage" })
        socket.on('eventGeocStderr', (data) => {
            consoleMsg.insertAdjacentHTML('beforeend', data.info)
        })
        socket.on('eventGeocStdout', (data) => {
            consoleMsg.insertAdjacentHTML('beforeend', data.info)
        })
        socket.on('eventGeocStin', (data) => {
            consoleMsg.insertAdjacentHTML('beforeend', data.info)
        })
        socket.on('eventGeocError', (data) => {
            consoleMsg.insertAdjacentHTML('beforeend', data.info)
        })
        socket.on('eventGeocEnd', (data) => {
            consoleMsg.insertAdjacentHTML('beforeend', data.info)
            consoleMsg.insertAdjacentHTML('beforeend', '<br/><a href="/api/download/adresses_geocodees.csv" class="btn btn-outline-light mt-2" type="button">Télécharger les adresses géocodées</a>')
            consoleMsg.insertAdjacentHTML('beforeend', '<br/><a href="/api/download/geocodage_erreurs_restantes.csv" class="btn btn-outline-light mt-2" type="button">Télécharger les erreurs</a>')
        
        })
    }
    document.getElementById('tail').addEventListener('submit', getConsoleGeocoding())
    const getKillProcess = () => {
        const socket = io.connect("http://localhost:3000")
        socket.emit('killProcess', {
            info: "Fin de la procédure demandée par l'utilisateur"
        })
        document.getElementById("tailing").insertAdjacentHTML('beforeend', "<br/>Fin de la procédure demandée par l'utilisateur")
    }
    document.getElementById('kill').addEventListener('click', getKillProcess())
    // Rechargement à chaud, seulement en environnement de développement
    if (module.hot) {
        module.hot.accept(function () {
            window.location.reload()
        })
    }
})
