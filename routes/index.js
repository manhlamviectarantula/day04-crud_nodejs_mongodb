var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

//CONECTING DB// APP CONFI
mongoose.connect(`mongodb+srv://cknguyenmanh:admin@cluster0.coj0a6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('DB CONNECTED');
}).catch((error) => {
  console.log('ERROR', error);
});

let lopSchema = mongoose.Schema({
  name: {
    type: String,
  },
  numberStudent: {
    type: Number,
  }
});

let Lop = mongoose.model('Lop', lopSchema);

router.get('/', function(req, res, next) {
  Lop.find({}, (error, data)=>{
    console.log('danh sách lớp', data)
  })
})

// router.get('/', async (req, res) => {
//   const products = await Lop.find()
//   console.log('danh sách lớp', products)  
// })

module.exports = router;
