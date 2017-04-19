//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.  
var express = require('express');
var mongoose = require('mongoose');

// Nous définissons ici les paramètres du serveur.
var hostname = 'localhost'; 
var port = 3000; 
var bodyParser = require("body-parser"); 





// Ces options sont recommandées par mLab pour une connexion à la base
var options = { server: { socketOptions: { keepAlive: 3000, connectTimeoutMS: 3000 } }, 
replset: { socketOptions: { keepAlive: 3000, connectTimeoutMS : 3000 } } };

//URL de notre base
var urlmongo = "mongodb://theji2bs:Elhadad1994@ds163060.mlab.com:63060/oklm";


// Nous connectons l'API à notre base de données
mongoose.connect(urlmongo, options);

var db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
});





var articlesSchema = mongoose.Schema({
    titre: String, 
    description: String, 
    auteur: String
}); 
 
var Article = mongoose.model('Article', articlesSchema);







// Nous créons un objet de type Express. 
var app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Afin de faciliter le routage (les URL que nous souhaitons prendre en charge dans notre API), nous créons un objet Router.
//C'est à partir de cet objet myRouter, que nous allons implémenter les méthodes. 





var myRouter = express.Router(); 

myRouter.route('/')
// all permet de prendre en charge toutes les méthodes. 
.all(function(req,res){ 
      res.json({message : "Bienvenue sur l'API ", methode : req.method});
});




// Je vous rappelle notre route (/articles).  
myRouter.route('/articles')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET

.get(function(req,res){ 
// Utilisation de notre schéma Piscine pour interrogation de la base
   Article.find(function(err, articles){
        if (err){
            res.send(err); 
        }
        res.json(articles); 
        
    });
})



.post(function(req,res){
    // Nous utilisons le schéma Piscine
      var article = new Article();
    // Nous récupérons les données reçues pour les ajouter à l'objet Piscine
      article.titre = req.body.titre;
      article.description = req.body.description;
      article.auteur = req.body.auteur;
      
    //Nous stockons l'objet en base
      article.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message : 'Ajout avec succes :)'});
      })
})


// Nous demandons à l'application d'utiliser notre routeur
app.use(myRouter);  

// Démarrer le serveur 
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});