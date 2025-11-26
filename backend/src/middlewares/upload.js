import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = file.originalname.split('.').pop()
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})


