const express = require('express');
const router = express.Router();

const multer = require('multer');

//product image storage
const storage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,'uploads/product')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

//user image storage
const userstorage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,'uploads/users')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*1
    },
    fileFilter:(res,file,cb)=>{
        if(file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/webp"){
            cb(null,true);
        }else{
            cb(null,false);
            return res.status(400).json({error:"File type not allowed"})
        }
    }
});


const userupload = multer({
    storage:userstorage,
    limits:{
        fileSize:1024*1024*1
    },
    fileFilter:(res,file,cb)=>{
        if(file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/webp"){
            cb(null,true);
        }else{
            cb(null,false);
            return res.status(400).json({error:"File type not allowed"})
        }
    }
});

//product image upload api
router.post("/uploadFile",upload.single('file'), (req,res)=>{
    res.json({"fileName":req.file.fileName})
});

// usr image upload api
router.post("/userimage",userupload.single('file'), (req,res)=>{
    res.json({"fileName":req.file.fileName})
});

const downloadFile = (req,res)=>{
    const fileName = req.params.fileName;
    const path = `${__basedir}/uploads/`;

    res.download(path+fileName,(error)=>{
        if(error){
            res.status(500).send({message:"File cannot be downloaded" +error})
        }
    })
}

router.get("/files/:fileName",downloadFile);

module.exports = router;