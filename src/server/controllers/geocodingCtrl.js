const { errorMessage, status, successMessage } = require('../helpers/status')
const fs = require('fs')
const { spawn } = require('child_process')
const formidable = require("formidable")

const Geocoding = {
    download: (req, res) => {
        if (req.params.name) {
            const fileName = req.params.name
            res.download('C:/data/geocodage_tests/geocodage/geocodage_resultats/' + fileName, (err) => {
                if (err) {
                    res.status(status.error).send({ message: "Impossible de télécharger : " + fileName + " " + err })
                }
            })
        } else {
            res.status(status.error).send({ message: "Le nom du fichier à télécharger n'est pas précisé, avez-vous oublié l'extension ?" })
        }
    },
    upload: (req, res) => {
        let io = req.app.get('socketio')
        const form = new formidable.IncomingForm()
        form.parse(req, function (err, fields, files) {
            var oldpath = files.file.path
            var newpath = 'uploads/adresses_a_geoc.csv'
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    res.status(status.error).send({ "text": err })
                }
                io.emit('uploaded', { msg: 'Chargement terminé' })
                res.status(status.nocontent).send({ "text": "Fichier enregistré" })
            })
        })
        form.on('progress', function (bytesReceived, bytesExpected) {
            var percent = Math.floor(bytesReceived / bytesExpected * 100)
            var progress = {
                name: 'progress',
                percent: percent,
            }
            io.emit('progress', progress)
        })
    },
    start: (req, res) => {
        let io = req.app.get('socketio')
        io.emit("startGeoc", {
            info: "Démarrage du géocodeur...<br/>"
        })
        let child = spawn("C:/Python27/ArcGIS10.8/python.exe", ["C:\\data\\geocoding\\main.py", '-f', "C:/node_apps/font-geocoding/uploads/adresses_a_geoc.csv", '-w', "C:/data/geocodage_tests", '-id', 'n_sq_rplsa', '-a', 'l_adr', '-cp', 'c_postal', '-com', 'l_com', '-p', 'pays', '-m', '400', '-g', 'interne', 'ban', '-o', 'test55.csv']
        )
        io.on('killProcess', (data) => {
            child.kill('SIGINT')
            io.emit('killing', {
                info: 'Fin de la procédure demandée par l\'utilisateur'
            })
        })
        child.stdin.on('data', (data) => {
            io.emit("eventGeocStdin", {
                info: data.toString().replace(/\n/g, '<br />')
            })
        })
        child.stdout.on('data', (data) => {
            io.emit("eventGeocStdout", {
                info: data.toString().replace(/\n/g, '<br />')
            })
        })
        child.stderr.on('data', (data) => {
            io.emit("eventGeocStderr", {
                info: data.toString().replace(/\n/g, '<br />')
            })
        })
        child.on('error', (error) => {
            io.emit("eventGeocError", {
                info: error.message.toString().replace(/\n/g, '<br />')
            })
        })
        child.on('exit', (code, signal) => {
            let textExit, codeReturn
            if (code) {
                codeReturn = status.nocontent
                textExit = code.toString().replace(/\n/g, '<br />')
            }
            if (signal) {
                codeReturn = status.nocontent
                textExit = signal.toString().replace(/\n/g, '<br />')
            } else {
                codeReturn = status.nocontent
                textExit = 'Terminé avec succès'
            }
            io.emit("eventGeocEnd", {
                info: textExit.toString().replace(/\n/g, '<br />')
            })
            return res.status(codeReturn).send({ "text": textExit })
        })
    }
}

module.exports = Geocoding