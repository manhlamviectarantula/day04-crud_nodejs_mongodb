const { timeStamp } = require('console');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const multer = require('multer');
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png") {
      cb(null, 'public/images')
    } else {
      cb(new Error('not image'), false)
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
    // cb(null, Date.now()+'jpg')
  }
})

var upload = multer({ storage: storage })

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

let productsSchema = mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  detail:{
    type: String
  }
}, { timeStamp: true });

let products = mongoose.model('products-buoi04', productsSchema);

router.get('/', function (req, res, next) {
  products.find({}, (error, data) => {
    // console.log('danh sách lớp', data)
    res.render('index', { products: data })
  })
})

// router.get('/', async (req, res) => {
//   const products = await products.find()
//   console.log('danh sách lớp', products)  
// })

//chèn data từ postman
router.post('/add-list-item', (req, res) => {
  const item = req.body
  const product = new products(item)
  product.save().then(() => {
    console.log('Item added successfully')
  })
  return res.status(201).send("Item added successfully")
})

router.get('/form-add', function (req, res, next) {
  res.render('form-add', {})
})

router.post('/add', upload.single('imageURL'), function (req, res, next) {
  const item = new products({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: req.file ? req.file.filename : null,
    detail: req.body.detail
  })
  item.save()
    // .then(response => {
    //   ress.json({
    //     message: 'Employee Added Successfully!'
    //   })
    // })
    // .catch(error => {
    //   res.json({
    //     message: 'An error Occured!'
    //   })
    // })
  
  // products.create(req.body)
  // const file = req.file;
  // if(!file){
  //   const error = new Error('Please upload a file')
  //   return next(error)
  // }
  res.redirect('/')
})

// router.post('/add', function (req, res, next) {
//   products.create(req.body)
//   res.redirect('/')
// })

router.get('/form-update/:id', function (req, res, next) {
  products.findById(req.params.id, (error, data) => {
    res.render('form-update', { products: data })
  })
})

router.post('/update', upload.single('imageURL'), function (req, res, next) {
  const updateFields = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    detail: req.body.detail
  };

  if (req.file) {
    updateFields.image = req.file.filename;
  }

  products.findByIdAndUpdate(req.body.id, updateFields, (error, data) => {
    res.redirect('/')
  });
})

router.get('/form-delete/:id', function (req, res, next) {
  products.findByIdAndDelete(req.params.id, (error, data) => {
    res.redirect('/')
  })
})

router.get('/detail-product/:id', function (req, res, next) {
  products.findById(req.params.id, (error, data) => {
    res.render('detail-product', { products: data })
  })
})

module.exports = router;
