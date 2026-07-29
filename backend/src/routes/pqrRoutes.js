const express = require('express');
const router = express.Router();
const {
  createPqr,
  searchPqr,
  getPqrByRadicado,
  downloadPqrPdf,
  downloadAttachment,
  getCatalog
} = require('../controllers/pqrController');
const upload = require('../middlewares/uploadMiddleware');
const { createPqrLimiter } = require('../middlewares/rateLimiter');

router.post('/', createPqrLimiter, upload.array('attachments', 5), createPqr);
router.get('/search', searchPqr);
router.get('/catalog', getCatalog);
router.get('/attachment/:attachmentId', downloadAttachment);
router.get('/:radicado', getPqrByRadicado);
router.get('/:radicado/pdf', downloadPqrPdf);

module.exports = router;
